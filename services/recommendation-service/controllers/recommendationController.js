const axios = require('axios'); // Import axios
// Assuming Roadmap, Program, User models are NOT directly accessed here anymore
// const Roadmap = require('../../roadmap-service/models/Roadmap');
// const Program = require('../../program-service/models/Program');
// const User = require('../../user-service/models/User');
// TODO: Import error handling utilities

// --- Service URLs from Environment Variables ---
const USER_PROFILE_SERVICE_URL = process.env.USER_PROFILE_SERVICE_URL || 'http://localhost:3001/api'; // Assuming profile endpoint is on user service
const PROGRAM_SERVICE_URL = process.env.PROGRAM_SERVICE_URL || 'http://localhost:3002/api';
const ML_INSIGHTS_SERVICE_URL = process.env.ML_INSIGHTS_SERVICE_URL || 'http://ml-insights:5001'; // Docker service name
// --- End Service URLs ---

// --- Helper Functions ---
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
// --- End Helper Functions ---


// V2 Recommendation Logic using Service Calls
// Accepts either userId (string) or a pre-fetched userProfile object
const performV2Recommendation = async (userIdOrProfile, authToken) => {
    let userProfile;
    let userId;

    // 1. Determine if input is ID or profile object, fetch if necessary
    if (typeof userIdOrProfile === 'string') {
        userId = userIdOrProfile;
        console.log(`[REC_SVC] Performing V2 recommendation for user ID: ${userId}`);
        try {
            console.log(`[REC_SVC] Fetching profile from ${USER_PROFILE_SERVICE_URL}/profile/${userId}`);
            const profileResponse = await axios.get(`${USER_PROFILE_SERVICE_URL}/profile/${userId}`, {
                // headers: { Authorization: `Bearer ${authToken}` } // Example auth forwarding
            });
            if (profileResponse.data?.status !== 'success' || !profileResponse.data?.data?.profile) {
                throw new Error('Failed to fetch valid profile data from user service.');
            }
            userProfile = profileResponse.data.data.profile;
            console.log("[REC_SVC] Received profile data.");
        } catch (error) {
            console.error(`[REC_SVC] Error fetching profile for user ${userId}:`, error.message);
            throw new Error(`Could not fetch profile for user ${userId}. Service may be down.`);
        }
    } else if (typeof userIdOrProfile === 'object' && userIdOrProfile !== null) {
        userProfile = userIdOrProfile;
        userId = userProfile.userId || userProfile._id; // Get ID from profile object
         if (!userId) {
             throw new Error("Provided profile object is missing a user ID (_id or userId).");
         }
        console.log(`[REC_SVC] Performing V2 recommendation using provided profile for user ID: ${userId}`);
    } else {
         throw new Error("Invalid input: userIdOrProfile must be a string (userId) or a profile object.");
    }

    // 2. Fetch relevant programs from Program Service based on preferences
    let programs = [];
    try {
        const countryCodes = userProfile.preferences?.destinationCountries?.map(c => c.countryCode || c); // Adapt based on profile structure
        const params = {};
        if (countryCodes && countryCodes.length > 0) {
            params.countries = countryCodes.join(','); // Example: Pass countries as comma-separated string
        }
        console.log(`[REC_SVC] Fetching programs from ${PROGRAM_SERVICE_URL}/programs with params:`, params);
        const programResponse = await axios.get(`${PROGRAM_SERVICE_URL}/programs`, { params });
         if (programResponse.data?.status !== 'success' || !programResponse.data?.data?.programs) {
             throw new Error('Failed to fetch valid program data from program service.');
        }
        programs = programResponse.data.data.programs;
        console.log(`[REC_SVC] Received ${programs.length} programs.`);
    } catch (error) {
        console.error(`[REC_SVC] Error fetching programs:`, error.message);
        // Decide whether to proceed with empty programs or throw error
        // For now, proceed with empty list if service fails
    }


    // 3. Apply V1 Filtering/Scoring/Ranking (using fetched data)
    const userAge = calculateAge(userProfile.personalInfo?.dateOfBirth);
    const userFinances = userProfile.financialInformation; // Simplified access
    const userLanguages = userProfile.languageProficiency; // Simplified access
    const userPreferences = userProfile.preferences; // Simplified access

    const scoredPromises = programs.map(async (p) => { // Changed to map of promises
        let isEligible = true;
        const eligibilityGaps = [];

        // --- Eligibility Check ---
        if (p.eligibilityCriteria && p.eligibilityCriteria.length > 0) {
            for (const crit of p.eligibilityCriteria) {
                let criterionMet = true; // Assume met unless proven otherwise
                if (crit.criterionType === 'age') {
                    if (userAge === null) {
                         criterionMet = !crit.isRequired; // Cannot check if age unknown, fail if required
                    } else if ((crit.minValue !== undefined && userAge < crit.minValue) || (crit.maxValue !== undefined && userAge > crit.maxValue)) {
                        criterionMet = false;
                    }
                } else if (crit.criterionType === 'financial') {
                    // Very basic check: compare required funds (minValue) with liquid assets or net worth
                    const fundsAvailable = userFinances?.liquidAssets ?? userFinances?.netWorth ?? null;
                    if (fundsAvailable === null) {
                        criterionMet = !crit.isRequired;
                    } else if (crit.minValue !== undefined && fundsAvailable < crit.minValue) {
                         criterionMet = false;
                    }
                    // TODO: Consider currency conversion if needed
                } else if (crit.criterionType === 'language') {
                    // Basic check: Does user have *any* test result for the required language (crit.criterionName)?
                    // A real check needs specific score comparison (e.g., CLB level in crit.minValue)
                    const requiredLang = crit.criterionName; // e.g., 'English'
                    const hasLangProof = userLanguages?.some(lang =>
                        lang.language === requiredLang && lang.formalTest?.results?.overall // Check if test results exist
                    );
                    if (!hasLangProof) {
                         criterionMet = !crit.isRequired; // Fail if required and no proof found
                    }
                    // More advanced: Check score against crit.minValue
                }
                // Add checks for other criterionTypes as needed (education, workExperience...)

                if (!criterionMet && crit.isRequired) {
                    isEligible = false;
                    eligibilityGaps.push({
                        criterion: crit.criterionName || crit.criterionType,
                        requirement: `Min: ${crit.minValue ?? 'N/A'}, Max: ${crit.maxValue ?? 'N/A'} ${crit.unit || ''}`,
                        userValue: crit.criterionType === 'age' ? userAge : 'Check Profile', // Provide specific value if easy
                        description: crit.description || `Requirement for ${crit.criterionName || crit.criterionType} not met.`
                    });
                    // Optimization: Can break early if already ineligible
                    // break;
                }
            }
        }
        // --- End Eligibility Check ---

        // --- V2 Scoring: Fetch ML scores ---
        let mlMatchScore = 0.1; // Default
        let mlSuccessProbability = 0.1; // Default
        const strengths = []; // Keep for V1 style explanation for now
        const challenges = [...eligibilityGaps];

        if (isEligible) { // Only call ML service if basic eligibility met
            try {
                const mlPayload = {
                    user_profile: { userId: userProfile._id, ...userProfile } , // Send relevant parts of profile
                    program_details: { programId: p._id, ...p } // Send relevant parts of program
                };

                // Fetch ML Match Score
                console.log(`[REC_SVC] Fetching ML match_score from ${ML_INSIGHTS_SERVICE_URL}/predict/match_score for program ${p._id}`);
                let matchExplanation = null;
                let successExplanation = null;

                // Fetch ML Match Score & Explanation
                console.log(`[REC_SVC] Fetching ML match_score from ${ML_INSIGHTS_SERVICE_URL}/predict/match_score for program ${p._id}`);
                const matchScoreResponse = await axios.post(`${ML_INSIGHTS_SERVICE_URL}/predict/match_score`, mlPayload);
                if (matchScoreResponse.data && typeof matchScoreResponse.data.match_score === 'number') {
                    mlMatchScore = matchScoreResponse.data.match_score;
                    matchExplanation = matchScoreResponse.data.explanation; // Store explanation
                    console.log(`[REC_SVC] Received ML match_score: ${mlMatchScore} for program ${p._id}`);
                } else {
                    console.warn(`[REC_SVC] ML match_score not found or invalid for program ${p._id}. Using default.`);
                }

                // Fetch ML Success Probability & Explanation
                console.log(`[REC_SVC] Fetching ML success_probability from ${ML_INSIGHTS_SERVICE_URL}/predict/success_probability for program ${p._id}`);
                const successProbResponse = await axios.post(`${ML_INSIGHTS_SERVICE_URL}/predict/success_probability`, mlPayload);
                if (successProbResponse.data && typeof successProbResponse.data.success_probability === 'number') {
                    mlSuccessProbability = successProbResponse.data.success_probability;
                    successExplanation = successProbResponse.data.explanation; // Store explanation
                    console.log(`[REC_SVC] Received ML success_probability: ${mlSuccessProbability} for program ${p._id}`);
                } else {
                    console.warn(`[REC_SVC] ML success_probability not found or invalid for program ${p._id}. Using default.`);
                }

            } catch (mlError) {
                console.error(`[REC_SVC] Error fetching ML scores for program ${p._id}:`, mlError.message);
                // Keep default scores if ML service fails
            }
        }
        // --- End V2 Scoring ---

        // --- Preference Score (V1 logic retained for now) ---
        let preferenceScore = 0.5; // Default neutral score
        if (isEligible) {
            const preferredCountries = userPreferences?.destinationCountries?.sort((a, b) => a.preferenceRank - b.preferenceRank).map(c => c.countryId?.toString()) || [];
            const preferredPathways = userPreferences?.pathwayTypes?.sort((a, b) => a.preferenceRank - b.preferenceRank).map(pt => pt.type) || [];
            const programCountryId = p.country?._id?.toString() || p.country?.toString();

            if (programCountryId && preferredCountries.length > 0) {
                const countryRankIndex = preferredCountries.indexOf(programCountryId);
                if (countryRankIndex === 0) { strengths.push({ factor: 'Country', description: 'Matches top preferred country.' }); }
                else if (countryRankIndex > 0) { strengths.push({ factor: 'Country', description: 'Matches preferred country.' }); }
            }
            if (p.category && preferredPathways.length > 0) {
                 const pathwayRankIndex = preferredPathways.indexOf(p.category);
                 if (pathwayRankIndex === 0) { strengths.push({ factor: 'Pathway', description: 'Matches top preferred pathway type.' }); }
                 else if (pathwayRankIndex > 0) { strengths.push({ factor: 'Pathway', description: 'Matches preferred pathway type.' }); }
            }

            if (strengths.some(s => s.factor === 'Country' || s.factor === 'Pathway')) {
                preferenceScore = 0.7;
            }
        }
        // --- End Preference Score ---

        // --- Combine scores for ranking (V2 weights) ---
        let overallScore = (mlMatchScore * 0.5) + (mlSuccessProbability * 0.3) + (preferenceScore * 0.2);
        overallScore = Math.min(1.0, Math.max(0.0, overallScore)); // Ensure bounds 0-1

        // --- Explanation (Combine ML and eligibility/preference factors) ---
        let finalExplanation = {
            summary: 'Evaluation based on V2 criteria with ML insights.',
            positiveFactors: [...(matchExplanation?.positive_factors || []), ...(successExplanation?.positive_factors || []), ...strengths.map(s => s.description)],
            negativeFactors: [...(matchExplanation?.negative_factors || []), ...(successExplanation?.negative_factors || []), ...challenges.map(c => c.description)],
            notes: [matchExplanation?.notes, successExplanation?.notes].filter(Boolean).join(' ') || "Placeholder notes."
        };

        // Refine summary based on scores
        if (!isEligible) {
            finalExplanation.summary = 'Does not meet required eligibility criteria.';
        } else if (mlMatchScore > 0.7 && mlSuccessProbability > 0.6 && preferenceScore > 0.6) {
            finalExplanation.summary = 'Strong potential match based on ML analysis and preferences.';
        } else if (mlMatchScore > 0.5 && mlSuccessProbability > 0.4) {
             finalExplanation.summary = 'Potential match based on ML analysis.';
        }


        return {
            programId: p._id,
            programName: p.name,
            country: p.countryCode || p.country?.name || p.country, // Use name if populated
            category: p.category,
            scores: {
                mlMatchScore: parseFloat(mlMatchScore.toFixed(2)),
                mlSuccessProbability: parseFloat(mlSuccessProbability.toFixed(2)),
                preferenceScore: parseFloat(preferenceScore.toFixed(2)),
                overallScore: parseFloat(overallScore.toFixed(2))
            },
            explanation: finalExplanation, // Use combined explanation
            gapAnalysis: { hasGaps: !isEligible, gaps: eligibilityGaps } // Explicitly list eligibility gaps
        };
    });

    // Wait for all program scoring promises to resolve
    const scored = await Promise.all(scoredPromises);

    // Rank by overall score
    const ranked = scored.sort((a, b) => b.scores.overallScore - a.scores.overallScore);

    console.log(`[REC_SVC] Generated ${ranked.length} recommendations for user ${userId} using V2 logic.`);
    return ranked;
};

