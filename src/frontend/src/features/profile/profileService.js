import supabase from '../../utils/supabaseClient';

// Get current user's profile
const getProfile = async () => {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get the user's profile from the profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      // If profile not found, create a default one
      if (profileError.code === 'PGRST116') { // Record not found error code
        console.log('Profile not found, creating default profile');

        const defaultProfile = {
          id: user.id,
          email: user.email,
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          personal_info: {},
          education: [],
          work_experience: [],
          language_proficiency: [],
          financial_information: {},
          immigration_history: {},
          preferences: {},
          readiness_checklist: []
        };

        // Insert the default profile
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert(defaultProfile)
          .select()
          .single();

        if (insertError) throw insertError;

        return newProfile;
      }

      throw profileError;
    }

    return profile;
  } catch (error) {
    console.error('Get Profile Service Error:', error.message);
    throw new Error(error.message || 'Failed to fetch profile');
  }
};

// Update a readiness checklist item
const updateReadinessChecklistItem = async (itemId, updateData) => {
  if (!itemId) throw new Error('Checklist Item ID is required for update');
  if (!updateData || typeof updateData.isComplete !== 'boolean') throw new Error('Update data with isComplete boolean is required');

  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get the current profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('readiness_checklist')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;

    // Find and update the checklist item
    let readinessChecklist = profile.readiness_checklist || [];
    const itemIndex = readinessChecklist.findIndex(item => item.item_id === itemId);

    if (itemIndex === -1) {
      // Item not found, create a new one
      const newItem = {
        item_id: itemId,
        title: updateData.title || `Item ${itemId}`,
        description: updateData.description || '',
        is_complete: updateData.isComplete,
        completed_at: updateData.isComplete ? new Date().toISOString() : null,
        notes: updateData.notes || ''
      };

      readinessChecklist.push(newItem);
    } else {
      // Update existing item
      readinessChecklist[itemIndex] = {
        ...readinessChecklist[itemIndex],
        is_complete: updateData.isComplete,
        completed_at: updateData.isComplete ? new Date().toISOString() : null,
        notes: updateData.notes !== undefined ? updateData.notes : readinessChecklist[itemIndex].notes
      };
    }

    // Update the profile with the new checklist
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({ readiness_checklist: readinessChecklist })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Return the updated item
    const updatedItem = updatedProfile.readiness_checklist.find(item => item.item_id === itemId);
    return updatedItem;
  } catch (error) {
    console.error(`Update Checklist Item Service Error (${itemId}):`, error.message);
    throw new Error(error.message || `Failed to update checklist item ${itemId}`);
  }
};

// TODO: Add function for general profile update (updateProfile) if needed

const profileService = {
  getProfile,
  updateReadinessChecklistItem,
};

export default profileService;
