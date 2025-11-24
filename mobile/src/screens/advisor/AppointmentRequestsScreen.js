import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { getAppointments } from '../../services/api/appointmentService';
import { approveAppointment, rejectAppointment } from '../../services/api/appointmentService';
import { useTheme } from '../../context/ThemeContext';

const AppointmentRequestsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      const response = await getAppointments({ status: 'Pending' });
      setAppointments(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load appointments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAppointments(false);
  };

  const handleApprove = async (id) => {
    try {
      await approveAppointment(id);
      Alert.alert('Success', 'Appointment approved');
      loadAppointments();
    } catch (error) {
      Alert.alert('Error', 'Failed to approve appointment');
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectAppointment(id, 'Rejected by advisor');
      Alert.alert('Success', 'Appointment rejected');
      loadAppointments();
    } catch (error) {
      Alert.alert('Error', 'Failed to reject appointment');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      timeZone: 'Asia/Dhaka',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const renderAppointment = ({ item }) => (
    <View style={styles(theme).card}>
      <View style={styles(theme).cardHeader}>
        <Text style={styles(theme).cardTitle}>
          👤 {item.student?.name || 'Student'}
        </Text>
      </View>
      <Text style={styles(theme).cardDescription}>
        📅 {formatDate(item.appointmentDate)} at {formatTime(item.appointmentTime)}
      </Text>
      <View style={styles(theme).categoryBadge}>
        <Text style={styles(theme).categoryText}>📋 {item.issueCategory}</Text>
      </View>
      <Text style={styles(theme).description}>{item.issueDescription}</Text>

      <View style={styles(theme).actions}>
        <TouchableOpacity
          style={[styles(theme).button, styles(theme).approveButton]}
          onPress={() => handleApprove(item.id)}
        >
          <Text style={styles(theme).buttonText}>✓ Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles(theme).button, styles(theme).rejectButton]}
          onPress={() => handleReject(item.id)}
        >
          <Text style={styles(theme).buttonText}>✕ Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles(theme).centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles(theme).container}>
      <FlatList
        data={appointments}
        renderItem={renderAppointment}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={appointments.length === 0 ? styles(theme).emptyContainer : styles(theme).list}
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
            <Text style={styles(theme).emptyIcon}>✅</Text>
            <Text style={styles(theme).emptyTitle}>All Clear!</Text>
            <Text style={styles(theme).emptyMessage}>
              No pending appointment requests at the moment
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = (theme) => StyleSheet.create({
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
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: theme.colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  cardDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  categoryBadge: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  description: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 16,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: theme.colors.success,
  },
  rejectButton: {
    backgroundColor: theme.colors.error,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
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

export default AppointmentRequestsScreen;

