import apiClient from './client';
import { Notification } from '../types';

export const notificationsService = {
  getMyNotifications: async (): Promise<Notification[]> => {
    const response = await apiClient.get('/notifications');
    return response.data.data;
  },

  markRead: async (id: string): Promise<void> => {
    await apiClient.put(`/notifications/${id}/read`);
  },

  markAllRead: async (): Promise<void> => {
    await apiClient.put('/notifications/mark-all-read');
  },
};
