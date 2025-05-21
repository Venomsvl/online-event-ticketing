import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated by calling backend
    const checkAuth = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/users/profile', { withCredentials: true });
        setUser(res.data);
      } catch (error) {
        setUser(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async () => {
    // After login, fetch user profile
    try {
      const res = await axios.get('http://localhost:3000/api/users/profile', { withCredentials: true });
      setUser(res.data);
    } catch (error) {
      setUser(null);
    }
  };

  const logout = async () => {
    await axios.post('http://localhost:3000/api/auth/logout', {}, { withCredentials: true });
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
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