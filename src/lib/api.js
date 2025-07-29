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
  logout: () => api.post('/logout'),
  // Remove getSession as it doesn't exist in the backend
  validateToken: () => api.get('/users/me'), // Use the existing endpoint to validate token
};

// User Management API
export const userAPI = {
  getUsers: (params) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  getUserByEmail: (email) => api.get(`/admin/users/by-email?email=${encodeURIComponent(email)}`),
  createUser: (data) => {
    // Transform data to match backend expectations
    const userData = {
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role || 'rider'
    };
    return api.post('/register', userData);
  },
  updateUser: (id, data) => {
    if (data.role) {
      return api.put(`/admin/users/${id}/role`, { role: data.role });
    }
    // For other updates, we might need additional endpoints
    return Promise.reject(new Error('Only role updates are supported'));
  },
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

// Booking Management API - using actual backend endpoints
export const bookingAPI = {
  getBookings: (params) => {
    // Transform params to match backend
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 20
    };
    
    // Add email search if provided
    if (params.customer_email) {
      return api.get(`/bookings/email/${encodeURIComponent(params.customer_email)}`);
    }
    
    // For now, return a mock response structure since the backend doesn't have admin booking list
    return Promise.resolve({
      data: {
        bookings: [],
        summary: {
          total_bookings: 0,
          pending: 0,
          assigned: 0,
          in_progress: 0,
          completed: 0,
          cancelled: 0
        },
        pagination: {
          current_page: 1,
          total_pages: 1,
          total_count: 0,
          limit: 20
        }
      }
    });
  },
  getBooking: (id) => {
    // The backend doesn't have individual booking endpoint for admin
    return Promise.reject(new Error('Individual booking retrieval not available'));
  },
  updateBookingStatus: (id, data) => {
    // Backend doesn't have admin booking status update
    return Promise.reject(new Error('Admin booking status update not available'));
  },
  cancelBooking: (id, data) => {
    // Backend has user-level cancellation only
    return api.delete(`/bookings/${id}/cancel`, { data });
  },
};

// Driver Management API - using actual backend endpoints
export const driverAPI = {
  getDrivers: (params) => {
    // Backend doesn't have dedicated driver listing for admin
    // We can get users with driver role instead
    return api.get('/admin/users', { 
      params: { 
        ...params,
        role: 'driver' 
      } 
    }).then(response => ({
      data: {
        drivers: response.data.users?.map(user => ({
          id: user.id,
          name: user.username,
          email: user.email,
          role: user.role,
          status: 'online', // Default status
          location: {
            latitude: 40.7128,
            longitude: -74.0060,
            address: 'New York, NY',
            last_updated: new Date().toISOString()
          },
          vehicle: {
            make: 'Mercedes',
            model: 'GLS',
            year: 2023,
            license_plate: 'LUX123',
            color: 'Black'
          },
          performance: {
            rating: 4.9,
            total_rides: 0,
            completed_rides: 0,
            cancelled_rides: 0,
            on_time_percentage: 95
          },
          current_booking: null,
          availability: {
            next_available: new Date().toISOString(),
            working_hours: {
              start: '08:00',
              end: '20:00'
            }
          }
        })) || [],
        summary: {
          total_drivers: response.data.pagination?.total_count || 0,
          online: 0,
          busy: 0,
          offline: 0,
          average_rating: 4.7
        }
      }
    }));
  },
  getDriver: (id) => api.get(`/admin/users/${id}`),
  updateDriverStatus: (id, data) => {
    return Promise.reject(new Error('Driver status update not available'));
  },
};

// Assignment System API - mock implementation
export const assignmentAPI = {
  getDashboard: () => Promise.resolve({
    data: {
      pending_assignments: 0,
      available_drivers: 0,
      urgent_bookings: [],
      assignment_stats: {
        auto_assigned: 0,
        manual_assigned: 0,
        unassigned: 0
      }
    }
  }),
  autoAssign: (data) => Promise.reject(new Error('Auto assignment not available')),
  manualAssignment: (data) => Promise.reject(new Error('Manual assignment not available')),
  getHistory: (params) => Promise.resolve({ data: { assignments: [] } }),
};

