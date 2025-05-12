const { User } = require('../models/user.model');
const { Profile } = require('../models/profile.model');
const { Recommendation } = require('../models/recommendation.model');
const { Roadmap } = require('../models/roadmap.model');
const { Document } = require('../models/document.model');
const { Response } = require('../models/response.model');
const { QuizSession } = require('../models/quiz-session.model');
const { logger } = require('../utils/logger');

/**
 * Get dashboard overview data
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user profile
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Get quiz session to determine assessment completion
    const quizSession = await QuizSession.findOne({ 
      userId, 
      status: { $in: ['in_progress', 'completed'] } 
    }).sort({ updatedAt: -1 });

    // Get responses to determine assessment completion percentage
    const responses = await Response.find({ userId });
    const totalQuestions = 50; // This should be dynamically determined
    const assessmentCompletion = Math.min(
      Math.round((responses.length / totalQuestions) * 100),
      100
    );

    // Get recommendations
    const recommendations = await Recommendation.find({ userId })
      .sort({ matchPercentage: -1 })
      .limit(3);

    // Get roadmaps
    const roadmaps = await Roadmap.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(3);

    // Get documents
    const documents = await Document.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(10);

    // Calculate days active
    const userCreatedAt = new Date(req.user.createdAt);
    const now = new Date();
    const daysActive = Math.ceil((now - userCreatedAt) / (1000 * 60 * 60 * 24));

    // Calculate document stats
    const documentsUploaded = documents.length;
    let documentsRequired = 0;

    // Calculate required documents from roadmaps
    if (roadmaps.length > 0) {
      roadmaps.forEach(roadmap => {
        if (roadmap.phases) {
          roadmap.phases.forEach(phase => {
            if (phase.milestones) {
              phase.milestones.forEach(milestone => {
                if (milestone.documents) {
                  documentsRequired += milestone.documents.filter(doc => doc.required).length;
                }
              });
            }
          });
        }
      });
    }

    // Calculate tasks
    let tasks = [];
    let tasksCompleted = 0;
    let totalTasks = 0;
    let nextDeadline = null;

    // Extract tasks from roadmaps
    if (roadmaps.length > 0) {
      roadmaps.forEach(roadmap => {
        if (roadmap.phases) {
          roadmap.phases.forEach(phase => {
            if (phase.milestones) {
              phase.milestones.forEach(milestone => {
                // Add milestone as a task
                tasks.push({
                  _id: milestone._id,
                  title: milestone.title,
                  status: milestone.status,
                  dueDate: milestone.dueDate,
                  phaseTitle: phase.title,
                  roadmapId: roadmap._id,
                  roadmapTitle: roadmap.title,
                  isMilestone: true
                });

                // Add milestone tasks
                if (milestone.tasks) {
                  tasks = [...tasks, ...milestone.tasks.map(task => ({
                    ...task,
                    phaseTitle: phase.title,
                    milestoneTitle: milestone.title,
                    roadmapId: roadmap._id,
                    roadmapTitle: roadmap.title
                  }))];
                }
              });
            }
          });
        }
      });
    }

    // Calculate task stats
    tasksCompleted = tasks.filter(task => task.status === 'completed').length;
    totalTasks = tasks.length;

    // Find next deadline
    const incompleteTasks = tasks.filter(task => task.status !== 'completed' && task.dueDate);
    if (incompleteTasks.length > 0) {
      incompleteTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      nextDeadline = incompleteTasks[0].dueDate;
    }

    // Calculate roadmap progress
    const roadmapProgress = roadmaps.length > 0 ? roadmaps[0].completionPercentage : 0;

    // Prepare overview data
    const overviewData = {
      profileCompletion: profile.completionStatus.overall,
      assessmentCompletion,
      roadmapProgress,
      documentsUploaded,
      documentsRequired,
      tasksCompleted,
      totalTasks,
      daysActive,
      nextDeadline
    };

    return res.status(200).json({
      success: true,
      data: overviewData
    });
  } catch (error) {
    logger.error(`Error getting dashboard overview: ${error.message}`, { error });

    return res.status(500).json({
      success: false,
      message: 'Failed to get dashboard overview',
      error: error.message
    });
  }
};

/**
 * Get dashboard data
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user profile
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Get quiz session to determine assessment completion
    const quizSession = await QuizSession.findOne({ 
      userId, 
      status: { $in: ['in_progress', 'completed'] } 
    }).sort({ updatedAt: -1 });

    // Get responses to determine assessment completion percentage
    const responses = await Response.find({ userId });
    const totalQuestions = 50; // This should be dynamically determined
    const assessmentCompletion = Math.min(
      Math.round((responses.length / totalQuestions) * 100),
      100
    );

    // Get recommendations
    const recommendations = await Recommendation.find({ userId })
      .sort({ matchPercentage: -1 })
      .limit(5);

    // Get roadmaps
    const roadmaps = await Roadmap.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(5);

    // Get documents
    const documents = await Document.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(10);

    // Calculate days active
    const userCreatedAt = new Date(req.user.createdAt);
    const now = new Date();
    const daysActive = Math.ceil((now - userCreatedAt) / (1000 * 60 * 60 * 24));

    // Calculate document stats
    const documentsUploaded = documents.length;
    let documentsRequired = 0;

    // Calculate required documents from roadmaps
    if (roadmaps.length > 0) {
      roadmaps.forEach(roadmap => {
        if (roadmap.phases) {
          roadmap.phases.forEach(phase => {
            if (phase.milestones) {
              phase.milestones.forEach(milestone => {
                if (milestone.documents) {
                  documentsRequired += milestone.documents.filter(doc => doc.required).length;
                }
              });
            }
          });
        }
      });
    }

    // Calculate tasks
    let tasks = [];
    let tasksCompleted = 0;
    let totalTasks = 0;
    let nextDeadline = null;

    // Extract tasks from roadmaps
    if (roadmaps.length > 0) {
      roadmaps.forEach(roadmap => {
        if (roadmap.phases) {
          roadmap.phases.forEach(phase => {
            if (phase.milestones) {
              phase.milestones.forEach(milestone => {
                // Add milestone as a task
                tasks.push({
                  _id: milestone._id,
                  title: milestone.title,
                  status: milestone.status,
                  dueDate: milestone.dueDate,
                  phaseTitle: phase.title,
                  roadmapId: roadmap._id,
                  roadmapTitle: roadmap.title,
                  isMilestone: true
                });

                // Add milestone tasks
                if (milestone.tasks) {
                  tasks = [...tasks, ...milestone.tasks.map(task => ({
                    ...task,
                    phaseTitle: phase.title,
                    milestoneTitle: milestone.title,
                    roadmapId: roadmap._id,
                    roadmapTitle: roadmap.title
                  }))];
                }
              });
            }
          });
        }
      });
    }

    // Calculate task stats
    tasksCompleted = tasks.filter(task => task.status === 'completed').length;
    totalTasks = tasks.length;

    // Find next deadline
    const incompleteTasks = tasks.filter(task => task.status !== 'completed' && task.dueDate);
    if (incompleteTasks.length > 0) {
      incompleteTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      nextDeadline = incompleteTasks[0].dueDate;
    }

    // Calculate roadmap progress
    const roadmapProgress = roadmaps.length > 0 ? roadmaps[0].completionPercentage : 0;

    // Prepare overview data
    const overviewData = {
      profileCompletion: profile.completionStatus.overall,
      assessmentCompletion,
      roadmapProgress,
      documentsUploaded,
      documentsRequired,
      tasksCompleted,
      totalTasks,
      daysActive,
      nextDeadline
    };

    // Prepare dashboard data
    const dashboardData = {
      overview: overviewData,
      profile,
      recommendations,
      roadmaps,
      documents,
      tasks
    };

    return res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    logger.error(`Error getting dashboard data: ${error.message}`, { error });

    return res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data',
      error: error.message
    });
  }
};

/**
 * Update dashboard preferences
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.updateDashboardPreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    const preferences = req.body;

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user preferences
    user.preferences = {
      ...user.preferences,
      dashboard: preferences
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Dashboard preferences updated successfully',
      data: user.preferences.dashboard
    });
  } catch (error) {
    logger.error(`Error updating dashboard preferences: ${error.message}`, { error });

    return res.status(500).json({
      success: false,
      message: 'Failed to update dashboard preferences',
      error: error.message
    });
  }
};
