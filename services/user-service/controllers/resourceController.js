const Resource = require('../models/Resource');
// TODO: Import error handling utilities
// TODO: Import APIFeatures class for filtering/sorting/pagination

// Get all resources (potentially filtered, admin view might see inactive)
exports.getAllResources = async (req, res, next) => {
    try {
        console.log('[RESOURCE_SVC] Fetching resources...');
        // TODO: Add filtering by tags, contentType, targetAudienceTags
        // TODO: Add pagination
        // TODO: Filter out inactive resources for non-admin users
        const query = Resource.find({ isActive: true }); // Basic query for active resources

        const resources = await query;

        res.status(200).json({
            status: 'success',
            results: resources.length,
            data: {
                resources
            }
        });
    } catch (err) {
        console.error("GET ALL RESOURCES ERROR:", err);
        res.status(500).json({ status: 'error', message: 'Error fetching resources' });
    }
};

// Get a single resource by ID
exports.getResource = async (req, res, next) => {
    try {
        const resourceId = req.params.id;
        console.log(`[RESOURCE_SVC] Fetching resource ${resourceId}`);
        const resource = await Resource.findOne({ _id: resourceId, isActive: true }); // Ensure it's active

        if (!resource) {
            return res.status(404).json({ status: 'fail', message: 'Resource not found or not active.' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                resource
            }
        });
    } catch (err) {
        if (err.name === 'CastError') {
           return res.status(400).json({ status: 'fail', message: `Invalid resource ID format: ${req.params.id}` });
        }
        console.error("GET RESOURCE ERROR:", err);
        res.status(500).json({ status: 'error', message: 'Error fetching resource' });
    }
};

// Create a new resource (Admin only)
exports.createResource = async (req, res, next) => {
    // TODO: Add authorization check (admin only)
    try {
        console.log('[RESOURCE_SVC] Creating new resource...');
        const newResource = await Resource.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                resource: newResource
            }
        });
    } catch (err) {
        console.error("CREATE RESOURCE ERROR:", err);
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(el => el.message);
            const message = `Invalid input data. ${errors.join('. ')}`;
            return res.status(400).json({ status: 'fail', message });
        }
        res.status(500).json({ status: 'error', message: 'Error creating resource' });
    }
};

// Update a resource (Admin only)
exports.updateResource = async (req, res, next) => {
     // TODO: Add authorization check (admin only)
    try {
        const resourceId = req.params.id;
        console.log(`[RESOURCE_SVC] Updating resource ${resourceId}`);
        const updatedResource = await Resource.findByIdAndUpdate(resourceId, req.body, {
            new: true,
            runValidators: true
        });

        if (!updatedResource) {
            return res.status(404).json({ status: 'fail', message: 'Resource not found.' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                resource: updatedResource
            }
        });
    } catch (err) {
         if (err.name === 'CastError') {
           return res.status(400).json({ status: 'fail', message: `Invalid resource ID format: ${req.params.id}` });
        }
         if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(el => el.message);
            const message = `Invalid input data. ${errors.join('. ')}`;
            return res.status(400).json({ status: 'fail', message });
        }
        console.error("UPDATE RESOURCE ERROR:", err);
        res.status(500).json({ status: 'error', message: 'Error updating resource' });
    }
};

// Delete a resource (Admin only - soft delete preferred)
exports.deleteResource = async (req, res, next) => {
    // TODO: Add authorization check (admin only)
    try {
        const resourceId = req.params.id;
        console.log(`[RESOURCE_SVC] Deleting resource ${resourceId}`);
        // Soft delete by setting isActive to false
        const deletedResource = await Resource.findByIdAndUpdate(resourceId, { isActive: false }, { new: true });

        if (!deletedResource) {
            return res.status(404).json({ status: 'fail', message: 'Resource not found.' });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
         if (err.name === 'CastError') {
           return res.status(400).json({ status: 'fail', message: `Invalid resource ID format: ${req.params.id}` });
        }
        console.error("DELETE RESOURCE ERROR:", err);
        res.status(500).json({ status: 'error', message: 'Error deleting resource' });
    }
};
