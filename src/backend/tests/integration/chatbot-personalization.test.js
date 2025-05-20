const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const User = require('../../models/User');
const UserPreferences = require('../../models/UserPreferences');
const ChatbotConversation = require('../../models/ChatbotConversation');
const jwt = require('jsonwebtoken');

let mongoServer;
let token;
let userId;

beforeAll(async () => {
  // Set up MongoDB Memory Server
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  
  // Create test user
  const user = new User({
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User'
  });
  await user.save();
  userId = user._id;
  
  // Create token
  token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });
  
  // Create initial preferences
  const preferences = new UserPreferences({
    user: userId,
    preferences: {
      theme: 'light',
      fontSize: 'medium',
      density: 'comfortable',
      notifications: {
        email: true,
        push: true,
        inApp: true
      }
    },
    layouts: {
      default: {
        name: 'Default Layout',
        config: {
          lg: [
            { i: 'welcome', x: 0, y: 0, w: 6, h: 2 },
            { i: 'journey', x: 6, y: 0, w: 6, h: 2 },
            { i: 'recommendations', x: 0, y: 2, w: 12, h: 2 },
            { i: 'tasks', x: 0, y: 4, w: 6, h: 2 },
            { i: 'documents', x: 6, y: 4, w: 6, h: 2 }
          ]
        },
        visibleWidgets: ['welcome', 'journey', 'recommendations', 'tasks', 'documents']
      }
    }
  });
  await preferences.save();
  
  // Create initial conversation
  const conversation = new ChatbotConversation({
    user: userId,
    title: 'Test Conversation',
    messages: [
      {
        content: 'Hello! How can I help you today?',
        sender: 'assistant',
        timestamp: new Date()
      }
    ]
  });
  await conversation.save();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Chatbot Personalization Integration Tests', () => {
  test('GET /api/personalization/preferences - should return user preferences', async () => {
    const response = await request(app)
      .get('/api/personalization/preferences')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
    expect(response.body.preferences).toBeDefined();
    expect(response.body.preferences.theme).toBe('light');
    expect(response.body.layouts).toBeDefined();
    expect(response.body.layouts.default).toBeDefined();
  });
  
  test('PUT /api/personalization/preferences - should update user preferences', async () => {
    const updatedPreferences = {
      preferences: {
        theme: 'dark',
        fontSize: 'large'
      }
    };
    
    const response = await request(app)
      .put('/api/personalization/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send(updatedPreferences);
    
    expect(response.status).toBe(200);
    expect(response.body.preferences.theme).toBe('dark');
    expect(response.body.preferences.fontSize).toBe('large');
    
    // Verify preferences were updated in the database
    const userPreferences = await UserPreferences.findOne({ user: userId });
    expect(userPreferences.preferences.theme).toBe('dark');
    expect(userPreferences.preferences.fontSize).toBe('large');
  });
  
  test('PUT /api/personalization/layouts - should save a new layout', async () => {
    const newLayout = {
      name: 'My Custom Layout',
      config: {
        lg: [
          { i: 'welcome', x: 0, y: 0, w: 12, h: 2 },
          { i: 'recommendations', x: 0, y: 2, w: 12, h: 2 }
        ]
      },
      visibleWidgets: ['welcome', 'recommendations']
    };
    
    const response = await request(app)
      .put('/api/personalization/layouts')
      .set('Authorization', `Bearer ${token}`)
      .send({ layout: newLayout });
    
    expect(response.status).toBe(200);
    expect(response.body.layouts['my-custom-layout']).toBeDefined();
    expect(response.body.layouts['my-custom-layout'].name).toBe('My Custom Layout');
    
    // Verify layout was saved in the database
    const userPreferences = await UserPreferences.findOne({ user: userId });
    expect(userPreferences.layouts['my-custom-layout']).toBeDefined();
  });
  
  test('DELETE /api/personalization/layouts/:id - should delete a layout', async () => {
    // First add a custom layout
    const newLayout = {
      name: 'Layout to Delete',
      config: {
        lg: [
          { i: 'welcome', x: 0, y: 0, w: 12, h: 2 }
        ]
      },
      visibleWidgets: ['welcome']
    };
    
    await request(app)
      .put('/api/personalization/layouts')
      .set('Authorization', `Bearer ${token}`)
      .send({ layout: newLayout });
    
    // Then delete it
    const response = await request(app)
      .delete('/api/personalization/layouts/layout-to-delete')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
    expect(response.body.layouts['layout-to-delete']).toBeUndefined();
    
    // Verify layout was deleted from the database
    const userPreferences = await UserPreferences.findOne({ user: userId });
    expect(userPreferences.layouts['layout-to-delete']).toBeUndefined();
  });
  
  test('POST /api/chatbot/message - should handle personalization requests', async () => {
    const response = await request(app)
      .post('/api/chatbot/message')
      .set('Authorization', `Bearer ${token}`)
      .send({
        message: 'Change my theme to dark mode',
        conversationId: null,
        context: {
          currentPage: 'dashboard',
          dashboardPreferences: {
            layout: 'default',
            visibleWidgets: ['welcome', 'journey', 'recommendations', 'tasks', 'documents']
          }
        }
      });
    
    expect(response.status).toBe(200);
    expect(response.body.content).toBeDefined();
    
    // Verify preferences were updated in the database
    const userPreferences = await UserPreferences.findOne({ user: userId });
    expect(userPreferences.preferences.theme).toBe('dark');
  });
  
  test('POST /api/chatbot/message - should handle widget visibility requests', async () => {
    const response = await request(app)
      .post('/api/chatbot/message')
      .set('Authorization', `Bearer ${token}`)
      .send({
        message: 'Hide the recommendations widget',
        conversationId: null,
        context: {
          currentPage: 'dashboard',
          dashboardPreferences: {
            layout: 'default',
            visibleWidgets: ['welcome', 'journey', 'recommendations', 'tasks', 'documents']
          }
        }
      });
    
    expect(response.status).toBe(200);
    expect(response.body.content).toBeDefined();
    
    // Verify widget visibility was updated in the database
    const userPreferences = await UserPreferences.findOne({ user: userId });
    expect(userPreferences.layouts.default.visibleWidgets).not.toContain('recommendations');
  });
  
  test('POST /api/chatbot/message - should handle layout change requests', async () => {
    // First create a custom layout
    const newLayout = {
      name: 'Focus Layout',
      config: {
        lg: [
          { i: 'welcome', x: 0, y: 0, w: 12, h: 2 },
          { i: 'tasks', x: 0, y: 2, w: 12, h: 2 }
        ]
      },
      visibleWidgets: ['welcome', 'tasks']
    };
    
    await request(app)
      .put('/api/personalization/layouts')
      .set('Authorization', `Bearer ${token}`)
      .send({ layout: newLayout });
    
    // Then ask chatbot to switch to it
    const response = await request(app)
      .post('/api/chatbot/message')
      .set('Authorization', `Bearer ${token}`)
      .send({
        message: 'Switch to focus layout',
        conversationId: null,
        context: {
          currentPage: 'dashboard',
          dashboardPreferences: {
            layout: 'default',
            visibleWidgets: ['welcome', 'journey', 'tasks', 'documents']
          }
        }
      });
    
    expect(response.status).toBe(200);
    expect(response.body.content).toBeDefined();
    
    // Verify user's current layout preference was updated
    const user = await User.findById(userId);
    expect(user.dashboardPreferences.layout).toBe('focus-layout');
  });
  
  test('GET /api/dashboard - should return dashboard data with personalization preferences', async () => {
    const response = await request(app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
    expect(response.body.preferences).toBeDefined();
    expect(response.body.preferences.layout).toBeDefined();
    expect(response.body.preferences.visibleWidgets).toBeDefined();
    expect(response.body.data).toBeDefined();
  });
});
