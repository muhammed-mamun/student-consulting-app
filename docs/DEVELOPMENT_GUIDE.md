# Development Guide
## Connecting Students with Advisors

This guide will help you set up and run the development environment.

## Prerequisites

1. **Node.js** (v16 or later)
2. **npm** or **yarn**
3. **Expo CLI**: `npm install -g expo-cli`
4. **Supabase account** (free tier available)
5. **Firebase account**
6. **Git**

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=3000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email

# JWT Configuration
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 4. Set Up Supabase Database
1. Create a Supabase project at https://supabase.com
2. Run the SQL schema from `database/postgresql_schema.sql` in Supabase SQL Editor
3. Get your Supabase credentials from Project Settings > API

### 5. Set Up Firebase
1. Create a Firebase project
2. Enable Authentication (Email/Password)
3. Generate service account key
4. Add Firebase credentials to `.env`

### 6. Start Backend Server
```bash
npm run dev
```

Backend should be running on `http://localhost:3000`

## React Native Expo Setup

### 1. Navigate to Mobile Directory
```bash
cd mobile
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the `mobile/` directory:
```env
API_BASE_URL=http://localhost:3000/api
# For physical device, use your computer's IP address:
# API_BASE_URL=http://192.168.1.x:3000/api

FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
```

### 4. Configure Firebase for React Native
1. Install Firebase dependencies (already in package.json)
2. Configure Firebase in your app (see Firebase setup guide)
3. For Android: Add `google-services.json` to `android/app/`
4. For iOS: Add `GoogleService-Info.plist` to `ios/`

### 5. Start Expo Development Server
```bash
expo start
```

### 6. Run on Device/Emulator
- **Expo Go**: Scan QR code with Expo Go app
- **Android Emulator**: Press `a` in Expo CLI
- **iOS Simulator**: Press `i` in Expo CLI (macOS only)

## Project Structure

```
advising-app/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Custom middleware
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   └── server.js        # Entry point
│   └── package.json
├── mobile/
│   ├── src/
│   │   ├── screens/         # Screen components
│   │   ├── components/      # Reusable components
│   │   ├── navigation/      # Navigation configuration
│   │   ├── services/        # API services
│   │   ├── context/         # Context providers
│   │   └── utils/           # Utility functions
│   ├── App.js               # Entry point
│   └── package.json
└── database/
    ├── postgresql_schema.sql
    └── sqlite_schema.sql
```

## Development Workflow

### 1. Start Backend
```bash
cd backend
npm run dev
```

### 2. Start React Native App
```bash
cd mobile
expo start
```

### 3. Make Changes
- Backend changes: Restart backend server
- React Native changes: App will reload automatically (Fast Refresh)
- For native changes: Restart Expo server

## Testing

### Backend Testing
```bash
cd backend
npm test
```

### React Native Testing
```bash
cd mobile
npm test
```

## Common Issues

### Issue: Cannot Connect to Backend from Expo Go
**Solution**:
- Use your computer's local IP address instead of `localhost`
- For Android emulator, use `10.0.2.2` instead of `localhost`
- Check firewall settings
- Verify backend server is running

### Issue: Firebase Not Working
**Solution**:
- Verify Firebase configuration files are in place
- Check environment variables
- Verify Firebase project settings
- Check Firebase console for errors

### Issue: Supabase Connection Error
**Solution**:
- Verify Supabase project is active
- Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in `.env`
- Verify network connection
- Check Supabase project status

## Next Steps

1. **Set up environment**: Follow the setup instructions above
2. **Configure Firebase**: Set up Firebase for React Native
3. **Configure Supabase**: Set up Supabase database
4. **Test authentication**: Test login/register functionality
5. **Implement features**: Start implementing app features

## Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Navigation](https://reactnavigation.org/)

---

**Last Updated**: [Date]  
**Version**: 1.0.0

