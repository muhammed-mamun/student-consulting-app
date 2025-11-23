# Quick Start Commands
## Ready-to-Use Commands for Development

## 🚀 Start Development

### Option 1: Manual Start (Recommended)

#### Terminal 1: Backend Server
```bash
cd backend
npm run dev
```

#### Terminal 2: Mobile App
```bash
cd mobile
expo start
```

### Option 2: Using Script
```bash
./START_DEVELOPMENT.sh
```

---

## 🧪 Test Your Setup

### Test Backend
```bash
# Test health endpoint
curl http://localhost:3000/health

# Test database connection
cd backend
npm run test-connection
```

### Test Mobile App
1. Start Expo: `cd mobile && expo start`
2. Press `a` for Android or `i` for iOS
3. Or scan QR code with Expo Go app

---

## 📋 Common Commands

### Backend Commands
```bash
cd backend

# Start server
npm run dev

# Test connection
npm run test-connection

# Run tests
npm test

# Install dependencies
npm install
```

### Mobile Commands
```bash
cd mobile

# Start Expo
expo start

# Start on Android
expo start --android

# Start on iOS
expo start --ios

# Clear cache and start
expo start -c

# Install dependencies
npm install

# Run tests
npm test
```

### Database Commands
```bash
# Test database connection
cd backend
npm run test-connection

# Access Supabase Dashboard
# Go to: https://supabase.com/dashboard
```

---

## 🐛 Troubleshooting Commands

### Check if port is in use
```bash
lsof -ti:3000
```

### Kill process on port 3000
```bash
kill -9 $(lsof -ti:3000)
```

### Clear Expo cache
```bash
cd mobile
expo start -c
```

### Reinstall dependencies
```bash
# Backend
cd backend
rm -rf node_modules
npm install

# Mobile
cd mobile
rm -rf node_modules
npm install
```

---

## 📝 Development Workflow

### 1. Start Backend
```bash
cd backend
npm run dev
```

### 2. Start Mobile App (New Terminal)
```bash
cd mobile
expo start
```

### 3. Make Changes
- Backend: Auto-restarts with nodemon
- Mobile: Auto-reloads with Fast Refresh

### 4. Test Changes
- Test in app
- Check console for errors
- Verify API calls work

---

## 🎯 Quick Test Commands

### Test API Endpoints
```bash
# Health check
curl http://localhost:3000/health

# Register user (example)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "role": "student"
  }'
```

### Test Database
```bash
cd backend
npm run test-connection
```

---

## ✅ Verification Checklist

Before starting development:

- [ ] Backend server starts: `cd backend && npm run dev`
- [ ] Database connection works: `npm run test-connection`
- [ ] Mobile app starts: `cd mobile && expo start`
- [ ] Mobile app can connect to backend
- [ ] No errors in console

---

## 🎉 Ready to Code!

Once everything is running:
1. Start implementing features
2. Test as you go
3. Fix errors immediately
4. Commit regularly

**Happy Coding! 🚀**

