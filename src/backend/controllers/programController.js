const Program = require('../models/Program');

/**
 * Program Controller
 * Handles API requests related to immigration programs
 */
class ProgramController {
  /**
   * Get all active programs
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async getAllPrograms(req, res) {
    try {
      const { country, category } = req.query;
      
      // Build query
      const query = { isActive: true };
      
      if (country) {
        query.country = country;
      }
      
      if (category) {
        query.category = category;
      }
      
      const programs = await Program.find(query)
        .select('name description country category processingTime benefits')
        .sort('name')
        .exec();
      
      return res.status(200).json(programs);
    } catch (error) {
      console.error('Error getting programs:', error);
      return res.status(500).json({ message: error.message || 'Failed to get programs' });
    }
  }
  
  /**
   * Get program by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async getProgramById(req, res) {
    try {
      const { id } = req.params;
      
      const program = await Program.findById(id).exec();
      
      if (!program) {
        return res.status(404).json({ message: 'Program not found' });
      }
      
      return res.status(200).json(program);
    } catch (error) {
      console.error('Error getting program:', error);
      return res.status(500).json({ message: error.message || 'Failed to get program' });
    }
  }
  
  /**
   * Create a new program (admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async createProgram(req, res) {
    try {
      // Check if user is admin
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Unauthorized: Admin access required' });
      }
      
      const programData = req.body;
      
      // Validate required fields
      if (!programData.name || !programData.description || !programData.country || !programData.category) {
        return res.status(400).json({ message: 'Name, description, country, and category are required' });
      }
      
      // Create new program
      const program = new Program(programData);
      await program.save();
      
      return res.status(201).json(program);
    } catch (error) {
      console.error('Error creating program:', error);
      return res.status(500).json({ message: error.message || 'Failed to create program' });
    }
  }
  
  /**
   * Update a program (admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async updateProgram(req, res) {
    try {
      // Check if user is admin
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Unauthorized: Admin access required' });
      }
      
      const { id } = req.params;
      const updateData = req.body;
      
      // Find and update program
      const program = await Program.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).exec();
      
      if (!program) {
        return res.status(404).json({ message: 'Program not found' });
      }
      
      return res.status(200).json(program);
    } catch (error) {
      console.error('Error updating program:', error);
      return res.status(500).json({ message: error.message || 'Failed to update program' });
    }
  }
  
  /**
   * Delete a program (admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async deleteProgram(req, res) {
    try {
      // Check if user is admin
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Unauthorized: Admin access required' });
      }
      
      const { id } = req.params;
      
      // Find and delete program
      const program = await Program.findByIdAndDelete(id).exec();
      
      if (!program) {
        return res.status(404).json({ message: 'Program not found' });
      }
      
      return res.status(200).json({ message: 'Program deleted successfully' });
    } catch (error) {
      console.error('Error deleting program:', error);
      return res.status(500).json({ message: error.message || 'Failed to delete program' });
    }
  }
  
  /**
   * Get program categories
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async getProgramCategories(req, res) {
    try {
      const categories = [
        { value: 'economic', label: 'Economic Immigration' },
        { value: 'family', label: 'Family Sponsorship' },
        { value: 'humanitarian', label: 'Humanitarian & Refugee' },
        { value: 'study', label: 'Study Permits' },
        { value: 'work', label: 'Work Permits' },
        { value: 'business', label: 'Business Immigration' },
        { value: 'other', label: 'Other Programs' }
      ];
      
      return res.status(200).json(categories);
    } catch (error) {
      console.error('Error getting program categories:', error);
      return res.status(500).json({ message: error.message || 'Failed to get program categories' });
    }
  }
  
  /**
   * Get program countries
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async getProgramCountries(req, res) {
    try {
      // Get distinct countries from active programs
      const countries = await Program.distinct('country', { isActive: true }).exec();
      
      return res.status(200).json(countries);
    } catch (error) {
      console.error('Error getting program countries:', error);
      return res.status(500).json({ message: error.message || 'Failed to get program countries' });
    }
  }
}

module.exports = new ProgramController();
