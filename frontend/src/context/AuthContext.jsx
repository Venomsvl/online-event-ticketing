import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Try to get user from localStorage on initial load
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await axios.get('/api/auth/profile');
      const userData = res.data;
      setUser(userData);
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      localStorage.removeItem('user');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      // First, attempt to login
      const response = await axios.post('/api/auth/login', credentials);
      
      // Use the user data from the login response
      const userData = response.data.user;
      
      if (!userData) {
        throw new Error('Failed to get user data after login');
      }
      
      setUser(userData);
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      setUser(null);
      localStorage.removeItem('user');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
      // Remove user data from localStorage
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to logout');
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 