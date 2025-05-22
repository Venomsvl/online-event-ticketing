import axios from 'axios';
import { toast } from 'react-toastify';

const instance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    // Get user from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      // Add any necessary auth headers
      config.headers['Authorization'] = `Bearer ${userData.token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.error('Response error:', error);
    
    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    // Handle specific error cases
    if (error.response.status === 401) {
      // Clear user data from localStorage
      localStorage.removeItem('user');
      // Handle unauthorized access
      toast.error('Session expired. Please login again.');
      // Redirect to login page
      window.location.href = '/login';
    } else if (error.response.status === 403) {
      // Handle forbidden access
      toast.error('You do not have permission to perform this action.');
    } else if (error.response.status === 500) {
      // Handle server errors
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default instance; 