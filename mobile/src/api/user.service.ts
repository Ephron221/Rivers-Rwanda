import apiClient from './client';
import * as FileSystem from 'expo-file-system';
import FormData from 'form-data';

export const userService = {
  /**
   * Get current user profile
   */
  getProfile: async () => {
    const response = await apiClient.get('/users/profile');
    return response.data.data;
  },

  /**
   * Update user profile with optional image upload
   */
  updateProfile: async (data: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    profileImage?: string; // URI of the image file
  }) => {
    const formData = new FormData();

    if (data.firstName) formData.append('firstName', data.firstName);
    if (data.lastName) formData.append('lastName', data.lastName);
    if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);

    // Handle image upload
    if (data.profileImage) {
      const filename = data.profileImage.split('/').pop() || 'profile.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('profileImage', {
        uri: data.profileImage,
        name: filename,
        type,
      } as any);
    }

    const response = await apiClient.patch('/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  },

  /**
   * Change user password
   */
  changePassword: async (data: {
    oldPassword: string;
    newPassword: string;
  }) => {
    const response = await apiClient.post('/users/change-password', {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
    return response.data;
  },

  /**
   * Update notification preferences
   */
  updateNotificationPreferences: async (preferences: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    bookingNotifications?: boolean;
    promotionalNotifications?: boolean;
  }) => {
    const response = await apiClient.patch('/users/notifications', preferences);
    return response.data.data;
  },

  /**
   * Get notification preferences
   */
  getNotificationPreferences: async () => {
    const response = await apiClient.get('/users/notifications');
    return response.data.data;
  },
};
