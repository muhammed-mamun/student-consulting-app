# API Documentation
## Connecting Students with Advisors

### Base URL
```
http://localhost:3000/api
```
Production: `https://api.advising-app.kyau.edu.bd/api`

### Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user (student or advisor).

**Request Body:**
```json
{
  "email": "user@kyau.edu.bd",
  "password": "password123",
  "role": "student",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "01712345678"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@kyau.edu.bd",
      "role": "student",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "jwt_token_here"
  }
}
```

---

### Login User
**POST** `/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "user@kyau.edu.bd",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@kyau.edu.bd",
      "role": "student",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "jwt_token_here"
  }
}
```

---

### Get Current User
**GET** `/auth/me`

Get current authenticated user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@kyau.edu.bd",
    "role": "student",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "01712345678"
  }
}
```

---

### Refresh Token
**POST** `/auth/refresh-token`

Refresh JWT token.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token_here"
  }
}
```

---

## User Endpoints

### Get User Profile
**GET** `/users/profile`

Get user profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@kyau.edu.bd",
    "role": "student",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "01712345678",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Update User Profile
**PUT** `/users/profile`

Update user profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "01712345678"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "email": "user@kyau.edu.bd",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "01712345678"
  }
}
```

---

### Get All Advisors
**GET** `/users/advisors`

Get list of all advisors.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 2,
      "department": "Computer Science and Engineering",
      "designation": "Professor",
      "consultationHoursStart": "10:00:00",
      "consultationHoursEnd": "12:00:00",
      "availableDays": "Monday,Wednesday,Friday",
      "bio": "Expert in Software Engineering",
      "user": {
        "firstName": "Dr. Jane",
        "lastName": "Smith",
        "email": "advisor1@kyau.edu.bd"
      }
    }
  ]
}
```

---

## Advisor Endpoints

### Get Advisor Details
**GET** `/advisors/:id`

Get specific advisor details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 2,
    "department": "Computer Science and Engineering",
    "designation": "Professor",
    "consultationHoursStart": "10:00:00",
    "consultationHoursEnd": "12:00:00",
    "availableDays": "Monday,Wednesday,Friday",
    "bio": "Expert in Software Engineering",
    "user": {
      "firstName": "Dr. Jane",
      "lastName": "Smith",
      "email": "advisor1@kyau.edu.bd"
    }
  }
}
```

---

### Get Advisor Availability
**GET** `/advisors/:id/availability`

Get advisor availability for a specific date range.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` (required): Start date (YYYY-MM-DD)
- `endDate` (required): End date (YYYY-MM-DD)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "advisorId": 1,
    "availableDays": ["Monday", "Wednesday", "Friday"],
    "consultationHours": {
      "start": "10:00:00",
      "end": "12:00:00"
    },
    "bookedSlots": [
      {
        "date": "2024-01-15",
        "time": "10:30:00"
      }
    ],
    "availableSlots": [
      {
        "date": "2024-01-15",
        "time": "11:00:00"
      }
    ]
  }
}
```

---

### Update Advisor Profile
**PUT** `/advisors/profile`

Update advisor profile (advisor only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "department": "Computer Science and Engineering",
  "designation": "Professor",
  "consultationHoursStart": "10:00:00",
  "consultationHoursEnd": "12:00:00",
  "availableDays": "Monday,Wednesday,Friday",
  "bio": "Updated bio"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Advisor profile updated successfully",
  "data": {
    "id": 1,
    "department": "Computer Science and Engineering",
    "designation": "Professor",
    "consultationHoursStart": "10:00:00",
    "consultationHoursEnd": "12:00:00",
    "availableDays": "Monday,Wednesday,Friday",
    "bio": "Updated bio"
  }
}
```

---

## Appointment Endpoints

### Create Appointment
**POST** `/appointments`

