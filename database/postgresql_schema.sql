-- PostgreSQL Database Schema for Advising App
-- Connecting Students with Advisors
-- 
-- This schema is designed for Supabase (Managed PostgreSQL)
-- Supabase uses PostgreSQL, so this schema is fully compatible
-- 
-- To use this schema:
-- 1. Create a Supabase project at https://supabase.com
-- 2. Go to SQL Editor in Supabase dashboard
-- 3. Copy and paste this entire script
-- 4. Run the script to create all tables
-- 
-- For detailed setup instructions, see SUPABASE_SETUP.md

-- Enable UUID extension (if needed)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firebase_uid VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'advisor')),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_role ON users(role);

-- Advisors Table
CREATE TABLE advisors (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    consultation_hours_start TIME,
    consultation_hours_end TIME,
    available_days VARCHAR(50), -- e.g., "Monday,Wednesday,Friday"
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Create index on user_id for faster lookups
CREATE INDEX idx_advisors_user_id ON advisors(user_id);
CREATE INDEX idx_advisors_department ON advisors(department);

-- Appointments Table
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    advisor_id INTEGER REFERENCES advisors(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    issue_category VARCHAR(50) NOT NULL, -- Course Issues, Thesis Discussion, Personal Counseling
    issue_description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_advisor_time_slot UNIQUE(advisor_id, appointment_date, appointment_time)
);

-- Create indexes for faster queries
CREATE INDEX idx_appointments_student_id ON appointments(student_id);
CREATE INDEX idx_appointments_advisor_id ON appointments(advisor_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_advisor_date ON appointments(advisor_id, appointment_date);

-- Notifications Table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    appointment_id INTEGER REFERENCES appointments(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- appointment_request, appointment_approved, appointment_rejected, etc.
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_appointment_id ON notifications(appointment_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Feedback Table
CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    advisor_id INTEGER REFERENCES advisors(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_feedback_per_appointment UNIQUE(appointment_id)
);

-- Create indexes for feedback
CREATE INDEX idx_feedback_appointment_id ON feedback(appointment_id);
CREATE INDEX idx_feedback_advisor_id ON feedback(advisor_id);
CREATE INDEX idx_feedback_student_id ON feedback(student_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_advisors_updated_at BEFORE UPDATE ON advisors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data insertion (for testing)
-- Insert sample users
INSERT INTO users (firebase_uid, email, role, first_name, last_name, phone_number) VALUES
('firebase_uid_1', 'student1@kyau.edu.bd', 'student', 'John', 'Doe', '01712345678'),
('firebase_uid_2', 'advisor1@kyau.edu.bd', 'advisor', 'Dr. Jane', 'Smith', '01712345679');

-- Insert sample advisor
INSERT INTO advisors (user_id, department, designation, consultation_hours_start, consultation_hours_end, available_days, bio) VALUES
(2, 'Computer Science and Engineering', 'Professor', '10:00:00', '12:00:00', 'Monday,Wednesday,Friday', 'Expert in Software Engineering and Database Systems');

-- Note: Remember to replace firebase_uid values with actual Firebase UIDs after Firebase setup

