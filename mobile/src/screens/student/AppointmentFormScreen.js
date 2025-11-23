import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
// Conditionally import DateTimePicker - will be undefined if native module not available
let DateTimePicker;
try {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
} catch (e) {
  console.warn('DateTimePicker not available:', e.message);
  DateTimePicker = null;
}
import { createAppointment } from '../../services/api/appointmentService';
import { useTheme } from '../../context/ThemeContext';

const AppointmentFormScreen = ({ route, navigation }) => {
  const { advisor } = route.params;
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    issueCategory: '',
    issueDescription: '',
  });
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  const handleSubmit = async () => {
    // Validation
    if (!formData.appointmentDate || !formData.appointmentTime || !formData.issueCategory || !formData.issueDescription) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    // Validate date is not in the past
    const selectedDate = new Date(formData.appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      Alert.alert('Validation Error', 'Appointment date cannot be in the past');
      return;
    }

    try {
      setLoading(true);
      const response = await createAppointment({
        advisorId: advisor.id,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        issueCategory: formData.issueCategory,
        issueDescription: formData.issueDescription,
      });

      if (response.success) {
        Alert.alert(
          'Success',
          'Appointment request submitted successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('AppointmentsList'),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Appointment creation error:', error);
      let errorMessage = 'Failed to create appointment. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Could not reach the server. Please check your connection.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Format time to HH:MM:SS (PostgreSQL TIME format)
  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = '00'; // Default to 00 seconds
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
      setFormData({ ...formData, appointmentDate: formatDate(date) });
    }
  };

  const handleTimeChange = (event, time) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (time) {
      setSelectedTime(time);
      setFormData({ ...formData, appointmentTime: formatTime(time) });
    }
  };

  const styles = createStyles(theme);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Book Appointment</Text>
          <Text style={styles.subtitle}>
            with {advisor.user?.firstName} {advisor.user?.lastName}
          </Text>
          <Text style={styles.department}>
            {advisor.department} - {advisor.designation}
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Appointment Date *</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.pickerText, !formData.appointmentDate && styles.placeholder]}>
              {formData.appointmentDate || 'Select Date'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && DateTimePicker && (
            Platform.OS === 'android' ? (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            ) : (
              <Modal
                visible={showDatePicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowDatePicker(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="spinner"
                      onChange={handleDateChange}
                      minimumDate={new Date()}
                      style={styles.datePickerIOS}
                    />
                    <View style={styles.pickerButtons}>
                      <TouchableOpacity
                        style={styles.pickerButtonConfirm}
                        onPress={() => setShowDatePicker(false)}
                      >
                        <Text style={styles.pickerButtonText}>Done</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            )
          )}
          {showDatePicker && !DateTimePicker && (
            <Modal
              visible={showDatePicker}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowDatePicker(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.label}>Enter Date (YYYY-MM-DD)</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.appointmentDate}
                    onChangeText={(text) => setFormData({ ...formData, appointmentDate: text })}
                    placeholder="2025-11-20"
                    placeholderTextColor={theme.colors.textTertiary}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    style={styles.pickerButtonConfirm}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={styles.pickerButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          <Text style={styles.label}>Appointment Time *</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={[styles.pickerText, !formData.appointmentTime && styles.placeholder]}>
              {formData.appointmentTime || 'Select Time'}
            </Text>
          </TouchableOpacity>
          {showTimePicker && DateTimePicker && (
            Platform.OS === 'android' ? (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display="default"
                onChange={handleTimeChange}
                is24Hour={false}
              />
            ) : (
              <Modal
                visible={showTimePicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowTimePicker(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <DateTimePicker
                      value={selectedTime}
                      mode="time"
                      display="spinner"
                      onChange={handleTimeChange}
                      is24Hour={false}
                      style={styles.datePickerIOS}
                    />
                    <View style={styles.pickerButtons}>
                      <TouchableOpacity
                        style={styles.pickerButtonConfirm}
                        onPress={() => setShowTimePicker(false)}
                      >
                        <Text style={styles.pickerButtonText}>Done</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            )
          )}
          {showTimePicker && !DateTimePicker && (
            <Modal
              visible={showTimePicker}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowTimePicker(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.label}>Enter Time (HH:MM:SS)</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.appointmentTime}
                    onChangeText={(text) => setFormData({ ...formData, appointmentTime: text })}
                    placeholder="14:30:00"
                    placeholderTextColor={theme.colors.textTertiary}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    style={styles.pickerButtonConfirm}
                    onPress={() => setShowTimePicker(false)}
                  >
                    <Text style={styles.pickerButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          <Text style={styles.label}>Issue Category *</Text>
          <TextInput
            style={styles.input}
            value={formData.issueCategory}
            onChangeText={(text) => setFormData({ ...formData, issueCategory: text })}
            placeholder="e.g., Course Issues, Thesis Discussion, Personal Counseling"
            placeholderTextColor={theme.colors.textTertiary}
            keyboardType="default"
          />

          <Text style={styles.label}>Issue Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.issueDescription}
            onChangeText={(text) => setFormData({ ...formData, issueDescription: text })}
            placeholder="Describe your issue or concern..."
            placeholderTextColor={theme.colors.textTertiary}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 20,
  },
  header: {
    backgroundColor: theme.colors.card,
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 5,
  },
  department: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  form: {
    backgroundColor: theme.colors.card,
    padding: 20,
    borderRadius: 8,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 15,
    color: theme.colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
  },
  textArea: {
    height: 120,
    paddingTop: 15,
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 15,
    backgroundColor: theme.colors.surface,
    marginBottom: 10,
  },
  pickerText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  placeholder: {
    color: theme.colors.textTertiary,
  },
  datePickerIOS: {
    backgroundColor: theme.colors.card,
    marginVertical: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  pickerButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  pickerButtonConfirm: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  pickerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AppointmentFormScreen;

