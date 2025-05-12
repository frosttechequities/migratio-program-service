const { Profile } = require('../models/profile.model');
const { User } = require('../models/user.model');
const { logger } = require('../utils/logger');

/**
 * Get user profile
 * @route GET /api/profiles
 * @access Private
 */
const getUserProfile = async (req, res, next) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user.id;

    // Find profile
    const profile = await Profile.findOne({ userId });

    // Check if profile exists
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Return profile
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    logger.error('Error fetching user profile:', error);
    next(error);
  }
};

/**
 * Get profile completion status
 * @route GET /api/profiles/completion
 * @access Private
 */
const getProfileCompletion = async (req, res, next) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user.id;

    // Find profile
    const profile = await Profile.findOne({ userId });

    // Check if profile exists
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Calculate completion
    const completionStatus = profile.calculateCompletion();

    // Return completion status
    res.status(200).json({
      success: true,
      data: completionStatus
    });
  } catch (error) {
    logger.error('Error calculating profile completion:', error);
    next(error);
  }
};

/**
 * Update profile section
 * @route PUT /api/profiles/:section
 * @access Private
 */
const updateProfileSection = async (req, res, next) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user.id;
    
    // Get section from params
    const { section } = req.params;
    
    // Validate section
    const validSections = ['personalInfo', 'education', 'workExperience', 'languageProficiency', 'financialInfo', 'immigrationPreferences'];
    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section'
      });
    }

    // Find profile
    const profile = await Profile.findOne({ userId });

    // Check if profile exists
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Update section
    if (section === 'education' || section === 'workExperience' || section === 'languageProficiency') {
      // Handle array fields
      if (Array.isArray(req.body)) {
        profile[section] = req.body;
      } else {
        return res.status(400).json({
          success: false,
          message: `${section} must be an array`
        });
      }
    } else {
      // Handle object fields
      profile[section] = {
        ...profile[section],
        ...req.body
      };
    }

    // Calculate completion
    profile.calculateCompletion();

    // Save profile
    await profile.save();

    // Return updated profile
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: profile
    });
  } catch (error) {
    logger.error('Error updating profile section:', error);
    next(error);
  }
};

/**
 * Delete profile education item
 * @route DELETE /api/profiles/education/:itemId
 * @access Private
 */
const deleteEducationItem = async (req, res, next) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user.id;
    
    // Get item ID from params
    const { itemId } = req.params;

    // Find profile
    const profile = await Profile.findOne({ userId });

    // Check if profile exists
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Find education item index
    const itemIndex = profile.education.findIndex(item => item._id.toString() === itemId);

    // Check if item exists
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Education item not found'
      });
    }

    // Remove item
    profile.education.splice(itemIndex, 1);

    // Calculate completion
    profile.calculateCompletion();

    // Save profile
    await profile.save();

    // Return success
    res.status(200).json({
      success: true,
      message: 'Education item deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting education item:', error);
    next(error);
  }
};

/**
 * Delete profile work experience item
 * @route DELETE /api/profiles/workExperience/:itemId
 * @access Private
 */
const deleteWorkExperienceItem = async (req, res, next) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user.id;
    
    // Get item ID from params
    const { itemId } = req.params;

    // Find profile
    const profile = await Profile.findOne({ userId });

    // Check if profile exists
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Find work experience item index
    const itemIndex = profile.workExperience.findIndex(item => item._id.toString() === itemId);

    // Check if item exists
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Work experience item not found'
      });
    }

    // Remove item
    profile.workExperience.splice(itemIndex, 1);

    // Calculate completion
    profile.calculateCompletion();

    // Save profile
    await profile.save();

    // Return success
    res.status(200).json({
      success: true,
      message: 'Work experience item deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting work experience item:', error);
    next(error);
  }
};

/**
 * Delete profile language proficiency item
 * @route DELETE /api/profiles/languageProficiency/:itemId
 * @access Private
 */
const deleteLanguageProficiencyItem = async (req, res, next) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user.id;
    
    // Get item ID from params
    const { itemId } = req.params;

    // Find profile
    const profile = await Profile.findOne({ userId });

    // Check if profile exists
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Find language proficiency item index
    const itemIndex = profile.languageProficiency.findIndex(item => item._id.toString() === itemId);

    // Check if item exists
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Language proficiency item not found'
      });
    }

    // Remove item
    profile.languageProficiency.splice(itemIndex, 1);

    // Calculate completion
    profile.calculateCompletion();

    // Save profile
    await profile.save();

    // Return success
    res.status(200).json({
      success: true,
      message: 'Language proficiency item deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting language proficiency item:', error);
    next(error);
  }
};

/**
 * Update user preferences
 * @route PUT /api/profiles/preferences
 * @access Private
 */
const updateUserPreferences = async (req, res, next) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user.id;

    // Find user
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update preferences
    user.preferences = {
      ...user.preferences,
      ...req.body
    };

    // Save user
    await user.save();

    // Return success
    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: user.preferences
    });
  } catch (error) {
    logger.error('Error updating user preferences:', error);
    next(error);
  }
};

module.exports = {
  getUserProfile,
  getProfileCompletion,
  updateProfileSection,
  deleteEducationItem,
  deleteWorkExperienceItem,
  deleteLanguageProficiencyItem,
  updateUserPreferences
};
