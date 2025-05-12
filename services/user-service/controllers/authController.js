const User = require('../models/User');
const jwt = require('jsonwebtoken');
// Add other necessary requires (e.g., error handling utilities)

// Function to sign JWT token
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Function to create and send token
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.passwordHash = undefined;

  // Cookie options (consider security flags like httpOnly, secure in production)
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 // days * hrs * mins * secs * ms
    ),
    httpOnly: true // Prevent XSS attacks
    // secure: req.secure || req.headers['x-forwarded-proto'] === 'https' // Only send over HTTPS
  };
   if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);


  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};


exports.signup = async (req, res, next) => {
  try {
    // 1) Get user data from request body
    const { firstName, lastName, email, password } = req.body; // Add passwordConfirm if needed

    // Basic validation (more robust validation can be added)
    if (!firstName || !lastName || !email || !password) {
       return res.status(400).json({ status: 'fail', message: 'Please provide first name, last name, email, and password.' });
       // Consider using a more robust error handling middleware/utility
    }

    // // Example: Check if password and confirm password match
    // if (password !== passwordConfirm) {
    //   return res.status(400).json({ status: 'fail', message: 'Passwords do not match.' });
    // }

    // 2) Create new user (password hashing is handled by Mongoose pre-save hook)
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      passwordHash: password // Pass the plain password, the model will hash it
      // Add other fields if necessary (e.g., userRole if allowed during signup)
    });

    // 3) Generate JWT token and send response
    createSendToken(newUser, 201, res);

  } catch (err) {
    // Handle errors (e.g., duplicate email)
    // Mongoose duplicate key error code is 11000
    if (err.code === 11000) {
       return res.status(400).json({ status: 'fail', message: 'Email address already in use.' });
    }
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(el => el.message);
        const message = `Invalid input data. ${errors.join('. ')}`;
        return res.status(400).json({ status: 'fail', message });
    }

    console.error("SIGNUP ERROR:", err);
    res.status(500).json({ status: 'error', message: 'An error occurred during signup.' });
    // Consider more specific error handling/logging
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Please provide email and password.' });
      // Consider using error handling middleware
    }

    // 2) Check if user exists & password is correct
    const user = await User.findOne({ email }).select('+passwordHash'); // Explicitly select passwordHash

    if (!user || !(await user.correctPassword(password, user.passwordHash))) {
      return res.status(401).json({ status: 'fail', message: 'Incorrect email or password.' });
      // Consider using error handling middleware
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);

  } catch (err) {
     console.error("LOGIN ERROR:", err);
     res.status(500).json({ status: 'error', message: 'An error occurred during login.' });
     // Consider more specific error handling/logging
  }
};


// --- Route Protection Middleware ---
exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt) { // Check for token in cookie if not in header
        token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({ status: 'fail', message: 'You are not logged in! Please log in to get access.' });
    }

    // 2) Verification token
    // Use promisify if jwt.verify doesn't return a promise directly
    const { promisify } = require('util');
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ status: 'fail', message: 'The user belonging to this token no longer exists.' });
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({ status: 'fail', message: 'User recently changed password! Please log in again.' });
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser; // Attach user to the request object
    next();
  } catch (err) {
     // Handle JWT errors (e.g., invalid token, expired token)
     if (err.name === 'JsonWebTokenError') {
         return res.status(401).json({ status: 'fail', message: 'Invalid token. Please log in again.' });
     } else if (err.name === 'TokenExpiredError') {
         return res.status(401).json({ status: 'fail', message: 'Your token has expired! Please log in again.' });
     }
     console.error("PROTECT MIDDLEWARE ERROR:", err);
     res.status(500).json({ status: 'error', message: 'Something went wrong during authentication.' });
  }
};

// --- Password Management ---

