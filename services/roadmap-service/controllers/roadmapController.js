const Roadmap = require('../models/Roadmap');
// const Program = require('../../program-service/models/Program'); // REMOVE direct model access
const axios = require('axios'); // Use axios to call other services
// TODO: Import error handling utilities

// --- Service URLs ---
const PROGRAM_SERVICE_URL = process.env.PROGRAM_SERVICE_URL || 'http://program-service:3004/api'; // Use service name and correct default port
// --- End Service URLs ---


// --- Service Client Functions ---
const getProgramDetailsFromService = async (programId, authToken) => {
    const url = `${PROGRAM_SERVICE_URL}/programs/${programId}`;
    console.log(`[ROADMAP_SVC] Fetching program details for ${programId} from ${url}`);
    try {
        // TODO: Forward auth token if Program Service requires authentication for this endpoint
        const response = await axios.get(url, {
            // headers: { Authorization: `Bearer ${authToken}` }
        });
        if (response.data?.status === 'success' && response.data?.data?.program) {
            console.log(`[ROADMAP_SVC] Successfully fetched program details for ${programId}`);
            return response.data.data.program;
        } else {
            console.error(`[ROADMAP_SVC] Program service returned unexpected response for ${programId}:`, response.data);
            throw new Error(`Program service returned invalid data for program ID ${programId}.`);
        }
    } catch (error) {
        console.error(`[ROADMAP_SVC] Error fetching program ${programId} from Program Service:`, error.response?.data || error.message);
        // Throw a more specific error or return null/empty object based on desired behavior
        if (error.response?.status === 404) {
             throw new Error(`Program with ID ${programId} not found in Program Service.`);
        }
        throw new Error(`Could not fetch program details for ID ${programId} from Program Service.`);
    }
};
// --- End Service Client Functions ---


