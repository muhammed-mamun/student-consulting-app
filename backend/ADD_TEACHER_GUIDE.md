# How to Add a Teacher/Advisor Directly

This guide shows you how to add a teacher/advisor to the system so they can login.

## Important Note

The system uses **Firebase for authentication** (email/password), so you need to create the user in Firebase first, then add them to Supabase. You **cannot** set passwords directly in Supabase - passwords are managed by Firebase.

## Method 1: Using the Script (Recommended)

The easiest way is to use the provided script that handles both Firebase and Supabase.

### Prerequisites

1. Make sure your backend `.env` file has:
   - Firebase Admin credentials (FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL)
   - Supabase credentials (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

2. Make sure the backend server dependencies are installed:
   ```bash
   cd backend
   npm install
   ```

### Usage

```bash
cd backend
node add-teacher.js <email> <password> <firstName> <lastName> [phoneNumber] [department] [designation]
```

### Examples

**Basic (without advisor details):**
```bash
node add-teacher.js teacher@kyau.edu.bd mypassword123 "Dr. John" "Smith"
```

**Complete (with advisor details):**
```bash
node add-teacher.js teacher@kyau.edu.bd mypassword123 "Dr. John" "Smith" "01712345678" "Computer Science and Engineering" "Professor"
```

**With spaces in names (use quotes):**
```bash
node add-teacher.js "teacher@kyau.edu.bd" "mypassword123" "Dr. John" "Smith" "01712345678" "Computer Science" "Associate Professor"
```

### What the Script Does

1. ✅ Creates user in Firebase with email/password
2. ✅ Creates user record in Supabase with Firebase UID
3. ✅ Creates advisor record (if department/designation provided)
4. ✅ Shows login credentials

### Output Example

```
📝 Adding teacher/advisor...
Email: teacher@kyau.edu.bd
Name: Dr. John Smith
Role: advisor

🔥 Step 1: Creating user in Firebase...
✅ Firebase user created successfully
   Firebase UID: abc123xyz789

💾 Step 2: Checking Supabase...
   Creating user in Supabase...
✅ User created in Supabase
   User ID: 5

👨‍🏫 Step 3: Creating advisor record...
✅ Advisor record created
   Advisor ID: 3
   Department: Computer Science and Engineering
   Designation: Professor

🎉 Success! Teacher/Advisor added successfully!

📋 Login Credentials:
   Email: teacher@kyau.edu.bd
   Password: mypassword123
   Role: advisor

💡 The teacher can now login to the app using these credentials.
```

---

## Method 2: Manual Process (Firebase Console + Supabase)

If you prefer to do it manually:

### Step 1: Create User in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Users**
4. Click **"Add user"**
5. Enter:
   - Email: `teacher@kyau.edu.bd`
   - Password: `your-password-here`
   - (Optional) Disable "Send email verification" if you want them to login immediately
6. Click **"Add user"**
7. **Copy the User UID** (you'll need this for Step 2)

### Step 2: Add User to Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Table Editor** → **users** table
4. Click **"Insert row"** or use **SQL Editor**

**Using Table Editor:**
- `firebase_uid`: (paste the UID from Firebase)
- `email`: `teacher@kyau.edu.bd`
- `role`: `advisor`
- `first_name`: `Dr. John`
- `last_name`: `Smith`
- `phone_number`: `01712345678` (optional)

**Using SQL Editor:**
```sql
INSERT INTO users (firebase_uid, email, role, first_name, last_name, phone_number)
VALUES (
  'paste-firebase-uid-here',
  'teacher@kyau.edu.bd',
  'advisor',
  'Dr. John',
  'Smith',
  '01712345678'
)
RETURNING *;
```

### Step 3: Create Advisor Record (Optional)

If you want to add advisor-specific details:

**Using SQL Editor:**
```sql
-- First, get the user_id from the users table
-- Then insert into advisors table
INSERT INTO advisors (user_id, department, designation, consultation_hours_start, consultation_hours_end, available_days, bio)
VALUES (
  (SELECT id FROM users WHERE email = 'teacher@kyau.edu.bd'),
  'Computer Science and Engineering',
  'Professor',
  '10:00:00',
  '12:00:00',
  'Monday,Wednesday,Friday',
  'Expert in Software Engineering'
)
RETURNING *;
```

---

## Method 3: Using Firebase Admin SDK (Programmatic)

You can also create a custom script using Firebase Admin SDK. See `add-teacher.js` for reference.

---

## Troubleshooting

### Error: Email already exists in Firebase
- The email is already registered. You can:
  - Use a different email
  - Reset the password in Firebase Console
  - The script will try to use the existing user

### Error: Email already exists in Supabase
- The email is already in the database. Check if the user exists and update if needed.

### User created but can't login
- Make sure the Firebase user email is verified (or disable email verification requirement)
- Check that the `firebase_uid` in Supabase matches the Firebase UID exactly
- Verify the password is correct

### Advisor record not created
- Make sure you provided both `department` and `designation` parameters
- Check that the `user_id` exists in the users table
- You can create the advisor record manually later

---

## Quick Reference

**Login credentials format:**
- Email: `teacher@kyau.edu.bd`
- Password: (the password you set in Firebase)
- Role: `advisor`

**Required fields for users table:**
- `firebase_uid` (from Firebase)
- `email`
- `role` (must be 'advisor' for teachers)
- `first_name`
- `last_name`
- `phone_number` (optional)

**Required fields for advisors table:**
- `user_id` (references users.id)
- `department`
- `designation`
- `consultation_hours_start` (optional)
- `consultation_hours_end` (optional)
- `available_days` (optional)
- `bio` (optional)

---

## How to Remove a Teacher/Advisor

### Method 1: Using the Script (Recommended)

The easiest way is to use the provided removal script.

**Basic removal (keeps Firebase user but disables it):**
```bash
cd backend
node remove-teacher.js teacher@kyau.edu.bd
```

**Complete removal (also deletes from Firebase):**
```bash
node remove-teacher.js teacher@kyau.edu.bd --delete-firebase
```

### What the Script Does

1. ✅ Finds the user in Supabase
2. ✅ Checks for advisor record and appointments
3. ✅ Deletes advisor record (if exists)
4. ✅ Deletes user from Supabase
5. ✅ Disables or deletes Firebase user (based on option)

### Output Example

```
🗑️  Removing teacher/advisor...
Email: teacher@kyau.edu.bd
Delete from Firebase: No (will only disable)

💾 Step 1: Finding user in Supabase...
✅ User found in Supabase
   User ID: 5
   Name: Dr. John Smith
   Role: advisor
   Firebase UID: abc123xyz789

👨‍🏫 Step 2: Checking advisor record...
✅ Advisor record found
   Advisor ID: 3
   Department: Computer Science and Engineering
   Designation: Professor

   Deleting advisor record...
✅ Advisor record deleted

💾 Step 3: Deleting user from Supabase...
✅ User deleted from Supabase

🔥 Step 4: Handling Firebase user...
   Found Firebase user with UID: abc123xyz789
   Disabling user in Firebase (not deleting)...
✅ Firebase user disabled (can be re-enabled later)

🎉 Success! Teacher/Advisor removed successfully!

📋 Summary:
   ✅ User deleted from Supabase
   ✅ Advisor record deleted
   ✅ Firebase user disabled

💡 Note: If there were appointments, they may need manual cleanup.
```

### Method 2: Manual Removal (Supabase SQL)

If you prefer to do it manually via Supabase:

**Step 1: Delete advisor record (if exists)**
```sql
-- First, find the user_id
SELECT id FROM users WHERE email = 'teacher@kyau.edu.bd';

-- Then delete the advisor record (replace USER_ID with the id from above)
DELETE FROM advisors WHERE user_id = USER_ID;
```

**Step 2: Delete user from Supabase**
```sql
DELETE FROM users WHERE email = 'teacher@kyau.edu.bd';
```

**Step 3: Handle Firebase user**
- Go to Firebase Console → Authentication → Users
- Find the user by email
- Either disable or delete the user

### Method 3: Using Supabase Table Editor

1. Go to Supabase Dashboard → Table Editor
2. **First, delete from `advisors` table:**
   - Find the advisor record
   - Click the row and select "Delete"
3. **Then, delete from `users` table:**
   - Find the user by email
   - Click the row and select "Delete"
4. **Handle Firebase user** (see Method 2, Step 3)

### Important Notes

⚠️ **Cascade Deletes:**
- Deleting a user will automatically delete related records due to foreign key constraints:
  - Appointments (if any)
  - Notifications
  - Feedback

⚠️ **Appointments:**
- If the advisor has pending or accepted appointments, consider handling them first
- The script will warn you if appointments exist

⚠️ **Firebase User:**
- By default, the script only **disables** the Firebase user (safer)
- Use `--delete-firebase` flag to permanently delete from Firebase
- Disabled users can be re-enabled later if needed

### Re-enabling a Disabled User

If you disabled a Firebase user and want to re-enable it:

1. Go to Firebase Console → Authentication → Users
2. Find the user by email
3. Click on the user
4. Toggle "Disable account" to OFF
5. Re-add the user to Supabase if needed

