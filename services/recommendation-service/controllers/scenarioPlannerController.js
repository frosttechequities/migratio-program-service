// services/recommendation-service/controllers/scenarioPlannerController.js
const axios = require('axios');
const { simulateProfileChange, identifyQualificationGaps } = require('../core/scenarioPlanner');

const USER_PROFILE_SERVICE_URL = process.env.USER_PROFILE_SERVICE_URL || 'http://localhost:3001/api';
const PROGRAM_SERVICE_URL = process.env.PROGRAM_SERVICE_URL || 'http://localhost:3002/api';


exports.handleSimulateProfileChange = async (req, res, next) => {
    try {
        const userId = req.user?.id; // Assuming user ID from auth middleware (if protect is used)
        const { profileChanges, programIdToEvaluate } = req.body;

        if (!userId && !req.body.originalUserProfile) { // Allow passing full profile for unauth testing if needed
             return res.status(400).json({ status: 'fail', message: 'User not authenticated and originalUserProfile not provided.' });
        }
        if (!profileChanges) {
            return res.status(400).json({ status: 'fail', message: 'Missing profileChanges in request body.' });
        }

        let originalUserProfile;
        if (req.body.originalUserProfile) {
            originalUserProfile = req.body.originalUserProfile;
        } else {
            // Fetch current user profile
            try {
                console.log(`[SCENARIO_CTRL] Fetching profile for simulation from ${USER_PROFILE_SERVICE_URL}/profile/${userId}`);
                const profileResponse = await axios.get(`${USER_PROFILE_SERVICE_URL}/profile/${userId}`);
                if (profileResponse.data?.status !== 'success' || !profileResponse.data?.data?.profile) {
                    throw new Error('Failed to fetch valid profile data for simulation.');
                }
                originalUserProfile = profileResponse.data.data.profile;
            } catch (error) {
                console.error(`[SCENARIO_CTRL] Error fetching profile for user ${userId} for simulation:`, error.message);
                return res.status(500).json({ status: 'error', message: `Could not fetch profile for simulation. Service may be down.` });
            }
        }
        
        let programToEvaluate = null;
        if (programIdToEvaluate) {
            // Fetch the specific program details if an ID is provided
            try {
                console.log(`[SCENARIO_CTRL] Fetching program ${programIdToEvaluate} for simulation from ${PROGRAM_SERVICE_URL}/programs/${programIdToEvaluate}`);
                const programResponse = await axios.get(`${PROGRAM_SERVICE_URL}/programs/${programIdToEvaluate}`);
                 if (programResponse.data?.status !== 'success' || !programResponse.data?.data?.program) {
                    throw new Error('Failed to fetch valid program data for simulation.');
                }
                programToEvaluate = programResponse.data.data.program;
            } catch (error) {
                console.error(`[SCENARIO_CTRL] Error fetching program ${programIdToEvaluate} for simulation:`, error.message);
                return res.status(500).json({ status: 'error', message: `Could not fetch program ${programIdToEvaluate} for simulation.` });
            }
        }

        const simulationResult = await simulateProfileChange(originalUserProfile, profileChanges, programToEvaluate);

        res.status(200).json({
            status: 'success',
            data: simulationResult,
        });

    } catch (err) {
        console.error("SIMULATE PROFILE CHANGE ERROR:", err);
        res.status(500).json({ status: 'error', message: err.message || 'Error simulating profile change' });
    }
};

exports.handleIdentifyGaps = async (req, res, next) => {
    try {
        const userId = req.user?.id; // Assuming user ID from auth middleware
        const { programId } = req.body; // Expect programId to identify gaps against

        if (!userId && !req.body.userProfile) {
             return res.status(400).json({ status: 'fail', message: 'User not authenticated and userProfile not provided.' });
        }
        if (!programId) {
            return res.status(400).json({ status: 'fail', message: 'Missing programId in request body.' });
        }
        
        let userProfile;
        if (req.body.userProfile) {
            userProfile = req.body.userProfile;
        } else {
            try {
                const profileResponse = await axios.get(`${USER_PROFILE_SERVICE_URL}/profile/${userId}`);
                userProfile = profileResponse.data.data.profile;
            } catch (error) {
                 console.error(`[SCENARIO_CTRL] Error fetching profile for user ${userId} for gap analysis:`, error.message);
                return res.status(500).json({ status: 'error', message: `Could not fetch profile for gap analysis.` });
            }
        }

        let program;
        try {
            const programResponse = await axios.get(`${PROGRAM_SERVICE_URL}/programs/${programId}`);
            program = programResponse.data.data.program;
        } catch (error) {
            console.error(`[SCENARIO_CTRL] Error fetching program ${programId} for gap analysis:`, error.message);
            return res.status(500).json({ status: 'error', message: `Could not fetch program ${programId} for gap analysis.` });
        }

        if (!userProfile || !program) {
            return res.status(404).json({ status: 'fail', message: 'User profile or program not found for gap analysis.' });
        }

        const gaps = await identifyQualificationGaps(userProfile, program);

        res.status(200).json({
            status: 'success',
            data: {
                userId: userProfile._id || userId,
                programId: program._id,
                gaps,
            },
        });

    } catch (err) {
        console.error("IDENTIFY GAPS ERROR:", err);
        res.status(500).json({ status: 'error', message: err.message || 'Error identifying qualification gaps' });
    }
};
