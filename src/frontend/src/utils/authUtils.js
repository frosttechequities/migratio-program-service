/**
 * Get authentication token from local storage
 * @returns {string|null} JWT token or null if not found
 */
export const getTokenFromLocalStorage = () => {
  try {
    const serializedUser = localStorage.getItem('user');
    if (serializedUser === null) {
      return null;
    }
    const user = JSON.parse(serializedUser);
    return user?.token || null; 
  } catch (e) {
    console.error("Error parsing user from localStorage", e);
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
    // If token is separate (as in some authService comments)
    // localStorage.setItem('token', token); 
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
    // localStorage.removeItem('token'); // If token was stored separately
  } catch (e) {
    console.error("Error removing user from localStorage", e);
  }
};
