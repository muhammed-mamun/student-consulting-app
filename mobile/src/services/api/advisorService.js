import apiClient from './apiClient';

/**
 * Get all advisors
 */
export const getAdvisors = async () => {
  try {
    const response = await apiClient.get('/advisors');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get advisor by ID
 */
export const getAdvisorById = async (id) => {
  try {
    const response = await apiClient.get(`/advisors/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get advisor availability
 */
export const getAdvisorAvailability = async (id, startDate, endDate) => {
  try {
    const response = await apiClient.get(`/advisors/${id}/availability`, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update advisor profile
 */
export const updateAdvisorProfile = async (profileData) => {
  try {
    const response = await apiClient.put('/advisors/profile', profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

