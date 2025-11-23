# Database Setup Guide
## Step-by-Step Instructions

This guide will walk you through setting up the database for the Advising App.

## Step 1: Create Supabase Project

### 1.1 Sign up for Supabase
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign up"
3. Sign up with GitHub, Google, or email

### 1.2 Create New Project
1. Once logged in, click **"New Project"**
2. Fill in project details:
   - **Organization**: Select or create an organization
   - **Project Name**: `advising-app` (or your preferred name)
   - **Database Password**: Choose a strong password (save it securely!)
   - **Region**: Select the closest region to your users
   - **Pricing Plan**: Free tier is sufficient for development
3. Click **"Create new project"**
4. Wait for project to be created (2-3 minutes)

## Step 2: Get Supabase Credentials

1. In your project dashboard, go to **Project Settings** (gear icon in left sidebar)
2. Click on **API** in the left sidebar
3. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co` (copy this)
   - **anon public** key: Used for client-side operations (copy this)
   - **service_role** key: Used for server-side operations (copy this - keep it secret!)

**Important**: Save these credentials - you'll need them for your backend `.env` file.

## Step 3: Run Database Schema

### 3.1 Open SQL Editor
1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**

### 3.2 Run the Schema
1. Open the file `database/postgresql_schema.sql` from your project
2. Copy the entire SQL script
3. Paste it into the SQL Editor in Supabase
4. Click **"Run"** or press `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (Mac)
5. Wait for the script to execute successfully
6. You should see a success message

### 3.3 Verify Tables
1. Go to **Table Editor** (left sidebar)
2. You should see the following tables:
   - `users`
   - `advisors`
   - `appointments`
   - `notifications`
   - `feedback`

## Step 4: Configure Backend Environment

### 4.1 Create Backend .env File
1. Navigate to `backend/` directory
2. Create a `.env` file (if it doesn't exist)
3. Add the following content:

```env
PORT=3000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Firebase Configuration (we'll set this up next)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email

# JWT Configuration
JWT_SECRET=your-random-secret-key-here-make-it-long-and-random
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4.2 Replace Placeholder Values
- Replace `https://your-project-id.supabase.co` with your actual Supabase URL
- Replace `your-supabase-anon-key` with your actual anon key
- Replace `your-supabase-service-role-key` with your actual service role key
- Replace `your-random-secret-key-here-make-it-long-and-random` with a random secret (you can generate one using: `openssl rand -base64 32`)

## Step 5: Test Database Connection

### 5.1 Install Backend Dependencies
```bash
cd backend
npm install
```

### 5.2 Test Connection
```bash
# Start the backend server
npm run dev
```

You should see:
```
✅ Supabase connection successful
Server is running on port 3000
Environment: development
```

If you see an error, check:
- Your Supabase URL is correct
- Your service role key is correct
- Your Supabase project is active
- Your internet connection is working

## Step 6: Set Up Firebase (Optional but Recommended)

### 6.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `advising-app`
4. Follow the setup wizard
5. Click "Create project"

### 6.2 Enable Authentication
1. In Firebase Console, go to **Authentication**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Click on **"Email/Password"**
5. Enable it and click **"Save"**

### 6.3 Generate Service Account Key
1. Go to **Project Settings** (gear icon)
2. Go to **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Save the JSON file securely (you'll need this for backend)

### 6.4 Update Backend .env
Add Firebase credentials to your `backend/.env`:

```env
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
```

**Note**: For `FIREBASE_PRIVATE_KEY`, you need to:
1. Open the JSON file you downloaded
2. Copy the `private_key` value
3. Replace `\n` with actual newlines in the .env file, OR
4. Keep it as a single line with `\n` characters (the code will handle it)

## Step 7: Configure React Native App

### 7.1 Create Mobile .env File
1. Navigate to `mobile/` directory
2. Create a `.env` file
3. Add the following content:

```env
# API Configuration
API_BASE_URL=http://localhost:3000/api
# For physical device, use your computer's IP address:
# API_BASE_URL=http://192.168.1.x:3000/api
# For Android emulator, use:
# API_BASE_URL=http://10.0.2.2:3000/api

# Firebase Configuration
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
```

### 7.2 Get Firebase Web App Config
1. In Firebase Console, go to **Project Settings**
2. Scroll down to **"Your apps"** section
3. Click on the **Web icon** (`</>`)
4. Register your app with nickname: `Advising App Web`
5. Copy the config values:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

### 7.3 Update Mobile .env
Replace the placeholder values in `mobile/.env` with your actual Firebase config values.

## Step 8: Test Everything

### 8.1 Start Backend
```bash
cd backend
npm run dev
```

You should see:
```
✅ Supabase connection successful
✅ Firebase Admin initialized successfully
Server is running on port 3000
```

### 8.2 Test Backend API
Open your browser or use curl:
```bash
curl http://localhost:3000/health
```

You should get a response:
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 8.3 Start React Native App
```bash
cd mobile
npm install
expo start
```

## Step 9: Verify Database Tables

### 9.1 Check Tables in Supabase
1. Go to Supabase Dashboard
2. Go to **Table Editor**
3. Verify you can see all tables:
   - `users`
   - `advisors`
   - `appointments`
   - `notifications`
   - `feedback`

### 9.2 Test Database Operations
You can test by creating a test user through the API or directly in Supabase.

## Troubleshooting

### Issue: Supabase Connection Error
**Solutions**:
- Verify your Supabase URL is correct
- Check your service role key is correct
- Ensure your Supabase project is active
- Check your internet connection
- Verify you're using the service_role key (not anon key) for backend

### Issue: Firebase Connection Error
**Solutions**:
- Verify your Firebase project ID is correct
- Check your private key is correctly formatted
- Ensure your service account email is correct
- Verify Firebase Admin SDK is properly initialized

### Issue: Tables Not Created
**Solutions**:
- Check SQL script for errors in Supabase SQL Editor
- Verify you have permission to create tables
- Check Supabase project status
- Try running the SQL script again

### Issue: Cannot Connect to Backend from Mobile App
**Solutions**:
- Use your computer's IP address instead of `localhost`
- For Android emulator: Use `10.0.2.2` instead of `localhost`
- Check firewall settings
- Verify backend server is running
- Check CORS settings in backend

## Next Steps

After setting up the database:
1. ✅ Test backend API endpoints
2. ✅ Test user registration
3. ✅ Test user login
4. ✅ Create test advisor accounts
5. ✅ Test appointment booking
6. ✅ Test notifications

## Quick Reference

### Supabase Dashboard
- **URL**: https://supabase.com/dashboard
- **SQL Editor**: For running SQL queries
- **Table Editor**: For viewing/editing data
- **API Settings**: For getting credentials

### Firebase Console
- **URL**: https://console.firebase.google.com/
- **Authentication**: For user authentication
- **Project Settings**: For getting credentials

### Environment Variables
- **Backend**: `backend/.env`
- **Mobile**: `mobile/.env`

---

**Congratulations! Your database is now set up! 🎉**

Now you can start developing and testing your application.

