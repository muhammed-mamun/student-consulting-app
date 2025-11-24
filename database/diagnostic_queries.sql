-- Diagnostic Queries for Accept/Reject Issue
-- Run these in Supabase SQL Editor to identify the problem

-- ============================================================================
-- 1. CHECK IF RLS IS ENABLED (should be TRUE)
-- ============================================================================
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'advisors', 'appointments', 'notifications');

-- Expected: All tables should show rowsecurity = true


-- ============================================================================
-- 2. LIST ALL ACTIVE POLICIES
-- ============================================================================
SELECT tablename, policyname, cmd, permissive
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Expected: Should see all the policies we created


-- ============================================================================
-- 3. CHECK ADVISOR RECORDS (Replace with actual firebase_uid)
-- ============================================================================
-- First, find a teacher's firebase_uid from your Firebase Auth
-- Then run this query:

SELECT 
    u.id as user_id,
    u.firebase_uid,
    u.email,
    u.role,
    a.id as advisor_id,
    a.department,
    a.designation
FROM users u
LEFT JOIN advisors a ON a.user_id = u.id
WHERE u.role = 'advisor'
ORDER BY u.created_at DESC;

-- Expected: Each advisor user should have a matching advisor record
-- If advisor_id is NULL, that's the problem!


-- ============================================================================
-- 4. CHECK IF SERVICE ROLE BYPASSES RLS
-- ============================================================================
-- This query checks if your backend is using service role correctly
-- Run this to see current role:
SELECT current_user, current_setting('role');

-- If using service role key, should show 'service_role' or similar


-- ============================================================================
-- 5. TEST ADVISOR LOOKUP (Replace firebase_uid with actual value)
-- ============================================================================
-- Replace 'TEACHER_FIREBASE_UID_HERE' with the actual firebase_uid of a teacher
-- who is having the problem

WITH user_lookup AS (
    SELECT id, firebase_uid, email, role
    FROM users
    WHERE firebase_uid = 'TEACHER_FIREBASE_UID_HERE'
)
SELECT 
    u.*,
    a.id as advisor_id,
    a.department
FROM user_lookup u
LEFT JOIN advisors a ON a.user_id = u.id;

-- Expected: Should return both user and advisor data
-- If advisor_id is NULL, the advisor record is missing!


-- ============================================================================
-- 6. CHECK PENDING APPOINTMENTS FOR SPECIFIC ADVISOR
-- ============================================================================
-- Replace ADVISOR_ID with actual advisor ID from query #3

SELECT 
    apt.id,
    apt.status,
    apt.appointment_date,
    apt.appointment_time,
    s.first_name || ' ' || s.last_name as student_name
FROM appointments apt
JOIN users s ON s.id = apt.student_id
WHERE apt.advisor_id = ADVISOR_ID  -- Replace with actual advisor ID
AND apt.status = 'Pending'
ORDER BY apt.created_at DESC;


-- ============================================================================
-- SOLUTION BASED ON FINDINGS:
-- ============================================================================

-- If Query #3 shows NULL advisor_id for some teachers:
-- PROBLEM: Teacher user exists but advisor record is missing
-- SOLUTION: Create advisor records for those teachers

-- Example fix (adjust values as needed):
-- INSERT INTO advisors (user_id, department, designation, bio)
-- SELECT 
--     id,
--     'Computer Science',  -- Change to actual department
--     'Professor',         -- Change to actual designation
--     'Advisor profile'    -- Change to actual bio
-- FROM users 
-- WHERE role = 'advisor' 
-- AND id NOT IN (SELECT user_id FROM advisors);
