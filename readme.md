````markdown
# 🏋️‍♂️ Gym Class Scheduling and Membership Management System

A full-featured backend API built with **TypeScript**, **Express.js**, and **PostgreSQL** to manage gym operations. The system enables secure role-based access for admins, trainers, and trainees to manage class schedules and bookings efficiently.

---

## 📘 Project Overview

This system allows:

- **Admins** to create and manage class schedules.
- **Trainers** to view their assigned schedules.
- **Trainees** to browse and book available fitness classes.

With secure **JWT-based authentication**, **Zod validation**, and a **scalable architecture**, it's built for real-world deployment in gyms and fitness studios.

---

## ✨ Features

- 🔐 Role-based access control: `ADMIN`, `TRAINER`, `TRAINEE`
- 🛡️ Secure JWT authentication
- 📅 Admins can create/update class schedules
- 📝 Trainees can book and cancel classes
- 🚫 Prevents overbooking (max 10 per class)
- 🔄 Pagination for schedule and booking lists
- 📦 Modular MVC structure with clean architecture
- ✅ Comprehensive input validation and error handling

---

## 🛠️ Tech Stack

| Category              | Tools                       |
| --------------------- | --------------------------- |
| Language              | TypeScript                  |
| Server Framework      | Express.js                  |
| ORM                   | Prisma ORM                  |
| Database              | PostgreSQL                  |
| Authentication        | JWT, bcrypt                 |
| Validation            | Zod                         |
| Utility Libraries     | UUID, date-fns              |
| Middleware & Security | cookie-parser, CORS, dotenv |

---

## 🗺️ ER Diagram

📌 View the full relational model here:  
👉 [ERD on dbdiagram.io](https://dbdiagram.io/d/6838664dbd74709cb7197be4)

---

## 🔐 Admin Credentials (for testing)

```txt
Email:    admin@gmail.com
Password: 123456
```
````

---

## 🚀 Getting Started (Run Locally)

Follow these steps to run the project in your local environment:

### 📁 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 📦 2. Install Dependencies

Make sure **Node.js (v18 or higher)** and **npm** are installed.

```bash
npm install
```

### ⚙️ 3. Configure Environment Variables

Create a `.env` file in the root directory and add:

```env
DATABASE_URL=your_postgresql_database_url
DIRECT_URL=your_postgresql_direct_url
JWT_SECRET=your_secure_jwt_secret
```

💡 You can use free PostgreSQL services like **Railway**, **Render**, or **Supabase**.

### 🛠️ 4. Set Up the Database

Generate the Prisma client and apply database migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

_(Optional: Seed initial data)_

```bash
npx prisma db seed
```

### ▶️ 5. Start the Development Server

```bash
npm run dev
```

Visit the server at: [http://localhost:5000](http://localhost:5000)

---

## 🔗 Live & Documentation Links

🌐 **Live Demo:**
[https://gym-class-scheduling-and-membership-ten.vercel.app](https://gym-class-scheduling-and-membership-ten.vercel.app/)

📬 **Postman API Docs:**
[Postman Collection](https://documenter.getpostman.com/view/9409293/2sB2qfAf4h)

---

## 📘 API Overview

### 🔐 Authentication

| Method | Endpoint              | Description    |
| ------ | --------------------- | -------------- |
| POST   | `/api/v1/auth/login`  | Login with JWT |
| POST   | `/api/v1/auth/logout` | Logout user    |

### 👤 Users

| Method | Endpoint                         | Role    | Description            |
| ------ | -------------------------------- | ------- | ---------------------- |
| POST   | `/api/v1/user/create`            | Public  | Register trainee       |
| POST   | `/api/v1/user/create/trainer`    | Admin   | Create trainer account |
| GET    | `/api/v1/users/me`               | All     | Get current user info  |
| GET    | `/api/v1/user/all-users`         | Admin   | List all users         |
| PATCH  | `/api/v1/user/update-my-profile` | Trainee | Update trainee profile |

### 📅 Schedules

| Method | Endpoint                        | Role    | Description             |
| ------ | ------------------------------- | ------- | ----------------------- |
| POST   | `/api/v1/schedule/create`       | Admin   | Create a class schedule |
| GET    | `/api/v1/schedule/my-schedules` | Trainer | View own schedules      |
| GET    | `/api/v1/schedule/`             | Admin   | View all schedules      |

### 📝 Bookings

| Method | Endpoint                      | Role    | Description             |
| ------ | ----------------------------- | ------- | ----------------------- |
| POST   | `/api/v1/booking/book`        | Trainee | Book a class schedule   |
| GET    | `/api/v1/booking/my-bookings` | Trainee | View trainee’s bookings |
| DELETE | `/api/v1/booking/:bookingId`  | Trainee | Cancel a booking        |

✅ All protected routes require the `Authorization: Bearer <token>` header.

---

## 🧩 Database Schema (Prisma)

<details>
<summary><strong>📘 Click to view full schema</strong></summary>

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// 👤 User Model
model User {
  id                 String     @id @default(uuid())
  email              String     @unique
  password           String
  role               UserRole
  needPasswordChange Boolean    @default(true)
  status             UserStatus @default(ACTIVE)
  createdAt          DateTime   @default(now())
  updatedAt          DateTime   @updatedAt

  profile  Profile?
  schedule Schedule[] @relation("TrainerSchedules")
  booking  Booking[]

  @@map("users")
}

// 🧍 Profile Model
model Profile {
  id        String   @id @default(uuid())
  userId    String   @unique
  name      String
  age       Int?
  phone     String?
  gender    Gender   @default(Male)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id])

  @@map("profiles")
}

// 🗓️ Schedule Model
model Schedule {
  id            String   @id @default(uuid())
  trainerId     String
  startDateTime DateTime
  endDateTime   DateTime
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  trainer  User      @relation("TrainerSchedules", fields: [trainerId], references: [id])
  booking  Booking[]

  @@map("schedules")
}

// 📆 Booking Model
model Booking {
  id         String   @id @default(uuid())
  scheduleId String
  userId     String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  schedule Schedule @relation(fields: [scheduleId], references: [id])
  user     User     @relation(fields: [userId], references: [id])

  @@unique([scheduleId, userId])
  @@map("bookings")
}

// 🔘 Enums
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

</details>

---

## 👨‍💻 Author

Built with ❤️ by \[MD OLI ULLAH]

---

## 📄 License

This project is licensed under the MIT License.

---

```

---

Let me know if you want a downloadable `.md` file or a GitHub-style badge section at the top (e.g., build status, license, etc.) added.
```
