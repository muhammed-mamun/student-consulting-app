# Connecting Students with Advisors - Project Plan

## Project Overview
A mobile application that provides an efficient digital platform for scheduling consultations between students and academic advisors at Khwaja Yunus Ali University.

## Technology Stack

### Frontend (React Native)
- **Framework**: React Native with Expo
- **Language**: JavaScript/TypeScript
- **UI Framework**: React Native Components / React Navigation
- **State Management**: React Context API / Redux (optional)
- **Local Database**: SQLite (Expo SQLite for JWT tokens, session data, caching)
- **Design Tool**: Figma (UI/UX designs)
- **Development**: Expo CLI, Expo Go app for testing

### Backend
- **Runtime**: Node.js
- **Database**: Supabase (Managed PostgreSQL)
- **Authentication**: Firebase Authentication
- **Real-time Sync**: Supabase Realtime / Firebase Realtime Database
- **API Framework**: Express.js
- **Version Control**: GitHub

## System Architecture

### Client-Server Architecture
```
React Native App (Expo)
    ↕
Firebase Authentication (User Auth)
    ↕
Node.js Backend (Express API)
    ↕
Supabase (Managed PostgreSQL Database)
    ↕
Supabase Realtime / Firebase Realtime Database (Real-time Updates)
```

### Data Flow
1. User authentication via Firebase Auth
2. API requests to Node.js backend
3. Data persistence in Supabase (PostgreSQL)
4. Real-time updates via Supabase Realtime or Firebase Realtime Database
5. Local caching in SQLite for offline support

## Database Design

### Supabase (PostgreSQL) Schema

Note: Supabase uses PostgreSQL, so the schema is compatible with standard PostgreSQL. The database is managed by Supabase cloud service.

#### 1. Users Table
```sql
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
```

