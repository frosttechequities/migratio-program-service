const Professional = require('../models/Professional');
// TODO: Import error handling utilities
// TODO: Import APIFeatures class for filtering, sorting, pagination

// Get all active professionals (public directory view)
exports.getAllProfessionals = async (req, res, next) => {
    try {
        console.log('[PROFESSIONAL_SVC] Fetching active professionals...');
        // TODO: Add filtering by serviceType, specialization, location
        // TODO: Add pagination
        const query = Professional.find({ isActive: true }); // Only show active profiles publicly

        const professionals = await query;

        res.status(200).json({
            status: 'success',
            results: professionals.length,
            data: {
                professionals
            }
        });
    } catch (err) {
        console.error("GET ALL PROFESSIONALS ERROR:", err);
        res.status(500).json({ status: 'error', message: 'Error fetching professionals' });
    }
};

// Get a single active professional by ID
exports.getProfessional = async (req, res, next) => {
    try {
        const professionalId = req.params.id;
        console.log(`[PROFESSIONAL_SVC] Fetching professional ${professionalId}`);
        const professional = await Professional.findOne({ _id: professionalId, isActive: true }); // Ensure active

        if (!professional) {
            return res.status(404).json({ status: 'fail', message: 'Professional not found or not active.' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                professional
            }
        });
    } catch (err) {
        if (err.name === 'CastError') {
           return res.status(400).json({ status: 'fail', message: `Invalid professional ID format: ${req.params.id}` });
        }
        console.error("GET PROFESSIONAL ERROR:", err);
        res.status(500).json({ status: 'error', message: 'Error fetching professional' });
    }
};

// --- Admin Only Functions ---

// Create a new professional profile (Admin only)
exports.createProfessional = async (req, res, next) => {
    // TODO: Add authorization check (admin only)
    try {
        console.log('[PROFESSIONAL_SVC] Creating new professional profile...');
        const newProfessional = await Professional.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                professional: newProfessional
            }
        });
    } catch (err) {
        console.error("CREATE PROFESSIONAL ERROR:", err);
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(el => el.message);
            const message = `Invalid input data. ${errors.join('. ')}`;
            return res.status(400).json({ status: 'fail', message });
        }
        res.status(500).json({ status: 'error', message: 'Error creating professional profile' });
    }
};

// Update a professional profile (Admin only)
exports.updateProfessional = async (req, res, next) => {
     // TODO: Add authorization check (admin only)
    try {
        const professionalId = req.params.id;
        console.log(`[PROFESSIONAL_SVC] Updating professional ${professionalId}`);
        const updatedProfessional = await Professional.findByIdAndUpdate(professionalId, req.body, {
            new: true,
            runValidators: true
        });

        if (!updatedProfessional) {
            return res.status(404).json({ status: 'fail', message: 'Professional not found.' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                professional: updatedProfessional
            }
        });
    } catch (err) {
         if (err.name === 'CastError') {
           return res.status(400).json({ status: 'fail', message: `Invalid professional ID format: ${req.params.id}` });
        }
         if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(el => el.message);
            const message = `Invalid input data. ${errors.join('. ')}`;
            return res.status(400).json({ status: 'fail', message });
        }
        console.error("UPDATE PROFESSIONAL ERROR:", err);
        res.status(500).json({ status: 'error', message: 'Error updating professional profile' });
    }
};

// Delete a professional profile (Admin only - soft delete preferred)
exports.deleteProfessional = async (req, res, next) => {
    // TODO: Add authorization check (admin only)
    try {
        const professionalId = req.params.id;
        console.log(`[PROFESSIONAL_SVC] Deleting professional ${professionalId}`);
        // Soft delete by setting isActive to false
        const deletedProfessional = await Professional.findByIdAndUpdate(professionalId, { isActive: false }, { new: true });

        if (!deletedProfessional) {
            return res.status(404).json({ status: 'fail', message: 'Professional not found.' });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
         if (err.name === 'CastError') {
           return res.status(400).json({ status: 'fail', message: `Invalid professional ID format: ${req.params.id}` });
        }
        console.error("DELETE PROFESSIONAL ERROR:", err);
        res.status(500).json({ status: 'error', message: 'Error deleting professional profile' });
    }
};

// Add a review to a professional's profile
exports.addReview = async (req, res, next) => {
    // TODO: Add authorization check (user must be logged in)
    // TODO: Potentially check if user has already reviewed this professional
    const userId = req.user?.id; // Assuming protect middleware adds user
    const userName = req.user?.firstName ? `${req.user.firstName} ${req.user.lastName || ''}`.trim() : 'Anonymous User'; // Get user name
    const professionalId = req.params.professionalId;
    const { rating, comment } = req.body;

    if (!userId) {
         return res.status(401).json({ status: 'fail', message: 'Please log in to leave a review.' });
    }
    if (!rating) {
         return res.status(400).json({ status: 'fail', message: 'Rating is required.' });
    }

    try {
        const professional = await Professional.findById(professionalId);

        if (!professional) {
            return res.status(404).json({ status: 'fail', message: 'Professional not found.' });
        }

        // Check if user already reviewed this professional
        const existingReview = professional.reviews.find(rev => rev.userId.toString() === userId.toString());
        if (existingReview) {
            return res.status(400).json({ status: 'fail', message: 'You have already reviewed this professional.' });
        }

        // Create review object
        const review = {
            userId,
            name: userName, // Store denormalized name
            rating: Number(rating),
            comment
        };

        // Add review to array
        professional.reviews.push(review);

        // Recalculate average rating and number of reviews
        await Professional.calculateAverageRating(professionalId); // Call static method

        // Save the professional document (this saves the subdocument too)
        // Need to re-fetch after calculateAverageRating updates it separately
        await professional.save(); // Save the added review first
        const updatedProfessional = await Professional.findById(professionalId); // Fetch again to get updated avg rating


        res.status(201).json({
            status: 'success',
            data: {
                // Return the newly added review or the updated professional?
                // Returning updated professional to include new avg rating
                professional: updatedProfessional
            }
        });

    } catch (err) {
        console.error("ADD REVIEW ERROR:", err);
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(el => el.message);
            const message = `Invalid input data. ${errors.join('. ')}`;
            return res.status(400).json({ status: 'fail', message });
        }
         if (err.name === 'CastError') {
           return res.status(400).json({ status: 'fail', message: `Invalid professional ID format: ${req.params.professionalId}` });
        }
        res.status(500).json({ status: 'error', message: 'Error adding review.' });
    }
};
