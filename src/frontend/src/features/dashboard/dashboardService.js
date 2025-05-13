import supabase from '../../utils/supabaseClient';

/**
 * Get dashboard data
 * Fetches aggregated data needed for the main dashboard view.
 * @returns {Promise<Object>} Dashboard data aggregated by the backend
 */
const getDashboardData = async () => {
  try {
    console.log('[dashboardService] Fetching dashboard data...');

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // For now, return mock data since we don't have a real dashboard API yet
    // In a real implementation, you would fetch this data from Supabase
    const mockData = {
      status: 'success',
      data: {
        overview: {
          completedSteps: 2,
          totalSteps: 8,
          currentStageIndex: 1,
          daysActive: 7,
          documentsUploaded: 3,
          tasksCompleted: 5
        },
        nextSteps: [
          { id: 1, title: "Complete your profile", priority: "high", dueDate: "2023-12-15" },
          { id: 2, title: "Upload your passport", priority: "medium", dueDate: "2023-12-20" },
          { id: 3, title: "Take language test", priority: "medium", dueDate: "2024-01-10" }
        ],
        recommendations: [
          { id: 1, title: "Express Entry Program", score: 85, description: "Based on your profile, you have a high chance of qualifying for Express Entry." },
          { id: 2, title: "Provincial Nominee Program", score: 72, description: "Your work experience matches in-demand occupations in several provinces." },
          { id: 3, title: "Study Permit", score: 68, description: "Consider furthering your education in Canada to improve immigration chances." }
        ],
        tasks: [
          { id: 1, title: "Update personal information", dueDate: "2023-12-10", status: "pending" },
          { id: 2, title: "Upload education documents", dueDate: "2023-12-12", status: "pending" },
          { id: 3, title: "Schedule language test", dueDate: "2023-12-15", status: "pending" }
        ],
        documents: {
          recent: [
            { id: 1, name: "Passport.pdf", uploadDate: "2023-12-01", type: "identification" },
            { id: 2, name: "Degree_Certificate.pdf", uploadDate: "2023-12-02", type: "education" },
            { id: 3, name: "Resume.pdf", uploadDate: "2023-12-03", type: "employment" }
          ],
          stats: {
            total: 3,
            verified: 1,
            pending: 2,
            rejected: 0
          }
        }
      }
    };

    console.log('[dashboardService] Received dashboard data:', mockData.data);
    return mockData;
  } catch (error) {
    console.error('Get Dashboard Data Service Error:', error.message);
    throw new Error(error.message);
  }
};

/**
 * Update dashboard preferences
 * @param {Object} preferences - Dashboard preferences
 * @returns {Promise<Object>} Updated preferences
 */
const updateDashboardPreferences = async (preferences) => {
  try {
    console.log('[dashboardService] Updating dashboard preferences...');

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // For now, just return a success response
    // In a real implementation, you would update the preferences in Supabase
    return {
      success: true,
      message: 'Dashboard preferences updated successfully',
      data: preferences
    };
  } catch (error) {
    console.error('Update Dashboard Preferences Error:', error.message);
    throw new Error(error.message);
  }
};

const dashboardService = {
  getDashboardData,
  updateDashboardPreferences,
};

export default dashboardService;
