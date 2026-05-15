import apiClient from './client';
import { House } from '../types';

export const housesService = {
  getAll: async (filters?: { purpose?: string; city?: string }): Promise<House[]> => {
    const response = await apiClient.get('/houses', { params: filters });
    return response.data.data;
  },

  getById: async (id: string): Promise<House> => {
    const response = await apiClient.get(`/houses/${id}`);
    return response.data.data;
  },

  create: async (formData: FormData): Promise<House> => {
    const response = await apiClient.post('/houses', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  update: async (id: string, formData: FormData): Promise<void> => {
    await apiClient.patch(`/houses/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/houses/${id}`);
  },
};
