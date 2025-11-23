import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const AdvisorDashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { theme } = useTheme();

  return (
    <ScrollView style={styles(theme).container}>
      <View style={styles(theme).header}>
        <Text style={styles(theme).greeting}>👋</Text>
        <Text style={styles(theme).title}>Welcome, {user?.firstName}!</Text>
        <Text style={styles(theme).subtitle}>Advisor Dashboard</Text>
      </View>

      <View style={styles(theme).content}>
        <TouchableOpacity
          style={styles(theme).card}
          onPress={() => navigation.navigate('AppointmentRequests')}
        >
          <View style={styles(theme).cardIcon}>
            <Text style={styles(theme).iconText}>📋</Text>
          </View>
          <Text style={styles(theme).cardTitle}>Appointment Requests</Text>
          <Text style={styles(theme).cardDescription}>
            View and manage pending appointment requests
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles(theme).card}
          onPress={() => navigation.navigate('Availability')}
        >
          <View style={styles(theme).cardIcon}>
            <Text style={styles(theme).iconText}>📅</Text>
          </View>
          <Text style={styles(theme).cardTitle}>Manage Availability</Text>
          <Text style={styles(theme).cardDescription}>
            Set your consultation hours and availability
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 24,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: theme.colors.card,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 28,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    color: theme.colors.text,
  },
  cardDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});

export default AdvisorDashboardScreen;

