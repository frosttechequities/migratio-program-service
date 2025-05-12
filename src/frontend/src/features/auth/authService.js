import axios from 'axios';
import { getTokenFromLocalStorage } from '../../utils/authUtils';

// Define base URLs for different parts of the user service
const BASE_USER_SERVICE_API = process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:3001/api';
const AUTH_API_URL = `${BASE_USER_SERVICE_API}/auth`; // For /auth specific routes (e.g., /login, /signup)
const USERS_API_URL = `${BASE_USER_SERVICE_API}/users`;   // For /users specific routes (e.g., /me)

const getAuthHeaders = () => {
  const token = getTokenFromLocalStorage();
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

// Register user
const register = async (userData) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    const message =
      (error.response?.data?.message) || error.message || error.toString();
    console.error('Registration Service Error:', message);
    throw new Error(message);
  }
};

// Login user
const login = async (userData) => {
   try {
    const loginUrl = `${AUTH_API_URL}/login`;
    console.log('[AuthService] Attempting login to URL:', loginUrl); // Log the URL
    const response = await axios.post(loginUrl, userData);
    return response.data;
  } catch (error) {
    const message =
      (error.response?.data?.message) || error.message || error.toString();
    console.error('Login Service Error:', message);
    throw new Error(message);
  }
};

// Logout user
const logout = async () => {
  console.log('Logout service called - clearing all authentication data');

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
};

// Check Auth Status
const checkAuth = async () => {
    const token = getTokenFromLocalStorage();
    if (token) {
      try {
         const response = await axios.get(`${USERS_API_URL}/me`, { headers: getAuthHeaders() });
         return response.data.data?.user || response.data.user || response.data;
      } catch (error) {
         console.error('Auth check failed:', error.response?.data?.message || error.message);
         return null;
      }
    }
    return null;
};

// --- Placeholder functions for other auth operations ---
const verifyEmail = async (token) => {
  console.warn('verifyEmail service function not implemented.');
  // try {
  //   const response = await axios.get(`${AUTH_API_URL}/verifyEmail/${token}`);
  //   return response.data;
  // } catch (error) { ... }
  return { success: false, message: 'Not implemented' };
};

const forgotPassword = async (email) => {
   console.warn('forgotPassword service function not implemented.');
  // try {
  //   const response = await axios.post(`${AUTH_API_URL}/forgotPassword`, { email });
  //   return response.data;
  // } catch (error) { ... }
   return { success: false, message: 'Not implemented' };
};

const resetPassword = async (token, password) => {
   console.warn('resetPassword service function not implemented.');
  // try {
  //   const response = await axios.patch(`${AUTH_API_URL}/resetPassword/${token}`, { password });
  //   return response.data;
  // } catch (error) { ... }
   return { success: false, message: 'Not implemented' };
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
