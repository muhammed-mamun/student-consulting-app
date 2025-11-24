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
import { useTheme } from '../../context/ThemeContext';

const AppointmentsListScreen = ({ navigation }) => {
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
      const response = await getAppointments();
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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return theme.colors.warning;
      case 'accepted':
        return theme.colors.success;
      case 'rejected':
        return theme.colors.error;
      case 'completed':
        return theme.colors.primary;
      default:
        return theme.colors.textSecondary;
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
    <TouchableOpacity
      style={styles(theme).card}
      onPress={() => navigation.navigate('AppointmentDetails', { id: item.id })}
    >
      <View style={styles(theme).cardHeader}>
        <Text style={styles(theme).cardTitle}>
          {item.advisor?.name || 'Advisor'}
        </Text>
        <View style={[styles(theme).statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles(theme).statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>
      <Text style={styles(theme).cardDescription}>
        📅 {formatDate(item.appointmentDate)} at {formatTime(item.appointmentTime)}
      </Text>
      <Text style={styles(theme).category}>
        📋 {item.issueCategory}
      </Text>
    </TouchableOpacity>
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
            <Text style={styles(theme).emptyIcon}>📅</Text>
            <Text style={styles(theme).emptyTitle}>No Appointments</Text>
            <Text style={styles(theme).emptyMessage}>
              You haven't booked any appointments yet
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    flex: 1,
    marginRight: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  category: {
    fontSize: 13,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
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

export default AppointmentsListScreen;

