import axios from 'axios';
import { toast } from 'react-toastify';

const instance = axios.create({
  baseURL: '/api/v1', // Add baseURL to match backend routes
  baseURL: 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log the request for debugging
    console.log(`🚀 Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    // Log successful responses
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    console.log('Response data:', response.data);
    return response;
  },
  (error) => {
    // Log detailed error information
    console.error('❌ Response error:', error);
    console.error('Error config:', error.config);
    console.error('Error response:', error.response?.data);
    
    if (!error.response) {
      toast.error('Network error. Please check your connection and try again.');
      return Promise.reject(error);
    }

    // Handle specific error cases
    switch (error.response.status) {
      case 401:
        toast.error('Session expired. Please login again.');
        // Clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
        break;
      case 403:
        toast.error('You do not have permission to perform this action.');
        break;
      case 404:
        toast.error(error.response.data?.message || 'Resource not found.');
        break;
      case 422:
        // Validation errors
        const validationErrors = error.response.data?.errors;
        if (validationErrors) {
          Object.values(validationErrors).forEach(error => {
            toast.error(error);
          });
        } else {
          toast.error(error.response.data?.message || 'Validation failed.');
        }
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        toast.error(error.response.data?.message || 'An unexpected error occurred.');
    }

    return Promise.reject(error);
  }
);

export default instance; 