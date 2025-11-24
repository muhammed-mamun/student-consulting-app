-- Quick Query to Find Invalid Teachers (No Advisor Record)
-- Run this in Supabase SQL Editor to see which teachers need to be deleted

SELECT 
    u.id as user_id,
    u.firebase_uid,
    u.email,
    u.first_name || ' ' || u.last_name as name,
    u.created_at,
    a.id as advisor_id,
    CASE 
        WHEN a.id IS NULL THEN '❌ INVALID - No advisor record'
        ELSE '✅ Valid'
    END as status
FROM users u
LEFT JOIN advisors a ON a.user_id = u.id
WHERE u.role = 'advisor'
ORDER BY a.id IS NULL DESC, u.created_at DESC;

-- Copy the email addresses of invalid teachers and use:
-- node delete-teacher.js <email>
