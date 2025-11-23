# 🚀 START HERE - Database Setup

## What You Need to Do

You need to set up **2 things**:
1. **Supabase Database** (Required) - This is where your data will be stored
2. **Firebase Authentication** (Optional but Recommended) - For user authentication

## 📋 Quick Steps

### 1. Set Up Supabase Database (5 minutes)

#### Step 1.1: Create Supabase Account
1. Go to https://supabase.com
2. Sign up (free)
3. Create a new project

#### Step 1.2: Get Your Credentials
1. In Supabase dashboard, go to **Settings** > **API**
2. Copy these 3 things:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (long string)
   - **service_role key** (long string - keep this secret!)

#### Step 1.3: Create Database Tables
1. In Supabase dashboard, go to **SQL Editor**
2. Open the file: `database/postgresql_schema.sql` from your project
3. Copy the entire SQL code
4. Paste it into SQL Editor
5. Click **"Run"**
6. Wait for success message

#### Step 1.4: Configure Backend
1. Go to `backend/` folder
2. Create a file named `.env`
3. Add this content:

```env
PORT=3000
NODE_ENV=development

# Paste your Supabase credentials here
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Generate a random secret (you can use: openssl rand -base64 32)
JWT_SECRET=your-random-secret-key-here

CORS_ORIGIN=http://localhost:3000
```

4. Replace the placeholder values with your actual Supabase credentials

#### Step 1.5: Test It
```bash
cd backend
npm install
npm run test-connection
```

If you see ✅ all tests passed, you're done with the database!

---

### 2. Set Up Firebase (Optional - 5 minutes)

#### Step 2.1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Create a new project
3. Enable **Email/Password** authentication

#### Step 2.2: Get Firebase Credentials
1. Go to **Project Settings** > **Service Accounts**
2. Click **"Generate new private key"**
3. Save the JSON file

#### Step 2.3: Update Backend .env
Add to your `backend/.env`:
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
```

#### Step 2.4: Configure Mobile App
1. In Firebase Console, go to **Project Settings**
2. Scroll to **"Your apps"** section
3. Click **Web icon** (`</>`)
4. Copy the config values
5. Create `mobile/.env` file:
```env
API_BASE_URL=http://localhost:3000/api

FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Supabase project created
- [ ] Database tables created (users, advisors, appointments, notifications, feedback)
- [ ] Backend `.env` file created with Supabase credentials
- [ ] `npm run test-connection` shows all tests passed
- [ ] Backend server starts without errors
- [ ] (Optional) Firebase project created
- [ ] (Optional) Firebase credentials added to backend `.env`
- [ ] (Optional) Mobile `.env` file created with Firebase config

## 🎯 What Happens Next?

Once database is set up:
1. ✅ Your backend can store data
2. ✅ Your app can create users
3. ✅ Your app can create appointments
4. ✅ Your app can manage advisors
5. ✅ Everything is connected!

## 📚 Need More Help?

- **Quick Setup**: See `QUICK_SETUP.md` (5-minute guide)
- **Detailed Guide**: See `DATABASE_SETUP_GUIDE.md` (step-by-step)
- **Checklist**: See `SETUP_CHECKLIST.md` (verify everything)
- **Troubleshooting**: Check error messages and see guides above

## 🆘 Common Issues

### "Missing Supabase environment variables"
→ Make sure you created `.env` file in `backend/` folder
→ Check that you copied the credentials correctly

### "Supabase connection error"
→ Verify your Supabase URL is correct
→ Check your service role key is correct
→ Make sure your Supabase project is active

### "Table does not exist"
→ Run the SQL schema again in Supabase SQL Editor
→ Check for errors in the SQL script

---

## 🎉 Ready to Start?

1. Follow the steps above
2. Run `npm run test-connection` to verify
3. Start your backend: `npm run dev`
4. Start developing!

**Good luck! 🚀**

