import axios from './axios';

// Configuration for API version
const API_VERSION = '/api/v1'; // Change to '/api' for legacy endpoints

// Auth API calls
export const authAPI = {
  login: (credentials) => axios.post(`${API_VERSION}/login`, credentials),
  register: (userData) => axios.post(`${API_VERSION}/register`, userData),
  adminLogin: (credentials) => axios.post(`${API_VERSION}/admin-login`, credentials),
  logout: () => axios.post(`${API_VERSION}/logout`),
  forgetPassword: (data) => axios.put(`${API_VERSION}/forgetPassword`, data),
  getProfile: () => axios.get(`${API_VERSION}/profile`),
};

// User API calls
export const userAPI = {
  getProfile: () => axios.get(`${API_VERSION}/users/profile`),
  updateProfile: (data) => axios.put(`${API_VERSION}/users/profile`, data),
  getBookings: () => axios.get(`${API_VERSION}/users/bookings`),
  getEvents: () => axios.get(`${API_VERSION}/users/events`),
  getEventAnalytics: () => axios.get(`${API_VERSION}/users/events/analytics`),
  getAllUsers: () => axios.get(`${API_VERSION}/users`),
  getUserById: (id) => axios.get(`${API_VERSION}/users/${id}`),
  updateUser: (id, data) => axios.put(`${API_VERSION}/users/${id}`, data),
  deleteUser: (id) => axios.delete(`${API_VERSION}/users/${id}`),
};

// Event API calls
export const eventAPI = {
  getAllEvents: () => axios.get(`${API_VERSION}/events`),
  getEvent: (id) => axios.get(`${API_VERSION}/events/${id}`),
  createEvent: (eventData) => axios.post(`${API_VERSION}/events`, eventData),
  updateEvent: (id, eventData) => axios.put(`${API_VERSION}/events/${id}`, eventData),
  deleteEvent: (id) => axios.delete(`${API_VERSION}/events/${id}`),
};

// Booking API calls
export const bookingAPI = {
  createBooking: (bookingData) => axios.post(`${API_VERSION}/bookings`, bookingData),
  getBooking: (id) => axios.get(`${API_VERSION}/bookings/${id}`),
  deleteBooking: (id) => axios.delete(`${API_VERSION}/bookings/${id}`),
  cancelBooking: (id) => axios.put(`${API_VERSION}/bookings/${id}/cancel`),
};

// Admin API calls
export const adminAPI = {
  getAllUsers: () => axios.get(`${API_VERSION}/users`),
  getUser: (id) => axios.get(`${API_VERSION}/users/${id}`),
  updateUser: (id, data) => axios.put(`${API_VERSION}/users/${id}`, data),
  deleteUser: (id) => axios.delete(`${API_VERSION}/users/${id}`),
  getAllEvents: () => axios.get(`${API_VERSION}/events`),
  updateEventStatus: (id, status) => axios.put(`${API_VERSION}/events/${id}/status`, { status }),
  deleteEvent: (id) => axios.delete(`${API_VERSION}/events/${id}`),
};

// API info
export const getAPIInfo = () => axios.get(API_VERSION);

export default {
  authAPI,
  userAPI,
  eventAPI,
  bookingAPI,
  adminAPI,
  getAPIInfo
}; 