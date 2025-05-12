const Program = require('../models/Program');
const mongoose = require('mongoose'); // Ensure mongoose is required for ObjectId validation
// TODO: Import error handling utilities
// TODO: Import APIFeatures class for filtering, sorting, pagination

exports.getAllPrograms = async (req, res, next) => {
  try {
    console.log('Fetching all programs...'); // Basic logging

    // EXECUTE QUERY
    // Basic find() - Add features later
    // Example with features: const features = new APIFeatures(Program.find(), req.query).filter().sort().limitFields().paginate();
    // const programs = await features.query;
    const programs = await Program.find(); // Simple find for now

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: programs.length,
      data: {
        programs
      }
    });
  } catch (err) {
    console.error("GET ALL PROGRAMS ERROR:", err);
    res.status(500).json({ status: 'error', message: 'Error fetching programs' });
    // Replace with next(new AppError('Error fetching programs', 500));
  }
};

exports.getProgram = async (req, res, next) => {
  try {
    console.log(`Fetching program with ID: ${req.params.id}`); // Basic logging
    // Find program by ID. Populate referenced fields if needed later.
    // Example: const program = await Program.findById(req.params.id).populate('requiredDocuments');
    const program = await Program.findById(req.params.id);

    if (!program) {
      // Use error handling utility
      return res.status(404).json({ status: 'fail', message: 'No program found with that ID' });
      // Replace with return next(new AppError('No program found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        program
      }
    });
  } catch (err) {
     // Handle invalid ObjectId format error
     if (err.name === 'CastError') {
        return res.status(400).json({ status: 'fail', message: `Invalid program ID format: ${req.params.id}` });
        // Replace with return next(new AppError(`Invalid program ID format: ${req.params.id}`, 400));
     }
     console.error("GET PROGRAM ERROR:", err);
     res.status(500).json({ status: 'error', message: 'Error fetching program' });
     // Replace with next(new AppError('Error fetching program', 500));
  }
};

exports.createProgram = async (req, res, next) => {
  try {
    console.log('Creating new program...'); // Basic logging
    // Create program from request body
    const newProgram = await Program.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        program: newProgram
      }
    });
  } catch (err) {
     console.error("CREATE PROGRAM ERROR:", err);
     if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(el => el.message);
        const message = `Invalid input data. ${errors.join('. ')}`;
        return res.status(400).json({ status: 'fail', message });
        // Replace with return next(new AppError(message, 400));
    }
     res.status(500).json({ status: 'error', message: 'Error creating program' });
     // Replace with next(new AppError('Error creating program', 500));
  }
};

exports.updateProgram = async (req, res, next) => {
  try {
    console.log(`Updating program with ID: ${req.params.id}`); // Basic logging
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the modified document
      runValidators: true // Run schema validators on update
    });

    if (!program) {
       return res.status(404).json({ status: 'fail', message: 'No program found with that ID' });
       // Replace with return next(new AppError('No program found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        program
      }
    });
  } catch (err) {
     // Handle invalid ObjectId format error
     if (err.name === 'CastError') {
        return res.status(400).json({ status: 'fail', message: `Invalid program ID format: ${req.params.id}` });
        // Replace with return next(new AppError(`Invalid program ID format: ${req.params.id}`, 400));
     }
     // Handle validation errors on update
     if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(el => el.message);
        const message = `Invalid input data. ${errors.join('. ')}`;
        return res.status(400).json({ status: 'fail', message });
        // Replace with return next(new AppError(message, 400));
    }
     console.error("UPDATE PROGRAM ERROR:", err);
     res.status(500).json({ status: 'error', message: 'Error updating program' });
     // Replace with next(new AppError('Error updating program', 500));
  }
};

exports.deleteProgram = async (req, res, next) => {
  try {
    console.log(`Deleting program with ID: ${req.params.id}`); // Basic logging
    const program = await Program.findByIdAndDelete(req.params.id);

     if (!program) {
       return res.status(404).json({ status: 'fail', message: 'No program found with that ID' });
       // Replace with return next(new AppError('No program found with that ID', 404));
    }

    // Standard practice is to return 204 No Content on successful deletion
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
     // Handle invalid ObjectId format error
     if (err.name === 'CastError') {
        return res.status(400).json({ status: 'fail', message: `Invalid program ID format: ${req.params.id}` });
        // Replace with return next(new AppError(`Invalid program ID format: ${req.params.id}`, 400));
     }
     console.error("DELETE PROGRAM ERROR:", err);
     res.status(500).json({ status: 'error', message: 'Error deleting program' });
     // Replace with next(new AppError('Error deleting program', 500));
  }
};

