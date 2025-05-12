const axios = require('axios');
const _ = require('lodash'); // Import lodash for deep merging
// Import the actual recommendation function (adjust path if needed)
// This creates a potential circular dependency if controller imports this file.
// Alternative: Pass performV1Recommendation as an argument to simulateProfileChange.
// Let's try importing directly first, assuming controller doesn't import this file.
const { performV1Recommendation } = require('../controllers/recommendationController');

const ML_INSIGHTS_SERVICE_URL = process.env.ML_INSIGHTS_SERVICE_URL || 'http://ml-insights:5001';

/**
 * Identifies qualification gaps for a user against a specific program.
 * Placeholder implementation.
 * @param {object} userProfile - The user's profile object.
 * @param {object} program - The program object.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of gap objects.
 */
async function identifyQualificationGaps(userProfile, program) {
    console.log(`[SCENARIO_PLANNER] Identifying gaps for user ${userProfile._id} and program ${program._id}`);
    const gaps = [];

    // This would replicate and extend the eligibility checks from recommendationController
    // For now, a very simplified placeholder:
    if (program.eligibilityCriteria && program.eligibilityCriteria.length > 0) {
        const userAge = calculateAge(userProfile.personalInfo?.dateOfBirth); // Assuming calculateAge is available or imported

        for (const crit of program.eligibilityCriteria) {
            if (crit.criterionType === 'age') {
                if (userAge !== null && ((crit.minValue && userAge < crit.minValue) || (crit.maxValue && userAge > crit.maxValue))) {
                    gaps.push({
                        criterion: crit.criterionName || 'Age',
                        currentValue: userAge,
                        requiredValue: `Min: ${crit.minValue ?? 'N/A'}, Max: ${crit.maxValue ?? 'N/A'}`,
                        description: crit.description || 'Age requirement not met.',
                        suggestion: `Consider programs with different age criteria or wait until criteria are met.`,
                    });
                }
            }
            // Add more criteria checks (financial, language, education, experience)
            // This should be more robust and mirror the main eligibility logic
        }
    }
    console.log(`[SCENARIO_PLANNER] Found ${gaps.length} gaps (placeholder).`);
    return gaps;
}

/**
 * Simulates the impact of a profile change on recommendations or a specific program.
 * Placeholder implementation for "what-if" scenarios.
 * @param {object} originalUserProfile - The user's original profile.
 * @param {object} profileChanges - An object representing changes to the profile (e.g., { "languageProficiency.english.ielts": 7.5 }).
 * @param {string} authToken - The user's auth token (if needed for service calls).
 * @returns {Promise<object>} A promise that resolves to an object containing the simulated recommendations.
 */
async function simulateProfileChange(originalUserProfile, profileChanges, authToken) {
    console.log(`[SCENARIO_PLANNER] Simulating profile change for user ${originalUserProfile._id}`);

    // 1. Create a temporary "modified" user profile using deep merge
    const modifiedUserProfile = _.merge({}, originalUserProfile, profileChanges);
    // Note: Ensure profileChanges structure matches profile structure for merge to work correctly.
    // e.g., profileChanges = { languageProficiency: [ { _id: '...', formalTest: { results: { ielts: 7.5 } } } ] } - this is complex.
    // Simpler V1 might only allow changing top-level fields or specific nested ones handled manually.
    // For now, assume profileChanges contains fields to directly overwrite/add at appropriate levels.
    // Example simple change: profileChanges = { financialInformation: { annualIncome: 80000 } }
    console.log('[SCENARIO_PLANNER] Modified profile (conceptual):', modifiedUserProfile);


    // 2. Re-run the recommendation generation with the modified profile
    // We need the userId and potentially the authToken
    const userId = originalUserProfile.userId || originalUserProfile._id; // Get user ID
    if (!userId) {
        throw new Error("User ID not found in original profile for simulation.");
    }

    console.log(`[SCENARIO_PLANNER] Re-running recommendations for user ${userId} with modified profile.`);

    // Call the main recommendation function (imported or passed)
    // We need to pass the *modified* profile object instead of fetching it by ID inside performV1Recommendation
    // This requires modifying performV1Recommendation to accept an optional profile object.
    // --- Modification Needed in recommendationController.js ---
    // Let's assume performV1Recommendation is modified like:
    // async (userIdOrProfile, authToken) => {
    //   let userProfile = typeof userIdOrProfile === 'string' ? await fetchProfile(userIdOrProfile) : userIdOrProfile;
    //   ... rest of the function ...
    // }
    // --- End Modification Needed ---

    // For now, we'll proceed assuming performV1Recommendation can handle an object input
    // If direct import causes issues, this function needs refactoring to accept performV1Recommendation as arg.
    const simulatedRecommendations = await performV1Recommendation(modifiedUserProfile, authToken);

    // 3. Return the results
    // Could also fetch original recommendations here to provide a comparison, but that might be slow.
    // The controller calling this might handle fetching original recommendations separately.
    return {
        scenario: "Full Re-recommendation Simulation",
        simulatedRecommendations: simulatedRecommendations.slice(0, 10) // Return top 10 simulated results
    };

}

// Helper function (could be in a utils file)
function calculateAge(dateOfBirth) {
    if (!dateOfBirth) return null;
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}


module.exports = {
    identifyQualificationGaps,
    simulateProfileChange,
};
