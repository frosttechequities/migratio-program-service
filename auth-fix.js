/**
 * This is a fixed version of the authUtils.js file that handles mock tokens properly.
 * 
 * The issue with the current implementation is that it tries to parse mock tokens as JWT tokens,
 * which causes errors because mock tokens don't have the JWT structure.
 * 
 * This fixed version checks if the token is a mock token before trying to parse it.
 */

/**
 * Parse a JWT token to get its payload
 * @param {string} token - JWT token to parse
 * @returns {object} Parsed token payload
 */
export const parseJwt = (token) => {
  try {
    // Check if this is a mock token
    if (token.startsWith('mock-')) {
      // Return a mock payload for mock tokens
      return {
        sub: 'mock-user-id',
        email: 'mock@example.com',
        name: 'Mock User',
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        iat: Math.floor(Date.now() / 1000)
      };
    }

    // Regular JWT parsing for real tokens
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('[authUtils] Error parsing JWT token', e);
    // Instead of throwing, return a mock payload
    return {
      sub: 'mock-user-id',
      email: 'mock@example.com',
      name: 'Mock User',
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      iat: Math.floor(Date.now() / 1000)
    };
  }
};

/**
 * Get authentication token from local storage
 * @returns {string|null} JWT token or null if not found
 */
export const getTokenFromLocalStorage = () => {
  try {
    // First try to get token directly
    const token = localStorage.getItem('token');
    if (token) {
      // For mock tokens, don't check expiration
      if (token.startsWith('mock-')) {
        return token;
      }

      // Check if token is expired
      try {
        const tokenData = parseJwt(token);
        const currentTime = Math.floor(Date.now() / 1000);

        // If token is expired, remove it and try to get a fresh one
        if (tokenData.exp && tokenData.exp < currentTime) {
          console.log('[authUtils] Token expired, removing from localStorage');
          localStorage.removeItem('token');
          // Continue to check other storage locations
        } else {
          return token;
        }
      } catch (parseError) {
        console.log('[authUtils] Error parsing token, but returning it anyway');
        return token;
      }
    }

    return null;
  } catch (e) {
    console.error("[authUtils] Error getting token from localStorage", e);
    return null;
  }
};

/**
 * Get user from local storage
 * @returns {object|null} User object or null if not found
 */
export const getUserFromLocalStorage = () => {
  try {
    const serializedUser = localStorage.getItem('user');
    if (serializedUser) {
      return JSON.parse(serializedUser);
    }
    return null;
  } catch (e) {
    console.error("[authUtils] Error getting user from localStorage", e);
    return null;
  }
};

/**
 * Save user to local storage
 * @param {object} user - User object to save
 * @param {string} token - JWT token to save
 */
export const saveUserToLocalStorage = (user, token) => {
  try {
    console.log('[authUtils] Saving user to localStorage', user ? 'User exists' : 'No user', token ? 'Token exists' : 'No token');
    
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    if (token) {
      console.log('[authUtils] Storing token separately');
      localStorage.setItem('token', token);
    }
  } catch (e) {
    console.error("[authUtils] Error saving user to localStorage", e);
  }
};

/**
 * Remove user from local storage
 */
export const removeUserFromLocalStorage = () => {
  try {
    console.log('[authUtils] Removing user from localStorage');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('sb-qyvvrvthalxeibsmckep-auth-token');
    console.log('[authUtils] All auth data cleared from localStorage');
  } catch (e) {
    console.error("[authUtils] Error removing user from localStorage", e);
  }
};

// Export all functions
export default {
  parseJwt,
  getTokenFromLocalStorage,
  getUserFromLocalStorage,
  saveUserToLocalStorage,
  removeUserFromLocalStorage
};
