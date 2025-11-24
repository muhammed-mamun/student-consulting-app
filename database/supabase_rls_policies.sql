-- Row Level Security (RLS) Policies for Advising App
-- These policies ensure data security and proper access control in production
-- 
-- IMPORTANT: Run this script in your Supabase SQL Editor
-- Location: Supabase Dashboard → SQL Editor → New Query
-- 
-- This fixes two critical issues:
-- 1. Advisors unable to access their own profile (blocking accept/reject)
-- 2. All teachers seeing notifications meant for specific advisors

-- ============================================================================
-- ENABLE RLS ON ALL TABLES (if not already enabled)
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE advisors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Users can read their own profile
DROP POLICY IF EXISTS "Users can read own profile" ON users;
CREATE POLICY "Users can read own profile"
ON users FOR SELECT
USING (firebase_uid = auth.uid()::text);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (firebase_uid = auth.uid()::text);

-- Allow service role to insert users (for registration)
DROP POLICY IF EXISTS "Service role can insert users" ON users;
CREATE POLICY "Service role can insert users"
ON users FOR INSERT
WITH CHECK (true);

-- ============================================================================
-- ADVISORS TABLE POLICIES
-- ============================================================================

-- Advisors can read their own profile
DROP POLICY IF EXISTS "Advisors can read own profile" ON advisors;
CREATE POLICY "Advisors can read own profile"
ON advisors FOR SELECT
USING (
  user_id IN (
    SELECT id FROM users WHERE firebase_uid = auth.uid()::text
  )
);

-- Students can read all advisor profiles (to browse and select advisors)
DROP POLICY IF EXISTS "Students can read all advisors" ON advisors;
CREATE POLICY "Students can read all advisors"
ON advisors FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE firebase_uid = auth.uid()::text 
    AND role = 'student'
  )
);

-- Advisors can update their own profile
DROP POLICY IF EXISTS "Advisors can update own profile" ON advisors;
CREATE POLICY "Advisors can update own profile"
ON advisors FOR UPDATE
USING (
  user_id IN (
    SELECT id FROM users WHERE firebase_uid = auth.uid()::text
  )
);

-- ============================================================================
-- APPOINTMENTS TABLE POLICIES
-- ============================================================================

-- Students can read their own appointments
DROP POLICY IF EXISTS "Students can read own appointments" ON appointments;
CREATE POLICY "Students can read own appointments"
ON appointments FOR SELECT
USING (
  student_id IN (
    SELECT id FROM users WHERE firebase_uid = auth.uid()::text
  )
);

-- Advisors can read appointments assigned to them
DROP POLICY IF EXISTS "Advisors can read own appointments" ON appointments;
CREATE POLICY "Advisors can read own appointments"
ON appointments FOR SELECT
USING (
  advisor_id IN (
    SELECT id FROM advisors WHERE user_id IN (
      SELECT id FROM users WHERE firebase_uid = auth.uid()::text
    )
  )
);

-- Students can create appointments
DROP POLICY IF EXISTS "Students can create appointments" ON appointments;
CREATE POLICY "Students can create appointments"
ON appointments FOR INSERT
WITH CHECK (
  student_id IN (
    SELECT id FROM users 
    WHERE firebase_uid = auth.uid()::text 
    AND role = 'student'
  )
);

-- Advisors can update appointments assigned to them
DROP POLICY IF EXISTS "Advisors can update own appointments" ON appointments;
CREATE POLICY "Advisors can update own appointments"
ON appointments FOR UPDATE
USING (
  advisor_id IN (
    SELECT id FROM advisors WHERE user_id IN (
      SELECT id FROM users WHERE firebase_uid = auth.uid()::text
    )
  )
);

-- Students can delete/cancel their own appointments
DROP POLICY IF EXISTS "Students can delete own appointments" ON appointments;
CREATE POLICY "Students can delete own appointments"
ON appointments FOR DELETE
USING (
  student_id IN (
    SELECT id FROM users WHERE firebase_uid = auth.uid()::text
  )
);

-- ============================================================================
-- NOTIFICATIONS TABLE POLICIES
-- ============================================================================
-- THIS IS THE KEY FIX FOR "ALL TEACHERS GETTING REQUESTS" ISSUE

-- Users can ONLY read their own notifications
DROP POLICY IF EXISTS "Users can read own notifications" ON notifications;
CREATE POLICY "Users can read own notifications"
ON notifications FOR SELECT
USING (
  user_id IN (
    SELECT id FROM users WHERE firebase_uid = auth.uid()::text
  )
);

-- Users can update their own notifications (mark as read)
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications"
ON notifications FOR UPDATE
USING (
  user_id IN (
    SELECT id FROM users WHERE firebase_uid = auth.uid()::text
  )
);

-- Allow system to insert notifications (service role)
DROP POLICY IF EXISTS "Service role can insert notifications" ON notifications;
CREATE POLICY "Service role can insert notifications"
ON notifications FOR INSERT
WITH CHECK (true);

-- Users can delete their own notifications
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
CREATE POLICY "Users can delete own notifications"
ON notifications FOR DELETE
USING (
  user_id IN (
    SELECT id FROM users WHERE firebase_uid = auth.uid()::text
  )
);

-- ============================================================================
-- FEEDBACK TABLE POLICIES
-- ============================================================================

-- Students can read their own feedback
DROP POLICY IF EXISTS "Students can read own feedback" ON feedback;
CREATE POLICY "Students can read own feedback"
ON feedback FOR SELECT
USING (
  student_id IN (
    SELECT id FROM users WHERE firebase_uid = auth.uid()::text
  )
);

-- Advisors can read feedback for their appointments
DROP POLICY IF EXISTS "Advisors can read own feedback" ON feedback;
CREATE POLICY "Advisors can read own feedback"
ON feedback FOR SELECT
USING (
  advisor_id IN (
    SELECT id FROM advisors WHERE user_id IN (
      SELECT id FROM users WHERE firebase_uid = auth.uid()::text
    )
  )
);

-- Students can create feedback for their appointments
DROP POLICY IF EXISTS "Students can create feedback" ON feedback;
CREATE POLICY "Students can create feedback"
ON feedback FOR INSERT
WITH CHECK (
  student_id IN (
    SELECT id FROM users WHERE firebase_uid = auth.uid()::text
  )
);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these queries to verify the policies are working correctly

-- Check if RLS is enabled on all tables
-- SELECT tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('users', 'advisors', 'appointments', 'notifications', 'feedback');

-- List all policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;
