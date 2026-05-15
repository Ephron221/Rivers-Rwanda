import apiClient from './client';
import { Vehicle } from '../types';

export const vehiclesService = {
  getAll: async (filters?: { purpose?: string; make?: string }): Promise<Vehicle[]> => {
    const response = await apiClient.get('/vehicles', { params: filters });
    return response.data.data;
  },

  getById: async (id: string): Promise<Vehicle> => {
    const response = await apiClient.get(`/vehicles/${id}`);
    return response.data.data;
  },

  create: async (formData: FormData): Promise<Vehicle> => {
    const response = await apiClient.post('/vehicles', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  update: async (id: string, formData: FormData): Promise<void> => {
    await apiClient.patch(`/vehicles/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/vehicles/${id}`);
  },
};
