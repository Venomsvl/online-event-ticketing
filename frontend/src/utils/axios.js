import axios from 'axios';
import { toast } from 'react-toastify';

const instance = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    // The token is handled via cookies (httpOnly), so no need to manually add Authorization header
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
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
    // Log successful responses for debugging
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check if the backend server is running on http://localhost:3000');
      return Promise.reject(error);
    }

    // Log the error details for debugging
    console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - Status: ${error.response.status}`);
    console.error('Error response:', error.response.data);

    // Handle specific error cases
    if (error.response.status === 401) {
      // Handle unauthorized access
      toast.error('Session expired or unauthorized. Please login again.');
      // Optional: redirect to login page
      // window.location.href = '/login';
    } else if (error.response.status === 403) {
      // Handle forbidden access
      toast.error('You do not have permission to perform this action.');
    } else if (error.response.status === 404) {
      // Handle not found errors
      toast.error(error.response.data?.message || 'Resource not found.');
    } else if (error.response.status === 500) {
      // Handle server errors
      toast.error('Server error. Please try again later.');
    } else {
      // Handle other errors
      toast.error(error.response.data?.message || 'An unexpected error occurred.');
    }

    return Promise.reject(error);
  }
);

export default instance; 