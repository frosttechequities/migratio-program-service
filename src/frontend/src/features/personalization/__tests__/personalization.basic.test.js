// Basic test for personalization features
describe('Personalization Basic Tests', () => {
  // Mock the localStorage
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: jest.fn(key => store[key] || null),
      setItem: jest.fn((key, value) => {
        store[key] = value.toString();
      }),
      removeItem: jest.fn(key => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        store = {};
      })
    };
  })();

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  });

  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();

    // Reset mocks
    jest.clearAllMocks();
  });

  test('localStorage mock works', () => {
    // Set an item
    localStorageMock.setItem('userPreferences', JSON.stringify({
      theme: 'dark',
      fontSize: 'large'
    }));

    // Verify it was set
    expect(localStorageMock.getItem('userPreferences')).toBe(JSON.stringify({
      theme: 'dark',
      fontSize: 'large'
    }));

    // Remove the item
    localStorageMock.removeItem('userPreferences');

    // Verify it was removed
    expect(localStorageMock.getItem('userPreferences')).toBeNull();
  });

  test('user preferences can be stored in localStorage', () => {
    // Set user preferences
    const preferences = {
      display: {
        theme: 'dark',
        fontSize: 'large',
        density: 'comfortable',
        colorAccent: 'blue'
      },
      content: {
        preferredLanguage: 'en',
        expertiseLevel: 'intermediate',
        dashboardFocus: 'overview',
        enablePredictiveAnalytics: true,
        enableAISuggestions: true
      }
    };

    localStorageMock.setItem('userPreferences', JSON.stringify(preferences));

    // Verify it was set
    expect(localStorageMock.getItem('userPreferences')).toBe(JSON.stringify(preferences));
  });

  test('dashboard layout preferences can be stored in localStorage', () => {
    // Set layout preferences
    const layoutPreferences = {
      visibleWidgets: ['welcome', 'journey', 'recommendations', 'tasks', 'documents'],
      widgetOrder: ['welcome', 'journey', 'recommendations', 'tasks', 'documents']
    };

    localStorageMock.setItem('dashboardLayout', JSON.stringify(layoutPreferences));

    // Verify it was set
    expect(localStorageMock.getItem('dashboardLayout')).toBe(JSON.stringify(layoutPreferences));

    // Update layout preferences
    const updatedLayout = {
      ...layoutPreferences,
      visibleWidgets: ['welcome', 'journey', 'tasks', 'documents'] // Remove recommendations
    };

    localStorageMock.setItem('dashboardLayout', JSON.stringify(updatedLayout));

    // Verify it was updated
    expect(localStorageMock.getItem('dashboardLayout')).toBe(JSON.stringify(updatedLayout));
    expect(JSON.parse(localStorageMock.getItem('dashboardLayout')).visibleWidgets).not.toContain('recommendations');
  });
});
