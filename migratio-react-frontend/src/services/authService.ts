const AUTH_API_URL = 'https://migratio-user-auth.onrender.com/auth';

interface TokenResponse {
  access_token: string;
  refresh_token?: string; // Supabase provides this
  token_type: string;
  expires_in?: number; // Supabase provides this
}

interface User {
  id: string;
  email: string;
  created_at: string | null; // Added created_at to match backend response
  // Add other user fields if your /auth/me endpoint returns more
}

export const authService = {
  signup: async (email: string, password: string): Promise<User | { detail: string }> => {
    const response = await fetch(`${AUTH_API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Signup failed');
    }
    // For signup, Supabase might return user details or a confirmation message
    // Adjust based on your API's actual signup response structure
    return data; 
  },

  login: async (email: string, password: string): Promise<TokenResponse> => {
    const response = await fetch(`${AUTH_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Login failed');
    }
    return data;
  },

  fetchCurrentUser: async (token: string): Promise<User> => {
    const response = await fetch(`${AUTH_API_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Failed to fetch current user');
    }
    return data;
  },

  logout: async (token: string): Promise<void> => {
    // Note: The logout endpoint has a known issue returning 500,
    // but we'll call it anyway as it might still invalidate the token on the server.
    try {
      const response = await fetch(`${AUTH_API_URL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok && response.status !== 204) { // 204 is success for logout
        // Attempt to parse error if not a successful status (excluding 204)
        const errorData = await response.json().catch(() => null); // Avoid error if body is not json
        console.error('Logout API error:', errorData?.detail || `Status: ${response.status}`);
        // We might not throw an error here to allow client-side logout to proceed
        // if the server-side logout has issues but token is locally cleared.
      }
    } catch (error) {
      console.error('Error during logout API call:', error);
      // Decide if this should throw or be handled gracefully client-side
    }
  },
};

// Helper functions for token management (can be moved to a separate auth utils file later)
const TOKEN_KEY = 'migratio_auth_token';

export const storeToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};