exports.createRoadmap = async (req, res, next) => {
  try {
    const userId = req.user?.id; // Assuming user ID from auth middleware
    if (!userId) {
      return res.status(401).json({ status: 'fail', message: 'User not authenticated' });
    }

    const { programId, recommendationId, title } = req.body;
    if (!programId || !recommendationId || !title) {
        return res.status(400).json({ status: 'fail', message: 'Missing programId, recommendationId, or title.' });
    } // <-- Added missing closing brace
    const authToken = req.headers.authorization?.split(' ')[1]; // Get token if passed in header

    console.log(`[ROADMAP_SVC] Creating roadmap for user ${userId}, program ${programId}`);

    // 1. Fetch program details including application steps using the real service client
    const program = await getProgramDetailsFromService(programId, authToken);
    // Error handling is now within getProgramDetailsFromService, it will throw on failure

    // 2. Generate phases and tasks from program steps (V1 - Phased Mapping)
    const standardPhases = {
        PREPARATION: { phaseName: 'Preparation', status: 'active', tasks: [], documents: [], milestones: [] },
        SUBMISSION: { phaseName: 'Application Submission', status: 'pending', tasks: [], documents: [], milestones: [] },
        PROCESSING: { phaseName: 'Application Processing', status: 'pending', tasks: [], documents: [], milestones: [] },
        PRE_ARRIVAL: { phaseName: 'Pre-Arrival & Landing', status: 'pending', tasks: [], documents: [], milestones: [] },
        // Add more phases like POST_ARRIVAL later
    };

    // Helper to map step title/description to a phase key
    const mapStepToPhase = (stepTitle) => {
        const titleLower = stepTitle.toLowerCase();
        if (titleLower.includes('submit') || titleLower.includes('pay fees')) return 'SUBMISSION';
        if (titleLower.includes('await') || titleLower.includes('wait') || titleLower.includes('medical') || titleLower.includes('biometrics') || titleLower.includes('decision') || titleLower.includes('ppr')) return 'PROCESSING';
        if (titleLower.includes('copr') || titleLower.includes('land') || titleLower.includes('visa stamp')) return 'PRE_ARRIVAL';
        // Default to Preparation for eligibility checks, profile creation, document gathering etc.
        return 'PREPARATION';
    };

    // Add standard preparation tasks
    standardPhases.PREPARATION.tasks.push({
         taskId: `task_${programId}_std_gather_docs`, title: 'Gather Required Documents', description: 'Collect all documents listed for the program.', status: 'pending'
    });
     standardPhases.PREPARATION.tasks.push({
         taskId: `task_${programId}_std_check_eligibility`, title: 'Confirm Eligibility Details', description: 'Double-check all eligibility criteria.', status: 'pending'
    });

    // Map program steps to phases
    (program.applicationSteps || []).forEach(step => {
        const phaseKey = mapStepToPhase(step.title);
        const task = {
            taskId: `task_${programId}_${step.stepNumber}`,
            title: step.title,
            description: step.description,
            status: 'pending',
            // TODO: Add due date logic
        };
        if (standardPhases[phaseKey]) {
            standardPhases[phaseKey].tasks.push(task);
        } else {
            standardPhases.PREPARATION.tasks.push(task); // Default to preparation if phase unknown
        }
    });

    // Add standard pre-arrival tasks
     standardPhases.PRE_ARRIVAL.tasks.push({
         taskId: `task_${programId}_std_book_flights`, title: 'Book Flights', description: 'Arrange travel to destination country.', status: 'pending'
    });
     standardPhases.PRE_ARRIVAL.tasks.push({
         taskId: `task_${programId}_std_arrange_accom`, title: 'Arrange Initial Accommodation', description: 'Secure temporary or permanent housing.', status: 'pending'
    });


    // Filter out phases with no tasks (unless standard phases should always be shown)
    const phases = Object.values(standardPhases).filter(phase => phase.tasks.length > 0);
    // TODO: Populate phase.documents based on program.requiredDocuments
    // TODO: Define and add phase.milestones

    // 3. Create Roadmap document
    const newRoadmapData = {
        userId,
        programId,
        recommendationId,
        title: title || `Roadmap for ${program.name}`,
        description: `Personalized roadmap for ${program.name}`,
        status: 'active',
        phases: phases,
        planningAssessmentResults: {}, // Initialize empty
        settlementProgress: {} // Initialize empty
    };

    const newRoadmap = await Roadmap.create(newRoadmapData);

    res.status(201).json({
      status: 'success',
      data: {
        roadmap: newRoadmap
      }
    });

  } catch (err) {
    console.error("CREATE ROADMAP ERROR:", err);
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(el => el.message);
        const message = `Invalid input data. ${errors.join('. ')}`;
        return res.status(400).json({ status: 'fail', message });
    }
    res.status(500).json({ status: 'error', message: 'Error creating roadmap' });
  }
};

exports.getAllRoadmaps = async (req, res, next) => {
  try {
    const userId = req.user?.id; // Assuming user ID from auth middleware
    if (!userId) {
      return res.status(401).json({ status: 'fail', message: 'User not authenticated' });
    }

    console.log(`[ROADMAP_SVC] Fetching all roadmaps for user ${userId}`);
    const roadmaps = await Roadmap.find({ userId: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: roadmaps.length,
      data: {
        roadmaps
      }
    });
  } catch (err) {
    console.error("GET ALL ROADMAPS ERROR:", err);
    res.status(500).json({ status: 'error', message: 'Error fetching roadmaps' });
  }
};

exports.getRoadmap = async (req, res, next) => {
  try {
    const userId = req.user?.id; // Assuming user ID from auth middleware
    if (!userId) {
      return res.status(401).json({ status: 'fail', message: 'User not authenticated' });
    }
    const roadmapId = req.params.id;
    console.log(`[ROADMAP_SVC] Fetching roadmap ${roadmapId} for user ${userId}`);

    // TODO: Add population for tasks/documents if needed for detailed view
    const roadmap = await Roadmap.findOne({ _id: roadmapId, userId: userId });

    if (!roadmap) {
      return res.status(404).json({ status: 'fail', message: 'No roadmap found with that ID for this user' });
    }

    res.status(200).json({
      status: 'success',
      data: {
        roadmap
      }
    });
  } catch (err) {
     if (err.name === 'CastError') {
        return res.status(400).json({ status: 'fail', message: `Invalid roadmap ID format: ${req.params.id}` });
     }
     console.error("GET ROADMAP ERROR:", err);
     res.status(500).json({ status: 'error', message: 'Error fetching roadmap' });
  }
};

