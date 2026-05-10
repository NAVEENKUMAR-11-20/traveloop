import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const loggedInUser = await authService.loginUser(email, password);
      // Optional: Sync email/password users too
      await userService.upsertUser(loggedInUser);
      setUser(loggedInUser);
      toast.success(`Welcome back, ${loggedInUser.name}!`);
      return loggedInUser;
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const loggedInUser = await authService.googleAuth(credentialResponse);
      
      // Store/Sync user in Supabase
      try {
        await userService.upsertUser(loggedInUser);
      } catch (syncError) {
        console.error('Failed to sync user with database:', syncError);
        // We still let them login even if sync fails (offline mode/demo)
      }

      setUser(loggedInUser);
      toast.success(`Welcome, ${loggedInUser.name}!`);
      return loggedInUser;
    } catch (error) {
      toast.error('Google login failed.');
      throw error;
    }
  };

  const logout = () => {
    authService.logoutUser();
    setUser(null);
    toast.success('Logged out successfully');
  };

  const ADMIN_EMAIL = 'naveenkumar11202006@gmail.com';

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.email === ADMIN_EMAIL,
    login,
    handleGoogleLogin,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
