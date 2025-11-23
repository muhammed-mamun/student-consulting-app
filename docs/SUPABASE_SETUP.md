# Supabase Setup Guide
## Connecting Students with Advisors

This guide provides detailed instructions for setting up Supabase for the Advising App project.

## What is Supabase?

Supabase is an open-source Firebase alternative that provides:
- **Managed PostgreSQL Database**: Fully managed PostgreSQL database
- **Auto-generated REST API**: Automatic REST API for your database
- **Real-time Subscriptions**: Real-time database changes
- **Row Level Security**: Fine-grained access control
- **Authentication**: Built-in authentication (optional, we're using Firebase Auth)
- **Storage**: File storage (optional)

## Prerequisites

- Supabase account (sign up at [https://supabase.com](https://supabase.com))
- Basic understanding of SQL and databases

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign up"**
3. Sign up with GitHub, Google, or email
4. Once logged in, click **"New Project"**
5. Fill in project details:
   - **Project Name**: `advising-app` (or your preferred name)
   - **Database Password**: Choose a strong password (save it securely!)
   - **Region**: Select the closest region to your users
   - **Pricing Plan**: Free tier is sufficient for development
6. Click **"Create new project"**
7. Wait for project to be created (2-3 minutes)

## Step 2: Get Supabase Credentials

1. In your project dashboard, go to **Project Settings** (gear icon)
2. Click on **API** in the left sidebar
3. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public** key: Used for client-side operations
   - **service_role** key: Used for server-side operations (keep secret!)

4. Copy these values - you'll need them for your `.env` file

## Step 3: Run Database Schema

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Open the file `database/postgresql_schema.sql` from the project
4. Copy the entire SQL script
5. Paste it into the SQL Editor
6. Click **"Run"** or press `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (Mac)
7. Wait for the script to execute successfully
8. You should see a success message

## Step 4: Verify Tables

1. Go to **Table Editor** (left sidebar)
2. You should see the following tables:
   - `users`
   - `advisors`
   - `appointments`
   - `notifications`
   - `feedback`

3. Click on each table to verify the structure

## Step 5: Configure Row Level Security (RLS)

Row Level Security (RLS) ensures that users can only access data they're allowed to see.

### Enable RLS on Tables

1. Go to **Authentication** > **Policies** (left sidebar)
2. For each table, click on it and enable RLS:
   - `users`: Enable RLS
   - `advisors`: Enable RLS
   - `appointments`: Enable RLS
   - `notifications`: Enable RLS
   - `feedback`: Enable RLS

### Create RLS Policies

#### Users Table Policies
```sql
-- Users can read their own profile
CREATE POLICY "Users can read own profile"
ON users FOR SELECT
USING (auth.uid()::text = firebase_uid);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid()::text = firebase_uid);
```

#### Advisors Table Policies
```sql
-- Anyone can read advisors (public list)
CREATE POLICY "Anyone can read advisors"
ON advisors FOR SELECT
USING (true);

-- Advisors can update their own profile
CREATE POLICY "Advisors can update own profile"
ON advisors FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = advisors.user_id
    AND users.firebase_uid = auth.uid()::text
  )
);
```

#### Appointments Table Policies
```sql
-- Students can read their own appointments
CREATE POLICY "Students can read own appointments"
ON appointments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = appointments.student_id
    AND users.firebase_uid = auth.uid()::text
  )
);

-- Advisors can read appointments for them
CREATE POLICY "Advisors can read their appointments"
ON appointments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM advisors
    JOIN users ON users.id = advisors.user_id
    WHERE advisors.id = appointments.advisor_id
    AND users.firebase_uid = auth.uid()::text
  )
);

-- Students can create appointments
CREATE POLICY "Students can create appointments"
ON appointments FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = appointments.student_id
    AND users.firebase_uid = auth.uid()::text
    AND users.role = 'student'
  )
);

-- Advisors can update their appointments
CREATE POLICY "Advisors can update their appointments"
ON appointments FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM advisors
    JOIN users ON users.id = advisors.user_id
    WHERE advisors.id = appointments.advisor_id
    AND users.firebase_uid = auth.uid()::text
  )
);
```

#### Notifications Table Policies
```sql
-- Users can read their own notifications
CREATE POLICY "Users can read own notifications"
ON notifications FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = notifications.user_id
    AND users.firebase_uid = auth.uid()::text
  )
);