exports.updateRoadmap = async (req, res, next) => {
  try {
    const userId = req.user?.id; // Assuming user ID from auth middleware
    if (!userId) {
      return res.status(401).json({ status: 'fail', message: 'User not authenticated' });
    }

    const roadmapId = req.params.id;
    const { title, description, status, notes } = req.body;

    console.log(`[ROADMAP_SVC] Updating roadmap ${roadmapId} for user ${userId}`);

    // Find roadmap and check ownership
    const roadmap = await Roadmap.findOne({ _id: roadmapId, userId });

    if (!roadmap) {
      return res.status(404).json({ status: 'fail', message: 'Roadmap not found or user unauthorized' });
    }

    // Update allowed fields
    if (title !== undefined) roadmap.title = title;
    if (description !== undefined) roadmap.description = description;
    if (status !== undefined) {
      // Validate status
      const validStatuses = ['draft', 'active', 'on_hold', 'completed', 'abandoned'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          status: 'fail',
          message: `Invalid status value: ${status}. Must be one of ${validStatuses.join(', ')}.`
        });
      }
      roadmap.status = status;
    }
    if (notes !== undefined) roadmap.notes = notes;

    // Save changes
    await roadmap.save();

    res.status(200).json({
      status: 'success',
      data: {
        roadmap
      }
    });
  } catch (err) {
    console.error("UPDATE ROADMAP ERROR:", err);
    if (err.name === 'CastError') {
      return res.status(400).json({ status: 'fail', message: `Invalid roadmap ID format: ${req.params.id}` });
    }
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(el => el.message);
      const message = `Invalid input data. ${errors.join('. ')}`;
      return res.status(400).json({ status: 'fail', message });
    }
    res.status(500).json({ status: 'error', message: 'Error updating roadmap' });
  }
};


exports.updateRoadmapDocumentStatus = async (req, res, next) => {
    try {
        const userId = req.user?.id; // Assuming user ID from auth middleware
        const { roadmapId, phaseId, docStatusId } = req.params;
        const { status, notes, documentId } = req.body; // Expecting new status, optionally notes or linked documentId

        if (!userId) {
            return res.status(401).json({ status: 'fail', message: 'User not authenticated' });
        }
        if (!status) {
            return res.status(400).json({ status: 'fail', message: 'Missing document status in request body.' });
        }
        // Validate status against DocumentRequirementStatusSchema enum
        const validStatuses = ['needed', 'in_progress', 'uploaded', 'submitted', 'verified', 'rejected', 'not_applicable'];
        if (!validStatuses.includes(status)) {
             return res.status(400).json({ status: 'fail', message: `Invalid status value: ${status}. Must be one of ${validStatuses.join(', ')}.` });
        }

        console.log(`[ROADMAP_SVC] Updating document status ${docStatusId} in phase ${phaseId} of roadmap ${roadmapId} for user ${userId} to status ${status}`);

        const roadmap = await Roadmap.findOne({ _id: roadmapId, userId: userId });

        if (!roadmap) {
            return res.status(404).json({ status: 'fail', message: 'Roadmap not found or user unauthorized.' });
        }

        // Find the phase and document status entry
        const phase = roadmap.phases.id(phaseId);
        if (!phase) {
            return res.status(404).json({ status: 'fail', message: `Phase with ID ${phaseId} not found in roadmap.` });
        }

        const docStatus = phase.documents.id(docStatusId);
        if (!docStatus) {
            return res.status(404).json({ status: 'fail', message: `Document status entry with ID ${docStatusId} not found in phase ${phaseId}.` });
        }

        // Update the document status entry
        docStatus.status = status;
        if (notes !== undefined) {
            docStatus.notes = notes;
        }
         if (documentId !== undefined) { // Allow linking/unlinking document ID
            docStatus.documentId = documentId || null; // Set to null if empty string/null passed
        }

        await roadmap.save();

        // Return the updated document status entry
        res.status(200).json({
            status: 'success',
            data: {
                updatedDocumentStatus: docStatus // Return the updated subdocument
            }
        });

    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ status: 'fail', message: `Invalid ID format in request parameters.` });
        }
        console.error("UPDATE ROADMAP DOC STATUS ERROR:", err);
        res.status(500).json({ status: 'error', message: 'Error updating roadmap document status' });
    }
};


