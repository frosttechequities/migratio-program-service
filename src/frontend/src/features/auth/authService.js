/**
 * Mock Auth Service
 *
 * This is a completely independent mock implementation that doesn't require any external dependencies.
 */

console.log('[AuthService] Using completely independent mock implementation');

// Register user
const register = async (userData) => {
  try {
    console.log('[AuthService] Mock register called with:', userData.email);

    // Mock successful registration
    return {
      user: {
        id: 'mock-user-id',
        email: userData.email,
        user_metadata: {
          first_name: userData.firstName || '',
          last_name: userData.lastName || '',
        }
      },
      session: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_at: Date.now() + 3600000 // 1 hour from now
      }
    };
  } catch (error) {
    console.error('Registration Service Error:', error.message);
    throw new Error(error.message);
  }
};

// Login user
const login = async (userData) => {
  try {
    console.log('[AuthService] Mock login called with:', userData.email);

    // Mock successful login
    const mockToken = 'mock-access-token-' + Date.now();

    // Store the session in localStorage
    localStorage.setItem('token', mockToken);

    return {
      user: {
        id: 'mock-user-id',
        email: userData.email,
        user_metadata: {
          first_name: 'Mock',
          last_name: 'User',
        }
      },
      token: mockToken
    };
  } catch (error) {
    console.error('Login Service Error:', error.message);
    throw new Error(error.message);
  }
};

// Logout user
const logout = async () => {
  try {
    console.log('[AuthService] Mock logout called - clearing all authentication data');

    // Clear all authentication-related data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('auth');

    // Clear any session cookies that might be persisting the session
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.trim().split('=');
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });

    // Force a reload of the page to ensure all state is cleared
    setTimeout(() => {
      window.location.href = '/';
    }, 100);

    return { success: true };
  } catch (error) {
    console.error('Logout Service Error:', error.message);
    return { success: false, message: error.message };
  }
};

// Check Auth Status
const checkAuth = async () => {
  try {
    console.log('[AuthService] Mock checking authentication status');

    // Check if there's a token in localStorage
    const token = localStorage.getItem('token');

    if (token) {
      console.log('[AuthService] Mock token found, user is authenticated');

      // Return a mock user
      return {
        id: 'mock-user-id',
        email: 'mock@example.com',
        user_metadata: {
          first_name: 'Mock',
          last_name: 'User',
        }
      };
    }

    console.log('[AuthService] No token found, user not authenticated');
    return null;
  } catch (error) {
    console.error('[AuthService] Auth check failed:', error.message);
    return null;
  }
};

// Email verification
const verifyEmail = async (token) => {
  try {
    console.log('[AuthService] Mock email verification called', token ? `(token: ${token})` : '');
    return { success: true, message: 'Email verification successful (mock)' };
  } catch (error) {
    console.error('[AuthService] Email verification error:', error.message);
    return { success: false, message: error.message };
  }
};

// Forgot password
const forgotPassword = async (email) => {
  try {
    console.log('[AuthService] Mock forgot password called with:', email);

    return {
      success: true,
      message: 'Password reset instructions sent to your email (mock)'
    };
  } catch (error) {
    console.error('Forgot password error:', error.message);
    return { success: false, message: error.message };
  }
};

// Reset password
const resetPassword = async (token, password) => {
  try {
    console.log('[AuthService] Mock reset password called with token:', token, 'and password:', password ? '(password provided)' : '(no password)');

    return {
      success: true,
      message: 'Password has been reset successfully (mock)'
    };
  } catch (error) {
    console.error('Reset password error:', error.message);
    return { success: false, message: error.message };
  }
};

const authService = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
};

export default authService;