Create a new appointment (student only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "advisorId": 1,
  "appointmentDate": "2024-01-15",
  "appointmentTime": "11:00:00",
  "issueCategory": "Course Issues",
  "issueDescription": "Need help with database course"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Appointment created successfully",
  "data": {
    "id": 1,
    "studentId": 1,
    "advisorId": 1,
    "appointmentDate": "2024-01-15",
    "appointmentTime": "11:00:00",
    "issueCategory": "Course Issues",
    "issueDescription": "Need help with database course",
    "status": "Pending",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Get Appointments
**GET** `/appointments`

Get user's appointments.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by status (Pending, Accepted, Rejected, Completed, Cancelled)
- `limit` (optional): Number of results (default: 20)
- `offset` (optional): Offset for pagination (default: 0)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "studentId": 1,
      "advisorId": 1,
      "appointmentDate": "2024-01-15",
      "appointmentTime": "11:00:00",
      "issueCategory": "Course Issues",
      "issueDescription": "Need help with database course",
      "status": "Pending",
      "advisor": {
        "name": "Dr. Jane Smith",
        "department": "Computer Science and Engineering"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Get Appointment Details
**GET** `/appointments/:id`

Get specific appointment details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "studentId": 1,
    "advisorId": 1,
    "appointmentDate": "2024-01-15",
    "appointmentTime": "11:00:00",
    "issueCategory": "Course Issues",
    "issueDescription": "Need help with database course",
    "status": "Pending",
    "student": {
      "name": "John Doe",
      "email": "student1@kyau.edu.bd"
    },
    "advisor": {
      "name": "Dr. Jane Smith",
      "department": "Computer Science and Engineering",
      "email": "advisor1@kyau.edu.bd"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Approve Appointment
**PUT** `/appointments/:id/approve`

Approve an appointment (advisor only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Appointment approved successfully",
  "data": {
    "id": 1,
    "status": "Accepted",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Reject Appointment
**PUT** `/appointments/:id/reject`

Reject an appointment (advisor only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reason": "Not available at this time"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Appointment rejected successfully",
  "data": {
    "id": 1,
    "status": "Rejected",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Complete Appointment
**PUT** `/appointments/:id/complete`

Mark appointment as completed.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Appointment marked as completed",
  "data": {
    "id": 1,
    "status": "Completed",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Cancel Appointment
**DELETE** `/appointments/:id`

Cancel an appointment.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Appointment cancelled successfully"
}
```

---

## Notification Endpoints

### Get Notifications
**GET** `/notifications`

Get user notifications.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `isRead` (optional): Filter by read status (true/false)
- `limit` (optional): Number of results (default: 20)
- `offset` (optional): Offset for pagination (default: 0)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "appointmentId": 1,
      "title": "Appointment Approved",
      "message": "Your appointment with Dr. Jane Smith has been approved",
      "type": "appointment_approved",
      "isRead": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Mark Notification as Read
**PUT** `/notifications/:id/read`

Mark a notification as read.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": {
    "id": 1,
    "isRead": true
  }
}
```

---

### Mark All Notifications as Read
**PUT** `/notifications/read-all`

Mark all notifications as read.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

### Delete Notification
**DELETE** `/notifications/:id`

Delete a notification.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

## Feedback Endpoints

### Submit Feedback
**POST** `/feedback`

Submit feedback for an appointment (student only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "appointmentId": 1,
  "rating": 5,
  "comment": "Very helpful session"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "data": {
    "id": 1,
    "appointmentId": 1,
    "studentId": 1,
    "advisorId": 1,
    "rating": 5,
    "comment": "Very helpful session",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Get Feedback for Appointment
**GET** `/feedback/:appointmentId`

Get feedback for a specific appointment.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "appointmentId": 1,
    "rating": 5,
    "comment": "Very helpful session",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Get Advisor Feedback
**GET** `/feedback/advisor/:advisorId`

Get all feedback for an advisor.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "appointmentId": 1,
      "rating": 5,
      "comment": "Very helpful session",
      "student": {
        "name": "John Doe"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "averageRating": 4.5,
  "totalRatings": 10
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized. Please login."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Issue Categories

Available issue categories for appointments:
- `Course Issues`
- `Thesis Discussion`
- `Personal Counseling`
- `Career Guidance`
- `Academic Planning`
- `Other`

---

## Appointment Statuses

- `Pending` - Appointment request is pending approval
- `Accepted` - Appointment has been approved by advisor
- `Rejected` - Appointment has been rejected by advisor
- `Completed` - Appointment has been completed
- `Cancelled` - Appointment has been cancelled

---

## Notification Types

- `appointment_request` - New appointment request
- `appointment_approved` - Appointment approved
- `appointment_rejected` - Appointment rejected
- `appointment_reminder` - Appointment reminder
- `appointment_cancelled` - Appointment cancelled
- `feedback_received` - New feedback received