exports.updateRoadmapTaskStatus = async (req, res, next) => {
    try {
        const userId = req.user?.id; // Assuming user ID from auth middleware
        const { roadmapId, phaseId, taskId } = req.params;
        const { status, notes } = req.body; // Expecting new status, optionally notes

        if (!userId) {
            return res.status(401).json({ status: 'fail', message: 'User not authenticated' });
        }
        if (!status) {
            return res.status(400).json({ status: 'fail', message: 'Missing task status in request body.' });
        }
        // Validate status against TaskSchema enum
        const validStatuses = ['pending', 'inProgress', 'completed', 'blocked'];
        if (!validStatuses.includes(status)) {
             return res.status(400).json({ status: 'fail', message: `Invalid status value: ${status}. Must be one of ${validStatuses.join(', ')}.` });
        }

        console.log(`[ROADMAP_SVC] Updating task ${taskId} in phase ${phaseId} of roadmap ${roadmapId} for user ${userId} to status ${status}`);

        const roadmap = await Roadmap.findOne({ _id: roadmapId, userId: userId });

        if (!roadmap) {
            return res.status(404).json({ status: 'fail', message: 'Roadmap not found or user unauthorized.' });
        }

        // Find the phase and task
        const phase = roadmap.phases.id(phaseId);
        if (!phase) {
            return res.status(404).json({ status: 'fail', message: `Phase with ID ${phaseId} not found in roadmap.` });
        }

        const task = phase.tasks.id(taskId);
        if (!task) {
            return res.status(404).json({ status: 'fail', message: `Task with ID ${taskId} not found in phase ${phaseId}.` });
        }

        // Update the task
        task.status = status;
        if (status === 'completed') {
            task.completedDate = new Date();
        } else {
            task.completedDate = undefined; // Clear completed date if status changes from completed
        }
        if (notes !== undefined) { // Allow updating notes
            task.notes = notes;
        }

        // TODO: Potentially update phase status based on task completion?
        // TODO: Potentially update overall roadmap status based on phase completion?

        await roadmap.save();

        // Return the updated task or the whole roadmap? Returning task for now.
        res.status(200).json({
            status: 'success',
            data: {
                updatedTask: task // Return the updated subdocument
            }
        });

    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ status: 'fail', message: `Invalid ID format in request parameters.` });
        }
        console.error("UPDATE ROADMAP TASK STATUS ERROR:", err);
        res.status(500).json({ status: 'error', message: 'Error updating roadmap task status' });
    }
};

exports.deleteRoadmap = async (req, res, next) => {
  try {
    const userId = req.user?.id; // Assuming user ID from auth middleware
    if (!userId) {
      return res.status(401).json({ status: 'fail', message: 'User not authenticated' });
    }

    const roadmapId = req.params.id;
    console.log(`[ROADMAP_SVC] Deleting roadmap ${roadmapId} for user ${userId}`);

    // Find and delete roadmap (only if owned by user)
    const roadmap = await Roadmap.findOneAndDelete({ _id: roadmapId, userId });

    if (!roadmap) {
      return res.status(404).json({ status: 'fail', message: 'Roadmap not found or user unauthorized' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Roadmap successfully deleted',
      data: null
    });
  } catch (err) {
    console.error("DELETE ROADMAP ERROR:", err);
    if (err.name === 'CastError') {
      return res.status(400).json({ status: 'fail', message: `Invalid roadmap ID format: ${req.params.id}` });
    }
    res.status(500).json({ status: 'error', message: 'Error deleting roadmap' });
  }
};
