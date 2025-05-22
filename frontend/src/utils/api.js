import axios from './axios';

// Auth API calls
export const authAPI = {
  login: (credentials) => axios.post('/api/auth/login', credentials),
  register: (userData) => axios.post('/api/auth/register', userData),
  adminLogin: (credentials) => axios.post('/api/auth/admin-login', credentials),
  logout: () => axios.post('/api/auth/logout'),
};

// User API calls
export const userAPI = {
  getProfile: () => axios.get('/api/users/profile'),
  updateProfile: (data) => axios.put('/api/users/profile', data),
  getBookings: () => axios.get('/api/users/bookings'),
  getEventAnalytics: () => axios.get('/api/users/events/analytics'),
};

// Event API calls
export const eventAPI = {
  getAllEvents: () => axios.get('/api/events'),
  getEvent: (id) => axios.get(`/api/events/${id}`),
  createEvent: (eventData) => axios.post('/api/events', eventData),
  updateEvent: (id, eventData) => axios.put(`/api/events/${id}`, eventData),
  deleteEvent: (id) => axios.delete(`/api/events/${id}`),
  bookTicket: (eventId, ticketData) => axios.post(`/api/bookings`, { eventId, ...ticketData }),
};

// Admin API calls
export const adminAPI = {
  getAllUsers: () => axios.get('/api/admin/users'),
  getUser: (id) => axios.get(`/api/admin/users/${id}`),
  updateUser: (id, data) => axios.put(`/api/admin/users/${id}`, data),
  deleteUser: (id) => axios.delete(`/api/admin/users/${id}`),
  getAllEvents: () => axios.get('/api/events'),
  updateEventStatus: (id, status) => axios.put(`/api/events/${id}/status`, { status }),
  deleteEvent: (id) => axios.delete(`/api/events/${id}`),
};

// Booking API calls
export const bookingAPI = {
  getBooking: (id) => axios.get(`/api/bookings/${id}`),
  deleteBooking: (id) => axios.delete(`/api/bookings/${id}`),
}; 