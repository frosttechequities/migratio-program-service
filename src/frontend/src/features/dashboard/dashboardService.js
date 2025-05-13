import supabase from '../../utils/supabaseClient';

/**
 * Get dashboard data
 * Fetches aggregated data needed for the main dashboard view from Supabase.
 * @returns {Promise<Object>} Dashboard data aggregated from Supabase
 */
const getDashboardData = async () => {
  try {
    console.log('[dashboardService] Fetching dashboard data from Supabase...');

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Fetch user progress data
    const { data: progressData, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (progressError && progressError.code !== 'PGRST116') {
      throw progressError;
    }

    // Fetch user tasks
    const { data: tasksData, error: tasksError } = await supabase
      .from('user_tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('due_date', { ascending: true });

    if (tasksError) throw tasksError;

    // Fetch user documents
    const { data: documentsData, error: documentsError } = await supabase
      .from('user_documents')
      .select('*')
      .eq('user_id', user.id)
      .order('upload_date', { ascending: false });

    if (documentsError) throw documentsError;

    // Fetch user recommendations
    const { data: recommendationsData, error: recommendationsError } = await supabase
      .from('user_recommendations')
      .select(`
        id,
        score,
        reasoning,
        immigration_programs (
          id,
          title,
          country,
          description
        )
      `)
      .eq('user_id', user.id)
      .order('score', { ascending: false });

    if (recommendationsError) throw recommendationsError;

    // Calculate document statistics
    const documentStats = {
      total: documentsData.length,
      verified: documentsData.filter(doc => doc.status === 'verified').length,
      pending: documentsData.filter(doc => doc.status === 'pending').length,
      rejected: documentsData.filter(doc => doc.status === 'rejected').length
    };

    // Format the data for the frontend
    const dashboardData = {
      status: 'success',
      data: {
        overview: {
          completedSteps: progressData?.completed_steps || 0,
          totalSteps: progressData?.total_steps || 0,
          currentStageIndex: progressData?.current_stage || 1,
          daysActive: progressData ? Math.ceil((new Date() - new Date(progressData.first_login_at)) / (1000 * 60 * 60 * 24)) : 0,
          documentsUploaded: documentsData.length,
          tasksCompleted: tasksData.filter(task => task.status === 'completed').length
        },
        nextSteps: tasksData.slice(0, 3).map(task => ({
          id: task.id,
          title: task.title,
          priority: task.priority,
          dueDate: task.due_date
        })),
        recommendations: recommendationsData.map(rec => ({
          id: rec.id,
          title: rec.immigration_programs.title,
          country: rec.immigration_programs.country,
          score: rec.score,
          description: rec.reasoning
        })),
        tasks: tasksData.map(task => ({
          id: task.id,
          title: task.title,
          dueDate: task.due_date,
          status: task.status,
          priority: task.priority,
          category: task.category
        })),
        documents: {
          recent: documentsData.slice(0, 5).map(doc => ({
            id: doc.id,
            name: doc.name,
            uploadDate: doc.upload_date,
            type: doc.document_type,
            status: doc.status
          })),
          stats: documentStats
        }
      }
    };

    console.log('[dashboardService] Received dashboard data:', dashboardData.data);
    return dashboardData;
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

    // Check if the user has a profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, preferences')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError;
    }

    // Update the profile with the new preferences
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({
        preferences: {
          ...profile?.preferences,
          dashboard: preferences
        }
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return {
      success: true,
      message: 'Dashboard preferences updated successfully',
      data: updatedProfile.preferences.dashboard
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
