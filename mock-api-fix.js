/**
 * This file contains mock implementations for the missing API endpoints.
 * 
 * The issue is that some API endpoints are returning 404 errors:
 * - /api/resources endpoint is not found
 * - /api/recommendations/destinations endpoint is not found
 * 
 * This file provides mock implementations for these endpoints.
 */

/**
 * Mock Resources API
 * 
 * This function intercepts fetch calls to the resources endpoint and returns mock data.
 */
export const mockResourcesApi = () => {
  const originalFetch = window.fetch;
  
  window.fetch = function(url, options) {
    // Check if this is a call to the resources endpoint
    if (url.includes('/api/resources')) {
      console.log('[Mock API] Intercepted call to resources endpoint:', url);
      
      // Return mock resources data
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          success: true,
          data: [
            {
              id: 'mock-resource-1',
              title: 'Express Entry Guide',
              description: 'A comprehensive guide to Canada\'s Express Entry immigration system.',
              url: 'https://example.com/express-entry-guide',
              type: 'guide',
              tags: ['canada', 'express-entry', 'immigration', 'dashboard', 'post-arrival']
            },
            {
              id: 'mock-resource-2',
              title: 'Document Checklist',
              description: 'Essential documents needed for your immigration application.',
              url: 'https://example.com/document-checklist',
              type: 'checklist',
              tags: ['documents', 'checklist', 'preparation', 'dashboard', 'post-arrival']
            },
            {
              id: 'mock-resource-3',
              title: 'Language Testing Guide',
              description: 'Everything you need to know about language tests for immigration.',
              url: 'https://example.com/language-testing',
              type: 'guide',
              tags: ['language', 'testing', 'preparation', 'dashboard', 'post-arrival']
            }
          ]
        })
      });
    }
    
    // Check if this is a call to the recommendations endpoint
    if (url.includes('/api/recommendations/destinations')) {
      console.log('[Mock API] Intercepted call to recommendations endpoint:', url);
      
      // Return mock recommendations data
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          success: true,
          data: [
            {
              id: 'mock-destination-1',
              country: 'Canada',
              score: 85,
              reasons: [
                'Strong economy with job opportunities in tech',
                'Welcoming immigration policies',
                'High quality of life'
              ],
              programs: [
                {
                  id: 'express-entry',
                  name: 'Express Entry',
                  url: '/immigration/programs/canada/express-entry'
                },
                {
                  id: 'provincial-nominee',
                  name: 'Provincial Nominee Program',
                  url: '/immigration/programs/canada/pnp'
                }
              ]
            },
            {
              id: 'mock-destination-2',
              country: 'Australia',
              score: 78,
              reasons: [
                'Skills in demand in the Australian job market',
                'Points-based immigration system',
                'English-speaking country'
              ],
              programs: [
                {
                  id: 'skilled-independent',
                  name: 'Skilled Independent Visa (Subclass 189)',
                  url: '/immigration/programs/australia/skilled-independent'
                }
              ]
            },
            {
              id: 'mock-destination-3',
              country: 'New Zealand',
              score: 72,
              reasons: [
                'Work-life balance',
                'Beautiful natural environment',
                'Stable economy'
              ],
              programs: [
                {
                  id: 'skilled-migrant',
                  name: 'Skilled Migrant Category',
                  url: '/immigration/programs/new-zealand/skilled-migrant'
                }
              ]
            }
          ]
        })
      });
    }
    
    // Check if this is a call to the dashboard endpoint
    if (url.includes('/dashboard')) {
      console.log('[Mock API] Intercepted call to dashboard endpoint:', url);
      
      // Return mock dashboard data
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          success: true,
          data: {
            user: {
              id: 'mock-user-id',
              name: 'Mock User',
              email: 'mock@example.com',
              plan: 'premium',
              joinDate: '2023-01-15'
            },
            stats: {
              documentsUploaded: 12,
              tasksCompleted: 8,
              tasksRemaining: 4,
              applicationProgress: 65
            },
            nextSteps: [
              {
                id: 'task-1',
                title: 'Complete language test',
                dueDate: '2023-06-30',
                priority: 'high'
              },
              {
                id: 'task-2',
                title: 'Get education credentials assessed',
                dueDate: '2023-07-15',
                priority: 'medium'
              },
              {
                id: 'task-3',
                title: 'Update resume',
                dueDate: '2023-06-25',
                priority: 'low'
              }
            ]
          }
        })
      });
    }
    
    // For all other requests, use the original fetch
    return originalFetch.apply(this, arguments);
  };
};

/**
 * Apply all mock API fixes
 */
export const applyMockApiFixes = () => {
  mockResourcesApi();
  console.log('[Mock API] Mock API fixes applied');
};

export default {
  mockResourcesApi,
  applyMockApiFixes
};
