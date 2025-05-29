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

## 📘 API Endpoints Documentation

### 🔐 Auth Routes

#### POST `/api/v1/auth/login`

**Description:** Login a user

**Request Body:**

```json
{
  "email": "admin@gmail.com",
  "password": "123456"
}
```

**Success Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Logged in successfully",
  "data": {
    "accessToken": "...",
    "needPasswordChange": true
  }
}
```

**Failure Response:**

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

#### POST `/api/v1/auth/logout`

**Description:** Logout a user (clears refresh token)

**Success Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Logged out successfully"
}
```

---

### 👤 User Routes

#### POST `/api/v1/user/create`

**Description:** Create a user (Trainee)

**Request Body:**

```json
{
  "email": "st1@gmail.com",
  "password": "123456789",
  "profile": {
    "name": "Student",
    "age": 45,
    "phone": "01935795146",
    "gender": "Male"
  }
}
```

**Success Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "User created successfully",
  "data": { ... }
}
```

#### POST `/api/v1/user/create/trainer`

**Description:** Create a trainer (only Admin allowed)

**Request Body:** Same as above

**Failure Response (Unauthorized):**

```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

#### GET `/api/v1/users/me`

**Description:** Get current user profile

**Success Response:**

```json
{
  "success": true,
  "message": "User profile fetched successfully",
  "data": { ... }
}
```

#### GET `/api/v1/user/all-users`

**Description:** Get all users (only Admin allowed)

**Success Response:**

```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [ ... ]
}
```

#### PATCH `/api/v1/user/update-my-profile`

**Description:** Update own profile (Only Trainee)

**Request Body:**

```json
{
  "profile": {
    "phone": "01945645600"
  }
}
```

---

### 📅 Schedule Routes

#### POST `/api/v1/schedule/create`

**Description:** Create a class schedule (Only Admin)

**Request Body:**

```json
{
  "trainerId": "51e3308b-81dd-4c13-959b-622cc4037d6a",
  "startDate": "2025-06-01",
  "endDate": "2025-06-01",
  "startTime": "20:00"
}
```

**Success Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Schedule created successfully",
  "data": { ... }
}
```

#### GET `/api/v1/schedule/my-schedules`

**Description:** Get trainer's own schedules

#### GET `/api/v1/schedule/`

**Description:** Get all schedules (Only Admin)

---

### 📝 Booking Routes

#### POST `/api/v1/booking/book`

**Description:** Book a schedule (Only Trainee)

**Request Body:**

```json
{
  "scheduleId": "2102fab5-2007-428b-b3f2-4e214f042993"
}
```

**Success Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Class booked successfully!",
  "data": { ... }
}
```

**Failure Response (Schedule Full):**

```json
{
  "success": false,
  "message": "Class schedule is full. Maximum 10 trainees allowed per schedule."
}
```

#### GET `/api/v1/booking/my-bookings`

**Description:** View upcoming bookings (Only Trainee)

#### DELETE `/api/v1/booking/:bookingId`

**Description:** Cancel a booking (Only Trainee)

**Success Response:**

```json
{
  "success": true,
  "message": "Booking cancelled successfully"
}
```

---

✅ **Note:** All protected routes require JWT Authorization in `Authorization: Bearer <token>` header.

🧩 Database Schema
The application uses PostgreSQL and Prisma ORM to define and manage the database schema. Below is the full model definition used in the schema.prisma file.

<details> <summary><strong>📘 Click to view full Prisma schema</strong></summary>

```prisma
// ✅ Prisma Client Generator
generator client {
  provider = "prisma-client-js"
}

// ✅ PostgreSQL Data Source
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### 👤 User Model

```prisma
model User {
  id                 String     @id @default(uuid())
  email              String     @unique
  password           String
  role               UserRole
  needPasswordChange Boolean    @default(true)
  status             UserStatus @default(ACTIVE)
  createdAt          DateTime   @default(now())
  updatedAt          DateTime   @updatedAt

  // Relations
  profile  Profile?
  schedule Schedule[] @relation("TrainerSchedules")
  booking  Booking[]

  @@map("users")
}
```

### 🧍 Profile Model

```prisma
model Profile {
  id        String  @id @default(uuid())
  userId    String  @unique
  name      String
  age       Int?
  phone     String?
  gender    Gender  @default(Male)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  user User @relation(fields: [userId], references: [id])

  @@map("profiles")
}
```

### 🗓️ Schedule Model

```prisma
model Schedule {
  id            String   @id @default(uuid())
  trainerId     String
  startDateTime DateTime
  endDateTime   DateTime
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  trainer  User      @relation("TrainerSchedules", fields: [trainerId], references: [id])
  booking  Booking[]

  @@map("schedules")
}
```

### 📆 Booking Model

```prisma
model Booking {
  id         String @id @default(uuid())
  scheduleId String
  userId     String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  // Relations
  schedule Schedule @relation(fields: [scheduleId], references: [id])
  user     User     @relation(fields: [userId], references: [id])

  @@unique([scheduleId, userId])
  @@map("bookings")
}
```

### 🔘 Enums

```prisma
enum UserRole {
  SUPER_ADMIN
  ADMIN
  TRAINER
  TRAINEE
}

enum UserStatus {
  ACTIVE
  BLOCKED
  DELETED
}

enum Gender {
  Male
  Female
}
```
