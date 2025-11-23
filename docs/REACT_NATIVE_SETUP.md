# React Native Expo Setup Guide
## Connecting Students with Advisors

This guide provides detailed instructions for setting up React Native Expo for the Advising App project.

## What is React Native Expo?

React Native Expo is a framework and platform for universal React applications. It provides:
- **Cross-platform Development**: Write once, run on Android and iOS
- **Expo Go App**: Test apps instantly on real devices
- **Managed Workflow**: No need for Xcode or Android Studio for basic development
- **Rich Ecosystem**: Access to Expo SDK and native modules
- **Easy Deployment**: Build and deploy apps easily

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app (install on your mobile device)
- Android Studio (for Android development) or Xcode (for iOS, macOS only)
- Firebase account
- Supabase account (for backend)

## Step 1: Install Expo CLI

```bash
npm install -g expo-cli
```

Verify installation:
```bash
expo --version
```

## Step 2: Create Expo Project

### Option 1: Create New Project
```bash
npx create-expo-app mobile --template blank
cd mobile
```

### Option 2: Use Existing Project
If the project structure already exists:
```bash
cd mobile
npm install
```

## Step 3: Install Dependencies

```bash
npm install
```

### Key Dependencies
- `expo`: Expo framework
- `react`: React library
- `react-native`: React Native framework
- `react-navigation`: Navigation library
- `expo-sqlite`: SQLite database
- `axios`: HTTP client
- `@react-native-firebase/auth`: Firebase Authentication
- `react-native-paper`: UI components

## Step 4: Configure Environment Variables

1. Create `.env` file in `mobile/` directory:
```env
API_BASE_URL=http://localhost:3000/api
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
```

2. Install `react-native-dotenv`:
```bash
npm install react-native-dotenv
```

3. Configure `babel.config.js`:
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
      }]
    ],
  };
};
```

## Step 5: Configure Firebase

### 5.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)

### 5.2 Add Android App
1. Click "Add app" > Android
2. Enter package name: `com.kyau.advisingapp`
3. Download `google-services.json`
4. Place it in `mobile/` directory

### 5.3 Add iOS App (Optional)
1. Click "Add app" > iOS
2. Enter bundle ID: `com.kyau.advisingapp`
3. Download `GoogleService-Info.plist`
4. Place it in `mobile/` directory

### 5.4 Install Firebase SDK
```bash
npm install @react-native-firebase/app @react-native-firebase/auth
```

### 5.5 Configure Firebase in App
Create `src/services/firebase/firebaseService.js`:
```javascript
import { initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
export { auth };
```

## Step 6: Set Up Navigation

### 6.1 Install Navigation Dependencies
```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler
```

### 6.2 Create Navigation Structure
Create `src/navigation/AppNavigator.js`:
```javascript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigator from './AuthNavigator';
import StudentNavigator from './StudentNavigator';
import AdvisorNavigator from './AdvisorNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Student" component={StudentNavigator} />
        <Stack.Screen name="Advisor" component={AdvisorNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
```

## Step 7: Set Up SQLite Database

### 7.1 Install SQLite
```bash
npx expo install expo-sqlite
```

### 7.2 Create Database Service
Create `src/services/database/database.js`:
```javascript
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('advising_app.db');

export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS session (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          jwt_token TEXT NOT NULL,
          user_id TEXT NOT NULL,
          email TEXT NOT NULL,
          role TEXT NOT NULL,
          expires_at INTEGER NOT NULL,
          created_at INTEGER NOT NULL
        );`,
        [],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

export default db;
```

## Step 8: Set Up API Service

### 8.1 Install Axios
```bash
npm install axios
```

### 8.2 Create API Client
Create `src/services/api/apiClient.js`:
```javascript
import axios from 'axios';
import { API_BASE_URL } from '@env';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token to headers
    const token = getToken(); // Implement getToken function
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

## Step 9: Set Up State Management

### 9.1 Create Auth Context
Create `src/context/AuthContext.js`:
```javascript
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    // Implement login logic
  };

  const logout = async () => {
    // Implement logout logic
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

## Step 10: Start Development Server

```bash
expo start
```

This will:
1. Start Metro bundler
2. Display QR code
3. Open Expo DevTools

## Step 11: Run on Device/Emulator

### Option 1: Expo Go App (Recommended for Development)
1. Install Expo Go app on your phone
2. Scan QR code from terminal
3. App will load on your device

### Option 2: Android Emulator
1. Start Android Studio
2. Start Android emulator
3. Press `a` in Expo CLI
4. App will open in emulator

### Option 3: iOS Simulator (macOS only)
1. Open Xcode
2. Start iOS simulator
3. Press `i` in Expo CLI
4. App will open in simulator

## Step 12: Test the App

1. Test authentication flow
2. Test navigation
3. Test API calls
4. Test database operations
5. Test notifications

## Troubleshooting

### Issue: Metro bundler not starting
```bash
# Clear cache
expo start -c

# Or delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Issue: Cannot connect to backend
- Use your computer's local IP address instead of `localhost`
- Check firewall settings
- Verify backend server is running
- For Android emulator, use `10.0.2.2` instead of `localhost`

### Issue: Firebase not working
- Verify Firebase configuration files are in place
- Check environment variables
- Verify Firebase project settings
- Check Firebase console for errors

### Issue: Navigation errors
- Ensure all navigation dependencies are installed
- Check navigation structure
- Verify screen components are properly exported

## Next Steps

1. Implement authentication screens
2. Set up navigation structure
3. Create API service layer
4. Implement database operations
5. Create UI components
6. Implement app features

## Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)

---

**Last Updated**: [Date]  
**Version**: 1.0.0

