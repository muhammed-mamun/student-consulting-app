import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// CHANGE 1: Remove 'getAuth' from here. We don't want the default one.
import { onAuthStateChanged } from 'firebase/auth'; 

// CHANGE 2: Import the specific 'auth' we configured in your firebase.js file
// Note: You might need to adjust '../firebase' depending on where that file is. 
import { auth } from '../config/firebase';
import { login, register, logout as logoutService, getCurrentUser } from '../services/api/authService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const unsubscribe = checkAuthState();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const checkAuthState = async () => {
    try {
      // CHANGE 3: Deleted "const auth = getAuth();"
      // We don't need to create it anymore because we imported it at the top!
      
      // CHANGE 4: Pass our imported 'auth' variable here
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const storedToken = await AsyncStorage.getItem('authToken');
          if (storedToken) {
            try {
              const userData = await getCurrentUser();
              setUser(userData.data);
              setToken(storedToken);
            } catch (error) {
              console.error('Error getting user data:', error);
              await AsyncStorage.removeItem('authToken');
              setUser(null);
              setToken(null);
            }
          }
        } else {
          setUser(null);
          setToken(null);
        }
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error checking auth state:', error);
      setLoading(false);
    }
  };

  const loginUser = async (email, password) => {
    try {
      const result = await login(email, password);
      
      if (result.success && result.data) {
        // Store token
        await AsyncStorage.setItem('authToken', result.data.token);
        setToken(result.data.token);
        setUser(result.data.user);
        return result;
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  const registerUser = async (userData) => {
    try {
      const result = await register(userData);
      
      if (result.success && result.data) {
        // Store token
        await AsyncStorage.setItem('authToken', result.data.token);
        setToken(result.data.token);
        setUser(result.data.user);
        return result;
      } else {
        throw new Error(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutService();
      await AsyncStorage.removeItem('authToken');
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      await AsyncStorage.removeItem('authToken');
      setUser(null);
      setToken(null);
      throw error;
    }
  };

  const value = {
    user,
    token,
    loading,
    login: loginUser,
    register: registerUser,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};