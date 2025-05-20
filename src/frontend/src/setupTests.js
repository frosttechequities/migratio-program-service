// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import React from 'react';

// MSW Server Setup
import { server } from './mocks/server';

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = String(value);
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

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
});

// Mock ResizeObserver which is not available in test environment
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserverMock;

// Mock IntersectionObserver which is not available in test environment
class IntersectionObserverMock {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
    this.callback([{ isIntersecting: true }], this);
  }
  unobserve() {}
  disconnect() {}
}

window.IntersectionObserver = IntersectionObserverMock;

// Mock React Router
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  const mockReact = jest.requireActual('react');

  return {
    __esModule: true,
    ...originalModule,
    BrowserRouter: ({ children }) => children,
    Link: mockReact.forwardRef(({ children, to, ...rest }, ref) => (
      <a href={to} ref={ref} {...rest}>{children}</a>
    )),
    useNavigate: () => jest.fn(),
    useLocation: () => ({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa'
    })
  };
});

// We're not mocking axios since we're using MSW to intercept requests
// This allows components to make real API calls that will be intercepted by MSW

// Mock Material UI components that might cause issues
jest.mock('@mui/material', () => {
  const originalModule = jest.requireActual('@mui/material');

  return {
    __esModule: true,
    ...originalModule,
    useMediaQuery: jest.fn().mockReturnValue(false)
  };
});

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
  sessionStorageMock.clear();

  // Reset any pending timers
  jest.useRealTimers();
});

// Clean up after each test
afterEach(() => {
  // Clean up any mounted components
  document.body.innerHTML = '';
});
