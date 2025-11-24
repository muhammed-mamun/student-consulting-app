-- Fix for Existing Teachers Without Advisor Records
-- This script creates advisor records for teachers who registered via the mobile app
-- and don't have corresponding entries in the advisors table

-- ============================================================================
-- STEP 1: View teachers without advisor records
-- ============================================================================
SELECT 
    u.id as user_id,
    u.firebase_uid,
    u.email,
    u.first_name,
    u.last_name,
    u.role,
    a.id as advisor_id
FROM users u
LEFT JOIN advisors a ON a.user_id = u.id
WHERE u.role = 'advisor' 
AND a.id IS NULL;

-- If this returns any rows, those teachers need advisor records created


-- ============================================================================
-- STEP 2: Create advisor records for teachers without them
-- ============================================================================
-- This will create advisor records with default values
-- You can update department and designation later

INSERT INTO advisors (user_id, department, designation, bio)
SELECT 
    u.id,
    'General',  -- Default department - update later if needed
    'Teacher',  -- Default designation - update later if needed
    'Advisor profile created automatically'
FROM users u
WHERE u.role = 'advisor' 
AND u.id NOT IN (SELECT user_id FROM advisors WHERE user_id IS NOT NULL);

-- ============================================================================
-- STEP 3: Verify all teachers now have advisor records
-- ============================================================================
SELECT 
    u.id as user_id,
    u.email,
    u.first_name || ' ' || u.last_name as name,
    a.id as advisor_id,
    a.department,
    a.designation
FROM users u
LEFT JOIN advisors a ON a.user_id = u.id
WHERE u.role = 'advisor'
ORDER BY u.created_at DESC;

-- Expected: All rows should have advisor_id populated (not NULL)


-- ============================================================================
-- STEP 4: Update specific teacher's department and designation (OPTIONAL)
-- ============================================================================
-- Replace the email and values as needed

-- UPDATE advisors 
-- SET 
--     department = 'Computer Science and Engineering',
--     designation = 'Assistant Professor'
-- WHERE user_id IN (
--     SELECT id FROM users WHERE email = 'teacher@kyau.edu.bd'
-- );
