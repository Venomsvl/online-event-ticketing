import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      // First check if there's an admin user in localStorage
      const adminUser = localStorage.getItem('adminUser');
      if (adminUser) {
        const parsedAdminUser = JSON.parse(adminUser);
        setUser(parsedAdminUser);
        localStorage.setItem('userRole', 'admin');
        return parsedAdminUser;
      }

      // Otherwise, check for regular user authentication
      const res = await axios.get('/api/v1/users/profile');
      setUser(res.data);
      localStorage.setItem('userRole', res.data.role);
      return res.data;
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      localStorage.removeItem('userRole');
      localStorage.removeItem('adminUser');
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
      const response = await axios.post('/api/v1/login', credentials);
      
      const userData = response.data.user;
      
      if (!userData) {
        throw new Error('Failed to get user data after login');
      }
      
      setUser(userData);
      localStorage.setItem('userRole', userData.role);
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      setUser(null);
      localStorage.removeItem('userRole');
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Check if it's an admin user
      const adminUser = localStorage.getItem('adminUser');
      
      if (!adminUser) {
        // Regular user logout - call API
        await axios.post('/api/v1/logout');
      }
      
      // Clear all user data
      setUser(null);
      localStorage.removeItem('userRole');
      localStorage.removeItem('adminUser');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local data even if API call fails
      setUser(null);
      localStorage.removeItem('userRole');
      localStorage.removeItem('adminUser');
      toast.error('Failed to logout');
    }
  };

  const updateUser = async (updatedData) => {
    try {
      // If it's an admin user, just update the local state
      const adminUser = localStorage.getItem('adminUser');
      if (adminUser) {
        const updatedAdminUser = {
          ...JSON.parse(adminUser),
          ...updatedData
        };
        localStorage.setItem('adminUser', JSON.stringify(updatedAdminUser));
        setUser(updatedAdminUser);
        return updatedAdminUser;
      }

      // For regular users, update through the API
      const response = await axios.put('/api/v1/users/profile', updatedData);
      const newUserData = response.data;
      
      // Update local state with new user data
      setUser(prev => ({
        ...prev,
        ...newUserData
      }));

      // Update role in localStorage if it changed
      if (newUserData.role) {
        localStorage.setItem('userRole', newUserData.role);
      }

      return newUserData;
    } catch (error) {
      console.error('Profile update failed:', error);
      // Re-throw the error so it can be handled by the component
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    checkAuth,
    updateUser
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