#### 2. Advisors Table
```sql
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. Appointments Table
```sql
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
    UNIQUE(advisor_id, appointment_date, appointment_time)
);
```

#### 4. Notifications Table
```sql
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
```

#### 5. Feedback Table
```sql
CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    advisor_id INTEGER REFERENCES advisors(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### SQLite Schema (Android Local Database)

#### 1. Session Table
```sql
CREATE TABLE session (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jwt_token TEXT NOT NULL,
    user_id TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);
```

#### 2. Cached Appointments Table
```sql
CREATE TABLE cached_appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    appointment_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    advisor_id INTEGER NOT NULL,
    appointment_date TEXT NOT NULL,
    appointment_time TEXT NOT NULL,
    issue_category TEXT NOT NULL,
    issue_description TEXT,
    status TEXT NOT NULL,
    last_synced INTEGER NOT NULL
);
```

#### 3. Cached Notifications Table
```sql
CREATE TABLE cached_notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    notification_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL
);
```

## API Endpoints Design

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/refresh-token` - Refresh JWT token

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/students` - Get all students (advisor only)
- `GET /api/users/advisors` - Get all advisors

### Advisor Endpoints
- `GET /api/advisors` - Get all advisors
- `GET /api/advisors/:id` - Get advisor details
- `GET /api/advisors/:id/availability` - Get advisor availability
- `PUT /api/advisors/profile` - Update advisor profile (advisor only)
- `PUT /api/advisors/availability` - Update availability (advisor only)

### Appointment Endpoints
- `POST /api/appointments` - Create new appointment (student only)
- `GET /api/appointments` - Get user's appointments
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id/approve` - Approve appointment (advisor only)
- `PUT /api/appointments/:id/reject` - Reject appointment (advisor only)
- `PUT /api/appointments/:id/complete` - Mark appointment as completed
- `DELETE /api/appointments/:id` - Cancel appointment

### Notification Endpoints
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete notification

### Feedback Endpoints
- `POST /api/feedback` - Submit feedback (student only)
- `GET /api/feedback/:appointmentId` - Get feedback for appointment
- `GET /api/feedback/advisor/:advisorId` - Get all feedback for advisor

## React Native Expo Project Structure

```
mobile/
├── app.json
├── package.json
├── App.js / App.tsx
├── babel.config.js
├── metro.config.js
├── .env
├── src/
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   └── AuthLoadingScreen.js
│   │   ├── student/
│   │   │   ├── StudentDashboardScreen.js
│   │   │   ├── BookingScreen.js
│   │   │   ├── AppointmentsListScreen.js
│   │   │   └── AppointmentDetailsScreen.js
│   │   ├── advisor/
│   │   │   ├── AdvisorDashboardScreen.js
│   │   │   ├── AppointmentRequestsScreen.js
│   │   │   └── AvailabilityScreen.js
│   │   ├── shared/
│   │   │   ├── ProfileScreen.js
│   │   │   ├── NotificationsScreen.js
│   │   │   └── FeedbackScreen.js
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.js
│   │   │   ├── Input.js
│   │   │   ├── Card.js
│   │   │   └── Loading.js
│   │   ├── appointments/
│   │   │   ├── AppointmentCard.js
│   │   │   └── AppointmentList.js
│   │   ├── advisors/
│   │   │   ├── AdvisorCard.js
│   │   │   └── AdvisorList.js
│   │   └── notifications/
│   │       └── NotificationItem.js
│   ├── navigation/
│   │   ├── AppNavigator.js
│   │   ├── AuthNavigator.js
│   │   ├── StudentNavigator.js
│   │   └── AdvisorNavigator.js
│   ├── services/
│   │   ├── api/
│   │   │   ├── apiClient.js
│   │   │   ├── authService.js
│   │   │   ├── appointmentService.js
│   │   │   ├── advisorService.js
│   │   │   └── notificationService.js
│   │   ├── database/
│   │   │   ├── database.js
│   │   │   ├── sessionStorage.js
│   │   │   └── cacheService.js
│   │   ├── firebase/
│   │   │   └── firebaseService.js
│   │   └── storage/
│   │       └── tokenStorage.js
│   ├── context/
│   │   ├── AuthContext.js
│   │   ├── AppContext.js
│   │   └── NotificationContext.js
│   ├── utils/
│   │   ├── validation.js
│   │   ├── formatters.js
│   │   └── constants.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useAppointments.js
│   │   └── useNotifications.js
│   └── models/
│       ├── User.js
│       ├── Advisor.js
│       ├── Appointment.js
│       ├── Notification.js
│       └── Feedback.js
├── assets/
│   ├── images/
│   ├── fonts/
│   └── icons/
└── __tests__/
```

## Node.js Backend Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── firebase.js
│   │   └── config.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Advisor.js
│   │   ├── Appointment.js
│   │   ├── Notification.js
│   │   └── Feedback.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── advisors.js
│   │   ├── appointments.js
│   │   ├── notifications.js
│   │   └── feedback.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── advisorController.js
│   │   ├── appointmentController.js
│   │   ├── notificationController.js
│   │   └── feedbackController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── firebaseAdmin.js
│   │   ├── jwt.js
│   │   └── logger.js
│   ├── services/
│   │   ├── firebaseService.js
│   │   └── notificationService.js
│   └── server.js
├── .env
├── package.json
└── README.md
```

## Implementation Phases

### Phase 1: Project Setup (Week 1)
- [ ] Initialize React Native Expo project
- [ ] Initialize Node.js backend project
- [ ] Set up Firebase project
- [ ] Configure Supabase database
- [ ] Set up Git repository
- [ ] Create project documentation
- [ ] Configure Expo development environment

### Phase 2: Authentication Module (Week 2)
- [ ] Implement Firebase Authentication (React Native)
- [ ] Create login/register screens (React Native)
- [ ] Implement navigation (React Navigation)
- [ ] Implement JWT token management
- [ ] Set up Expo SQLite for session storage
- [ ] Create authentication API endpoints
- [ ] Test authentication flow

### Phase 3: Database & Models (Week 3)
- [ ] Create Supabase database schema
- [ ] Set up database models (backend)
- [ ] Create Expo SQLite schema for local storage
- [ ] Implement data access layer (React Native)
- [ ] Create API models and DTOs
- [ ] Set up API service layer (React Native)

### Phase 4: User Management (Week 4)
- [ ] Implement user profile management
- [ ] Create advisor registration flow
- [ ] Implement user role management
- [ ] Create user profile screens
- [ ] Test user management features

### Phase 5: Appointment Booking (Week 5-6)
- [ ] Implement appointment creation
- [ ] Create booking interface
- [ ] Implement availability checking
- [ ] Create appointment list views
- [ ] Implement appointment status management
- [ ] Test appointment booking flow

### Phase 6: Advisor Dashboard (Week 7)
- [ ] Create advisor dashboard
- [ ] Implement appointment approval/rejection
- [ ] Create advisor availability management
- [ ] Implement advisor profile management
- [ ] Test advisor functionalities

### Phase 7: Notification System (Week 8)
- [ ] Implement Firebase Realtime Database integration
- [ ] Create notification service
- [ ] Implement push notifications
- [ ] Create notification UI
- [ ] Test notification system

### Phase 8: UI/UX Integration (Week 9)
- [ ] Implement Figma designs in React Native
- [ ] Apply React Native styling best practices
- [ ] Optimize user interface
- [ ] Implement responsive layouts
- [ ] Add animations and transitions
- [ ] User testing and feedback

### Phase 9: Testing & Debugging (Week 10)
- [ ] Unit testing
- [ ] Integration testing
- [ ] Functional testing
- [ ] Performance testing
- [ ] Bug fixes and optimization

### Phase 10: Deployment Preparation (Week 11)
- [ ] Prepare for production
- [ ] Security audit
- [ ] Performance optimization
- [ ] Documentation completion
- [ ] Build Android APK (Expo)
- [ ] Build iOS IPA (Expo)
- [ ] Submit to Google Play Store
- [ ] Submit to Apple App Store (optional)

## Supabase Configuration

### Supabase Database
- Managed PostgreSQL database
- Auto-generated REST API
- Real-time subscriptions for database changes
- Row Level Security (RLS) policies
- Database backups and automatic scaling
- SQL Editor for running queries
- Database migrations support

### Supabase Setup
1. Create a Supabase project at https://supabase.com
2. Get project URL and API keys
3. Run database schema SQL in Supabase SQL Editor
4. Configure Row Level Security policies
5. Enable Realtime for required tables
6. Set up database connections in backend

## Firebase Configuration

### Firebase Authentication
- Email/Password authentication
- User role management
- Token generation and validation

### Real-time Updates
- Supabase Realtime for database changes (recommended)
- Firebase Realtime Database (optional) for additional notifications
- Real-time appointment updates
- Notification synchronization
- Presence tracking

## Security Considerations

1. **Authentication**: Firebase Auth + JWT tokens
2. **API Security**: HTTPS only, rate limiting
3. **Data Validation**: Input validation on both client and server
4. **SQL Injection Prevention**: Parameterized queries
5. **Token Management**: Secure token storage in SQLite
6. **Role-Based Access Control**: Verify user roles for API endpoints

## Future Enhancements

1. **Integrated Chat**: Real-time messaging between students and advisors
2. **Video Consultation**: Zoom/Google Meet integration
3. **Google Calendar Integration**: Automatic schedule synchronization
4. **Department Management**: Admin dashboard for department management
5. **Feedback System**: Rating and review system
6. **Analytics Dashboard**: Appointment statistics and insights
7. **Multi-language Support**: Support for multiple languages
8. **Push Notifications**: Firebase Cloud Messaging for mobile notifications

## Team Responsibilities

### Mamun Hossain (Team Leader & Backend Developer)
- Project management and coordination
- Backend development (Node.js, Supabase)
- Firebase integration
- Supabase setup and configuration
- API development
- Database design and management

### Jarziz Ahmed (UI/UX Designer)
- Figma design and wireframing
- User interface design
- User experience optimization
- Visual design and branding

### Mahmudul Hassan (Frontend Developer)
- React Native Expo app development
- UI implementation with React Native
- Frontend-backend integration
- Expo SQLite local database
- React Navigation setup
- Testing and debugging

## Development Guidelines

1. **Code Standards**: Follow JavaScript/TypeScript and React Native best practices
2. **Git Workflow**: Use feature branches and pull requests
3. **Documentation**: Document all APIs and functions
4. **Testing**: Write tests for critical functionalities (Jest, React Native Testing Library)
5. **Version Control**: Regular commits with meaningful messages
6. **Code Review**: All code must be reviewed before merging
7. **Component Structure**: Follow React Native component patterns
8. **State Management**: Use Context API or Redux for global state

## Resources and References

- React Native Documentation: https://reactnative.dev/docs/getting-started
- Expo Documentation: https://docs.expo.dev/
- Firebase Documentation: https://firebase.google.com/docs
- Supabase Documentation: https://supabase.com/docs
- React Navigation: https://reactnavigation.org/
- Figma Design Resources: https://www.figma.com/resources
- GitHub Guides: https://guides.github.com/
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Node.js Documentation: https://nodejs.org/docs/

## Timeline

- **Total Duration**: 11 weeks
- **Start Date**: [To be determined]
- **Expected Completion**: [To be determined]

---

*This project plan is subject to updates and modifications based on development progress and requirements.*

