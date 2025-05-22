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
    // You can add any request modifications here
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
  (error) => {
    console.error('Response error:', error);
    
    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    // Handle specific error cases
    if (error.response.status === 401) {
      // Handle unauthorized access
      toast.error('Session expired. Please login again.');
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