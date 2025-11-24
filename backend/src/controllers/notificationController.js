const supabase = require('../config/supabase');

/**
 * Get notifications
 */
const getNotifications = async (req, res) => {
  try {
    const { uid } = req.user;
    const { isRead, limit = 20, offset = 0 } = req.query;

    // Get user ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('firebase_uid', uid)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by read status
    if (isRead !== undefined) {
      query = query.eq('is_read', isRead === 'true');
    }

    const { data: notifications, error } = await query;

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to get notifications',
      });
    }

    res.json({
      success: true,
      data: notifications.map(notif => ({
        id: notif.id,
        userId: notif.user_id,
        appointmentId: notif.appointment_id,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        isRead: notif.is_read,
        createdAt: notif.created_at,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get notifications',
    });
  }
};

/**
 * Mark notification as read
 */
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { uid } = req.user;

    // Get user ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('firebase_uid', uid)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update notification
    const { data: notification, error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error || !notification) {
      return res.status(400).json({
        success: false,
        message: error?.message || 'Failed to mark notification as read',
      });
    }

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: {
        id: notification.id,
        isRead: notification.is_read,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to mark notification as read',
    });
  }
};

/**
 * Mark all notifications as read
 */
const markAllAsRead = async (req, res) => {
  try {
    const { uid } = req.user;

    // Get user ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('firebase_uid', uid)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update all notifications
    const { error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
      })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to mark all notifications as read',
      });
    }

    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to mark all notifications as read',
    });
  }
};

/**
 * Delete notification
 */
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { uid } = req.user;

    // Get user ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('firebase_uid', uid)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Delete notification
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete notification',
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete notification',
    });
  }
};

/**
 * Register/Update push token
 */
const registerPushToken = async (req, res) => {
  try {
    const { uid } = req.user;
    const { pushToken } = req.body;

    if (!pushToken) {
      return res.status(400).json({
        success: false,
        message: 'Push token is required',
      });
    }

    // Update user's push token
    const { data: user, error } = await supabase
      .from('users')
      .update({
        push_token: pushToken,
      })
      .eq('firebase_uid', uid)
      .select()
      .single();

    if (error || !user) {
      return res.status(400).json({
        success: false,
        message: error?.message || 'Failed to register push token',
      });
    }

    console.log(`✅ Push token registered for user ${user.email}`);

    res.json({
      success: true,
      message: 'Push token registered successfully',
    });
  } catch (error) {
    console.error('Error registering push token:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to register push token',
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  registerPushToken,
};

