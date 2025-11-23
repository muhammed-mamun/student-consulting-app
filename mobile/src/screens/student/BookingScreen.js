import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { getAdvisors } from '../../services/api/advisorService';
import { createAppointment } from '../../services/api/appointmentService';
import { useTheme } from '../../context/ThemeContext';

const BookingScreen = ({ navigation }) => {
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    loadAdvisors();
  }, []);

  const loadAdvisors = async () => {
    try {
      const response = await getAdvisors();
      console.log('Advisors response:', response);
      
      if (response.success && response.data) {
        setAdvisors(response.data);
      } else {
        setAdvisors([]);
        Alert.alert('Info', 'No advisors available at the moment.');
      }
    } catch (error) {
      console.error('Error loading advisors:', error);
      let errorMessage = 'Failed to load advisors. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Could not reach the server. Please check your connection.';
      }
      
      Alert.alert('Error', errorMessage);
      setAdvisors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = (advisor) => {
    // Navigate to appointment booking form
    navigation.navigate('AppointmentForm', { advisor });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading advisors...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select an Advisor</Text>
      </View>

      <View style={styles.content}>
        {advisors.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No advisors available</Text>
            <Text style={styles.emptySubtext}>
              Please check back later or contact support.
            </Text>
          </View>
        ) : (
          advisors.map((advisor) => (
            <TouchableOpacity
              key={advisor.id}
              style={styles.card}
              onPress={() => handleBookAppointment(advisor)}
            >
              <Text style={styles.cardTitle}>
                {advisor.user?.firstName || 'N/A'} {advisor.user?.lastName || ''}
              </Text>
              <Text style={styles.cardDescription}>
                {advisor.department || 'N/A'} - {advisor.designation || 'N/A'}
              </Text>
              {advisor.bio && (
                <Text style={styles.bio}>{advisor.bio}</Text>
              )}
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: 20,
  },
  header: {
    padding: 20,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: theme.colors.card,
    padding: 20,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.mode === 'dark' ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: theme.colors.text,
  },
  cardDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 5,
  },
  bio: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    marginTop: 5,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textTertiary,
    textAlign: 'center',
  },
});

export default BookingScreen;

