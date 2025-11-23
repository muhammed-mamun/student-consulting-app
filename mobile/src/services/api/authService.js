import apiClient from './apiClient';
// 1. Import only the auth functions we need (removed getAuth)
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

// 2. Import the specific 'auth' instance you configured with AsyncStorage
// (Make sure this points to the file where you called initializeAuth)
import { auth } from '../../config/firebase'; 

/**
 * Register a new user
 */
export const register = async (userData) => {
  try {
    // 3. Use the imported 'auth' instance
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );

    const firebaseUid = userCredential.user.uid;

    // Register user in backend
    const response = await apiClient.post('/auth/register', {
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      phoneNumber: userData.phoneNumber,
      firebase_uid: firebaseUid,
    });

    return response.data;
  } catch (error) {
    // If backend registration fails, delete the Firebase user
    if (error.response && error.response.status !== 200) {
      try {
        await signOut(auth);
      } catch (signOutError) {
        console.error('Error signing out after failed registration:', signOutError);
      }
    }
    throw error;
  }
};

/**
 * Login user
 */
export const login = async (email, password) => {
  try {
    // 4. Use the imported 'auth' instance
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseToken = await userCredential.user.getIdToken();

    // Login with backend to get JWT token
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = async () => {
  try {
    // 5. Use the imported 'auth' instance
    await signOut(auth);
    
    // Logout from backend
    await apiClient.post('/auth/logout');
  } catch (error) {
    throw error;
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Refresh token
 */
export const refreshToken = async () => {
  try {
    const response = await apiClient.post('/auth/refresh-token');
    return response.data;
  } catch (error) {
    throw error;
  }
};