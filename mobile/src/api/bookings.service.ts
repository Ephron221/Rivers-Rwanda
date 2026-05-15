import apiClient from './client';
import { Booking } from '../types';

export const bookingsService = {
  create: async (data: {
    booking_type: string;
    accommodation_id?: string;
    vehicle_id?: string;
    house_id?: string;
    seller_id?: string;
    start_date?: string;
    end_date?: string;
    total_amount: number;
    payment_method?: string;
    paymentProof?: { uri: string; name: string; type: string };
    email?: string;
    fullName?: string;
    phone?: string;
  }): Promise<Booking> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'paymentProof' && value) {
        formData.append('payment_proof', {
          uri: (value as any).uri,
          name: (value as any).name,
          type: (value as any).type,
        } as any);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    const response = await apiClient.post('/bookings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  getMyBookings: async (): Promise<Booking[]> => {
    const response = await apiClient.get('/bookings/my');
    return response.data.data;
  },

  cancel: async (id: string): Promise<void> => {
    await apiClient.patch(`/bookings/${id}/cancel`);
  },

  getAll: async (): Promise<Booking[]> => {
    const response = await apiClient.get('/admin/bookings');
    return response.data.data;
  },

  confirmPayment: async (id: string): Promise<void> => {
    await apiClient.patch(`/bookings/${id}/confirm-payment`);
  },

  updateStatus: async (id: string, status: string): Promise<void> => {
    await apiClient.patch(`/admin/bookings/${id}/status`, { status });
  },
};
