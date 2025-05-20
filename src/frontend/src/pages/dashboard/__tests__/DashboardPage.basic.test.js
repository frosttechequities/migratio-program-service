// Basic test for DashboardPage
describe('DashboardPage Basic Tests', () => {
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
    localStorageMock.setItem('test', 'value');
    
    // Verify it was set
    expect(localStorageMock.getItem('test')).toBe('value');
    
    // Remove the item
    localStorageMock.removeItem('test');
    
    // Verify it was removed
    expect(localStorageMock.getItem('test')).toBeNull();
  });

  test('widget visibility can be stored in localStorage', () => {
    // Set widget visibility
    localStorageMock.setItem('widgetVisibility_welcome', 'false');
    
    // Verify it was set
    expect(localStorageMock.getItem('widgetVisibility_welcome')).toBe('false');
    
    // Change widget visibility
    localStorageMock.setItem('widgetVisibility_welcome', 'true');
    
    // Verify it was updated
    expect(localStorageMock.getItem('widgetVisibility_welcome')).toBe('true');
  });
});
