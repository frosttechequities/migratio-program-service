const Country = require('../models/Country');
// TODO: Import error handling utilities
// TODO: Import APIFeatures class for filtering, sorting, pagination

// Get all countries (potentially filtered)
exports.getAllCountries = async (req, res, next) => {
    try {
        console.log('[COUNTRY_SVC] Fetching countries...');
        // TODO: Add filtering by region, etc.
        // TODO: Add pagination
        const query = Country.find(); // Basic query

        const countries = await query;

        res.status(200).json({
            status: 'success',
            results: countries.length,
            data: {
                countries
            }
        });
    } catch (err) {
        console.error("GET ALL COUNTRIES ERROR:", err);
        res.status(500).json({ status: 'error', message: 'Error fetching countries' });
    }
};

// Get a single country by ID or Code
exports.getCountry = async (req, res, next) => {
    try {
        const identifier = req.params.idOrCode; // Can be DB ID or countryCode
        console.log(`[COUNTRY_SVC] Fetching country ${identifier}`);

        let query;
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            query = Country.findById(identifier);
        } else {
            // Assume it's a country code
            query = Country.findOne({ countryCode: identifier.toUpperCase() });
        }

        const country = await query;

        if (!country) {
            return res.status(404).json({ status: 'fail', message: 'Country not found.' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                country
            }
        });
    } catch (err) {
        if (err.name === 'CastError' && !mongoose.Types.ObjectId.isValid(req.params.idOrCode)) {
           // Ignore CastError if it wasn't supposed to be an ObjectId anyway
           return res.status(404).json({ status: 'fail', message: 'Country not found.' });
        }
         if (err.name === 'CastError') {
           return res.status(400).json({ status: 'fail', message: `Invalid country ID format: ${req.params.idOrCode}` });
        }
        console.error("GET COUNTRY ERROR:", err);
        res.status(500).json({ status: 'error', message: 'Error fetching country' });
    }
};

// Create a new country (Admin only)
exports.createCountry = async (req, res, next) => {
    // TODO: Add authorization check (admin only)
    try {
        console.log('[COUNTRY_SVC] Creating new country...');
        const newCountry = await Country.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                country: newCountry
            }
        });
    } catch (err) {
        console.error("CREATE COUNTRY ERROR:", err);
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(el => el.message);
            const message = `Invalid input data. ${errors.join('. ')}`;
            return res.status(400).json({ status: 'fail', message });
        }
         if (err.code === 11000) { // Handle duplicate key error (e.g., countryCode)
             return res.status(400).json({ status: 'fail', message: `Duplicate field value entered: ${Object.keys(err.keyValue)}` });
         }
        res.status(500).json({ status: 'error', message: 'Error creating country' });
    }
};

// Update a country (Admin only)
exports.updateCountry = async (req, res, next) => {
     // TODO: Add authorization check (admin only)
    try {
        const identifier = req.params.idOrCode;
        console.log(`[COUNTRY_SVC] Updating country ${identifier}`);

        let filter;
         if (mongoose.Types.ObjectId.isValid(identifier)) {
            filter = { _id: identifier };
        } else {
            filter = { countryCode: identifier.toUpperCase() };
        }

        const updatedCountry = await Country.findOneAndUpdate(filter, req.body, {
            new: true,
            runValidators: true
        });

        if (!updatedCountry) {
            return res.status(404).json({ status: 'fail', message: 'Country not found.' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                country: updatedCountry
            }
        });
    } catch (err) {
         if (err.name === 'CastError' && !mongoose.Types.ObjectId.isValid(req.params.idOrCode)) {
             return res.status(404).json({ status: 'fail', message: 'Country not found.' });
         }
         if (err.name === 'CastError') {
           return res.status(400).json({ status: 'fail', message: `Invalid country ID format: ${req.params.idOrCode}` });
        }
         if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(el => el.message);
            const message = `Invalid input data. ${errors.join('. ')}`;
            return res.status(400).json({ status: 'fail', message });
        }
         if (err.code === 11000) {
             return res.status(400).json({ status: 'fail', message: `Duplicate field value entered: ${Object.keys(err.keyValue)}` });
         }
        console.error("UPDATE COUNTRY ERROR:", err);
        res.status(500).json({ status: 'error', message: 'Error updating country' });
    }
};

// Delete a country (Admin only - Use with extreme caution, might orphan programs)
exports.deleteCountry = async (req, res, next) => {
    // TODO: Add authorization check (admin only)
    // Consider implications: Should deleting a country delete its programs? Probably not.
    // Maybe just mark as inactive or prevent deletion if programs reference it.
    try {
        const identifier = req.params.idOrCode;
        console.log(`[COUNTRY_SVC] Deleting country ${identifier}`);

        let filter;
         if (mongoose.Types.ObjectId.isValid(identifier)) {
            filter = { _id: identifier };
        } else {
            filter = { countryCode: identifier.toUpperCase() };
        }

        // Check if programs reference this country before deleting?
        // const programsExist = await Program.exists({ country: country._id });
        // if (programsExist) return res.status(400).json({ status: 'fail', message: 'Cannot delete country with associated programs.' });

        const deletedCountry = await Country.findOneAndDelete(filter);

        if (!deletedCountry) {
            return res.status(404).json({ status: 'fail', message: 'Country not found.' });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
         if (err.name === 'CastError' && !mongoose.Types.ObjectId.isValid(req.params.idOrCode)) {
             return res.status(404).json({ status: 'fail', message: 'Country not found.' });
         }
         if (err.name === 'CastError') {
           return res.status(400).json({ status: 'fail', message: `Invalid country ID format: ${req.params.idOrCode}` });
        }
        console.error("DELETE COUNTRY ERROR:", err);
        res.status(500).json({ status: 'error', message: 'Error deleting country' });
    }
};

const mongoose = require('mongoose'); // Ensure mongoose is required
