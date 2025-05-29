## 📘 Project Overview

**Gym Class Scheduling and Membership Management System** is a robust backend API designed to manage gym operations efficiently. This system enables admins to create and manage fitness class schedules, while users (trainees) can view available classes and book them in real-time.

The system enforces booking limits to prevent overbooking and includes secure role-based authentication using JWT. With scalable design and clear API structure, it is well-suited for real-world deployment in any fitness center, gym, or studio requiring online class scheduling and membership handling.

### ✨ Key Features

- Role-based access: Admin and Trainee
- Secure authentication with JWT (login/signup with tokens)
- Create, view, and manage class schedules (admin)
- Book classes (trainee)
- Prevent double bookings and over-capacity scheduling
- Paginated listings for schedules and bookings
- Modular codebase with clear separation of concerns
- RESTful API design with strong validation (Zod) and error handling

## 🔗 Relational Diagram

View the full ERD (Entity Relationship Diagram) here:  
[👉 View Relational Diagram on dbdiagram.io](https://dbdiagram.io/d/6838664dbd74709cb7197be4)

## 🛠️ Technology Stack

### Language & Runtime

- **TypeScript**
- **Node.js**

### Framework & Server

- **Express.js**

### Database & ORM

- **PostgreSQL**
- **Prisma ORM**

### Authentication & Authorization

- **JWT (JSON Web Token)**
- **Role-Based Access Control** (ADMIN | TRAINER | TRAINEE)

### Validation & Utilities

- **Zod** – Schema validation
- **UUID** – Unique identifier
- **date-fns** – Date formatting helper

### Security & Middleware

- **bcrypt** – Password hashing
- **cookie-parser**
- **CORS**
- **dotenv** – Environment variable handling

## 📱 API Endpoints Documentation

All API endpoints follow RESTful conventions and return consistent JSON structures with `success`, `statusCode`, `message`, and `data` fields.

---

### 🔐 POST /api/auth/login

**Description:**
Authenticate a user and return access and refresh tokens.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Success Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User logged in successfully!",
  "data": {
    "accessToken": "JWT_TOKEN",
    "refreshToken": "REFRESH_TOKEN",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "ADMIN"
    }
  }
}
```

**Failure Response:**

```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid email or password"
}
```

---

### 👥 GET /api/users/\:id

**Description:**
Retrieve user profile information by ID (Admin Only).

**Path Parameter:**

- `id` (string) — User UUID

**Success Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User fetched successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "TRAINER",
    "status": "ACTIVE"
  }
}
```

---

### 📅 POST /api/schedules

**Description:**
Create a new gym class schedule (Trainer/Admin).

**Request Body:**

```json
{
  "startDateTime": "2025-06-01T10:00:00Z",
  "endDateTime": "2025-06-01T11:00:00Z"
}
```

**Success Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Schedule created successfully!",
  "data": {
    "id": "uuid",
    "trainerId": "uuid",
    "startDateTime": "2025-06-01T10:00:00Z",
    "endDateTime": "2025-06-01T11:00:00Z"
  }
}
```

---

### 📝 POST /api/bookings

**Description:**
Book a trainee into a scheduled class.

**Request Body:**

```json
{
  "scheduleId": "uuid"
}
```

**Success Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Class booked successfully!",
  "data": {
    "id": "uuid",
    "scheduleId": "uuid",
    "userId": "uuid",
    "createdAt": "2025-06-01T12:00:00Z"
  }
}
```

**Failure Response (class full):**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Class schedule is full. Maximum 10 trainees allowed per schedule."
}
```

---

### ❌ DELETE /api/users/\:id

**Description:**
Soft-delete a user by marking their status as DELETED (Admin Only).

**Path Parameter:**

- `id` (string) — User UUID

**Success Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User deleted successfully.",
  "data": null
}
```

---

This documentation includes the major functional endpoints required to operate the Gym Class Scheduling and Membership Management System. For full reference, see the Postman documentation link provided in the README.
