# Connecting Students with Advisors
## Mobile Application for Academic Advising

A mobile application designed to provide an efficient and user-friendly digital platform for scheduling consultations between students and academic advisors at Khwaja Yunus Ali University.

## 🎯 Project Overview

This app solves the challenges of manual appointment scheduling by allowing students to register, log in, view their advisors' availability, and book appointments directly through their smartphones. Advisors can view appointment requests, approve or reject them, and manage their schedules in real time.

## 🚀 Features

### For Students
- User registration and authentication
- View available advisors
- Book appointments with advisors
- Select appointment time slots
- Choose issue categories (Course Issues, Thesis Discussion, Personal Counseling)
- View appointment status
- Receive real-time notifications
- Submit feedback after consultations

### For Advisors
- Advisor authentication
- View appointment requests
- Approve or reject appointments
- Manage availability and consultation hours
- View student appointment history
- Receive notifications for new requests
- View feedback and ratings

## 🛠️ Technology Stack

### Frontend (React Native)
- **Framework**: React Native with Expo
- **Language**: JavaScript/TypeScript
- **UI Framework**: React Native Components / React Navigation
- **State Management**: React Context API / Redux (optional)
- **Local Database**: Expo SQLite (for JWT tokens, session data, caching)
- **Design Tool**: Figma
- **Development**: Expo CLI, Expo Go app for testing

### Backend
- **Runtime**: Node.js
- **Database**: Supabase (Managed PostgreSQL)
- **Authentication**: Firebase Authentication
- **Real-time Sync**: Supabase Realtime / Firebase Realtime Database
- **API Framework**: Express.js

### Version Control
- **Git**: GitHub

## 📁 Project Structure

```
advising-app/
├── mobile/                  # React Native Expo application
│   ├── src/
│   ├── package.json
│   ├── app.json
│   └── ...
├── backend/                 # Node.js backend
│   ├── src/
│   ├── package.json
│   └── ...
├── database/                # Database schemas
│   ├── postgresql_schema.sql
│   └── sqlite_schema.sql
├── docs/                    # Documentation
│   ├── PROJECT_PLAN.md
│   ├── API_DOCUMENTATION.md
│   └── DEVELOPMENT_ROADMAP.md
└── README.md
```

## 🗄️ Database Design

### Supabase (Backend - Managed PostgreSQL)
- **Users**: User authentication and profile information
- **Advisors**: Advisor details and availability
- **Appointments**: Appointment records and status
- **Notifications**: System notifications
- **Feedback**: Ratings and comments

### SQLite (Android Local)
- **Session**: JWT tokens and user session data
- **Cached Appointments**: Offline appointment data
- **Cached Notifications**: Offline notification data
- **Cached Advisors**: Offline advisor data

## 🚦 Getting Started

### ⚡ Quick Start
**New to this project? Start here:**
1. Read **[START_HERE.md](START_HERE.md)** - Overview of what to do
2. Follow **[WHAT_TO_DO_NOW.md](WHAT_TO_DO_NOW.md)** - Simple step-by-step instructions
3. Use **[QUICK_SETUP.md](QUICK_SETUP.md)** - 5-minute quick setup guide

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Expo CLI (install with `npm install -g expo-cli`)
- Expo Go app (for testing on mobile devices)
- Supabase account (free tier available) - **REQUIRED**
- Firebase account - **Optional but Recommended**
- Git
- Android Studio (for Android development) or Xcode (for iOS development, macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/advising-app.git
   cd advising-app
   ```

2. **Set up Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm start
   ```

3. **Set up Supabase Database**
   - Create a Supabase project at https://supabase.com
   - Go to SQL Editor in Supabase dashboard
   - Run the SQL schema from `database/postgresql_schema.sql`
   - Get your Supabase URL and API keys from Project Settings
   - Configure Row Level Security (RLS) policies
   - Enable Realtime for required tables (appointments, notifications)
   - **Detailed instructions**: See [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

4. **Set up Firebase**
   - Create a Firebase project
   - Enable Authentication (Email/Password)
   - Enable Realtime Database
   - Add Firebase configuration to Android app

5. **Set up React Native Expo App**
   - Navigate to mobile directory: `cd mobile`
   - Install dependencies: `npm install`
   - Configure environment variables (create `.env` file)
   - Set up Firebase configuration
   - Start Expo development server: `expo start`
   - Scan QR code with Expo Go app or run on emulator

## 📖 API Documentation

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed API documentation.

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### React Native Testing
- Run unit tests: `npm test`
- Run tests with coverage: `npm test -- --coverage`
- Perform manual testing with Expo Go app
- Test on Android and iOS devices/emulators

## 👥 Team Members

- **Mamun Hossain** (Team Leader & Backend Developer)
  - Project management and coordination
  - Backend development (Node.js, Supabase)
  - Firebase integration
  - Supabase setup and configuration
  - API development

- **Jarziz Ahmed** (UI/UX Designer)
  - Figma design and wireframing
  - User interface design
  - User experience optimization

- **Mahmudul Hassan** (Frontend Developer)
  - React Native Expo app development
  - UI implementation with React Native
  - Frontend-backend integration
  - React Navigation setup
  - Expo SQLite local database

## 📅 Development Timeline

- **Total Duration**: 11 weeks
- **Phase 1**: Project Setup (Week 1)
- **Phase 2**: Authentication Module (Week 2)
- **Phase 3**: Database & Models (Week 3)
- **Phase 4**: User Management (Week 4)
- **Phase 5**: Appointment Booking (Week 5-6)
- **Phase 6**: Advisor Dashboard (Week 7)
- **Phase 7**: Notification System (Week 8)
- **Phase 8**: UI/UX Integration (Week 9)
- **Phase 9**: Testing & Debugging (Week 10)
- **Phase 10**: Deployment Preparation (Week 11)

See [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md) for detailed roadmap.

## 🔒 Security

- Firebase Authentication for secure user authentication
- JWT tokens for API authentication
- HTTPS for all API communications
- Input validation on client and server
- SQL injection prevention
- Secure token storage in SQLite

## 🚧 Future Enhancements

- [ ] Integrated Chat and Video Consultation
- [ ] Google Calendar Integration
- [ ] Department Management Dashboard
- [ ] Enhanced Feedback and Rating System
- [ ] Push Notifications
- [ ] Analytics Dashboard
- [ ] Multi-language Support
- [ ] App Publication on Google Play Store

## 📝 License

This project is developed for academic purposes at Khwaja Yunus Ali University.

## 🙏 Acknowledgments

We would like to express our heartfelt gratitude to:
- **Mst. Anika Amzad**, our respected supervisor, for her constant guidance and valuable feedback
- **Department of Computer Science and Engineering, Khwaja Yunus Ali University**, for providing the necessary resources and learning environment
- All team members for their dedication and cooperation

## 📚 References

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Supabase Documentation](https://supabase.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Figma Design Resources](https://www.figma.com/resources)
- [GitHub Guides](https://guides.github.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)

## 📧 Contact

For questions or support, please contact:
- **Project Leader**: Mamun Hossain
- **Email**: [your-email@example.com]
- **University**: Khwaja Yunus Ali University

---

**Last Updated**: [Date]  
**Version**: 1.0.0

