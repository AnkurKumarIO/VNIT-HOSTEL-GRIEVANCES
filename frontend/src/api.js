import axios from 'axios';

const API_URL = 'https://vnit-hostel-grievances-1-o.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Corrected endpoints with /api prefix
export const auth = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
};

export const complaints = {
  create: (data) => api.post('/api/complaints/', data),
  createEmergency: (data) => api.post('/api/complaints/emergency', data),
  getAll: () => api.get('/api/complaints/'),
  getOne: (id) => api.get(`/api/complaints/${id}`),
  updateStatus: (id, status) => api.patch(`/api/complaints/${id}/status`, { status }),
  getByLocation: (data) => api.post('/api/complaints/by-location', data),
  upvote: (id) => api.post(`/api/complaints/${id}/upvote`),
  removeUpvote: (id) => api.post(`/api/complaints/${id}/remove-upvote`),
  rateWorker: (id, rating, feedback) => api.post(`/api/complaints/${id}/rate`, { rating, feedback }),
};

export const admin = {
  getAllComplaints: (params) => api.get('/api/admin/complaints', { params }),
  getEmergencyComplaints: (params) => api.get('/api/admin/complaints/emergency', { params }),
  resolveEmergency: (id, data) => api.post(`/api/admin/complaints/${id}/resolve-emergency`, data),
  validate: (id, data) => api.post(`/api/admin/complaints/${id}/validate`, data),
  assign: (id, data) => api.post(`/api/admin/complaints/${id}/assign`, data),
  verify: (id, data) => api.post(`/api/admin/complaints/${id}/verify`, data),
  getWorkers: () => api.get('/api/admin/workers'),
  getStats: () => api.get('/api/admin/stats'),
  getDashboard: () => api.get('/api/admin/dashboard'),
  getWorkerPerformance: () => api.get('/api/admin/workers/performance'),
  getWorkerDetails: (id) => api.get(`/api/admin/workers/${id}/details`),
  checkUnassignedEscalations: () => api.post('/api/admin/complaints/check-unassigned'),
};

export const worker = {
  getTasks: () => api.get('/api/worker/tasks'),
  updateTask: (id, data) => api.patch(`/api/worker/tasks/${id}/update`, data),
  completeTask: (id, data) => api.post(`/api/worker/tasks/${id}/complete`, data),
  uploadProgressPhoto: (id, photo) => api.post(`/api/worker/tasks/${id}/upload-progress-photo`, { photo }),
  uploadCompletionPhoto: (id, photo) => api.post(`/api/worker/tasks/${id}/upload-completion-photo`, { photo }),
  getProfile: () => api.get('/api/worker/profile'),
};

export default api;
