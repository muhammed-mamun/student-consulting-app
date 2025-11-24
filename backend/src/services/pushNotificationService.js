/**
 * Push Notification Service using Expo Push Notifications
 * Sends real-time notifications to users' devices
 */

const { Expo } = require('expo-server-sdk');

// Create a new Expo SDK client
const expo = new Expo();

/**
 * Send push notification to a single device
 * @param {string} pushToken - Expo push token
 * @param {string} title - Notification title
 * @param {string} body - Notification message
 * @param {object} data - Additional data to send with notification
 * @returns {Promise<object>} - Result of push notification
 */
const sendPushNotification = async (pushToken, title, body, data = {}) => {
    try {
        // Check if token is valid
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            return { success: false, error: 'Invalid push token' };
        }

        // Create the message
        const message = {
            to: pushToken,
            sound: 'default',
            title: title,
            body: body,
            data: data,
            priority: 'high',
            channelId: 'default',
        };

        // Send the notification
        const chunks = expo.chunkPushNotifications([message]);
        const tickets = [];

        for (const chunk of chunks) {
            try {
                const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
            } catch (error) {
                console.error('Error sending push notification chunk:', error);
            }
        }

        console.log('✅ Push notification sent:', { title, to: pushToken });
        return { success: true, tickets };
    } catch (error) {
        console.error('❌ Error sending push notification:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Send push notifications to multiple devices
 * @param {Array<string>} pushTokens - Array of Expo push tokens
 * @param {string} title - Notification title
 * @param {string} body - Notification message
 * @param {object} data - Additional data to send with notification
 * @returns {Promise<object>} - Result of push notifications
 */
const sendBulkPushNotifications = async (pushTokens, title, body, data = {}) => {
    try {
        // Filter out invalid tokens
        const validTokens = pushTokens.filter(token => Expo.isExpoPushToken(token));

        if (validTokens.length === 0) {
            console.warn('No valid push tokens provided');
            return { success: false, error: 'No valid push tokens' };
        }

        // Create messages for all tokens
        const messages = validTokens.map(token => ({
            to: token,
            sound: 'default',
            title: title,
            body: body,
            data: data,
            priority: 'high',
            channelId: 'default',
        }));

        // Send in chunks
        const chunks = expo.chunkPushNotifications(messages);
        const tickets = [];

        for (const chunk of chunks) {
            try {
                const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
            } catch (error) {
                console.error('Error sending push notification chunk:', error);
            }
        }

        console.log(`✅ Sent ${validTokens.length} push notifications:`, title);
        return { success: true, tickets, count: validTokens.length };
    } catch (error) {
        console.error('❌ Error sending bulk push notifications:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Validate push token format
 * @param {string} pushToken - Token to validate
 * @returns {boolean} - True if valid
 */
const isValidPushToken = (pushToken) => {
    return Expo.isExpoPushToken(pushToken);
};

module.exports = {
    sendPushNotification,
    sendBulkPushNotifications,
    isValidPushToken,
};
