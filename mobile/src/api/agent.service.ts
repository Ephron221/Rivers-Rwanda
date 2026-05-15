import apiClient from './client';

export const agentService = {
  getStats: async () => {
    const response = await apiClient.get('/agents/stats');
    return response.data.data;
  },

  getReferralCode: async () => {
    const response = await apiClient.get('/agents/referral-code');
    return response.data.data;
  },

  getClients: async () => {
    const response = await apiClient.get('/agents/clients');
    return response.data.data;
  },

  getEarnings: async () => {
    const response = await apiClient.get('/agents/earnings');
    return response.data.data;
  }
};
