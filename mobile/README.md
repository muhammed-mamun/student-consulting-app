# Advising App Mobile
## React Native Expo Application for Connecting Students with Advisors

## Setup Instructions

### 1. Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app (for testing on mobile devices)
- Android Studio (for Android development) or Xcode (for iOS, macOS only)

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Configure Firebase
1. Create a Firebase project
2. Enable Authentication (Email/Password)
3. Add Android/iOS apps to Firebase project
4. Download configuration files:
   - Android: `google-services.json`
   - iOS: `GoogleService-Info.plist`
5. Place configuration files in the `mobile/` directory
6. Configure Firebase in your app code

### 5. Start Development Server
```bash
# Start Expo development server
expo start

# Start on Android
expo start --android

# Start on iOS (macOS only)
expo start --ios
```

### 6. Run on Device
1. Install Expo Go app on your phone
2. Scan QR code from terminal
3. App will load on your device

## Project Structure

```
mobile/
├── src/
│   ├── screens/
│   │   ├── auth/
│   │   ├── student/
│   │   ├── advisor/
│   │   └── shared/
│   ├── components/
│   │   ├── common/
│   │   ├── appointments/
│   │   ├── advisors/
│   │   └── notifications/
│   ├── navigation/
│   ├── services/
│   │   ├── api/
│   │   ├── database/
│   │   ├── firebase/
│   │   └── storage/
│   ├── context/
│   ├── utils/
│   ├── hooks/
│   └── models/
├── assets/
│   ├── images/
│   ├── fonts/
│   └── icons/
├── app.json
├── package.json
└── .env
```

## Key Features

### Authentication
- Firebase Authentication integration
- Login/Register screens
- JWT token management
- Session storage with Expo SQLite

### Navigation
- React Navigation setup
- Stack navigation for auth flow
- Tab navigation for main app
- Deep linking support

### State Management
- React Context API for global state
- Local state management with useState/useReducer
- AsyncStorage for persistence

### API Integration
- Axios for HTTP requests
- API service layer
- Error handling
- Request interceptors

### Local Database
- Expo SQLite for local storage
- Session management
- Cached data storage
- Offline support

### Notifications
- Expo Notifications
- Push notifications
- Local notifications
- Notification handling

## Dependencies

### Core
- `expo`: Expo framework
- `react`: React library
- `react-native`: React Native framework
- `react-navigation`: Navigation library

### UI
- `react-native-paper`: Material Design components
- `react-native-vector-icons`: Icon library

### Database & Storage
- `expo-sqlite`: SQLite database
- `@react-native-async-storage/async-storage`: AsyncStorage

### Firebase
- `@react-native-firebase/app`: Firebase core
- `@react-native-firebase/auth`: Firebase Authentication

### API
- `axios`: HTTP client

### Notifications
- `expo-notifications`: Notifications

## Environment Variables

- `API_BASE_URL`: Backend API base URL
- `FIREBASE_API_KEY`: Firebase API key
- `FIREBASE_AUTH_DOMAIN`: Firebase auth domain
- `FIREBASE_PROJECT_ID`: Firebase project ID
- `FIREBASE_STORAGE_BUCKET`: Firebase storage bucket
- `FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
- `FIREBASE_APP_ID`: Firebase app ID
- `SUPABASE_URL`: Supabase project URL (optional)
- `SUPABASE_ANON_KEY`: Supabase anonymous key (optional)

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Building

### Android
```bash
# Build Android APK
expo build:android

# Or use EAS Build
eas build --platform android
```

### iOS
```bash
# Build iOS IPA (requires Apple Developer account)
expo build:ios

# Or use EAS Build
eas build --platform ios
```

## Development

### Hot Reloading
- Fast Refresh is enabled by default
- Changes to JavaScript files will reload automatically
- Native changes require app restart

### Debugging
- Use React Native Debugger
- Use Expo DevTools
- Use Chrome DevTools for JavaScript debugging
- Use Flipper for advanced debugging

## Troubleshooting

### Issue: Metro bundler issues
```bash
# Clear cache and restart
expo start -c
```

### Issue: Cannot connect to backend
- Use your computer's local IP address instead of `localhost`
- Check firewall settings
- Verify backend server is running
- Check CORS settings in backend

### Issue: Firebase not working
- Verify Firebase configuration files are in place
- Check environment variables
- Verify Firebase project settings
- Check Firebase console for errors

## Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)

## License

ISC

