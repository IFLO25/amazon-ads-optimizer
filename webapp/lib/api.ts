import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://amazon-ads-backend-production.up.railway.app';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Dashboard APIs
export const dashboardApi = {
  getOverview: () => api.get('/api/dashboard/overview'),
  getPerformanceTrends: (days: number = 30) => api.get(`/api/dashboard/performance-trends?days=${days}`),
};

// Campaigns APIs
export const campaignsApi = {
  getAll: () => api.get('/api/campaigns'),
  getById: (id: string) => api.get(`/api/campaigns/${id}`),
  create: (data: any) => api.post('/api/campaigns', data),
  update: (id: string, data: any) => api.patch(`/api/campaigns/${id}`, data),
  delete: (id: string) => api.delete(`/api/campaigns/${id}`),
  sync: () => api.post('/api/campaigns/sync'),
};

// Keywords APIs
export const keywordsApi = {
  getAll: () => api.get('/api/keywords'),
  getById: (id: string) => api.get(`/api/keywords/${id}`),
  optimize: () => api.post('/api/keywords/optimize'),
  research: (asin: string) => api.post('/api/keyword-research/generate', { asin }),
};

// Optimization APIs
export const optimizationApi = {
  runAll: () => api.post('/api/optimization/run-all'),
  getHistory: () => api.get('/api/optimization/history'),
};

// Reports APIs
export const reportsApi = {
  getCampaignReport: (campaignId: string) => api.get(`/api/reports/campaign/${campaignId}`),
  getKeywordReport: () => api.get('/api/reports/keywords'),
  exportReport: (type: string) => api.get(`/api/reports/export/${type}`),
};

// Alerts APIs
export const alertsApi = {
  getAll: () => api.get('/api/alerts'),
  markAsRead: (id: string) => api.patch(`/api/alerts/${id}/read`),
};

// Budget APIs
export const budgetApi = {
  getStatus: () => api.get('/api/budget/status'),
  updateSettings: (data: any) => api.post('/api/budget/settings', data),
};
