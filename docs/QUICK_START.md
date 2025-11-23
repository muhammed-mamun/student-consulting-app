# Quick Start Guide
## Connecting Students with Advisors

This guide will help you get started with the project quickly.

## Prerequisites Checklist

- [ ] Node.js (v16 or later) installed
- [ ] npm or yarn installed
- [ ] Expo CLI installed (`npm install -g expo-cli`)
- [ ] Expo Go app installed on mobile device (for testing)
- [ ] Supabase account created (free tier available)
- [ ] Firebase account created
- [ ] Git installed
- [ ] Android Studio (for Android development) or Xcode (for iOS, macOS only)

## Step-by-Step Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/advising-app.git
cd advising-app
```

### 2. Set Up Supabase Database

#### Create Supabase Project
1. Go to [Supabase](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - Project Name: `advising-app`
   - Database Password: (choose a strong password)
   - Region: (choose closest region)
5. Click "Create new project"
6. Wait for project to be created (2-3 minutes)

#### Run Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the contents of `database/postgresql_schema.sql`
4. Click "Run" to execute the schema
5. Verify tables are created in **Table Editor**

#### Get Supabase Credentials
1. Go to **Project Settings** > **API**
2. Copy the following:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - `anon` public key (for client-side)
   - `service_role` key (for server-side - keep secret!)

#### Configure Row Level Security (RLS)
1. Go to **Authentication** > **Policies**
2. Set up RLS policies for each table (users, advisors, appointments, etc.)
3. Enable Realtime for tables: appointments, notifications
   - Go to **Database** > **Replication**
   - Enable replication for required tables

### 3. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
4. Enable Realtime Database:
   - Go to Realtime Database
   - Create database
   - Set security rules
5. Generate Service Account Key:
   - Go to Project Settings > Service Accounts
   - Generate new private key
   - Save the JSON file securely

### 4. Set Up Backend

#### Navigate to Backend Directory
```bash
cd backend
```

#### Install Dependencies
```bash
npm install
```

#### Configure Environment
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

# Firebase Realtime Database (Optional)
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

#### Start Backend Server
```bash
npm run dev
```

Backend should be running on `http://localhost:3000`

### 5. Set Up React Native Expo App

#### Navigate to Mobile Directory
```bash
cd mobile
```

#### Install Dependencies
```bash
npm install
```

#### Configure Environment Variables
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

#### Configure Firebase
1. Go to Firebase Console
2. Add a new app (Android/iOS)
3. Download `google-services.json` (Android) or `GoogleService-Info.plist` (iOS)
4. Place the config file in `mobile/` directory
5. Configure Firebase in your app

#### Start Expo Development Server
```bash
expo start
```

#### Run on Device/Emulator
1. **Option 1: Expo Go App**
   - Install Expo Go app on your phone
   - Scan the QR code displayed in terminal
   - App will load on your device

2. **Option 2: Android Emulator**
   - Press `a` in the Expo CLI to open on Android emulator
   - Make sure Android Studio and emulator are running

3. **Option 3: iOS Simulator** (macOS only)
   - Press `i` in the Expo CLI to open on iOS simulator
   - Make sure Xcode is installed

### 6. Verify Installation

#### Test Backend
```bash
# Test API endpoint
curl http://localhost:3000/api/health
```

#### Test React Native App
1. Launch the app in Expo Go or emulator
2. Try to register a new user
3. Try to login
4. Verify connection to backend
5. Test app navigation
6. Test API calls

## Common Issues and Solutions

### Issue: Supabase Connection Error
**Solution**: 
- Verify Supabase project is active in dashboard
- Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in `.env`
- Verify network connection to Supabase
- Check Supabase project status in dashboard
- Ensure API keys are correct (service_role key for server-side)

### Issue: Firebase Authentication Error
**Solution**:
- Verify Firebase project is set up correctly
- Check `google-services.json` is in correct location
- Verify Firebase credentials in `.env`

### Issue: Android App Cannot Connect to Backend
**Solution**:
- For emulator: Use `10.0.2.2` instead of `localhost`
- For physical device: Use your computer's local IP address
- Check backend server is running
- Verify CORS settings in backend

### Issue: Expo Start Failed
**Solution**:
- Check Node.js version (should be v16 or later)
- Clear Expo cache: `expo start -c`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check if port 19000 is available
- Verify Expo CLI is installed: `expo --version`

### Issue: Cannot Connect to Backend from Expo Go
**Solution**:
- Use your computer's local IP address instead of `localhost`
- Ensure backend server is running
- Check firewall settings
- For Android emulator, use `10.0.2.2` instead of `localhost`
- Verify CORS settings in backend

### Issue: Port Already in Use
**Solution**:
- Change PORT in `.env` file
- Or kill process using the port: `lsof -ti:3000 | xargs kill`

## Development Workflow

### 1. Start Backend
```bash
cd backend
npm run dev
```

### 2. Start React Native App
- Navigate to mobile directory: `cd mobile`
- Start Expo: `expo start`
- Scan QR code or press `a` for Android / `i` for iOS

### 3. Make Changes
- Backend changes: Restart backend server
- React Native changes: App will reload automatically (Fast Refresh)
- For native changes: Restart Expo server

### 4. Test Changes
- Test API endpoints using Postman or curl
- Test Android app functionality
- Check logs for errors

## Next Steps

1. Read [PROJECT_PLAN.md](PROJECT_PLAN.md) for detailed project information
2. Read [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
3. Read [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md) for development phases
4. Start implementing features according to the roadmap

## Getting Help

- Check documentation in `docs/` directory
- Review API documentation
- Check GitHub issues
- Contact team members

## Useful Commands

### Backend
```bash
# Start development server
npm run dev

# Run tests
npm test

# Check database connection
psql -d advising_app -c "SELECT version();"
```

### React Native Expo
```bash
# Start development server
expo start

# Start with clear cache
expo start -c

# Run on Android
expo start --android

# Run on iOS (macOS only)
expo start --ios

# Run tests
npm test

# Build Android APK
expo build:android

# Build iOS IPA (macOS only, requires Apple Developer account)
expo build:ios
```

### Supabase
```bash
# Access Supabase Dashboard
# Go to https://supabase.com/dashboard
# Select your project
# Use SQL Editor to run queries
# Use Table Editor to view/edit data

# Or use Supabase CLI (optional)
npm install -g supabase
supabase login
supabase projects list
```

## Project Structure

```
advising-app/
├── android/          # Android application
├── backend/          # Node.js backend
├── database/         # Database schemas
├── docs/             # Documentation
└── README.md         # Main README
```

## Team Responsibilities

- **Mamun**: Backend setup, Firebase, Database
- **Jarziz**: UI/UX design, Figma
- **Mahmudul**: Android setup, Frontend integration

## Important Notes

- Always pull latest changes before starting work
- Commit changes regularly with meaningful messages
- Test changes before pushing
- Follow coding standards
- Update documentation when making changes

---

**Last Updated**: [Date]  
**Version**: 1.0.0

