import apiClient from './client';
import { AuthResponse } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data.data;
  },

  register: async (data: {
    email: string;
    password: string;
    role: 'client' | 'seller' | 'agent';
    fullName: string;
    phone?: string;
    nationalId?: string;
  }): Promise<{ message: string; userId: string }> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data.data;
  },

  verifyEmail: async (userId: string, otp: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/verify-email', { userId, otp });
    return response.data.data;
  },

  resendOtp: async (userId: string): Promise<void> => {
    await apiClient.post('/auth/resend-otp', { userId });
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post('/auth/forgot-password', { email });
  },

  resetPassword: async (email: string, otp: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/reset-password', { email, otp, newPassword });
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/change-password', { currentPassword, newPassword });
  },
};