// TODO: Add functions for advanced filtering, searching (Elasticsearch?), aggregation

exports.getProgramsForComparison = async (req, res, next) => {
  try {
    const programIdsString = req.query.ids;
    if (!programIdsString) {
      return res.status(400).json({ status: 'fail', message: 'Please provide a comma-separated list of program IDs in the "ids" query parameter.' });
    }

    const programIds = programIdsString.split(',').map(id => id.trim());
    if (programIds.some(id => !mongoose.Types.ObjectId.isValid(id))) {
        return res.status(400).json({ status: 'fail', message: 'One or more provided program IDs are invalid.' });
    }
    
    // Fetch programs and populate country details
    // It assumes a 'Country' model exists and 'country' field in ProgramSchema is a ref.
    const programs = await Program.find({ _id: { $in: programIds } }).populate('country');

    if (!programs || programs.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'No programs found for the provided IDs.' });
    }

    // Format programs for comparison
    const comparisonData = programs.map(program => {
      const getCountryName = (countryField) => {
        if (!countryField) return 'N/A';
        if (typeof countryField === 'string') return countryField;
        return countryField.name || countryField.countryCode || 'N/A'; 
      };
      
      const keyEligibility = {};
      program.eligibilityCriteria.forEach(crit => {
        if (crit.criterionType === 'age') {
          keyEligibility.age = `Min: ${crit.minValue ?? 'N/A'}, Max: ${crit.maxValue ?? 'N/A'}`;
        }
        if (crit.criterionType === 'financial' && crit.criterionName?.toLowerCase().includes('funds')) {
            keyEligibility.minFunds = `${crit.minValue ?? 'N/A'} ${crit.unit || ''}`;
        }
        if (crit.criterionType === 'language' && crit.criterionName?.toLowerCase().includes('english')) {
            keyEligibility.englishProficiency = crit.description || `Requires ${crit.criterionName}`;
        }
      });
      
      let estimatedCost = 'N/A';
      if (program.costs && program.costs.length > 0) {
        const appFees = program.costs
            .filter(c => c.feeType.toLowerCase().includes('application') && !c.isRefundable)
            .reduce((sum, fee) => sum + fee.amount, 0);
        if (appFees > 0) {
            estimatedCost = `${appFees} ${program.costs[0].currency || 'USD'}`;
        } else {
            const totalCost = program.costs.reduce((sum, fee) => sum + fee.amount, 0);
            if (totalCost > 0) {
                 estimatedCost = `Approx. ${totalCost} ${program.costs[0].currency || 'USD'}`;
            }
        }
      }

      return {
        id: program._id,
        name: program.name,
        country: getCountryName(program.country),
        category: program.category,
        descriptionSummary: program.description ? program.description.substring(0, 150) + (program.description.length > 150 ? '...' : '') : 'N/A',
        processingTime: program.processingTime?.averageMonths ? `${program.processingTime.averageMonths} months (avg)` : 
                        (program.processingTime?.minMonths && program.processingTime?.maxMonths ? `${program.processingTime.minMonths}-${program.processingTime.maxMonths} months` : 'N/A'),
        eligibilityHighlights: keyEligibility,
        estimatedApplicationCost: estimatedCost,
        pathwayToResidency: program.pathwayToResidency,
        pathwayToCitizenship: program.pathwayToCitizenship,
        baseSuccessRate: program.predictedSuccessRate?.baseRate ?? program.successRate?.rate ?? 'N/A',
        officialWebsite: program.officialWebsite,
      };
    });

    res.status(200).json({
      status: 'success',
      results: comparisonData.length,
      data: {
        comparisonPrograms: comparisonData
      }
    });

  } catch (err) {
    console.error("GET PROGRAMS FOR COMPARISON ERROR:", err);
    if (err.name === 'CastError') {
        return res.status(400).json({ status: 'fail', message: 'Invalid ID format in query.' });
    }
    res.status(500).json({ status: 'error', message: 'Error fetching programs for comparison' });
  }
};
