# Setup Checklist
## Complete Setup Guide for Advising App

Use this checklist to ensure everything is set up correctly.

## ✅ Prerequisites

- [ ] Node.js (v16 or later) installed
- [ ] npm or yarn installed
- [ ] Expo CLI installed (`npm install -g expo-cli`)
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## ✅ Supabase Setup

### Account & Project
- [ ] Supabase account created
- [ ] Supabase project created
- [ ] Project is active and running
- [ ] Database password saved securely

### Database Schema
- [ ] SQL schema file located (`database/postgresql_schema.sql`)
- [ ] SQL schema executed in Supabase SQL Editor
- [ ] All tables created successfully:
  - [ ] `users` table
  - [ ] `advisors` table
  - [ ] `appointments` table
  - [ ] `notifications` table
  - [ ] `feedback` table

### Credentials
- [ ] Supabase URL copied
- [ ] Supabase anon key copied
- [ ] Supabase service role key copied (kept secret)

## ✅ Firebase Setup

### Account & Project
- [ ] Firebase account created
- [ ] Firebase project created
- [ ] Project is active

### Authentication
- [ ] Email/Password authentication enabled
- [ ] Authentication method configured

### Service Account
- [ ] Service account key generated
- [ ] JSON file downloaded and saved securely
- [ ] Project ID noted
- [ ] Client email noted
- [ ] Private key noted

### Web App Configuration
- [ ] Web app registered in Firebase
- [ ] Firebase config values copied:
  - [ ] API Key
  - [ ] Auth Domain
  - [ ] Project ID
  - [ ] Storage Bucket
  - [ ] Messaging Sender ID
  - [ ] App ID

## ✅ Backend Setup

### Installation
- [ ] Navigated to `backend/` directory
- [ ] Ran `npm install`
- [ ] Dependencies installed successfully

### Configuration
- [ ] `.env` file created in `backend/` directory
- [ ] Supabase URL added to `.env`
- [ ] Supabase service role key added to `.env`
- [ ] Firebase project ID added to `.env`
- [ ] Firebase private key added to `.env`
- [ ] Firebase client email added to `.env`
- [ ] JWT secret generated and added to `.env`
- [ ] Port configured (default: 3000)

### Testing
- [ ] Backend server starts without errors
- [ ] Supabase connection successful
- [ ] Firebase Admin initialized successfully
- [ ] Health endpoint works (`http://localhost:3000/health`)
- [ ] No connection errors in console

## ✅ React Native Setup

### Installation
- [ ] Navigated to `mobile/` directory
- [ ] Ran `npm install`
- [ ] Dependencies installed successfully
- [ ] Expo CLI working

### Configuration
- [ ] `.env` file created in `mobile/` directory
- [ ] API_BASE_URL configured
- [ ] Firebase API key added to `.env`
- [ ] Firebase auth domain added to `.env`
- [ ] Firebase project ID added to `.env`
- [ ] Firebase storage bucket added to `.env`
- [ ] Firebase messaging sender ID added to `.env`
- [ ] Firebase app ID added to `.env`

### Testing
- [ ] Expo development server starts
- [ ] No configuration errors
- [ ] App loads in Expo Go or emulator
- [ ] No Firebase errors

## ✅ Database Verification

### Tables
- [ ] `users` table exists and has correct structure
- [ ] `advisors` table exists and has correct structure
- [ ] `appointments` table exists and has correct structure
- [ ] `notifications` table exists and has correct structure
- [ ] `feedback` table exists and has correct structure

### Indexes
- [ ] Indexes created successfully
- [ ] Foreign key constraints working
- [ ] Unique constraints working

### Test Data (Optional)
- [ ] Can insert test user
- [ ] Can insert test advisor
- [ ] Can query data successfully

## ✅ API Testing

### Authentication Endpoints
- [ ] POST `/api/auth/register` - Register user
- [ ] POST `/api/auth/login` - Login user
- [ ] GET `/api/auth/me` - Get current user
- [ ] POST `/api/auth/refresh-token` - Refresh token

