import apiClient from './client';
import { AdminStats, User, Booking } from '../types';

export const adminService = {
  // Dashboard stats
  getStats: async (): Promise<AdminStats> => {
    const response = await apiClient.get('/admin/stats');
    return response.data.data;
  },

  // Users
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/admin/users');
    return response.data.data;
  },

  updateUserStatus: async (id: string, status: string): Promise<void> => {
    await apiClient.patch(`/admin/users/${id}/status`, { status });
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/users/${id}`);
  },

  // Sellers
  getAllSellers: async (): Promise<any[]> => {
    const response = await apiClient.get('/admin/sellers');
    return response.data.data;
  },

  updateSellerStatus: async (id: string, status: string): Promise<void> => {
    await apiClient.patch(`/admin/sellers/${id}/status`, { status });
  },

  // Bookings
  getAllBookings: async (): Promise<Booking[]> => {
    const response = await apiClient.get('/admin/bookings');
    return response.data.data;
  },

  updateBookingStatus: async (id: string, status: string): Promise<void> => {
    await apiClient.patch(`/admin/bookings/${id}/status`, { status });
  },

  confirmPayment: async (id: string): Promise<void> => {
    await apiClient.patch(`/bookings/${id}/confirm-payment`);
  },

  // Listings
  getAllAccommodations: async (filters?: any): Promise<any[]> => {
    const response = await apiClient.get('/accommodations', { params: { ...filters } });
    return response.data.data;
  },

  getAllVehicles: async (filters?: any): Promise<any[]> => {
    const response = await apiClient.get('/vehicles', { params: filters });
    return response.data.data;
  },

  getAllHouses: async (filters?: any): Promise<any[]> => {
    const response = await apiClient.get('/houses', { params: filters });
    return response.data.data;
  },

  updateListingStatus: async (type: 'accommodations' | 'vehicles' | 'houses', id: string, status: string): Promise<void> => {
    await apiClient.patch(`/admin/${type}/${id}/status`, { status });
  },

  // Commissions / Payments
  getAllCommissions: async (): Promise<any[]> => {
    const response = await apiClient.get('/admin/commissions');
    return response.data.data;
  },

  markCommissionPaid: async (id: string, formData: FormData): Promise<void> => {
    await apiClient.patch(`/admin/commissions/${id}/mark-paid`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
