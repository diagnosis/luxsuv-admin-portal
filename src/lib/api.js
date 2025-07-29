import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  logout: () => {
    return api.post('/logout').catch(() => {
      // Even if logout fails, we should clear local storage
      return Promise.resolve();
    });
  },
  validateToken: () => api.get('/auth/session'),
};

// User Management API
export const userAPI = {
  getUsers: (params) => api.get('/admin/users', { params }).then(res => res.data),
  getUser: (id) => api.get(`/admin/users/${id}`).then(res => res.data),
  getUserByEmail: (email) => api.get(`/admin/users/by-email?email=${encodeURIComponent(email)}`).then(res => res.data),
  createUser: (data) => api.post('/admin/users', data).then(res => res.data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data).then(res => res.data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`).then(res => res.data),
};

// Booking Management API
export const bookingAPI = {
  getBookings: (params) => api.get('/admin/bookings', { params }).then(res => res.data),
  getBooking: (id) => api.get(`/admin/bookings/${id}`).then(res => res.data),
  updateBookingStatus: (id, data) => api.put(`/admin/bookings/${id}/status`, data).then(res => res.data),
  cancelBooking: (id, data) => api.delete(`/admin/bookings/${id}/cancel`, { data }).then(res => res.data),
};

// Driver Management API
export const driverAPI = {
  getDrivers: (params) => api.get('/admin/drivers', { params }).then(res => res.data),
  getDriver: (id) => api.get(`/admin/drivers/${id}`).then(res => res.data),
  updateDriverStatus: (id, data) => api.put(`/admin/drivers/${id}/status`, data).then(res => res.data),
};

// Assignment System API
export const assignmentAPI = {
  getDashboard: () => api.get('/admin/assignments/dashboard').then(res => res.data),
  autoAssign: (data) => api.post('/admin/assignments/auto-assign', data).then(res => res.data),
  manualAssignment: (data) => api.post('/admin/assignments/manual', data).then(res => res.data),
  getHistory: (params) => api.get('/admin/assignments/history', { params }).then(res => res.data),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => api.get('/admin/analytics/dashboard').then(res => res.data),
  getBookingAnalytics: (params) => api.get('/admin/analytics/bookings', { params }).then(res => res.data),
  getDriverAnalytics: () => api.get('/admin/analytics/drivers').then(res => res.data),
  getFinancialReports: () => api.get('/admin/analytics/financial').then(res => res.data),
};

// Notifications API
export const notificationAPI = {
  getNotifications: (params) => api.get('/admin/notifications', { params }).then(res => res.data),
  sendNotification: (data) => api.post('/admin/notifications/send', data).then(res => res.data),
  markAsRead: (data) => api.put('/admin/notifications/mark-read', data).then(res => res.data),
};