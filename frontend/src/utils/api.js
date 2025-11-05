import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Diet API functions
export const dietAPI = {
  getDietPlans: () => api.get('/diet'),
  getDietPlan: (id) => api.get(`/diet/${id}`),
  createDietPlan: (data) => api.post('/diet', data),
  generateDietPlan: (data) => api.post('/diet/generate', data),
  updateDietPlan: (id, data) => api.put(`/diet/${id}`, data),
  deleteDietPlan: (id) => api.delete(`/diet/${id}`),
  addProgress: (id, data) => api.post(`/diet/${id}/progress`, data),
  getProgress: (id) => api.get(`/diet/${id}/progress`),
};

// AI API functions
export const aiAPI = {
  chatWithAI: (data) => api.post('/ai/chat', data),
  getChatHistory: () => api.get('/ai/history'),
  generateAIDietPlan: (data) => api.post('/ai/generate-diet', data),
  generateAIHealthInsights: (data) => api.post('/ai/health-insights', data),
  getHealthPredictions: (data) => api.post('/ai/health-predictions', data),
};



export default api;