// Export the core logic so it can be imported by scenarioPlanner
exports.performV2Recommendation = performV2Recommendation;

exports.generateRecommendations = async (req, res, next) => {
  try {
    const userId = req.user?.id; // Assuming user ID from auth middleware
    const authToken = req.headers.authorization?.split(' ')[1]; // Get token if passed in header

    if (!userId) {
      return res.status(401).json({ status: 'fail', message: 'User not authenticated' });
    }

    // Call V2 logic using actual service calls (or mocks if services not running)
    const recommendations = await performV2Recommendation(userId, authToken);

    // TODO: Persist recommendations to the Recommendations collection in the database

    res.status(200).json({
      status: 'success',
      results: recommendations.length,
      data: {
        recommendationSet: recommendations
      }
    });
  } catch (err) {
    console.error("GENERATE RECOMMENDATIONS ERROR:", err);
    res.status(500).json({ status: 'error', message: err.message || 'Error generating recommendations' });
  }
};

exports.suggestDestinations = async (req, res, next) => {
    try {
        const userId = req.user?.id; // Assuming user ID from auth middleware
        const authToken = req.headers.authorization?.split(' ')[1]; // Get token if passed in header

        if (!userId) {
            return res.status(401).json({ status: 'fail', message: 'User not authenticated' });
        }

        console.log(`[REC_SVC] Suggesting destinations for user: ${userId}`);

        // 1. Fetch user profile
        let userProfile;
        try {
            console.log(`[REC_SVC] Fetching profile from ${USER_PROFILE_SERVICE_URL}/profile/${userId}`);
            const profileResponse = await axios.get(`${USER_PROFILE_SERVICE_URL}/profile/${userId}`, {
                // headers: { Authorization: `Bearer ${authToken}` } // Example auth forwarding
            });
            if (profileResponse.data?.status !== 'success' || !profileResponse.data?.data?.profile) {
                throw new Error('Failed to fetch valid profile data from user service.');
            }
            userProfile = profileResponse.data.data.profile;
            console.log("[REC_SVC] Received profile data for destination suggestion.");
        } catch (error) {
            console.error(`[REC_SVC] Error fetching profile for user ${userId}:`, error.message);
            throw new Error(`Could not fetch profile for user ${userId}. Service may be down.`);
        }

        // 2. Define Simplified Country Matching Rules (V1 Placeholder)
        // In a real scenario, this data would come from a DB or config file
        const countryRules = [
            { code: 'CA', name: 'Canada', ageMax: 45, needsEnglish: true, needsFrench: false, skilledWorkerFocus: true },
            { code: 'AU', name: 'Australia', ageMax: 45, needsEnglish: true, needsFrench: false, skilledWorkerFocus: true },
            { code: 'DE', name: 'Germany', ageMax: 50, needsEnglish: false, needsFrench: false, skilledWorkerFocus: true }, // Language needs vary greatly
            { code: 'NZ', name: 'New Zealand', ageMax: 55, needsEnglish: true, needsFrench: false, skilledWorkerFocus: true },
            { code: 'GB', name: 'United Kingdom', ageMax: 50, needsEnglish: true, needsFrench: false, skilledWorkerFocus: true },
            // Add more countries and refine rules
        ];

        // 3. Evaluate Rules against Profile
        const userAge = calculateAge(userProfile.personalInfo?.dateOfBirth);
        const hasEnglish = userProfile.languageProficiency?.some(lang => lang.language === 'English' && (lang.proficiencyLevel === 'advanced' || lang.proficiencyLevel === 'native' || lang.formalTest?.results?.overall > 6)); // Simplified check
        const hasFrench = userProfile.languageProficiency?.some(lang => lang.language === 'French' && (lang.proficiencyLevel === 'advanced' || lang.proficiencyLevel === 'native')); // Simplified check
        const hasDegree = userProfile.education?.some(edu => ['bachelor', 'master', 'doctorate'].includes(edu.degreeType) && edu.isCompleted);
        const hasSkilledWork = userProfile.workExperience?.some(work => work.employmentType === 'full-time' && (new Date() - new Date(work.startDate)) / (1000 * 60 * 60 * 24 * 365) >= 1); // At least 1 year FT exp

        const suggestions = [];
        countryRules.forEach(rule => {
            let score = 0;
            const reasons = [];

            // Age check
            if (userAge && userAge <= rule.ageMax) {
                score += 1;
                reasons.push(`Age (${userAge}) fits within typical range (<= ${rule.ageMax}).`);
            } else if (userAge) {
                 reasons.push(`Age (${userAge}) may be outside typical range (<= ${rule.ageMax}).`);
                 score -= 0.5; // Penalize slightly
            }

            // Language check
            if (rule.needsEnglish && hasEnglish) {
                score += 1;
                reasons.push('Good English proficiency match.');
            } else if (rule.needsEnglish && !hasEnglish) {
                score -= 1; // Penalize heavily if required language missing
                 reasons.push('English proficiency needed.');
            }
             if (rule.needsFrench && hasFrench) {
                score += 1;
                reasons.push('Good French proficiency match.');
            } else if (rule.needsFrench && !hasFrench) {
                score -= 1;
                 reasons.push('French proficiency needed.');
            }

             // Skilled worker check (basic proxy)
             if (rule.skilledWorkerFocus && (hasDegree || hasSkilledWork)) {
                 score += 1;
                 reasons.push('Profile suggests potential fit for skilled worker pathways.');
             } else if (rule.skilledWorkerFocus) {
                  reasons.push('May need specific skills/education for primary pathways.');
             }

             // Only add suggestions with a non-negative score
             if (score >= 0.5) { // Threshold for suggestion
                 suggestions.push({
                     countryCode: rule.code,
                     countryName: rule.name,
                     matchScore: score, // Simple score for ranking
                     reasons: reasons
                 });
             }
        });

        // Rank suggestions by score
        const rankedSuggestions = suggestions.sort((a, b) => b.matchScore - a.matchScore);

        console.log(`[REC_SVC] Generated ${rankedSuggestions.length} destination suggestions for user ${userId}.`);

        res.status(200).json({
            status: 'success',
            results: rankedSuggestions.length,
            data: {
                destinationSuggestions: rankedSuggestions
            }
        });

    } catch (err) {
        console.error("SUGGEST DESTINATIONS ERROR:", err);
        res.status(500).json({ status: 'error', message: err.message || 'Error suggesting destinations' });
    }
};


// Add other controller functions if needed