### User Endpoints
- [ ] GET `/api/users/profile` - Get profile
- [ ] PUT `/api/users/profile` - Update profile
- [ ] GET `/api/users/advisors` - Get advisors

### Advisor Endpoints
- [ ] GET `/api/advisors` - Get all advisors
- [ ] GET `/api/advisors/:id` - Get advisor by ID
- [ ] GET `/api/advisors/:id/availability` - Get availability

### Appointment Endpoints
- [ ] POST `/api/appointments` - Create appointment
- [ ] GET `/api/appointments` - Get appointments
- [ ] GET `/api/appointments/:id` - Get appointment by ID
- [ ] PUT `/api/appointments/:id/approve` - Approve appointment
- [ ] PUT `/api/appointments/:id/reject` - Reject appointment

## ✅ Mobile App Testing

### Authentication
- [ ] Can register new user
- [ ] Can login with registered user
- [ ] Can logout
- [ ] User session persists

### Navigation
- [ ] Login screen displays
- [ ] Register screen displays
- [ ] Dashboard displays after login
- [ ] Navigation works correctly
- [ ] Role-based navigation works (student/advisor)

### Features
- [ ] Can view advisors list
- [ ] Can view appointments
- [ ] Can create appointment (student)
- [ ] Can approve/reject appointment (advisor)
- [ ] Profile screen displays user info

## ✅ Environment Variables Check

### Backend `.env`
```env
✅ PORT=3000
✅ NODE_ENV=development
✅ SUPABASE_URL=✓
✅ SUPABASE_SERVICE_ROLE_KEY=✓
✅ FIREBASE_PROJECT_ID=✓
✅ FIREBASE_PRIVATE_KEY=✓
✅ FIREBASE_CLIENT_EMAIL=✓
✅ JWT_SECRET=✓
✅ CORS_ORIGIN=http://localhost:3000
```

### Mobile `.env`
```env
✅ API_BASE_URL=http://localhost:3000/api
✅ FIREBASE_API_KEY=✓
✅ FIREBASE_AUTH_DOMAIN=✓
✅ FIREBASE_PROJECT_ID=✓
✅ FIREBASE_STORAGE_BUCKET=✓
✅ FIREBASE_MESSAGING_SENDER_ID=✓
✅ FIREBASE_APP_ID=✓
```

## ✅ Security Checklist

### Backend
- [ ] JWT secret is strong and random
- [ ] Service role key is kept secret (not in git)
- [ ] Firebase private key is kept secret
- [ ] `.env` file is in `.gitignore`
- [ ] CORS is configured correctly
- [ ] Rate limiting is enabled

### Mobile
- [ ] Firebase config is in `.env` (not hardcoded)
- [ ] `.env` file is in `.gitignore`
- [ ] API keys are not exposed in code
- [ ] Tokens are stored securely (AsyncStorage)

## 🎯 Ready for Development

Once all items are checked:
- [ ] Backend is running and connected to database
- [ ] Mobile app can connect to backend
- [ ] Authentication is working
- [ ] Database is set up and accessible
- [ ] All environment variables are configured

## 📝 Notes

- Keep your `.env` files secure and never commit them to git
- Save your database password and service account keys securely
- Test each feature as you implement it
- Check Supabase and Firebase dashboards regularly
- Monitor backend logs for errors

## 🆘 Need Help?

If you're stuck on any step:
1. Check the error message carefully
2. Verify your credentials are correct
3. Check the documentation:
   - `DATABASE_SETUP_GUIDE.md`
   - `SUPABASE_SETUP.md`
   - `REACT_NATIVE_SETUP.md`
   - `DEVELOPMENT_GUIDE.md`
4. Check Supabase/Firebase console for errors
5. Verify your internet connection
6. Restart your development servers

---

**Once all items are checked, you're ready to start developing! 🚀**

