const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { verifyJWT } = require('../middleware/auth');

// Get notifications
router.get('/', verifyJWT, notificationController.getNotifications);

// Mark notification as read
router.put('/:id/read', verifyJWT, notificationController.markAsRead);

// Mark all notifications as read
router.put('/mark-all-read', verifyJWT, notificationController.markAllAsRead);

// Delete notification
router.delete('/:id', verifyJWT, notificationController.deleteNotification);

// Register push token
router.post('/register-token', verifyJWT, notificationController.registerPushToken);

module.exports = router;
