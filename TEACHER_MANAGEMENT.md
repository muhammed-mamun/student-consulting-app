# Teacher/Advisor Management Guide

This guide explains how to add and delete teachers/advisors in the system.

## Important Notes

⚠️ **Teachers CANNOT register themselves via the mobile app**  
✅ **Only administrators can add teachers using the scripts below**  
📱 **Students can register normally via the mobile app**

---

## Adding a New Teacher

### Command

```bash
cd backend
node add-teacher.js <email> <password> <firstName> <lastName> [phoneNumber] [department] [designation]
```

### Parameters

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| email | ✅ Yes | Teacher's email address | `teacher@kyau.edu.bd` |
| password | ✅ Yes | Initial password (teacher can change later) | `password123` |
| firstName | ✅ Yes | First name | `"Dr. John"` |
| lastName | ✅ Yes | Last name | `"Smith"` |
| phoneNumber | ❌ No | Phone number | `"01712345678"` |
| department | ❌ No | Department name | `"Computer Science"` |
| designation | ❌ No | Job title | `"Professor"` |

### Examples

**Minimal (required fields only):**
```bash
node add-teacher.js teacher@kyau.edu.bd password123 "John" "Doe"
```

**With phone number:**
```bash
node add-teacher.js teacher@kyau.edu.bd password123 "John" "Doe" "01712345678"
```

**Complete (all fields):**
```bash
node add-teacher.js teacher@kyau.edu.bd password123 "Dr. John" "Smith" "01712345678" "Computer Science and Engineering" "Professor"
```

### What Happens

The script will:
1. ✅ Create user in Firebase Authentication
2. ✅ Create user record in Supabase `users` table
3. ✅ Create advisor record in Supabase `advisors` table
4. ✅ Display login credentials

### Output Example

```
🎉 Success! Teacher/Advisor added successfully!

📋 Login Credentials:
   Email: teacher@kyau.edu.bd
   Password: password123
   Role: advisor

💡 The teacher can now login to the app using these credentials.
```

---

## Deleting a Teacher

### Command

```bash
cd backend
node delete-teacher.js <email>
```

### Parameters

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| email | ✅ Yes | Teacher's email address to delete | `teacher@kyau.edu.bd` |

### Example

```bash
node delete-teacher.js teacher@kyau.edu.bd
```

### What Happens

The script will:
1. ✅ Delete user from Firebase Authentication
2. ✅ Delete advisor record from Supabase
3. ✅ Delete user record from Supabase
4. ✅ Automatically delete all related data:
   - Appointments
   - Notifications
   - Feedback

### Safety Features

- ⚠️ Only allows deleting users with role='advisor'
- 📊 Shows what will be deleted before proceeding
- ✅ Handles orphaned records gracefully

### Output Example

```
🎉 Success! Teacher/Advisor deleted completely!

📋 Summary:
   Email: teacher@kyau.edu.bd
   User ID: 13
   Advisor Record: Deleted
   Appointments Deleted: 5
   Notifications Deleted: 12
   Firebase User: Deleted
```

---

## Finding Invalid Teachers

If you need to find teachers who were registered incorrectly (without advisor records), run this SQL query in Supabase:

```sql
SELECT 
    u.email,
    u.first_name || ' ' || u.last_name as name,
    CASE 
        WHEN a.id IS NULL THEN '❌ INVALID'
        ELSE '✅ Valid'
    END as status
FROM users u
LEFT JOIN advisors a ON a.user_id = u.id
WHERE u.role = 'advisor'
ORDER BY a.id IS NULL DESC;
```

Or use the provided file:
```bash
# View the query
cat database/find_invalid_teachers.sql
```

Then delete invalid teachers using:
```bash
node delete-teacher.js <invalid-teacher-email>
```

---

## Troubleshooting

### Error: "Email already exists in Firebase"

The script will automatically find the existing user and:
- If user exists in Supabase: Skip creation
- If user missing in Supabase: Create the missing records

### Error: "User not found"

When deleting, if the user doesn't exist:
- Script will check both Firebase and Supabase
- Clean up any orphaned records
- Exit gracefully

### Teacher can't accept/reject appointments

This means the advisor record is missing. Options:

**Option 1: Delete and re-add**
```bash
node delete-teacher.js teacher@kyau.edu.bd
node add-teacher.js teacher@kyau.edu.bd password123 "Name" "Last" "Phone" "Dept" "Title"
```

**Option 2: Fix existing teacher**
Run this SQL in Supabase:
```sql
INSERT INTO advisors (user_id, department, designation)
SELECT id, 'General', 'Teacher'
FROM users 
WHERE email = 'teacher@kyau.edu.bd';
```

---

## Quick Reference

### Add Teacher (Minimal)
```bash
cd backend
node add-teacher.js email@kyau.edu.bd password123 "First" "Last"
```

### Add Teacher (Complete)
```bash
cd backend
node add-teacher.js email@kyau.edu.bd password123 "Dr. First" "Last" "01712345678" "Computer Science" "Professor"
```

### Delete Teacher
```bash
cd backend
node delete-teacher.js email@kyau.edu.bd
```

### Find Invalid Teachers
```bash
# In Supabase SQL Editor, run:
cat database/find_invalid_teachers.sql
```

---

## Important Reminders

1. 🔒 **Keep passwords secure** - Share credentials with teachers privately
2. 📧 **Use institutional emails** - Preferably @kyau.edu.bd addresses
3. ✅ **Verify after adding** - Have the teacher login to confirm
4. ⚠️ **Backup before deleting** - Deletion is permanent and cascades to all related data
5. 📱 **Students self-register** - Don't use these scripts for students

---

## Files Reference

| File | Purpose |
|------|---------|
| `backend/add-teacher.js` | Script to add teachers |
| `backend/delete-teacher.js` | Script to delete teachers |
| `database/find_invalid_teachers.sql` | Query to find invalid teachers |
| `database/fix_existing_teachers.sql` | SQL to fix teachers without advisor records |

---

## Need Help?

If you encounter issues:
1. Check the error message in the console
2. Verify your `.env` file has correct Supabase credentials
3. Ensure you're in the `backend` directory when running scripts
4. Check Supabase dashboard for database state
