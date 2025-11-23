# Quick Setup Guide
## Get Your Database Running in 5 Minutes

This is a simplified guide to get you started quickly. For detailed instructions, see `DATABASE_SETUP_GUIDE.md`.

## 🚀 Quick Start (5 Steps)

### Step 1: Create Supabase Account & Project (2 minutes)
1. Go to https://supabase.com and sign up
2. Click "New Project"
3. Fill in project details and create project
4. Wait for project to be created

### Step 2: Get Supabase Credentials (1 minute)
1. Go to Project Settings > API
2. Copy these 3 values:
   - Project URL
   - `anon` public key
   - `service_role` key (keep this secret!)

### Step 3: Run Database Schema (1 minute)
1. Go to SQL Editor in Supabase
2. Open `database/postgresql_schema.sql` from your project
3. Copy and paste the entire SQL script
4. Click "Run"
5. Verify tables are created in Table Editor

### Step 4: Configure Backend (1 minute)
1. Go to `backend/` directory
2. Create `.env` file:
```env
PORT=3000
NODE_ENV=development

SUPABASE_URL=your-supabase-url-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Generate a random secret for JWT
JWT_SECRET=your-random-secret-key-here

CORS_ORIGIN=http://localhost:3000
```

3. Replace the placeholder values with your actual Supabase credentials

### Step 5: Test Connection (30 seconds)
```bash
cd backend
npm install
npm run test-connection
```

You should see:
```
✅ Supabase connection successful!
✅ All database tables are accessible!
🎉 All tests passed!
```

## ✅ That's It!

Your database is now set up! You can:
- Start the backend: `npm run dev`
- Start developing your app
- Test API endpoints

## 🔥 Next: Set Up Firebase (Optional but Recommended)

Firebase is used for authentication. To set it up:

1. Go to https://console.firebase.google.com/
2. Create a new project
3. Enable Email/Password authentication
4. Generate service account key
5. Add Firebase credentials to `backend/.env`
6. Add Firebase config to `mobile/.env`

See `DATABASE_SETUP_GUIDE.md` for detailed Firebase setup.

## 🆘 Troubleshooting

### "Missing Supabase environment variables"
- Make sure you created `.env` file in `backend/` directory
- Check that your credentials are correct
- Make sure there are no extra spaces or quotes

### "Supabase connection error"
- Verify your Supabase URL is correct
- Check your service role key is correct
- Make sure your Supabase project is active
- Check your internet connection

### "Table does not exist"
- Run the SQL schema again in Supabase SQL Editor
- Check for any errors in the SQL script
- Verify tables in Table Editor

### "Cannot connect to backend"
- Make sure backend server is running: `npm run dev`
- Check the port (default: 3000)
- Verify CORS settings

## 📚 Need More Help?

- **Detailed Setup**: See `DATABASE_SETUP_GUIDE.md`
- **Checklist**: See `SETUP_CHECKLIST.md`
- **Supabase Setup**: See `SUPABASE_SETUP.md`
- **Development Guide**: See `DEVELOPMENT_GUIDE.md`

---

**Ready to code! 🚀**

