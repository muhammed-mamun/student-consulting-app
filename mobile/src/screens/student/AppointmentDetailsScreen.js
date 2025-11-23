import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { getAppointmentById, cancelAppointment } from '../../services/api/appointmentService';
import { useTheme } from '../../context/ThemeContext';

const AppointmentDetailsScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { theme } = useTheme();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointmentDetails();
  }, []);

  const loadAppointmentDetails = async () => {
    try {
      const response = await getAppointmentById(id);
      if (response.success) {
        setAppointment(response.data);
      }
    } catch (error) {
      console.error('Error loading appointment:', error);
      Alert.alert('Error', 'Failed to load appointment details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelAppointment(id);
              Alert.alert('Success', 'Appointment cancelled successfully', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel appointment');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  if (loading) {
    return (
      <View style={styles(theme).centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!appointment) {
    return (
      <View style={styles(theme).centered}>
        <Text style={styles(theme).errorText}>Appointment not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles(theme).container}>
      <View style={styles(theme).header}>
        <View style={[styles(theme).statusBadge, { backgroundColor: getStatusColor(appointment.status) + '20' }]}>
          <Text style={[styles(theme).statusText, { color: getStatusColor(appointment.status) }]}>
            {appointment.status}
          </Text>
        </View>
      </View>

      <View style={styles(theme).section}>
        <Text style={styles(theme).sectionTitle}>Advisor Information</Text>
        <View style={styles(theme).infoCard}>
          <Text style={styles(theme).advisorName}>{appointment.advisor?.name || 'N/A'}</Text>
          <Text style={styles(theme).advisorDepartment}>{appointment.advisor?.department || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles(theme).section}>
        <Text style={styles(theme).sectionTitle}>Appointment Details</Text>
        <View style={styles(theme).infoCard}>
          <View style={styles(theme).infoRow}>
            <Text style={styles(theme).infoLabel}>📅 Date</Text>
            <Text style={styles(theme).infoValue}>{formatDate(appointment.appointmentDate)}</Text>
          </View>
          <View style={styles(theme).divider} />
          <View style={styles(theme).infoRow}>
            <Text style={styles(theme).infoLabel}>🕐 Time</Text>
            <Text style={styles(theme).infoValue}>{formatTime(appointment.appointmentTime)}</Text>
          </View>
          <View style={styles(theme).divider} />
          <View style={styles(theme).infoRow}>
            <Text style={styles(theme).infoLabel}>📋 Category</Text>
            <Text style={styles(theme).infoValue}>{appointment.issueCategory}</Text>
          </View>
        </View>
      </View>

      <View style={styles(theme).section}>
        <Text style={styles(theme).sectionTitle}>Issue Description</Text>
        <View style={styles(theme).infoCard}>
          <Text style={styles(theme).description}>{appointment.issueDescription}</Text>
        </View>
      </View>

      {appointment.status === 'Pending' && (
        <View style={styles(theme).actions}>
          <TouchableOpacity
            style={styles(theme).cancelButton}
            onPress={handleCancel}
          >
            <Text style={styles(theme).cancelButtonText}>Cancel Appointment</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
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
  errorText: {
    color: theme.colors.error,
    fontSize: 16,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  advisorName: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  advisorDepartment: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 2,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 8,
  },
  description: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 22,
  },
  actions: {
    padding: 20,
    paddingBottom: 40,
  },
  cancelButton: {
    backgroundColor: theme.colors.error,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AppointmentDetailsScreen;

