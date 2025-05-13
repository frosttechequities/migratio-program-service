import supabase from '../../utils/supabaseClient';

/**
 * Get all roadmaps for the current user
 * @returns {Promise<Object>} Roadmaps data
 */
const getAllRoadmaps = async () => {
  try {
    console.log('[roadmapService] Fetching all roadmaps...');

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Fetch user roadmaps
    const { data: roadmapsData, error: roadmapsError } = await supabase
      .from('user_roadmaps')
      .select(`
        id,
        title,
        description,
        status,
        created_at,
        updated_at,
        program_id,
        immigration_programs (
          id,
          title,
          country,
          description
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (roadmapsError) throw roadmapsError;

    console.log('[roadmapService] Received roadmaps:', roadmapsData);
    return {
      status: 'success',
      data: roadmapsData || []
    };
  } catch (error) {
    console.error('Get All Roadmaps Service Error:', error.message);
    throw new Error(error.message);
  }
};

/**
 * Get a roadmap by ID
 * @param {string} roadmapId - Roadmap ID
 * @returns {Promise<Object>} Roadmap data
 */
const getRoadmapById = async (roadmapId) => {
  try {
    console.log(`[roadmapService] Fetching roadmap ${roadmapId}...`);

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Fetch the roadmap
    const { data: roadmap, error: roadmapError } = await supabase
      .from('user_roadmaps')
      .select(`
        id,
        title,
        description,
        status,
        created_at,
        updated_at,
        program_id,
        immigration_programs (
          id,
          title,
          country,
          description
        )
      `)
      .eq('id', roadmapId)
      .eq('user_id', user.id)
      .single();

    if (roadmapError) throw roadmapError;

    // Fetch the roadmap milestones
    const { data: milestones, error: milestonesError } = await supabase
      .from('roadmap_milestones')
      .select('*')
      .eq('roadmap_id', roadmapId)
      .order('order_index', { ascending: true });

    if (milestonesError) throw milestonesError;

    console.log('[roadmapService] Received roadmap:', roadmap);
    console.log('[roadmapService] Received milestones:', milestones);

    return {
      status: 'success',
      data: {
        ...roadmap,
        milestones: milestones || []
      }
    };
  } catch (error) {
    console.error(`Get Roadmap By ID Service Error (${roadmapId}):`, error.message);
    throw new Error(error.message);
  }
};

/**
 * Updates the status of a specific milestone within a roadmap.
 * @param {string} roadmapId - Roadmap ID
 * @param {string} milestoneId - Milestone ID
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} Updated milestone data
 */
const updateMilestoneStatus = async (roadmapId, milestoneId, updateData) => {
  try {
    console.log(`[roadmapService] Updating milestone ${milestoneId} status to ${updateData.status}...`);

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Verify the roadmap belongs to the user
    const { data: roadmap, error: roadmapError } = await supabase
      .from('user_roadmaps')
      .select('id')
      .eq('id', roadmapId)
      .eq('user_id', user.id)
      .single();

    if (roadmapError) throw roadmapError;

    // Update the milestone status
    const { data: updatedMilestone, error: updateError } = await supabase
      .from('roadmap_milestones')
      .update({
        status: updateData.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', milestoneId)
      .eq('roadmap_id', roadmapId)
      .select()
      .single();

    if (updateError) throw updateError;

    console.log('[roadmapService] Updated milestone:', updatedMilestone);
    return {
      status: 'success',
      data: updatedMilestone
    };
  } catch (error) {
    console.error(`Update Milestone Status Service Error (${milestoneId}):`, error.message);
    throw new Error(error.message);
  }
};

/**
 * Updates the status of a document requirement within a roadmap.
 * @param {string} roadmapId - Roadmap ID
 * @param {string} documentId - Document ID
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} Updated document data
 */
const updateDocumentStatus = async (roadmapId, documentId, updateData) => {
  try {
    console.log(`[roadmapService] Updating document ${documentId} status to ${updateData.status}...`);

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Verify the roadmap belongs to the user
    const { data: roadmap, error: roadmapError } = await supabase
      .from('user_roadmaps')
      .select('id')
      .eq('id', roadmapId)
      .eq('user_id', user.id)
      .single();

    if (roadmapError) throw roadmapError;

    // Update the document status
    const { data: updatedDocument, error: updateError } = await supabase
      .from('user_documents')
      .update({
        status: updateData.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) throw updateError;

    console.log('[roadmapService] Updated document:', updatedDocument);
    return {
      status: 'success',
      data: updatedDocument
    };
  } catch (error) {
    console.error(`Update Document Status Service Error (${documentId}):`, error.message);
    throw new Error(error.message);
  }
};

/**
 * Generate a new roadmap based on recommendation and program data
 * @param {Object} roadmapData - Data for creating a roadmap
 * @returns {Promise<Object>} - The created roadmap
 */
const generateRoadmap = async (roadmapData) => {
  try {
    console.log(`[roadmapService] Generating roadmap for program ${roadmapData.programId}...`);

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Create the roadmap
    const { data: roadmap, error: roadmapError } = await supabase
      .from('user_roadmaps')
      .insert([
        {
          user_id: user.id,
          title: roadmapData.title,
          description: roadmapData.description || '',
          program_id: roadmapData.programId,
          status: 'active'
        }
      ])
      .select()
      .single();

    if (roadmapError) throw roadmapError;

    // Generate milestones based on the program
    const milestones = await generateMilestones(roadmap.id, roadmapData.programId);

    console.log('[roadmapService] Created roadmap:', roadmap);
    console.log('[roadmapService] Created milestones:', milestones);

    return {
      status: 'success',
      data: {
        ...roadmap,
        milestones
      }
    };
  } catch (error) {
    console.error('Generate Roadmap Service Error:', error.message);
    throw new Error(error.message);
  }
};

/**
 * Generate milestones for a roadmap
 * @param {string} roadmapId - Roadmap ID
 * @param {string} programId - Program ID
 * @returns {Promise<Array>} Generated milestones
 */
const generateMilestones = async (roadmapId, programId) => {
  try {
    console.log(`[roadmapService] Generating milestones for roadmap ${roadmapId} and program ${programId}...`);

    // Get the program
    const { data: program, error: programError } = await supabase
      .from('immigration_programs')
      .select('*')
      .eq('id', programId)
      .single();

    if (programError) throw programError;

    // Define standard milestones based on the program
    const standardMilestones = [
      {
        title: 'Research and Planning',
        description: 'Research the immigration program and requirements',
        order_index: 0,
        status: 'pending',
        estimated_duration: '2 weeks',
        roadmap_id: roadmapId
      },
      {
        title: 'Document Collection',
        description: 'Gather all required documents for the application',
        order_index: 1,
        status: 'pending',
        estimated_duration: '4 weeks',
        roadmap_id: roadmapId
      },
      {
        title: 'Language Testing',
        description: 'Complete required language tests (IELTS, CELPIP, etc.)',
        order_index: 2,
        status: 'pending',
        estimated_duration: '6 weeks',
        roadmap_id: roadmapId
      },
      {
        title: 'Education Assessment',
        description: 'Get educational credentials assessed if required',
        order_index: 3,
        status: 'pending',
        estimated_duration: '8 weeks',
        roadmap_id: roadmapId
      },
      {
        title: 'Application Submission',
        description: 'Submit the application with all required documents',
        order_index: 4,
        status: 'pending',
        estimated_duration: '2 weeks',
        roadmap_id: roadmapId
      },
      {
        title: 'Biometrics and Medical Examination',
        description: 'Complete biometrics and medical examination if required',
        order_index: 5,
        status: 'pending',
        estimated_duration: '4 weeks',
        roadmap_id: roadmapId
      },
      {
        title: 'Application Processing',
        description: 'Wait for application processing and respond to any requests for additional information',
        order_index: 6,
        status: 'pending',
        estimated_duration: '6 months',
        roadmap_id: roadmapId
      },
      {
        title: 'Visa Approval',
        description: 'Receive visa approval and prepare for travel',
        order_index: 7,
        status: 'pending',
        estimated_duration: '2 weeks',
        roadmap_id: roadmapId
      }
    ];

    // Insert the milestones
    const { data: milestones, error: milestonesError } = await supabase
      .from('roadmap_milestones')
      .insert(standardMilestones)
      .select();

    if (milestonesError) throw milestonesError;

    return milestones;
  } catch (error) {
    console.error(`Generate Milestones Error (${roadmapId}, ${programId}):`, error.message);
    return [];
  }
};

const roadmapService = {
  getAllRoadmaps,
  getRoadmapById,
  updateMilestoneStatus,
  updateDocumentStatus,
  generateRoadmap
};

export default roadmapService;
