import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://amazonadsoptimizer2025-production.up.railway.app';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Dashboard APIs
export const dashboardApi = {
  getOverview: () => api.get('/dashboard/overview'),
  getPerformanceTrends: (days: number = 30) => api.get(`/dashboard/performance-trends?days=${days}`),
};

// Campaigns APIs
export const campaignsApi = {
  getAll: () => api.get('/campaigns'),
  getById: (id: string) => api.get(`/campaigns/${id}`),
  create: (data: any) => api.post('/campaigns', data),
  update: (id: string, data: any) => api.patch(`/campaigns/${id}`, data),
  delete: (id: string) => api.delete(`/campaigns/${id}`),
  sync: () => api.post('/campaigns/sync'),
};

// Keywords APIs
export const keywordsApi = {
  getAll: () => api.get('/keywords'),
  getById: (id: string) => api.get(`/keywords/${id}`),
  optimize: () => api.post('/keywords/optimize'),
  research: (asin: string) => api.post('/keyword-research/generate', { asin }),
};

// Optimization APIs
export const optimizationApi = {
  runAll: () => api.post('/optimization/run-all'),
  getHistory: () => api.get('/optimization/history'),
};

// Reports APIs
export const reportsApi = {
  getCampaignReport: (campaignId: string) => api.get(`/reports/campaign/${campaignId}`),
  getKeywordReport: () => api.get('/reports/keywords'),
  exportReport: (type: string) => api.get(`/reports/export/${type}`),
};

// Alerts APIs
export const alertsApi = {
  getAll: () => api.get('/alerts'),
  markAsRead: (id: string) => api.patch(`/alerts/${id}/read`),
};

// Budget APIs
export const budgetApi = {
  getStatus: () => api.get('/budget/status'),
  updateSettings: (data: any) => api.post('/budget/settings', data),
};
