import React, { createContext, useContext } from 'react';

const ThemeContext = createContext({});

const lightTheme = {
  mode: 'light',
  colors: {
    primary: '#007AFF',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    card: '#FFFFFF',
    header: '#F8F8F8', // Light shade for headers
    tabBar: '#F8F8F8', // Light shade for menu/tab bar
    text: '#000000',
    textSecondary: '#666666',
    textTertiary: '#999999',
    border: '#DDDDDD',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
    shadow: '#000000',
  },
};

const darkTheme = {
  mode: 'dark',
  colors: {
    primary: '#6366F1', // Indigo - more beautiful than plain blue
    primaryDark: '#4F46E5',
    secondary: '#8B5CF6', // Purple accent
    background: '#0F0F0F', // Rich black
    surface: '#1A1A1D',
    card: '#27272A',
    header: '#18181B', // Deep charcoal for headers
    headerGradientStart: '#1E1B4B', // Deep indigo
    headerGradientEnd: '#312E81', // Rich purple-blue
    tabBar: '#18181B', // Deep charcoal for tab bar
    tabBarAccent: '#6366F1',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textTertiary: '#9CA3AF',
    border: '#27272A',
    borderLight: '#3F3F46',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    shadow: '#000000',
    glow: 'rgba(99, 102, 241, 0.3)', // Indigo glow
  },
};

export const ThemeProvider = ({ children }) => {
  // Always use dark theme - no toggle needed
  const theme = darkTheme;
  const isDarkMode = true;

  const value = {
    theme,
    isDarkMode,
    loading: false,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

