import supabase from '../../utils/supabaseClient';

// Register user
const register = async (userData) => {
  try {
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

    if (error) throw error;

    return {
      user: data.user,
      session: data.session
    };
  } catch (error) {
    console.error('Registration Service Error:', error.message);
    throw new Error(error.message);
  }
};

// Login user
const login = async (userData) => {
  try {
    console.log('[AuthService] Attempting login with Supabase');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password: userData.password
    });

    if (error) throw error;

    // Store the session in localStorage
    localStorage.setItem('token', data.session.access_token);

    return {
      user: data.user,
      token: data.session.access_token
    };
  } catch (error) {
    console.error('Login Service Error:', error.message);
    throw new Error(error.message);
  }
};

// Logout user
const logout = async () => {
  try {
    console.log('Logout service called - clearing all authentication data');

    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

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
    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;

    if (data.session) {
      const { data: userData } = await supabase.auth.getUser();
      return userData.user;
    }

    return null;
  } catch (error) {
    console.error('Auth check failed:', error.message);
    return null;
  }
};

// Email verification
const verifyEmail = async (token) => {
  try {
    // Supabase handles email verification automatically
    // This function is just for compatibility with the existing code
    console.log('Email verification is handled automatically by Supabase');
    return { success: true, message: 'Email verification is handled by Supabase' };
  } catch (error) {
    console.error('Email verification error:', error.message);
    return { success: false, message: error.message };
  }
};

// Forgot password
const forgotPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;

    return {
      success: true,
      message: 'Password reset instructions sent to your email'
    };
  } catch (error) {
    console.error('Forgot password error:', error.message);
    return { success: false, message: error.message };
  }
};

// Reset password
const resetPassword = async (password) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) throw error;

    return {
      success: true,
      message: 'Password has been reset successfully'
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
