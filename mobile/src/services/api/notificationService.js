import apiClient from './apiClient';

/**
 * Get notifications
 */
export const getNotifications = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/notifications?${params}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (id) => {
  try {
    const response = await apiClient.put(`/notifications/${id}/read`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await apiClient.put('/notifications/read-all');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (id) => {
  try {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
