/**
 * Auth Service using Supabase
 *
 * This service handles authentication using Supabase Auth.
 */

import supabase from '../../utils/supabaseClient';

console.log('[AuthService] Using Supabase authentication');

// Register user
const register = async (userData) => {
  try {
    console.log('[AuthService] Registering user with Supabase:', userData.email);

    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.firstName || '',
          last_name: userData.lastName || '',
        }
      }
    });

    if (error) {
      console.error('[AuthService] Registration error:', error.message);
      throw new Error(error.message);
    }

    console.log('[AuthService] Registration successful');
    return {
      user: data.user,
      session: data.session
    };
  } catch (error) {
    console.error('[AuthService] Registration Service Error:', error.message);
    throw new Error(error.message);
  }
};

// Login user
const login = async (userData) => {
  try {
    console.log('[AuthService] Logging in with Supabase:', userData.email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password: userData.password
    });

    if (error) {
      console.error('[AuthService] Login error:', error.message);
      throw new Error(error.message);
    }

    if (!data.session) {
      console.error('[AuthService] Login failed: No session returned');
      throw new Error('Login failed: No session returned');
    }

    console.log('[AuthService] Login successful');

    // Store the token in localStorage for backward compatibility
    localStorage.setItem('token', data.session.access_token);

    return {
      user: data.user,
      token: data.session.access_token
    };
  } catch (error) {
    console.error('[AuthService] Login Service Error:', error.message);
    throw new Error(error.message);
  }
};

// Logout user
const logout = async () => {
  try {
    console.log('[AuthService] Logging out with Supabase');

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('[AuthService] Logout error:', error.message);
      throw error;
    }

    // Clear all authentication-related data from localStorage for backward compatibility
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('auth');

    // Force a reload of the page to ensure all state is cleared
    setTimeout(() => {
      window.location.href = '/';
    }, 100);

    console.log('[AuthService] Logout successful');
    return { success: true };
  } catch (error) {
    console.error('[AuthService] Logout Service Error:', error.message);
    return { success: false, message: error.message };
  }
};

// Check Auth Status
const checkAuth = async () => {
  try {
    console.log('[AuthService] Checking authentication status with Supabase');

    // Get the current session from Supabase
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('[AuthService] Session check error:', error.message);
      return null;
    }

    if (!data.session) {
      console.log('[AuthService] No active session found');
      return null;
    }

    // Get the user data
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('[AuthService] Get user error:', userError.message);
      return null;
    }

    if (!userData.user) {
      console.log('[AuthService] No user found');
      return null;
    }

    console.log('[AuthService] User is authenticated:', userData.user.id);
    return userData.user;
  } catch (error) {
    console.error('[AuthService] Auth check failed:', error.message);
    return null;
  }
};

// Email verification
const verifyEmail = async () => {
  try {
    console.log('[AuthService] Verifying email with Supabase');

    // Supabase handles email verification automatically
    // This function is kept for API compatibility
    return { success: true, message: 'Email verification handled by Supabase' };
  } catch (error) {
    console.error('[AuthService] Email verification error:', error.message);
    return { success: false, message: error.message };
  }
};

// Forgot password
const forgotPassword = async (email) => {
  try {
    console.log('[AuthService] Sending password reset email with Supabase:', email);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) {
      console.error('[AuthService] Forgot password error:', error.message);
      throw error;
    }

    console.log('[AuthService] Password reset email sent successfully');
    return {
      success: true,
      message: 'Password reset instructions sent to your email'
    };
  } catch (error) {
    console.error('[AuthService] Forgot password error:', error.message);
    return { success: false, message: error.message };
  }
};

// Reset password
const resetPassword = async (password) => {
  try {
    console.log('[AuthService] Resetting password with Supabase');

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      console.error('[AuthService] Reset password error:', error.message);
      throw error;
    }

    console.log('[AuthService] Password reset successful');
    return {
      success: true,
      message: 'Password has been reset successfully'
    };
  } catch (error) {
    console.error('[AuthService] Reset password error:', error.message);
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
