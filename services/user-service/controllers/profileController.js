const Profile = require('../models/Profile');
const User = require('../models/User'); // May need User model for linking
// TODO: Import error handling utilities

// Helper function to filter allowed fields for update
const filterObject = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      // Basic sanitization/validation could happen here too
      newObj[el] = obj[el];
    }
  });
  return newObj;
};


// Get the profile for the currently logged-in user
exports.getMe = (req, res, next) => {
  // This acts as middleware to set the userId param for getProfile
  req.params.userId = req.user.id; // Assumes protect middleware adds user to req
  next();
};

// Get a user's profile (can be self or admin view)
exports.getProfile = async (req, res, next) => {
  try {
    const userIdToFetch = req.params.userId;
    const requestingUserId = req.user.id; // From protect middleware
    const requestingUserRole = req.user.userRole; // From protect middleware

    // Basic authorization: User can get own profile, admin can get any
    if (userIdToFetch !== requestingUserId && requestingUserRole !== 'admin') {
       return res.status(403).json({ status: 'fail', message: 'You do not have permission to access this profile.' });
    }

    console.log(`[PROFILE_SVC] Fetching profile for user ID: ${userIdToFetch}`);
    // Find profile by userId field
    const profile = await Profile.findOne({ userId: userIdToFetch })
        .populate('userId', 'firstName lastName email'); // Populate basic user info

    if (!profile) {
      // If profile doesn't exist, maybe create a basic one? Or return 404?
      // For now, return 404. Profile creation might happen during signup or first login/access.
      console.log(`[PROFILE_SVC] Profile not found for user ID: ${userIdToFetch}`);
      return res.status(404).json({ status: 'fail', message: 'Profile not found.' });
    }

    res.status(200).json({
      status: 'success',
      data: {
        profile
      }
    });

  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ status: 'error', message: 'Error fetching profile data.' });
  }
};

// Update the profile for the currently logged-in user
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id; // From protect middleware

    // Filter out fields that shouldn't be updated directly (like userId, derived data)
    // Define allowed fields for each section based on Profile model
    // This is complex due to nested structure. Start with top-level updatable sections.
    // Example: Allow updating personalInfo, preferences, maybe parts of financialInfo
    // IMPORTANT: Nested objects need careful handling to avoid overwriting entire sub-documents
    // unless that's the intention. Using $set with dot notation is often safer for specific fields.

    // For V1, let's allow updating specific fields within personalInfo and preferences
    const allowedPersonalInfo = ['gender', 'maritalStatus', 'contactInformation']; // Example
    const allowedPreferences = ['destinationCountries', 'pathwayTypes', 'timeframe', 'budgetRange', 'priorityFactors', 'locationPreferences']; // Example

    const filteredBody = {};
    if (req.body.personalInfo) {
        filteredBody.personalInfo = filterObject(req.body.personalInfo, ...allowedPersonalInfo);
        // TODO: Handle nested updates within contactInformation carefully if needed
    }
     if (req.body.preferences) {
        filteredBody.preferences = filterObject(req.body.preferences, ...allowedPreferences);
         // TODO: Handle nested updates within locationPreferences carefully if needed
    }
    // Add other updatable sections/fields here (e.g., education, workExperience need array handling)

    if (Object.keys(filteredBody).length === 0) {
         return res.status(400).json({ status: 'fail', message: 'No valid fields provided for update.' });
    } 

    console.log(`[PROFILE_SVC] Updating profile for user ID: ${userId}`);
    // Find profile by userId and update
    // Use findOneAndUpdate to get the updated document back
    // Need to handle nested objects carefully. $set might overwrite nested objects entirely.
    // Consider using dot notation for specific nested fields if possible, or fetching, merging, and saving.
    // For simplicity now, using $set - this requires client to send full sub-document if updating nested parts.
    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: userId },
      { $set: filteredBody },
      { new: true, runValidators: true } // Return updated doc, run schema validators
    );

    if (!updatedProfile) {
      // Should not happen if user exists and protect middleware ran, but handle defensively
      return res.status(404).json({ status: 'fail', message: 'Profile not found for update.' });
    }

    res.status(200).json({
      status: 'success',
      data: {
        profile: updatedProfile
      }
    });

  } catch (err) {
     console.error("UPDATE PROFILE ERROR:", err);
     if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(el => el.message);
        const message = `Invalid input data. ${errors.join('. ')}`;
        return res.status(400).json({ status: 'fail', message });
    }
    res.status(500).json({ status: 'error', message: 'Error updating profile.' });
  }
};

exports.updateReadinessChecklistItem = async (req, res, next) => {
    try {
        const userId = req.user.id; // From protect middleware
        const { itemId } = req.params;
        const { isComplete, notes } = req.body; // Expect isComplete (boolean), notes (string, optional)

        if (typeof isComplete !== 'boolean') {
            return res.status(400).json({ status: 'fail', message: 'Missing or invalid "isComplete" field (must be true or false).' });
        }

        console.log(`[PROFILE_SVC] Updating readiness item ${itemId} for user ${userId} to isComplete=${isComplete}`);

        const profile = await Profile.findOne({ userId: userId });

        if (!profile) {
            return res.status(404).json({ status: 'fail', message: 'Profile not found.' });
        }

        // Find the checklist item
        const itemIndex = profile.readinessChecklist.findIndex(item => item.itemId === itemId);

        if (itemIndex === -1) {
             return res.status(404).json({ status: 'fail', message: `Readiness checklist item with ID "${itemId}" not found.` });
        }

        // Update the item
        profile.readinessChecklist[itemIndex].isComplete = isComplete;
        profile.readinessChecklist[itemIndex].lastUpdated = new Date();
        if (notes !== undefined) {
             profile.readinessChecklist[itemIndex].notes = notes;
        }

        // Mark the array as modified if Mongoose doesn't detect the change automatically
        profile.markModified('readinessChecklist');

        await profile.save({ validateModifiedOnly: true }); // Save the updated profile

        res.status(200).json({
            status: 'success',
            data: {
                updatedItem: profile.readinessChecklist[itemIndex] // Return the updated item
            }
        });

    } catch (err) {
        console.error("UPDATE READINESS CHECKLIST ERROR:", err);
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(el => el.message);
            const message = `Invalid input data. ${errors.join('. ')}`;
            return res.status(400).json({ status: 'fail', message });
        }
        res.status(500).json({ status: 'error', message: 'Error updating readiness checklist item.' });
    }
};


// TODO: Add functions for managing specific profile sections like education, work experience (add, update, delete array elements)