// Update password for logged-in user
exports.updatePassword = async (req, res, next) => {
    try {
        // 1) Get user from collection (user is attached by protect middleware)
        const user = await User.findById(req.user.id).select('+passwordHash');

        // 2) Get current password and new password from body
        const { currentPassword, newPassword, newPasswordConfirm } = req.body;

        // 3) Check if current password is correct
        if (!currentPassword || !(await user.correctPassword(currentPassword, user.passwordHash))) {
            return res.status(401).json({ status: 'fail', message: 'Your current password is incorrect.' });
        }

        // 4) Check if new password and confirmation match
        if (!newPassword || !newPasswordConfirm || newPassword !== newPasswordConfirm) {
            return res.status(400).json({ status: 'fail', message: 'New password and confirmation do not match.' });
        }

        // 5) Update password (pre-save middleware will hash it and update passwordChangedAt)
        user.passwordHash = newPassword;
        await user.save();

        // 6) Log user in, send JWT
        createSendToken(user, 200, res);

    } catch (err) {
        console.error("UPDATE PASSWORD ERROR:", err);
        // Handle potential validation errors from save()
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(el => el.message);
            const message = `Invalid input data. ${errors.join('. ')}`;
            return res.status(400).json({ status: 'fail', message });
        }
        res.status(500).json({ status: 'error', message: 'Error updating password.' });
    }
};


// Forgot Password - Generate Token
exports.forgotPassword = async (req, res, next) => {
    try {
        // 1) Get user based on POSTed email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            // Send generic success message even if user not found for security
            console.warn(`[FORGOT_PWD] Attempt for non-existent email: ${req.body.email}`);
            return res.status(200).json({ status: 'success', message: 'If an account with that email exists, a password reset link has been sent.' });
        }

        // 2) Generate the random reset token using method on User model
        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false }); // Save token hash and expiry, disable validation for this save

        // 3) Send it to user's email
        // TODO: Implement actual email sending service
        const resetURL = `${req.protocol}://${req.get('host')}/api/auth/resetPassword/${resetToken}`; // Adjust URL as needed
        const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

        try {
            // await sendEmail({ email: user.email, subject: 'Your password reset token (valid for 10 min)', message });
            console.log(`-----\nPASSWORD RESET EMAIL (Dev Only):\nSubject: Your password reset token (valid for 10 min)\nTo: ${user.email}\nMessage: ${message}\n-----`);
            res.status(200).json({ status: 'success', message: 'Password reset token sent to email!' });
        } catch (emailErr) {
            console.error("EMAIL SENDING ERROR:", emailErr);
            // If email fails, reset the token fields in DB to allow retry
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({ status: 'error', message: 'There was an error sending the email. Please try again later.' });
        }
    } catch (err) {
        console.error("FORGOT PASSWORD ERROR:", err);
        res.status(500).json({ status: 'error', message: 'Error processing forgot password request.' });
    }
};

// Reset Password - Use Token
exports.resetPassword = async (req, res, next) => {
    try {
        // 1) Get user based on the token
        const hashedToken = require('crypto')
            .createHash('sha256')
            .update(req.params.token) // Get token from URL parameter
            .digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() } // Check if token is not expired
        });

        // 2) If token has not expired, and there is user, set the new password
        if (!user) {
            return res.status(400).json({ status: 'fail', message: 'Token is invalid or has expired.' });
        }

        const { password, passwordConfirm } = req.body;
        if (!password || !passwordConfirm || password !== passwordConfirm) {
             return res.status(400).json({ status: 'fail', message: 'Password and confirmation do not match.' });
        }

        // Update password (pre-save hook hashes it)
        user.passwordHash = password;
        // Clear reset token fields
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        // passwordChangedAt is updated automatically by pre-save hook
        await user.save(); // This will trigger validation and hashing

        // 3) Log the user in, send JWT
        createSendToken(user, 200, res);

    } catch (err) {
        console.error("RESET PASSWORD ERROR:", err);
         // Handle potential validation errors from save()
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(el => el.message);
            const message = `Invalid input data. ${errors.join('. ')}`;
            return res.status(400).json({ status: 'fail', message });
        }
        res.status(500).json({ status: 'error', message: 'Error resetting password.' });
    }
};

// TODO: Implement restrictTo for role-based access control
// TODO: Implement logout (e.g., clearing cookie)
