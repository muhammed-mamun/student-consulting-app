import apiClient from './apiClient';

/**
 * Create appointment
 */
export const createAppointment = async (appointmentData) => {
  try {
    const response = await apiClient.post('/appointments', appointmentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get appointments
 */
export const getAppointments = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/appointments?${params}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get appointment by ID
 */
export const getAppointmentById = async (id) => {
  try {
    const response = await apiClient.get(`/appointments/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Approve appointment
 */
export const approveAppointment = async (id) => {
  try {
    const response = await apiClient.put(`/appointments/${id}/approve`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reject appointment
 */
export const rejectAppointment = async (id, reason) => {
  try {
    const response = await apiClient.put(`/appointments/${id}/reject`, { reason });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Complete appointment
 */
export const completeAppointment = async (id) => {
  try {
    const response = await apiClient.put(`/appointments/${id}/complete`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Cancel appointment
 */
export const cancelAppointment = async (id) => {
  try {
    const response = await apiClient.delete(`/appointments/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

