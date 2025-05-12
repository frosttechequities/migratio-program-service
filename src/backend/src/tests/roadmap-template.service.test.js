const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const RoadmapTemplateService = require('../services/roadmap-template.service');
const { Roadmap } = require('../models/roadmap.model');
const { Program } = require('../models/program.model');

let mongoServer;
const roadmapTemplateService = new RoadmapTemplateService();

// Mock data
const mockUserId = new mongoose.Types.ObjectId();
const mockProgramId = 'ca-express-entry';

// Mock program
const mockProgram = {
  programId: mockProgramId,
  name: 'Express Entry',
  country: 'ca',
  category: 'skilled-worker',
  processingTime: {
    min: 3,
    max: 6,
    unit: 'months'
  },
  estimatedCost: {
    total: 2000,
    currency: 'CAD',
    breakdown: [
      {
        category: 'Application Fee',
        amount: 1500,
        description: 'Government application fee'
      },
      {
        category: 'Biometrics',
        amount: 500,
        description: 'Biometrics fee'
      }
    ]
  }
};

// Connect to the in-memory database
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

// Clear all test data after each test
afterEach(async () => {
  await Roadmap.deleteMany({});
  await Program.deleteMany({});
});

// Disconnect and close the db connection
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('RoadmapTemplateService', () => {
  describe('createTemplate', () => {
    it('should create a template from scratch', async () => {
      // Create mock program in the database
      await Program.create(mockProgram);

      // Create template data
      const templateData = {
        programId: mockProgramId,
        templateName: 'Express Entry Template',
        templateCategory: 'skilled-worker',
        isPublic: true
      };

      // Create template
      const template = await roadmapTemplateService.createTemplate(mockUserId.toString(), templateData);

      // Assertions
      expect(template).toBeDefined();
      expect(template.userId.toString()).toBe(mockUserId.toString());
      expect(template.programId).toBe(mockProgramId);
      expect(template.isTemplate).toBe(true);
      expect(template.templateName).toBe('Express Entry Template');
      expect(template.templateCategory).toBe('skilled-worker');
      expect(template.isPublic).toBe(true);
      expect(template.phases).toHaveLength(4); // Default phases
    });

    it('should create a template from an existing roadmap', async () => {
      // Create mock program in the database
      await Program.create(mockProgram);

      // Create a roadmap
      const roadmap = new Roadmap({
        userId: mockUserId,
        programId: mockProgramId,
        title: 'My Roadmap',
        description: 'My roadmap description',
        status: 'active',
        startDate: new Date(),
        targetCompletionDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000), // 6 months from now
        phases: [
          {
            title: 'Custom Phase',
            description: 'Custom phase description',
            order: 1,
            status: 'not_started',
            milestones: [
              {
                title: 'Custom Milestone',
                description: 'Custom milestone description',
                category: 'document',
                status: 'not_started',
                priority: 'high'
              }
            ]
          }
        ],
        visibility: 'private'
      });

      await roadmap.save();

      // Create template data
      const templateData = {
        roadmapId: roadmap._id.toString(),
        templateName: 'Custom Template',
        templateCategory: 'custom',
        isPublic: false
      };

      // Create template from roadmap
      const template = await roadmapTemplateService.createTemplate(mockUserId.toString(), templateData);

      // Assertions
      expect(template).toBeDefined();
      expect(template.userId.toString()).toBe(mockUserId.toString());
      expect(template.programId).toBe(mockProgramId);
      expect(template.isTemplate).toBe(true);
      expect(template.templateName).toBe('Custom Template');
      expect(template.templateCategory).toBe('custom');
      expect(template.isPublic).toBe(false);
      expect(template.phases).toHaveLength(1);
      expect(template.phases[0].title).toBe('Custom Phase');
      expect(template.phases[0].milestones).toHaveLength(1);
      expect(template.phases[0].milestones[0].title).toBe('Custom Milestone');
    });

    it('should throw an error if program not found', async () => {
      // Create template data with non-existent program
      const templateData = {
        programId: 'non-existent-program',
        templateName: 'Invalid Template',
        templateCategory: 'skilled-worker',
        isPublic: true
      };

      await expect(
        roadmapTemplateService.createTemplate(mockUserId.toString(), templateData)
      ).rejects.toThrow('Program not found');
    });

    it('should throw an error if roadmap not found', async () => {
      // Create template data with non-existent roadmap
      const templateData = {
        roadmapId: new mongoose.Types.ObjectId().toString(),
        templateName: 'Invalid Template',
        templateCategory: 'custom',
        isPublic: false
      };

      await expect(
        roadmapTemplateService.createTemplate(mockUserId.toString(), templateData)
      ).rejects.toThrow('Roadmap not found or access denied');
    });
  });

  describe('getTemplates', () => {
    it('should get all templates', async () => {
      // Create mock program in the database
      await Program.create(mockProgram);

      // Create template data
      const templateData1 = {
        programId: mockProgramId,
        templateName: 'Template 1',
        templateCategory: 'skilled-worker',
        isPublic: true
      };

      const templateData2 = {
        programId: mockProgramId,
        templateName: 'Template 2',
        templateCategory: 'family',
        isPublic: true
      };

      // Create templates
      await roadmapTemplateService.createTemplate(mockUserId.toString(), templateData1);
      await roadmapTemplateService.createTemplate(mockUserId.toString(), templateData2);

      // Get templates
      const templates = await roadmapTemplateService.getTemplates();

      // Assertions
      expect(templates).toBeDefined();
      expect(templates).toHaveLength(2);
      expect(templates[0].templateName).toBe('Template 1');
      expect(templates[1].templateName).toBe('Template 2');
    });

    it('should filter templates by category', async () => {
      // Create mock program in the database
      await Program.create(mockProgram);

      // Create template data
      const templateData1 = {
        programId: mockProgramId,
        templateName: 'Template 1',
        templateCategory: 'skilled-worker',
        isPublic: true
      };

      const templateData2 = {
        programId: mockProgramId,
        templateName: 'Template 2',
        templateCategory: 'family',
        isPublic: true
      };

      // Create templates
      await roadmapTemplateService.createTemplate(mockUserId.toString(), templateData1);
      await roadmapTemplateService.createTemplate(mockUserId.toString(), templateData2);

      // Get templates filtered by category
      const templates = await roadmapTemplateService.getTemplates({ category: 'skilled-worker' });

      // Assertions
      expect(templates).toBeDefined();
      expect(templates).toHaveLength(1);
      expect(templates[0].templateName).toBe('Template 1');
      expect(templates[0].templateCategory).toBe('skilled-worker');
    });

    it('should filter templates by public status', async () => {
      // Create mock program in the database
      await Program.create(mockProgram);

      // Create template data
      const templateData1 = {
        programId: mockProgramId,
        templateName: 'Public Template',
        templateCategory: 'skilled-worker',
        isPublic: true
      };

      const templateData2 = {
        programId: mockProgramId,
        templateName: 'Private Template',
        templateCategory: 'skilled-worker',
        isPublic: false
      };

      // Create templates
      await roadmapTemplateService.createTemplate(mockUserId.toString(), templateData1);
      await roadmapTemplateService.createTemplate(mockUserId.toString(), templateData2);

      // Get public templates
      const publicTemplates = await roadmapTemplateService.getTemplates({ publicOnly: true });

      // Assertions
      expect(publicTemplates).toBeDefined();
      expect(publicTemplates).toHaveLength(1);
      expect(publicTemplates[0].templateName).toBe('Public Template');
      expect(publicTemplates[0].isPublic).toBe(true);

      // Get all templates for the user
      const allTemplates = await roadmapTemplateService.getTemplates({ userId: mockUserId.toString() });

      // Assertions
      expect(allTemplates).toBeDefined();
      expect(allTemplates).toHaveLength(2);
    });
  });

  describe('getTemplate', () => {
    it('should get a template by ID', async () => {
      // Create mock program in the database
      await Program.create(mockProgram);

      // Create template data
      const templateData = {
        programId: mockProgramId,
        templateName: 'Test Template',
        templateCategory: 'skilled-worker',
        isPublic: true
      };

      // Create template
      const createdTemplate = await roadmapTemplateService.createTemplate(mockUserId.toString(), templateData);

      // Get template by ID
      const template = await roadmapTemplateService.getTemplate(createdTemplate._id.toString(), mockUserId.toString());

      // Assertions
      expect(template).toBeDefined();
      expect(template._id.toString()).toBe(createdTemplate._id.toString());
      expect(template.templateName).toBe('Test Template');
    });

    it('should throw an error if template not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      await expect(
        roadmapTemplateService.getTemplate(nonExistentId.toString(), mockUserId.toString())
      ).rejects.toThrow('Template not found or access denied');
    });

    it('should allow access to public templates', async () => {
      // Create mock program in the database
      await Program.create(mockProgram);

      // Create template data
      const templateData = {
        programId: mockProgramId,
        templateName: 'Public Template',
        templateCategory: 'skilled-worker',
        isPublic: true
      };

      // Create template
      const createdTemplate = await roadmapTemplateService.createTemplate(mockUserId.toString(), templateData);

      // Get template with different user ID
      const differentUserId = new mongoose.Types.ObjectId();
      const template = await roadmapTemplateService.getTemplate(createdTemplate._id.toString(), differentUserId.toString());

      // Assertions
      expect(template).toBeDefined();
      expect(template._id.toString()).toBe(createdTemplate._id.toString());
    });

    it('should deny access to private templates from other users', async () => {
      // Create mock program in the database
      await Program.create(mockProgram);

      // Create template data
      const templateData = {
        programId: mockProgramId,
        templateName: 'Private Template',
        templateCategory: 'skilled-worker',
        isPublic: false
      };

      // Create template
      const createdTemplate = await roadmapTemplateService.createTemplate(mockUserId.toString(), templateData);

      // Try to get template with different user ID
      const differentUserId = new mongoose.Types.ObjectId();

      await expect(
        roadmapTemplateService.getTemplate(createdTemplate._id.toString(), differentUserId.toString())
      ).rejects.toThrow('Template not found or access denied');
    });
  });

  describe('createRoadmapFromTemplate', () => {
    it('should create a roadmap from a template', async () => {
      // Create mock program in the database
      await Program.create(mockProgram);

      // Create template data
      const templateData = {
        programId: mockProgramId,
        templateName: 'Test Template',
        templateCategory: 'skilled-worker',
        isPublic: true
      };

      // Create template
      const template = await roadmapTemplateService.createTemplate(mockUserId.toString(), templateData);

      // Create roadmap from template
      const roadmap = await roadmapTemplateService.createRoadmapFromTemplate(
        mockUserId.toString(),
        template._id.toString(),
        {
          title: 'My Roadmap',
          description: 'My roadmap description',
          startDate: new Date('2023-01-01'),
          visibility: 'private'
        }
      );

      // Assertions
      expect(roadmap).toBeDefined();
      expect(roadmap.userId.toString()).toBe(mockUserId.toString());
      expect(roadmap.programId).toBe(mockProgramId);
      expect(roadmap.isTemplate).toBe(false);
      expect(roadmap.templateId.toString()).toBe(template._id.toString());
      expect(roadmap.title).toBe('My Roadmap');
      expect(roadmap.description).toBe('My roadmap description');
      expect(roadmap.startDate.toISOString().split('T')[0]).toBe('2023-01-01');
      expect(roadmap.visibility).toBe('private');
      expect(roadmap.phases).toHaveLength(4); // Default phases
    });

    it('should throw an error if template not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      await expect(
        roadmapTemplateService.createRoadmapFromTemplate(mockUserId.toString(), nonExistentId.toString())
      ).rejects.toThrow('Template not found or access denied');
    });
  });

  describe('updateTemplate', () => {
    it('should update a template', async () => {
      // Create mock program in the database
      await Program.create(mockProgram);

      // Create template data
      const templateData = {
        programId: mockProgramId,
        templateName: 'Original Template',
        templateCategory: 'skilled-worker',
        isPublic: false
      };

      // Create template
      const template = await roadmapTemplateService.createTemplate(mockUserId.toString(), templateData);

      // Update data
      const updateData = {
        templateName: 'Updated Template',
        templateCategory: 'updated-category',
        isPublic: true
      };

      // Update template
      const updatedTemplate = await roadmapTemplateService.updateTemplate(
        template._id.toString(),
        mockUserId.toString(),
        updateData
      );

      // Assertions
      expect(updatedTemplate).toBeDefined();
      expect(updatedTemplate._id.toString()).toBe(template._id.toString());
      expect(updatedTemplate.templateName).toBe('Updated Template');
      expect(updatedTemplate.templateCategory).toBe('updated-category');
      expect(updatedTemplate.isPublic).toBe(true);
    });

    it('should throw an error if template not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      await expect(
        roadmapTemplateService.updateTemplate(
          nonExistentId.toString(),
          mockUserId.toString(),
          { templateName: 'Updated Template' }
        )
      ).rejects.toThrow('Template not found or access denied');
    });

    it('should throw an error if user does not own the template', async () => {
      // Create mock program in the database
      await Program.create(mockProgram);

      // Create template data
      const templateData = {
        programId: mockProgramId,
        templateName: 'Original Template',
        templateCategory: 'skilled-worker',
        isPublic: false
      };

      // Create template
      const template = await roadmapTemplateService.createTemplate(mockUserId.toString(), templateData);

      // Try to update with different user ID
      const differentUserId = new mongoose.Types.ObjectId();

      await expect(
        roadmapTemplateService.updateTemplate(
          template._id.toString(),
          differentUserId.toString(),
          { templateName: 'Updated Template' }
        )
      ).rejects.toThrow('Template not found or access denied');
    });
  });

  describe('deleteTemplate', () => {
    it('should delete a template', async () => {
      // Create mock program in the database
      await Program.create(mockProgram);

      // Create template data
      const templateData = {
        programId: mockProgramId,
        templateName: 'Test Template',
        templateCategory: 'skilled-worker',
        isPublic: true
      };

      // Create template
      const template = await roadmapTemplateService.createTemplate(mockUserId.toString(), templateData);

      // Delete template
      const result = await roadmapTemplateService.deleteTemplate(template._id.toString(), mockUserId.toString());

      // Assertions
      expect(result).toBe(true);

      // Verify template is deleted
      const templates = await roadmapTemplateService.getTemplates();
      expect(templates).toHaveLength(0);
    });

    it('should throw an error if template not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      await expect(
        roadmapTemplateService.deleteTemplate(nonExistentId.toString(), mockUserId.toString())
      ).rejects.toThrow('Template not found or access denied');
    });

    it('should throw an error if user does not own the template', async () => {
      // Create mock program in the database
      await Program.create(mockProgram);

      // Create template data
      const templateData = {
        programId: mockProgramId,
        templateName: 'Test Template',
        templateCategory: 'skilled-worker',
        isPublic: true
      };

      // Create template
      const template = await roadmapTemplateService.createTemplate(mockUserId.toString(), templateData);

      // Try to delete with different user ID
      const differentUserId = new mongoose.Types.ObjectId();

      await expect(
        roadmapTemplateService.deleteTemplate(template._id.toString(), differentUserId.toString())
      ).rejects.toThrow('Template not found or access denied');
    });
  });
});
