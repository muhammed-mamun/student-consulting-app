import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '../../services/api/notificationService';
import { useTheme } from '../../context/ThemeContext';

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      const response = await getNotifications();
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      Alert.alert('Error', 'Failed to load notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications(false);
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications(false);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
      Alert.alert('Success', 'All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      Alert.alert('Error', 'Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNotification(id);
              setNotifications((prev) => prev.filter((notif) => notif.id !== id));
            } catch (error) {
              console.error('Error deleting notification:', error);
              Alert.alert('Error', 'Failed to delete notification');
            }
          },
        },
      ]
    );
  };

  const handleNotificationPress = (notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }

    if (notification.appointmentId) {
      navigation.navigate('AppointmentDetails', { id: notification.appointmentId });
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment_request':
        return '📅';
      case 'appointment_approved':
        return '✅';
      case 'appointment_rejected':
        return '❌';
      case 'appointment_completed':
        return '✔️';
      default:
        return '🔔';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[
        styles(theme).notificationItem,
        !item.isRead && styles(theme).unreadNotification,
      ]}
      onPress={() => handleNotificationPress(item)}
      onLongPress={() => handleDelete(item.id)}
    >
      <View style={styles(theme).notificationIcon}>
        <Text style={styles(theme).iconText}>{getNotificationIcon(item.type)}</Text>
      </View>
      <View style={styles(theme).notificationContent}>
        <View style={styles(theme).notificationHeader}>
          <Text style={styles(theme).notificationTitle}>{item.title}</Text>
          <Text style={styles(theme).notificationTime}>{formatDate(item.createdAt)}</Text>
        </View>
        <Text style={styles(theme).notificationMessage}>{item.message}</Text>
        {!item.isRead && <View style={styles(theme).unreadDot} />}
      </View>
    </TouchableOpacity>
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <View style={styles(theme).centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles(theme).container}>
      {notifications.length > 0 && unreadCount > 0 && (
        <View style={styles(theme).header}>
          <Text style={styles(theme).unreadText}>
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </Text>
          <TouchableOpacity onPress={handleMarkAllAsRead}>
            <Text style={styles(theme).markAllButton}>Mark all as read</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={
          notifications.length === 0 ? styles(theme).emptyContainer : styles(theme).listContainer
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles(theme).emptyState}>
            <Text style={styles(theme).emptyIcon}>🔔</Text>
            <Text style={styles(theme).emptyTitle}>No notifications</Text>
            <Text style={styles(theme).emptyMessage}>
              You'll see notifications here when you have updates
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    unreadText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
    },
    markAllButton: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.primary,
    },
    listContainer: {
      padding: 16,
    },
    notificationItem: {
      flexDirection: 'row',
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    unreadNotification: {
      backgroundColor: theme.colors.surface,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
    },
    notificationIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    iconText: {
      fontSize: 24,
    },
    notificationContent: {
      flex: 1,
      position: 'relative',
    },
    notificationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 4,
    },
    notificationTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text,
      flex: 1,
      marginRight: 8,
    },
    notificationTime: {
      fontSize: 12,
      color: theme.colors.textTertiary,
    },
    notificationMessage: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    unreadDot: {
      position: 'absolute',
      top: 4,
      right: 0,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.primary,
    },
    emptyContainer: {
      flex: 1,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
      paddingVertical: 60,
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 8,
    },
    emptyMessage: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
  });

export default NotificationsScreen;

