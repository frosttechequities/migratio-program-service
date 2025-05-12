const { User } = require('../models/user.model');
const { Profile } = require('../models/profile.model');
const { logger } = require('../utils/logger');

/**
 * Get current user
 * @route GET /api/users/me
 * @access Private
 */
const getCurrentUser = async (req, res, next) => {
  try {
    // User is already attached to request by auth middleware
    const user = req.user;

    // Return user data
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
        lastLogin: user.lastLogin,
        preferences: user.preferences,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    logger.error('Error fetching current user:', error);
    next(error);
  }
};

/**
 * Update user
 * @route PUT /api/users/me
 * @access Private
 */
const updateUser = async (req, res, next) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user.id;

    // Get fields to update
    const { firstName, lastName } = req.body;

    // Find and update user
    const user = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName },
      { new: true, runValidators: true }
    );

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return updated user
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
        lastLogin: user.lastLogin,
        preferences: user.preferences,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    logger.error('Error updating user:', error);
    next(error);
  }
};

/**
 * Change password
 * @route PUT /api/users/me/password
 * @access Private
 */
const changePassword = async (req, res, next) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user.id;

    // Get passwords from request
    const { currentPassword, newPassword } = req.body;

    // Find user with password
    const user = await User.findById(userId).select('+password');

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if current password is correct
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Return success
    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    logger.error('Error changing password:', error);
    next(error);
  }
};

/**
 * Delete account
 * @route DELETE /api/users/me
 * @access Private
 */
const deleteAccount = async (req, res, next) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user.id;

    // Delete user profile
    await Profile.findOneAndDelete({ userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    // Return success
    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting account:', error);
    next(error);
  }
};

/**
 * Get all users (admin only)
 * @route GET /api/users
 * @access Private/Admin
 */
const getAllUsers = async (req, res, next) => {
  try {
    // Get query parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Get users
    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get total count
    const total = await User.countDocuments();

    // Return users
    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching all users:', error);
    next(error);
  }
};

/**
 * Get user by ID (admin only)
 * @route GET /api/users/:userId
 * @access Private/Admin
 */
const getUserById = async (req, res, next) => {
  try {
    // Get user ID from params
    const { userId } = req.params;

    // Find user
    const user = await User.findById(userId).select('-password');

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return user
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Error fetching user by ID:', error);
    next(error);
  }
};

/**
 * Update user status (admin only)
 * @route PUT /api/users/:userId/status
 * @access Private/Admin
 */
const updateUserStatus = async (req, res, next) => {
  try {
    // Get user ID from params
    const { userId } = req.params;

    // Get status from request
    const { status } = req.body;

    // Find and update user
    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true, runValidators: true }
    ).select('-password');

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return updated user
    res.status(200).json({
      success: true,
      message: 'User status updated successfully',
      data: user
    });
  } catch (error) {
    logger.error('Error updating user status:', error);
    next(error);
  }
};

module.exports = {
  getCurrentUser,
  updateUser,
  changePassword,
  deleteAccount,
  getAllUsers,
  getUserById,
  updateUserStatus
};
