import { jwtDecode } from 'jwt-decode';

const STORAGE_KEY = 'traveloop_user';
const TOKEN_KEY = 'traveloop_token';

export const authService = {
  /**
   * Mock login for demo purposes
   */
  loginUser: async (email, password) => {
    // In a real app, this would call your backend
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = { 
          id: 'demo-123', 
          name: email.split('@')[0], 
          email, 
          picture: `https://ui-avatars.com/api/?name=${email}&background=random` 
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        localStorage.setItem(TOKEN_KEY, 'demo-token-123');
        resolve(user);
      }, 1000);
    });
  },

  /**
   * Handle Google Auth response
   */
  googleAuth: async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      const decoded = jwtDecode(credential);
      
      const user = {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        given_name: decoded.given_name,
        family_name: decoded.family_name
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_KEY, credential);
      
      return user;
    } catch (error) {
      console.error('Google Auth Error:', error);
      throw error;
    }
  },

  /**
   * Logout user
   */
  logoutUser: () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Get current user from storage
   */
  getCurrentUser: () => {
    const user = localStorage.getItem(STORAGE_KEY);
    return user ? JSON.parse(user) : null;
  },

  /**
   * Get current token
   */
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  }
};
