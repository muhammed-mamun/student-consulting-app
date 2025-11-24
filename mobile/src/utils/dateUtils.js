/**
 * Utility functions for date and time formatting in Bangladesh Time (BDT/GMT+6)
 */

/**
 * Convert UTC timestamp to Bangladesh Time
 * @param {string} utcTimestamp - ISO timestamp from database
 * @returns {Date} - Date object in Bangladesh timezone
 */
export const toBDT = (utcTimestamp) => {
    if (!utcTimestamp) return new Date();

    const date = new Date(utcTimestamp);
    // Bangladesh is UTC+6
    const bdtOffset = 6 * 60; // 6 hours in minutes
    const localOffset = date.getTimezoneOffset(); // Local timezone offset in minutes
    const totalOffset = bdtOffset + localOffset;

    return new Date(date.getTime() + totalOffset * 60 * 1000);
};

/**
 * Format date to Bangladesh locale
 * @param {string} dateString - ISO date string
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export const formatDateBDT = (dateString, options = {}) => {
    if (!dateString) return '';

    const defaultOptions = {
        timeZone: 'Asia/Dhaka',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options
    };

    return new Date(dateString).toLocaleDateString('en-BD', defaultOptions);
};

/**
 * Format time to Bangladesh locale
 * @param {string} timeString - Time string (HH:MM:SS or ISO timestamp)
 * @returns {string} - Formatted time string (12-hour format)
 */
export const formatTimeBDT = (timeString) => {
    if (!timeString) return '';

    // If it's just a time string (HH:MM:SS), create a date with it
    let date;
    if (timeString.includes('T') || timeString.includes('Z')) {
        // It's an ISO timestamp
        date = new Date(timeString);
    } else {
        // It's just a time string
        const [hours, minutes] = timeString.split(':');
        date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes), 0);
    }

    return date.toLocaleTimeString('en-BD', {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

/**
 * Format date and time together
 * @param {string} timestamp - ISO timestamp
 * @returns {string} - Formatted date and time
 */
export const formatDateTimeBDT = (timestamp) => {
    if (!timestamp) return '';

    return new Date(timestamp).toLocaleString('en-BD', {
        timeZone: 'Asia/Dhaka',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

/**
 * Get relative time (e.g., "2 hours ago")
 * @param {string} timestamp - ISO timestamp
 * @returns {string} - Relative time string
 */
export const getRelativeTimeBDT = (timestamp) => {
    if (!timestamp) return '';

    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return formatDateBDT(timestamp, { month: 'short', day: 'numeric' });
};

/**
 * Get current date in Bangladesh timezone (for date pickers)
 * @returns {Date} - Current date in BDT
 */
export const getCurrentDateBDT = () => {
    const now = new Date();
    const bdtString = now.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
    return new Date(bdtString);
};

/**
 * Format date for API (YYYY-MM-DD)
 * @param {Date} date - Date object
 * @returns {string} - Formatted date string
 */
export const formatDateForAPI = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Format time for API (HH:MM:SS)
 * @param {Date} date - Date object
 * @returns {string} - Formatted time string
 */
export const formatTimeForAPI = (date) => {
    if (!date) return '';
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = '00';
    return `${hours}:${minutes}:${seconds}`;
};
