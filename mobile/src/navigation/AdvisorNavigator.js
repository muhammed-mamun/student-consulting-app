import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AdvisorDashboardScreen from '../screens/advisor/AdvisorDashboardScreen';
import AppointmentRequestsScreen from '../screens/advisor/AppointmentRequestsScreen';
import AppointmentDetailsScreen from '../screens/advisor/AppointmentDetailsScreen';
import AvailabilityScreen from '../screens/advisor/AvailabilityScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
import NotificationsScreen from '../screens/shared/NotificationsScreen';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AdvisorStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerBackground: () => (
          <LinearGradient
            colors={[theme.colors.headerGradientStart, theme.colors.headerGradientEnd]}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        ),
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 20,
          letterSpacing: 0.5,
        },
        headerShadowVisible: true,
      }}
    >
      <Stack.Screen 
        name="AdvisorDashboard" 
        component={AdvisorDashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Stack.Screen 
        name="AppointmentRequests" 
        component={AppointmentRequestsScreen}
        options={{ title: 'Appointment Requests' }}
      />
      <Stack.Screen 
        name="AppointmentDetails" 
        component={AppointmentDetailsScreen}
        options={{ title: 'Appointment Details' }}
      />
      <Stack.Screen 
        name="Availability" 
        component={AvailabilityScreen}
        options={{ title: 'Manage Availability' }}
      />
    </Stack.Navigator>
  );
};

const AdvisorNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerBackground: () => (
          <LinearGradient
            colors={[theme.colors.headerGradientStart, theme.colors.headerGradientEnd]}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        ),
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 20,
          letterSpacing: 0.5,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.tabBar,
          borderTopWidth: 1,
          borderTopColor: theme.colors.borderLight,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
          elevation: 8,
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={AdvisorStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsScreen}
      />
    </Tab.Navigator>
  );
};

export default AdvisorNavigator;

