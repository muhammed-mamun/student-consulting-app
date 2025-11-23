const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { verifyJWT } = require('../middleware/auth');

// Get notifications
router.get('/', verifyJWT, notificationController.getNotifications);

// Mark notification as read
router.put('/:id/read', verifyJWT, notificationController.markAsRead);

// Mark all notifications as read
router.put('/read-all', verifyJWT, notificationController.markAllAsRead);

// Delete notification
router.delete('/:id', verifyJWT, notificationController.deleteNotification);

module.exports = router;