// Analytics API - mock implementation with realistic data
export const analyticsAPI = {
  getDashboard: () => Promise.resolve({
    data: {
      overview: {
        total_bookings: 150,
        total_revenue: 15000.00,
        active_drivers: 5,
        customer_satisfaction: 4.7
      },
      today: {
        bookings: 12,
        revenue: 1200.00,
        completed_rides: 10,
        cancelled_rides: 1
      },
      trends: {
        bookings_growth: 15.5,
        revenue_growth: 12.3,
        driver_utilization: 78.5
      },
      charts: {
        bookings_by_hour: [
          { hour: '08:00', count: 2 },
          { hour: '09:00', count: 3 },
          { hour: '10:00', count: 4 },
          { hour: '11:00', count: 3 },
          { hour: '12:00', count: 5 },
          { hour: '13:00', count: 4 },
          { hour: '14:00', count: 6 },
          { hour: '15:00', count: 5 },
          { hour: '16:00', count: 7 },
          { hour: '17:00', count: 8 },
          { hour: '18:00', count: 6 },
          { hour: '19:00', count: 4 }
        ],
        revenue_by_day: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          revenue: Math.floor(Math.random() * 2000) + 1000
        }))
      }
    }
  }),
  getBookingAnalytics: (params) => Promise.resolve({
    data: {
      summary: {
        total_bookings: 150,
        completed: 135,
        cancelled: 10,
        no_shows: 5,
        completion_rate: 90.0
      },
      by_status: {
        pending: 5,
        assigned: 8,
        in_progress: 2,
        completed: 135
      },
      by_ride_type: {
        'Airport Transfer': 60,
        'City Tour': 40,
        'Business Meeting': 30,
        'Special Event': 15,
        'Other': 5
      },
      peak_hours: [
        { hour: '08:00', bookings: 12 },
        { hour: '17:00', bookings: 15 },
        { hour: '18:00', bookings: 13 }
      ],
      geographic_distribution: [
        { area: 'Downtown', bookings: 50 },
        { area: 'Airport', bookings: 45 },
        { area: 'Suburbs', bookings: 35 },
        { area: 'Business District', bookings: 20 }
      ]
    }
  }),
  getDriverAnalytics: () => Promise.resolve({
    data: {
      summary: {
        total_drivers: 5,
        active_drivers: 5,
        average_rating: 4.7,
        average_utilization: 75.5
      },
      top_performers: [
        {
          driver_id: 2,
          name: 'Jane Driver',
          rating: 4.9,
          completed_rides: 45,
          revenue: 4500.00
        },
        {
          driver_id: 3,
          name: 'John Driver',
          rating: 4.8,
          completed_rides: 42,
          revenue: 4200.00
        }
      ],
      performance_metrics: {
        on_time_rate: 92.5,
        cancellation_rate: 3.2,
        customer_satisfaction: 4.7
      },
      utilization_by_hour: Array.from({ length: 12 }, (_, i) => ({
        hour: String(8 + i).padStart(2, '0') + ':00',
        utilization: Math.floor(Math.random() * 30) + 70
      }))
    }
  }),
  getFinancialReports: () => Promise.resolve({
    data: {
      revenue: {
        total: 15000.00,
        this_month: 5000.00,
        last_month: 4500.00,
        growth: 11.1
      },
      by_category: {
        ride_fees: 12000.00,
        cancellation_fees: 500.00,
        surge_pricing: 2000.00,
        tips: 500.00
      },
      expenses: {
        driver_payments: 10500.00,
        platform_costs: 1500.00,
        marketing: 500.00,
        operations: 1000.00
      },
      profit_margin: 13.3,
      payment_methods: {
        credit_card: 75.5,
        cash: 15.2,
        digital_wallet: 9.3
      }
    }
  }),
};

// Notifications API - mock implementation
export const notificationAPI = {
  getNotifications: (params) => Promise.resolve({
    data: {
      notifications: [
        {
          id: 1,
          type: 'system_info',
          priority: 'medium',
          title: 'Welcome to LuxSUV Admin Portal',
          message: 'You have successfully logged into the admin portal. All systems are operational.',
          data: {},
          actions: [],
          created_at: new Date().toISOString(),
          read: false
        },
        {
          id: 2,
          type: 'booking_info',
          priority: 'low',
          title: 'Booking Activity Summary',
          message: 'Daily booking summary: 12 new bookings, 10 completed rides.',
          data: {},
          actions: [],
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false
        }
      ],
      summary: {
        total: 2,
        unread: 2,
        high_priority: 0
      }
    }
  }),
  sendNotification: (data) => Promise.resolve({ data: { message: 'Notification sent' } }),
  markAsRead: (data) => Promise.resolve({ data: { message: 'Notifications marked as read' } }),
};