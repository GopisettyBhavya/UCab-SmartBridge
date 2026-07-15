import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ucab_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('ucab_token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export const rideService = {
  create: (data) => api.post('/rides/book', data),
  getById: (id) => api.get(`/rides/${id}`),
  getMyRides: (params) => api.get('/rides/history', { params }),
  // Fetch active ride: first non-completed, non-cancelled ride from history
  getActiveRide: () => api.get('/rides/history', { params: { limit: 5 } }),
  cancel: (id) => api.put(`/rides/${id}/cancel`),
  rate: (id, data) => api.put(`/rides/${id}/rate`, data),
  pay: (id, data) => api.put(`/rides/${id}/pay`, data),
  getFareEstimate: (data) => api.post('/rides/estimate', data),
};

export const driverService = {
  toggleAvailability: (status) => api.put('/drivers/availability', { isAvailable: status }),
  getActiveRide: () => api.get('/rides/history', { params: { limit: 5 } }),
  acceptRide: (id) => api.put(`/rides/${id}/accept`),
  rejectRide: (id) => api.put(`/rides/${id}/cancel`),
  // verifyOtp sends the OTP in body — backend PUT /rides/:id/start expects { otp }
  verifyOtp: (id, otp) => api.put(`/rides/${id}/start`, { otp }),
  startRide: (id) => api.put(`/rides/${id}/start`),
  completeRide: (id) => api.put(`/rides/${id}/complete`),
  updateLocation: (location) => api.put('/drivers/location', { longitude: location.lng, latitude: location.lat }),
  getMyRides: (params) => api.get('/rides/history', { params }),
  getEarnings: () => api.get('/drivers/stats'),
  // Backend expects longitude/latitude query params (not lat/lng)
  getNearby: (lat, lng, radius) => api.get('/drivers/nearby', { params: { latitude: lat, longitude: lng, maxDistance: radius } }),
};

export const paymentService = {
  // Backend route is POST /api/payments/process with { rideId, method } in body
  processPayment: (rideId, data) => api.post('/payments/process', { rideId, ...data }),
  getPaymentHistory: () => api.get('/payments/history'),
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getDrivers: (params) => api.get('/admin/drivers', { params }),
  getRides: (params) => api.get('/admin/rides', { params }),
  verifyDriver: (id) => api.put(`/admin/drivers/${id}/verify`, { verified: true }),
  rejectDriver: (id) => api.put(`/admin/drivers/${id}/verify`, { verified: false }),
};

export default api;
