# Advising App Backend
## Node.js Backend API for Connecting Students with Advisors

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Set up Supabase Database
1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Go to **SQL Editor** in Supabase dashboard
3. Run the SQL schema from `../database/postgresql_schema.sql`
4. Get your Supabase credentials from **Project Settings** > **API**:
   - Project URL
   - Service Role Key (for server-side)
   - Anon Key (for client-side)
5. Configure Row Level Security (RLS) policies
6. Enable Realtime for tables: appointments, notifications

### 4. Set up Firebase
- Create a Firebase project
- Enable Authentication (Email/Password)
- Enable Realtime Database
- Generate service account key
- Add Firebase credentials to .env

### 5. Run the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── supabase.js
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
├── .env.example
├── package.json
└── README.md
```

## API Endpoints

See [API_DOCUMENTATION.md](../API_DOCUMENTATION.md) for detailed API documentation.

## Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `SUPABASE_URL`: Supabase project URL (e.g., `https://xxxxx.supabase.co`)
- `SUPABASE_ANON_KEY`: Supabase anonymous key (for client-side)
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (for server-side - keep secret!)
- `FIREBASE_PROJECT_ID`: Firebase project ID
- `FIREBASE_PRIVATE_KEY`: Firebase private key
- `FIREBASE_CLIENT_EMAIL`: Firebase client email
- `JWT_SECRET`: JWT secret key
- `JWT_EXPIRE`: JWT expiration time
- `FIREBASE_DATABASE_URL`: Firebase Realtime Database URL (optional)
- `CORS_ORIGIN`: CORS origin
- `RATE_LIMIT_WINDOW_MS`: Rate limit window in milliseconds
- `RATE_LIMIT_MAX_REQUESTS`: Maximum requests per window

## Testing

```bash
npm test
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## Security

- JWT authentication
- Password hashing with bcrypt
- Input validation
- SQL injection prevention (Supabase handles this)
- Row Level Security (RLS) policies in Supabase
- Rate limiting
- CORS configuration
- Helmet for security headers
- Supabase service role key (keep secret, server-side only)

## License

ISC

