/**
 * Get authentication token from local storage
 * @returns {string|null} JWT token or null if not found
 */
export const getTokenFromLocalStorage = () => {
  try {
    // First try to get token directly (Supabase stores it separately)
    const token = localStorage.getItem('token');
    if (token) {
      return token;
    }

    // Fallback to user object if token is not stored separately
    const serializedUser = localStorage.getItem('user');
    if (serializedUser === null) {
      return null;
    }
    const user = JSON.parse(serializedUser);
    return user?.token || null;
  } catch (e) {
    console.error("Error getting token from localStorage", e);
    return null;
  }
};

/**
 * Get user data from local storage
 * @returns {object|null} User object or null if not found
 */
export const getUserFromLocalStorage = () => {
  try {
    const serializedUser = localStorage.getItem('user');
    if (serializedUser === null) {
      return null;
    }
    return JSON.parse(serializedUser);
  } catch (e) {
    console.error("Error parsing user from localStorage", e);
    return null;
  }
};

/**
 * Save user data and token to local storage
 * NOTE: Storing tokens in localStorage is not recommended for production.
 * Consider HttpOnly cookies or more secure storage.
 * @param {object} user - User object
 * @param {string} token - JWT token
 */
export const saveUserToLocalStorage = (user, token) => {
  try {
    // Augment user object with token if it's not already there
    const userWithToken = { ...user, token };
    localStorage.setItem('user', JSON.stringify(userWithToken));
    // Store token separately for Supabase
    if (token) {
      localStorage.setItem('token', token);
    }
  } catch (e) {
    console.error("Error saving user to localStorage", e);
  }
};

/**
 * Remove user data and token from local storage
 */
export const removeUserFromLocalStorage = () => {
  try {
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Remove token stored separately for Supabase
    localStorage.removeItem('auth'); // Remove any Supabase auth data
  } catch (e) {
    console.error("Error removing user from localStorage", e);
  }
};
