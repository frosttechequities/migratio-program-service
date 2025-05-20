import { configureStore } from '@reduxjs/toolkit';
import personalizationReducer, {
  savePreferences,
  saveLayout,
  deleteLayout,
  loadUserPreferences,
  selectPersonalizationPreferences,
  selectPersonalizationLayouts,
  selectPersonalizationLoading,
  selectPersonalizationError
} from '../personalizationSlice';

// Mock personalization service
jest.mock('../services/personalizationService', () => ({
  saveUserPreferences: jest.fn(),
  getUserPreferences: jest.fn()
}));

// Import mocked service
import personalizationService from '../services/personalizationService';

describe('personalizationSlice', () => {
  let store;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create store
    store = configureStore({
      reducer: {
        personalization: personalizationReducer
      }
    });
  });
  
  describe('initial state', () => {
    test('should have the correct initial state', () => {
      const state = store.getState().personalization;
      
      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(false);
      expect(state.isError).toBe(false);
      expect(state.error).toBeNull();
      expect(state.preferences).toEqual({
        theme: 'light',
        fontSize: 'medium',
        density: 'comfortable',
        notifications: {
          email: true,
          push: true,
          inApp: true
        }
      });
      expect(state.layouts).toEqual({
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
        },
        compact: {
          name: 'Compact Layout',
          config: {
            lg: [
              { i: 'welcome', x: 0, y: 0, w: 4, h: 2 },
              { i: 'journey', x: 4, y: 0, w: 4, h: 2 },
              { i: 'recommendations', x: 8, y: 0, w: 4, h: 2 },
              { i: 'tasks', x: 0, y: 2, w: 6, h: 2 },
              { i: 'documents', x: 6, y: 2, w: 6, h: 2 }
            ]
          },
          visibleWidgets: ['welcome', 'journey', 'recommendations', 'tasks', 'documents']
        }
      });
    });
  });
  
  describe('reducers', () => {
    test('savePreferences should update the preferences object', () => {
      const newPreferences = {
        theme: 'dark',
        fontSize: 'large'
      };
      
      store.dispatch(savePreferences(newPreferences));
      
      const state = store.getState().personalization;
      
      // Verify preferences were updated
      expect(state.preferences.theme).toBe('dark');
      expect(state.preferences.fontSize).toBe('large');
      expect(state.preferences.density).toBe('comfortable'); // Unchanged
      expect(state.preferences.notifications).toEqual({
        email: true,
        push: true,
        inApp: true
      }); // Unchanged
    });
    
    test('saveLayout should add a new layout or update an existing one', () => {
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
      
      store.dispatch(saveLayout(newLayout));
      
      const state = store.getState().personalization;
      
      // Verify new layout was added
      expect(state.layouts['my-custom-layout']).toBeDefined();
      expect(state.layouts['my-custom-layout'].name).toBe('My Custom Layout');
      expect(state.layouts['my-custom-layout'].config).toEqual(newLayout.config);
      expect(state.layouts['my-custom-layout'].visibleWidgets).toEqual(newLayout.visibleWidgets);
      
      // Update existing layout
      const updatedLayout = {
        name: 'My Custom Layout',
        config: {
          lg: [
            { i: 'welcome', x: 0, y: 0, w: 6, h: 2 },
            { i: 'recommendations', x: 6, y: 0, w: 6, h: 2 }
          ]
        },
        visibleWidgets: ['welcome', 'recommendations', 'tasks']
      };
      
      store.dispatch(saveLayout(updatedLayout));
      
      const updatedState = store.getState().personalization;
      
      // Verify layout was updated
      expect(updatedState.layouts['my-custom-layout'].config).toEqual(updatedLayout.config);
      expect(updatedState.layouts['my-custom-layout'].visibleWidgets).toEqual(updatedLayout.visibleWidgets);
    });
    
    test('deleteLayout should remove a layout', () => {
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
      
      store.dispatch(saveLayout(newLayout));
      
      // Verify layout was added
      let state = store.getState().personalization;
      expect(state.layouts['layout-to-delete']).toBeDefined();
      
      // Delete the layout
      store.dispatch(deleteLayout('layout-to-delete'));
      
      // Verify layout was removed
      state = store.getState().personalization;
      expect(state.layouts['layout-to-delete']).toBeUndefined();
    });
    
    test('deleteLayout should not remove default layouts', () => {
      // Try to delete the default layout
      store.dispatch(deleteLayout('default'));
      
      // Verify default layout still exists
      const state = store.getState().personalization;
      expect(state.layouts.default).toBeDefined();
    });
  });
  
  describe('async thunks', () => {
    test('loadUserPreferences should call service and update state on success', async () => {
      const mockPreferences = {
        preferences: {
          theme: 'dark',
          fontSize: 'small',
          density: 'compact',
          notifications: {
            email: false,
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
                { i: 'journey', x: 6, y: 0, w: 6, h: 2 }
              ]
            },
            visibleWidgets: ['welcome', 'journey']
          },
          'my-custom': {
            name: 'My Custom',
            config: {
              lg: [
                { i: 'welcome', x: 0, y: 0, w: 12, h: 2 }
              ]
            },
            visibleWidgets: ['welcome']
          }
        }
      };
      
      personalizationService.getUserPreferences.mockResolvedValue(mockPreferences);
      
      await store.dispatch(loadUserPreferences());
      
      const state = store.getState().personalization;
      
      // Verify service was called
      expect(personalizationService.getUserPreferences).toHaveBeenCalled();
      
      // Verify state was updated
      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.preferences).toEqual(mockPreferences.preferences);
      expect(state.layouts).toEqual(mockPreferences.layouts);
    });
    
    test('loadUserPreferences should handle errors', async () => {
      const errorMessage = 'Failed to load preferences';
      personalizationService.getUserPreferences.mockRejectedValue(new Error(errorMessage));
      
      await store.dispatch(loadUserPreferences());
      
      const state = store.getState().personalization;
      
      // Verify error state
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.error).toBe(errorMessage);
    });
    
    test('savePreferences should call service to save preferences', async () => {
      const newPreferences = {
        theme: 'dark',
        fontSize: 'large'
      };
      
      personalizationService.saveUserPreferences.mockResolvedValue({ success: true });
      
      await store.dispatch(savePreferences(newPreferences));
      
      // Verify service was called with the right parameters
      expect(personalizationService.saveUserPreferences).toHaveBeenCalledWith({
        preferences: {
          theme: 'dark',
          fontSize: 'large',
          density: 'comfortable',
          notifications: {
            email: true,
            push: true,
            inApp: true
          }
        }
      });
    });
    
    test('saveLayout should call service to save layout', async () => {
      const newLayout = {
        name: 'My Custom Layout',
        config: {
          lg: [
            { i: 'welcome', x: 0, y: 0, w: 12, h: 2 }
          ]
        },
        visibleWidgets: ['welcome']
      };
      
      personalizationService.saveUserPreferences.mockResolvedValue({ success: true });
      
      await store.dispatch(saveLayout(newLayout));
      
      // Verify service was called with the right parameters
      expect(personalizationService.saveUserPreferences).toHaveBeenCalledWith({
        layouts: expect.objectContaining({
          'my-custom-layout': {
            name: 'My Custom Layout',
            config: {
              lg: [
                { i: 'welcome', x: 0, y: 0, w: 12, h: 2 }
              ]
            },
            visibleWidgets: ['welcome']
          }
        })
      });
    });
    
    test('deleteLayout should call service to delete layout', async () => {
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
      
      store.dispatch(saveLayout(newLayout));
      
      personalizationService.saveUserPreferences.mockResolvedValue({ success: true });
      
      await store.dispatch(deleteLayout('layout-to-delete'));
      
      // Verify service was called with the right parameters
      expect(personalizationService.saveUserPreferences).toHaveBeenCalledWith({
        layouts: expect.not.objectContaining({
          'layout-to-delete': expect.anything()
        })
      });
    });
  });
  
  describe('selectors', () => {
    test('selectPersonalizationPreferences should return the preferences object', () => {
      const state = {
        personalization: {
          preferences: {
            theme: 'dark',
            fontSize: 'large'
          }
        }
      };
      
      const result = selectPersonalizationPreferences(state);
      
      expect(result).toEqual({
        theme: 'dark',
        fontSize: 'large'
      });
    });
    
    test('selectPersonalizationLayouts should return the layouts object', () => {
      const state = {
        personalization: {
          layouts: {
            default: {
              name: 'Default Layout',
              config: {
                lg: [
                  { i: 'welcome', x: 0, y: 0, w: 6, h: 2 }
                ]
              }
            }
          }
        }
      };
      
      const result = selectPersonalizationLayouts(state);
      
      expect(result).toEqual({
        default: {
          name: 'Default Layout',
          config: {
            lg: [
              { i: 'welcome', x: 0, y: 0, w: 6, h: 2 }
            ]
          }
        }
      });
    });
    
    test('selectPersonalizationLoading should return the loading state', () => {
      const state = {
        personalization: {
          isLoading: true
        }
      };
      
      const result = selectPersonalizationLoading(state);
      
      expect(result).toBe(true);
    });
    
    test('selectPersonalizationError should return the error state', () => {
      const state = {
        personalization: {
          error: 'Test error'
        }
      };
      
      const result = selectPersonalizationError(state);
      
      expect(result).toBe('Test error');
    });
  });
});
