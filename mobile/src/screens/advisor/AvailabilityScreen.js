import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AvailabilityScreen = () => {
  // TODO: Implement availability management
  // For now, just display a placeholder

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Availability</Text>
      <Text>Availability management coming soon...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default AvailabilityScreen;

