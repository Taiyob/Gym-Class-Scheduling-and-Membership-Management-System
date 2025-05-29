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

🧩 Relational Diagram

┌────────────────────────────────────────────┐
│ User │
├────────────────────────────────────────────┤
│ id (PK)------------------------------------│
│ email (Unique)-----------------------------│
│ password ----------------------------------│
│ role (Enum: UserRole)----------------------│
│ needPasswordChange ------------------------│
│ status (Enum: UserStatus)------------------│
│ createdAt----------------------------------│
│ updatedAt----------------------------------│
├────────────────────────────────────────────┤
│ 🔗 1-1 → Profile (userId)------------------│
│ 🔗 1-N → Schedule (trainerId)--------------│
│ 🔗 1-N → Booking (userId)----------------- │
└────────────────────────────────────────────┘

        ▲                  ▲
        │                  │
        │                  │

┌───────┴───────┐ ┌────┴──────────────────────────────────┐
│--- Profile--- │ │-------------- Schedule--------------│
├───────────────┤ ├───────────────────────────────────────┤
│ id (PK)------ │ │ id (PK)------------------------------ │
│ userId (FK)---│ │ trainerId (FK → User.id)------------- │
│ name----------│ │ startDateTime------------------------ │
│ age-----------│ │ endDateTime-------------------------- │
│ phone---------│ │ createdAt---------------------------- │
│ gender--------│ │ updatedAt---------------------------- │
│ createdAt-----│ ├────────────────────────────────────── ┤
│ updatedAt-----│ │ 🔗 1-N → Booking (scheduleId)------- │
└───────────────┘ └──────────────────────────────────────┘
--------------------▲
--------------------│
--------------------│
┌────────── ┴─────────────┐
│------- Booking--------- │
├────────────────────────-┤
│------- id (PK)----------│
│---- scheduleId (FK)---- │
│----- userId (FK)------- │
│------ createdAt-------- │
│------ updatedAt-------- │
└────────────────────────┘
