# Getting Started with Development
## Connecting Students with Advisors

This guide will help you get started with developing the Advising App.

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (see backend/.env.example)
# Configure your Supabase and Firebase credentials

# Start development server
npm run dev
```

Backend will run on `http://localhost:3000`

### 2. React Native Expo Setup

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Create .env file (see mobile/.env.example)
# Configure your API_BASE_URL and Firebase credentials

# Start Expo development server
expo start
```

## 📋 Prerequisites Checklist

- [ ] Node.js (v16 or later) installed
- [ ] npm or yarn installed
- [ ] Expo CLI installed (`npm install -g expo-cli`)
- [ ] Supabase account created
- [ ] Firebase account created
- [ ] Supabase database set up
- [ ] Firebase project configured
- [ ] Environment variables configured

## 🔧 Configuration

### Backend Configuration

Create `backend/.env`:
```env
PORT=3000
NODE_ENV=development

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email

JWT_SECRET=your-jwt-secret-key
JWT_EXPIRE=7d

CORS_ORIGIN=http://localhost:3000
```

### React Native Configuration

Create `mobile/.env`:
```env
API_BASE_URL=http://localhost:3000/api
# For physical device: http://192.168.1.x:3000/api
# For Android emulator: http://10.0.2.2:3000/api

FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
```

## 📁 Project Structure

```
advising-app/
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Custom middleware
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Entry point
│   └── package.json
├── mobile/                  # React Native Expo app
│   ├── src/
│   │   ├── screens/        # Screen components
│   │   ├── navigation/     # Navigation configuration
│   │   ├── services/       # API services
│   │   ├── context/        # Context providers
│   │   └── config/         # Configuration files
│   ├── App.js              # Entry point
│   └── package.json
└── database/               # Database schemas
    ├── postgresql_schema.sql
    └── sqlite_schema.sql
```

## 🎯 Features Implemented

### Backend
- ✅ Express.js server setup
- ✅ Supabase database integration
- ✅ Firebase Admin SDK integration
- ✅ JWT token generation
- ✅ Authentication routes
- ✅ User management routes
- ✅ Advisor routes
- ✅ Appointment routes
- ✅ Notification routes
- ✅ Feedback routes
- ✅ Error handling middleware
- ✅ Validation middleware
- ✅ CORS configuration
- ✅ Rate limiting

### React Native
- ✅ Expo project setup
- ✅ Navigation setup (React Navigation)
- ✅ Authentication context
- ✅ API service layer
- ✅ Login screen
- ✅ Register screen
- ✅ Student dashboard
- ✅ Advisor dashboard
- ✅ Appointment booking
- ✅ Appointment list
- ✅ Profile screen
- ✅ Firebase authentication integration

## 🚧 Next Steps

### Backend
1. Test all API endpoints
2. Implement real-time notifications with Supabase Realtime
3. Add email notifications
4. Implement file uploads (if needed)
5. Add logging and monitoring
6. Set up automated testing

### React Native
1. Complete appointment booking form
2. Implement appointment details screen
3. Add availability management for advisors
4. Implement notifications screen
5. Add feedback/rating system
6. Implement offline support with SQLite
7. Add push notifications
8. Improve UI/UX with better styling
9. Add form validation
10. Add error handling and loading states

## 🧪 Testing

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

## 🐛 Troubleshooting

### Backend Issues
- **Supabase connection error**: Check your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
- **Firebase error**: Verify Firebase credentials in .env
- **Port already in use**: Change PORT in .env or kill the process using the port

### React Native Issues
- **Cannot connect to backend**: Use your computer's IP address instead of localhost
- **Firebase not working**: Check Firebase configuration in .env
- **Expo start failed**: Clear cache with `expo start -c`
- **Module not found**: Run `npm install` again

## 📚 Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Navigation](https://reactnavigation.org/)

## 🎉 You're Ready!

You now have a working backend and React Native Expo app structure. Start implementing features and testing!

For detailed setup instructions, see:
- [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)
- [REACT_NATIVE_SETUP.md](REACT_NATIVE_SETUP.md)
- [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

---

**Happy Coding! 🚀**

