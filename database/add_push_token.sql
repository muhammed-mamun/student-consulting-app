-- Add push_token column to users table for Expo Push Notifications
-- Run this in Supabase SQL Editor

-- Add push_token column
ALTER TABLE users ADD COLUMN IF NOT EXISTS push_token VARCHAR(255);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_push_token ON users(push_token);

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'push_token';
