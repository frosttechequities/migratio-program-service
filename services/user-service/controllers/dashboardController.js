const axios = require('axios'); // Use axios for inter-service communication
const User = require('../models/User');
const Profile = require('../models/Profile');
// TODO: Import error handling utilities

// --- Service URLs from Environment Variables ---
const RECOMMENDATION_SERVICE_URL = process.env.RECOMMENDATION_SERVICE_URL || 'http://localhost:3004/api';
const ROADMAP_SERVICE_URL = process.env.ROADMAP_SERVICE_URL || 'http://localhost:3006/api';
const DOCUMENT_SERVICE_URL = process.env.DOCUMENT_SERVICE_URL || 'http://localhost:3005/api';
// Add other service URLs as needed (e.g., ASSESSMENT_SERVICE_URL)
// --- End Service URLs ---

// Helper function to make service calls with basic error handling
const callService = async (url, config = {}) => {
    try {
        const response = await axios({ url, ...config });
        if (response.data?.status === 'success') {
            return response.data.data; // Return the actual data part
        }
        console.warn(`Service call to ${url} returned status: ${response.data?.status}`);
        return null; // Return null or default value on non-success status
    } catch (error) {
        const status = error.response?.status;
        const message = (error.response?.data?.message) || error.message || 'Unknown service error';
        console.error(`Error calling service ${url}: ${status} - ${message}`);
        // Don't throw here, allow aggregation to continue with partial data if possible
        return null; // Return null on error
    }
};

exports.getDashboardData = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const authToken = req.headers.authorization; // Get auth token to forward

        if (!userId) {
            return res.status(401).json({ status: 'fail', message: 'User not authenticated' });
        }

        console.log(`[DASHBOARD_CTRL] Aggregating dashboard data for user ${userId}`);

        // --- Fetch data concurrently from various sources ---
        // Prepare headers for internal service calls (forward auth token)
        const serviceCallHeaders = { Authorization: authToken }; // Pass the original auth header

        const [
            profileData,
            recommendationData,
            roadmapData, // Fetch all roadmaps to find tasks/stats
            documentData // Fetch all docs to find stats/recent
            // TODO: Fetch resource recommendations
        ] = await Promise.all([
            // Fetch profile data (assuming endpoint exists on this service or another)
            Profile.findOne({ userId: userId }).lean(), // Fetch local profile data
            // Fetch top recommendations
            callService(`${RECOMMENDATION_SERVICE_URL}/recommendations`, { headers: serviceCallHeaders }), // GET request
            // Fetch all active roadmaps for user to extract tasks/progress
            callService(`${ROADMAP_SERVICE_URL}/roadmaps`, { headers: serviceCallHeaders }), // GET request
            // Fetch all documents for user to extract stats/recent
            callService(`${DOCUMENT_SERVICE_URL}/documents`, { headers: serviceCallHeaders }) // GET request
        ]);

        // --- Process and Aggregate Data ---

        // Process Recommendations
        const topRecommendations = recommendationData?.recommendationSet?.slice(0, 3) || [];

        // Process Tasks (find upcoming/overdue from all active roadmaps)
        let upcomingTasks = [];
        if (roadmapData?.roadmaps) {
            const allTasks = roadmapData.roadmaps
                .filter(r => r.status === 'active') // Only consider active roadmaps
                .flatMap(r => r.phases?.flatMap(p => p.tasks?.map(t => ({ ...t, roadmapTitle: r.title, phaseName: p.phaseName })) || []) || []);

            upcomingTasks = allTasks
                .filter(t => t.status !== 'completed' && t.dueDate)
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)) // Sort by due date
                .slice(0, 4); // Limit to 4
        }

        // Process Documents
        const documentStats = { uploaded: 0, verified: 0, pendingVerification: 0, expiring: 0 };
        let recentDocuments = [];
        if (documentData?.documents) {
            const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            documentData.documents.forEach(doc => {
                if (doc.status === 'uploaded' || doc.status === 'replaced') { // Count only active uploads
                    documentStats.uploaded++;
                    if (doc.verificationStatus === 'verified') {
                        documentStats.verified++;
                    } else if (['pending_verification', 'verification_in_progress'].includes(doc.verificationStatus)) {
                        documentStats.pendingVerification++;
                    }
                    if (doc.expiryDate && new Date(doc.expiryDate) <= thirtyDaysFromNow) {
                        documentStats.expiring++;
                    }
                }
            });
            recentDocuments = documentData.documents
                .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
                .slice(0, 3)
                .map(doc => ({ // Select only needed fields for widget
                    documentId: doc._id,
                    originalFilename: doc.originalFilename,
                    uploadDate: doc.uploadDate,
                    lastUpdated: doc.updatedAt,
                    status: doc.status,
                    verificationStatus: doc.verificationStatus
                 }));
        }

        // Aggregate Payload
        const dashboardPayload = {
            overview: {
                profileCompletion: profileData?.profileMetadata?.completionPercentage || 0,
                // TODO: Add other overview stats by calling relevant services if needed
                daysActive: profileData?.createdAt ? Math.ceil((Date.now() - new Date(profileData.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0,
                currentStageIndex: 1 // Placeholder
            },
            recommendations: topRecommendations,
            tasks: upcomingTasks,
            documents: {
                stats: documentStats,
                recent: recentDocuments
            },
            resources: [], // Placeholder
        };

        res.status(200).json({
            status: 'success',
            data: dashboardPayload
        });

    } catch (err) {
        console.error("GET DASHBOARD DATA ERROR:", err);
        res.status(500).json({ status: 'error', message: 'Error fetching dashboard data' });
    }
};
