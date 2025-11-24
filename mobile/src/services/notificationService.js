/**
 * Mobile Push Notification Service
 * Handles Expo push notification registration and management
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import apiClient from './apiClient';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

/**
 * Request notification permissions
 * @returns {Promise<boolean>} - True if permission granted
 */
export const requestNotificationPermissions = async () => {
    try {
        if (!Device.isDevice) {
            console.warn('Push notifications only work on physical devices');
            return false;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.warn('Permission for push notifications was denied');
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error requesting notification permissions:', error);
        return false;
    }
};

/**
 * Get Expo Push Token
 * @returns {Promise<string|null>} - Push token or null
 */
export const getExpoPushToken = async () => {
    try {
        if (!Device.isDevice) {
            console.warn('Push notifications only work on physical devices');
            return null;
        }

        const token = await Notifications.getExpoPushTokenAsync({
            projectId: 'your-project-id', // Replace with your Expo project ID
        });

        console.log('✅ Expo Push Token:', token.data);
        return token.data;
    } catch (error) {
        console.error('❌ Error getting push token:', error);
        return null;
    }
};

/**
 * Register push token with backend
 * @param {string} pushToken - Expo push token
 * @returns {Promise<boolean>} - True if successful
 */
export const registerPushToken = async (pushToken) => {
    try {
        if (!pushToken) {
            console.warn('No push token to register');
            return false;
        }

        const response = await apiClient.post('/notifications/register-token', {
            pushToken,
        });

        if (response.data.success) {
            console.log('✅ Push token registered with backend');
            return true;
        }

        return false;
    } catch (error) {
        console.error('❌ Error registering push token:', error);
        return false;
    }
};

/**
 * Initialize push notifications
 * Call this when user logs in
 * @returns {Promise<string|null>} - Push token or null
 */
export const initializePushNotifications = async () => {
    try {
        // Request permissions
        const hasPermission = await requestNotificationPermissions();
        if (!hasPermission) {
            return null;
        }

        // Get push token
        const pushToken = await getExpoPushToken();
        if (!pushToken) {
            return null;
        }

        // Register with backend
        await registerPushToken(pushToken);

        // Configure Android notification channel
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'Default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return pushToken;
    } catch (error) {
        console.error('Error initializing push notifications:', error);
        return null;
    }
};

/**
 * Add notification received listener
 * @param {Function} callback - Function to call when notification is received
 * @returns {Subscription} - Subscription object
 */
export const addNotificationReceivedListener = (callback) => {
    return Notifications.addNotificationReceivedListener(callback);
};

/**
 * Add notification response listener (when user taps notification)
 * @param {Function} callback - Function to call when notification is tapped
 * @returns {Subscription} - Subscription object
 */
export const addNotificationResponseListener = (callback) => {
    return Notifications.addNotificationResponseReceivedListener(callback);
};

/**
 * Remove notification listeners
 * @param {Subscription} subscription - Subscription to remove
 */
export const removeNotificationListener = (subscription) => {
    if (subscription) {
        subscription.remove();
    }
};