-- System can create notifications (via service role)
CREATE POLICY "System can create notifications"
ON notifications FOR INSERT
WITH CHECK (true);
```

#### Feedback Table Policies
```sql
-- Users can read feedback for advisors
CREATE POLICY "Anyone can read feedback"
ON feedback FOR SELECT
USING (true);

-- Students can create feedback
CREATE POLICY "Students can create feedback"
ON feedback FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = feedback.student_id
    AND users.firebase_uid = auth.uid()::text
    AND users.role = 'student'
  )
);
```

**Note**: Since we're using Firebase Authentication, the RLS policies may need to be adjusted. You might need to disable RLS for server-side operations and handle authorization in your backend API.

## Step 6: Enable Realtime

1. Go to **Database** > **Replication** (left sidebar)
2. Enable replication for the following tables:
   - `appointments` - for real-time appointment updates
   - `notifications` - for real-time notifications

3. Click the toggle switch next to each table to enable replication

## Step 7: Configure Backend

1. Open your backend `.env` file
2. Add the following Supabase configuration:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

3. Replace the values with your actual Supabase credentials

## Step 8: Install Supabase Client

In your backend project, the Supabase client is already included in `package.json`:

```bash
npm install
```

This will install `@supabase/supabase-js` package.

## Step 9: Initialize Supabase Client

Create a file `backend/src/config/supabase.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with service role key (for server-side operations)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

module.exports = supabase;
```

## Step 10: Test Connection

Create a test file to verify the connection:

```javascript
const supabase = require('./src/config/supabase');

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count');
    
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Supabase connection successful!');
      console.log('Data:', data);
    }
  } catch (err) {
    console.error('Connection error:', err);
  }
}

testConnection();
```

## Step 11: Use Supabase in Your Backend

### Example: Query Users

```javascript
const supabase = require('./config/supabase');

// Get all users
const { data, error } = await supabase
  .from('users')
  .select('*');

// Get user by ID
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single();

// Insert user
const { data, error } = await supabase
  .from('users')
  .insert({
    firebase_uid: 'user-firebase-uid',
    email: 'user@example.com',
    role: 'student',
    first_name: 'John',
    last_name: 'Doe'
  });

// Update user
const { data, error } = await supabase
  .from('users')
  .update({ phone_number: '1234567890' })
  .eq('id', userId);

// Delete user
const { data, error } = await supabase
  .from('users')
  .delete()
  .eq('id', userId);
```

### Example: Real-time Subscriptions

```javascript
const supabase = require('./config/supabase');

// Subscribe to appointments changes
const subscription = supabase
  .channel('appointments')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'appointments' },
    (payload) => {
      console.log('New appointment:', payload.new);
      // Send notification to advisor
    }
  )
  .subscribe();
```

## Security Best Practices

1. **Never expose service_role key**: Keep it server-side only
2. **Use anon key for client-side**: Use anon key in Android app if needed
3. **Enable RLS**: Use Row Level Security for data access control
4. **Validate input**: Always validate input on the server side
5. **Use HTTPS**: Always use HTTPS in production
6. **Rotate keys**: Rotate API keys regularly
7. **Monitor usage**: Monitor API usage in Supabase dashboard

## Troubleshooting

### Issue: Connection Error
- Verify SUPABASE_URL is correct
- Check SUPABASE_SERVICE_ROLE_KEY is correct
- Ensure project is active in Supabase dashboard

### Issue: RLS Policy Error
- Check RLS policies are correctly configured
- Verify user authentication is working
- Consider disabling RLS for server-side operations if using Firebase Auth

### Issue: Real-time Not Working
- Ensure Realtime is enabled for the table
- Check table is in the replication list
- Verify subscription is properly set up

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)

## Next Steps

1. Set up Firebase Authentication (see Firebase setup guide)
2. Configure backend API to use Supabase
3. Test database operations
4. Set up real-time subscriptions
5. Deploy to production

---

**Last Updated**: [Date]  
**Version**: 1.0.0

