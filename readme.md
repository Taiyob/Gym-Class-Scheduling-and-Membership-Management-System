```markdown
---

## 🧪 Testing Instructions

### 🔐 Admin Test Credentials

Use these credentials to log in as an admin and test admin-level features:
```

Email: [admin@gmail.com](mailto:admin@gmail.com)
Password: 123456

````

### 🧪 How to Test Key Features

#### 1. 🔑 Login as Admin
- Endpoint: `POST /api/v1/auth/login`
- Body:
  ```json
  {
    "email": "admin@gmail.com",
    "password": "123456"
  }
````

- Receive a JWT token and use it in the `Authorization` header for protected routes.

#### 2. 👨‍🏫 Create Trainer

- Endpoint: `POST /api/v1/user/create/trainer`
- Headers: `Authorization: Bearer <admin_token>`
- Body:

  ```json
  {
    "email": "trainer@example.com",
    "password": "123456",
    "name": "John Doe",
    "age": 30,
    "gender": "Male"
  }
  ```

#### 3. 🗓️ Create Class Schedule

- Endpoint: `POST /api/v1/schedule/create`
- Headers: `Authorization: Bearer <admin_token>`
- Body:

  ```json
  {
    "trainerId": "<trainer_id>",
    "startDateTime": "2025-06-01T10:00:00.000Z",
    "endDateTime": "2025-06-01T11:00:00.000Z"
  }
  ```

#### 4. 🙋‍♂️ Register a Trainee

- Endpoint: `POST /api/v1/user/create`
- Body:

  ```json
  {
    "email": "trainee@example.com",
    "password": "123456",
    "name": "Alice Smith",
    "age": 25,
    "gender": "Female"
  }
  ```

#### 5. 📝 Book a Class as Trainee

- Login with trainee credentials and get a JWT token.
- Endpoint: `POST /api/v1/booking/book`
- Headers: `Authorization: Bearer <trainee_token>`
- Body:

  ```json
  {
    "scheduleId": "<schedule_id>"
  }
  ```

#### 6. 🚫 Test Overbooking Prevention

- Try booking the same class 10+ times with different trainee accounts.
- The 11th attempt should return an error (e.g., `Class is fully booked`).

---

````

Then continue with:

```markdown
## 👨‍💻 Author
Built with ❤️ by [MD OLI ULLAH]

## 📄 License
This project is licensed under the MIT License.
````

---

Let me know if you’d like this section exported into a downloadable `.md` file or appended to an existing one.
