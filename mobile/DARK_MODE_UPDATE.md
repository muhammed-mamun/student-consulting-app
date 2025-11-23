# Dark Mode Implementation Guide

## What's Been Done

1. ✅ Created `ThemeContext` with light and dark themes
2. ✅ Wrapped App with `ThemeProvider`
3. ✅ Updated `ProfileScreen` with dark mode toggle
4. ✅ Updated `StudentDashboardScreen` to use theme
5. ✅ Updated `StatusBar` to reflect theme

## How to Use

Users can toggle dark mode from the **Profile** screen using the "Dark Mode" switch.

## Remaining Screens to Update

To complete dark mode support, update these screens to use `useTheme()` hook:

### Auth Screens
- `src/screens/auth/LoginScreen.js`
- `src/screens/auth/RegisterScreen.js`
- `src/screens/auth/LoadingScreen.js`

### Student Screens
- `src/screens/student/BookingScreen.js`
- `src/screens/student/AppointmentFormScreen.js`
- `src/screens/student/AppointmentsListScreen.js`
- `src/screens/student/AppointmentDetailsScreen.js`

### Advisor Screens
- `src/screens/advisor/AdvisorDashboardScreen.js`
- `src/screens/advisor/AppointmentRequestsScreen.js`
- `src/screens/advisor/AppointmentDetailsScreen.js`
- `src/screens/advisor/AvailabilityScreen.js`

### Shared Screens
- `src/screens/shared/NotificationsScreen.js`

### Navigation
- Update navigation theme colors in navigators

## Pattern to Follow

```javascript
import { useTheme } from '../../context/ThemeContext';

const MyScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Content</Text>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  text: {
    color: theme.colors.text,
  },
});
```

## Theme Colors Available

- `theme.colors.background` - Main background
- `theme.colors.surface` - Secondary background
- `theme.colors.card` - Card background
- `theme.colors.text` - Primary text
- `theme.colors.textSecondary` - Secondary text
- `theme.colors.textTertiary` - Tertiary text
- `theme.colors.border` - Borders
- `theme.colors.primary` - Primary accent
- `theme.colors.error` - Error color
- `theme.colors.success` - Success color
- `theme.colors.warning` - Warning color

