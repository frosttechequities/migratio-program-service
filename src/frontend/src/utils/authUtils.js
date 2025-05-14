/**
 * Get authentication token from local storage
 * @returns {string|null} JWT token or null if not found
 */
export const getTokenFromLocalStorage = () => {
  try {
    // First try to get token directly (Supabase stores it separately)
    const token = localStorage.getItem('token');
    if (token) {
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
        console.error('[authUtils] Error parsing token', parseError);
        // Continue to check other storage locations
      }
    }

    // Try to get token from Supabase's storage
    const supabaseSession = localStorage.getItem('sb-qyvvrvthalxeibsmckep-auth-token');
    if (supabaseSession) {
      try {
        const parsedSession = JSON.parse(supabaseSession);
        if (parsedSession?.access_token) {
          // Check if token is expired
          try {
            const tokenData = parseJwt(parsedSession.access_token);
            const currentTime = Math.floor(Date.now() / 1000);

            // If token is expired, remove it
            if (tokenData.exp && tokenData.exp < currentTime) {
              console.log('[authUtils] Supabase token expired, removing from localStorage');
              localStorage.removeItem('sb-qyvvrvthalxeibsmckep-auth-token');
              // Continue to check other storage locations
            } else {
              // Store it in our standard location for future use
              localStorage.setItem('token', parsedSession.access_token);
              return parsedSession.access_token;
            }
          } catch (parseError) {
            console.error('[authUtils] Error parsing Supabase token', parseError);
            // Continue to check other storage locations
          }
        }
      } catch (parseError) {
        console.error('[authUtils] Error parsing Supabase session', parseError);
      }
    }

    // Fallback to user object if token is not stored separately
    const serializedUser = localStorage.getItem('user');
    if (serializedUser) {
      try {
        const user = JSON.parse(serializedUser);
        if (user?.token) {
          // Check if token is expired
          try {
            const tokenData = parseJwt(user.token);
            const currentTime = Math.floor(Date.now() / 1000);

            // If token is expired, remove it
            if (tokenData.exp && tokenData.exp < currentTime) {
              console.log('[authUtils] User token expired, removing from localStorage');
              removeUserFromLocalStorage();
              return null;
            } else {
              // Store it in our standard location for future use
              localStorage.setItem('token', user.token);
              return user.token;
            }
          } catch (parseError) {
            console.error('[authUtils] Error parsing user token', parseError);
            // Continue but return the token anyway
            localStorage.setItem('token', user.token);
            return user.token;
          }
        }
      } catch (parseError) {
        console.error('[authUtils] Error parsing user object', parseError);
      }
    }

    // If we got here, no valid token was found
    return null;
  } catch (e) {
    console.error("[authUtils] Error getting token from localStorage", e);
    return null;
  }
};

/**
 * Parse a JWT token to get its payload
 * @param {string} token - JWT token to parse
 * @returns {object} Parsed token payload
 */
export const parseJwt = (token) => {
  try {
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
    throw e;
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
    console.log('[authUtils] Saving user to localStorage', user ? 'User exists' : 'No user', token ? 'Token exists' : 'No token');

    // Augment user object with token if it's not already there
    const userWithToken = { ...user, token };
    localStorage.setItem('user', JSON.stringify(userWithToken));

    // Store token separately for Supabase
    if (token) {
      console.log('[authUtils] Storing token separately');
      localStorage.setItem('token', token);

      // Also check if Supabase has stored its own token and ensure they match
      const supabaseSession = localStorage.getItem('sb-qyvvrvthalxeibsmckep-auth-token');
      if (supabaseSession) {
        try {
          const parsedSession = JSON.parse(supabaseSession);
          if (parsedSession && (!parsedSession.access_token || parsedSession.access_token !== token)) {
            console.log('[authUtils] Updating Supabase session token');
            parsedSession.access_token = token;
            localStorage.setItem('sb-qyvvrvthalxeibsmckep-auth-token', JSON.stringify(parsedSession));
          }
        } catch (parseError) {
          console.error('[authUtils] Error parsing/updating Supabase session', parseError);
        }
      }
    }
  } catch (e) {
    console.error("[authUtils] Error saving user to localStorage", e);
  }
};

/**
 * Remove user data and token from local storage
 */
export const removeUserFromLocalStorage = () => {
  try {
    console.log('[authUtils] Removing user from localStorage');
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Remove token stored separately for Supabase
    localStorage.removeItem('auth'); // Remove any Supabase auth data
    localStorage.removeItem('sb-qyvvrvthalxeibsmckep-auth-token'); // Remove Supabase session

    // Clear any other Supabase-related items
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sb-') || key.includes('supabase')) {
        console.log(`[authUtils] Removing Supabase-related item: ${key}`);
        localStorage.removeItem(key);
      }
    });

    console.log('[authUtils] All auth data cleared from localStorage');
  } catch (e) {
    console.error("[authUtils] Error removing user from localStorage", e);
  }
};
