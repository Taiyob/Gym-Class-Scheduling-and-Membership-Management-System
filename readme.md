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
