-- SQLite Database Schema for Android Local Storage
-- Connecting Students with Advisors - Local Database

-- Session Table - Stores JWT tokens and user session data
CREATE TABLE IF NOT EXISTS session (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jwt_token TEXT NOT NULL,
    user_id TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);

-- Cached Appointments Table - Stores appointment data for offline access
CREATE TABLE IF NOT EXISTS cached_appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    appointment_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    advisor_id INTEGER NOT NULL,
    advisor_name TEXT,
    appointment_date TEXT NOT NULL,
    appointment_time TEXT NOT NULL,
    issue_category TEXT NOT NULL,
    issue_description TEXT,
    status TEXT NOT NULL,
    last_synced INTEGER NOT NULL
);

-- Cached Notifications Table - Stores notifications for offline access
CREATE TABLE IF NOT EXISTS cached_notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    notification_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL
);

-- Cached Advisors Table - Stores advisor data for offline access
CREATE TABLE IF NOT EXISTS cached_advisors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    advisor_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    designation TEXT NOT NULL,
    consultation_hours_start TEXT,
    consultation_hours_end TEXT,
    available_days TEXT,
    bio TEXT,
    last_synced INTEGER NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_session_user_id ON session(user_id);
CREATE INDEX IF NOT EXISTS idx_session_expires_at ON session(expires_at);
CREATE INDEX IF NOT EXISTS idx_cached_appointments_student_id ON cached_appointments(student_id);
CREATE INDEX IF NOT EXISTS idx_cached_appointments_advisor_id ON cached_appointments(advisor_id);
CREATE INDEX IF NOT EXISTS idx_cached_appointments_status ON cached_appointments(status);
CREATE INDEX IF NOT EXISTS idx_cached_appointments_date ON cached_appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_cached_notifications_is_read ON cached_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_cached_notifications_created_at ON cached_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cached_advisors_department ON cached_advisors(department);

-- Note: 
-- - All timestamps are stored as Unix timestamps (INTEGER)
-- - Dates are stored as TEXT in ISO format (YYYY-MM-DD)
-- - Times are stored as TEXT in 24-hour format (HH:MM:SS)
-- - Boolean values are stored as INTEGER (0 = false, 1 = true)

