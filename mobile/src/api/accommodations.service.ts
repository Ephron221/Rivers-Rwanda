import apiClient from './client';
import { Accommodation } from '../types';

export const accommodationsService = {
  getAll: async (filters?: {
    type?: string;
    sub_type?: string;
    city?: string;
    purpose?: string;
    maxPrice?: string;
  }): Promise<Accommodation[]> => {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.sub_type) params.append('sub_type', filters.sub_type);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.purpose) params.append('purpose', filters.purpose);
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice);
    const response = await apiClient.get(`/accommodations?${params.toString()}`);
    return response.data.data;
  },

  getById: async (id: string): Promise<Accommodation> => {
    const response = await apiClient.get(`/accommodations/${id}`);
    return response.data.data;
  },

  create: async (formData: FormData): Promise<Accommodation> => {
    const response = await apiClient.post('/accommodations', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  update: async (id: string, formData: FormData): Promise<void> => {
    await apiClient.patch(`/accommodations/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/accommodations/${id}`);
  },
};
