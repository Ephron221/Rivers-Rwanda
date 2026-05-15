import apiClient from './client';
import { Booking, Commission, SellerProduct } from '../types';

export const sellerService = {
  getProducts: async (): Promise<SellerProduct[]> => {
    const response = await apiClient.get('/sellers/products');
    return response.data.data;
  },

  getBookings: async (): Promise<Booking[]> => {
    const response = await apiClient.get('/sellers/bookings');
    return response.data.data;
  },

  getEarnings: async (): Promise<Commission[]> => {
    const response = await apiClient.get('/sellers/earnings');
    return response.data.data;
  },

  confirmPayoutReceipt: async (id: string): Promise<void> => {
    await apiClient.patch(`/sellers/commissions/${id}/confirm-receipt`);
  },

  rejectPayoutReceipt: async (id: string): Promise<void> => {
    await apiClient.patch(`/sellers/commissions/${id}/reject-receipt`);
  },
};
