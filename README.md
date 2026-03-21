# Time2Wish

A full-stack web application to manage birthdays, automate reminders, and centralize useful contact information (preferences, notes, and more).

---

### time2wish-v1.0.1 - dark mode
<img width="1886" height="914" alt="image" src="https://github.com/user-attachments/assets/825bfb27-e417-4bab-86b1-82bec1cf9797" />



### time2wish-v1.0.0
<img width="2545" height="1302" alt="image" src="https://github.com/user-attachments/assets/1ba18752-b903-47e2-8fdb-068c460067b8" />

### Light mode
<img width="2549" height="1306" alt="image" src="https://github.com/user-attachments/assets/d868085d-0bea-4f47-bb93-a59af19b979d" />

### Dark mode
<img width="2554" height="1299" alt="image" src="https://github.com/user-attachments/assets/6d5d84fb-4eb9-4c95-a530-6383a138bf41" />

## 1) Project Vision

**Time2Wish** helps users never miss important birthdays by combining:

- a modern frontend experience (Angular),
- a secure backend API (Spring Boot + JWT),
- a relational data layer (JPA, H2 in local runtime),
- notification and password-reset email flows.

---

## 2) Core Features

### 2.1 Authentication & Security
- User registration.
- Login with **Access Token** and **Refresh Token** generation.
- Refresh token stored in an HTTP-only cookie.
- Protected frontend routes via Angular Auth Guard.

### 2.2 Birthday Management
- Create, read, update, and delete birthdays.
- Birthday table/list views.
- Birthday details pages.

### 2.3 User Profile Management
- View and update profile data.
- Preferences support (language, theme, notifications).

### 2.4 User Experience
- Responsive interface.
- Light and dark themes.
- Internationalization (FR/EN/DE with Transloco).
- Public and private screens (landing, login, dashboard, etc.).

---

## 3) Technical Stack

### Frontend
- Angular 19
- TypeScript
- Angular Material + CDK
- Tailwind CSS v4
- Transloco (i18n)
- Chart.js / ng2-charts

### Backend
- Java 8
- Spring Boot 2.3.2.RELEASE
- Spring Security
- Spring Data JPA
- JWT (jjwt)
- Spring Mail

### Data & Runtime
- H2 (local runtime)
- Docker / Docker Compose (dev and prod-like)

---

## 4) High-Level Architecture

```text
[Browser User]
      |
      v
[Angular Frontend (port 4200 in dev / 80 in container)]
      |
      | HTTP (Bearer access token)
      v
[Spring Boot API (port 9000)]
      |
      +--> [JWT Service + Security Filter]
      +--> [Business Services: User/Birthday/Email]
      +--> [JPA Repositories]
      v
    [H2 Database]
```

### 4.1 Frontend Architecture (simplified)

```text
src/app
├── core
│   ├── guard (auth)
│   └── services (auth, birthday, interceptor)
├── pages (login, register, dashboard, profile, etc.)
├── components (navbar, cards, forms, footer, etc.)
├── shared/services (theme, notifications, dialog, confetti)
└── models
```

### 4.2 Backend Architecture (simplified)

```text
com.time2wish.time2wish_api
├── controller (UserController, BirthdayController)
├── service (UserService, BirthdayService, EmailService)
├── repository (UserRepository, BirthdayRepository)
├── security (JwtTokenProvider, JwtAuthenticationFilter)
├── dto
└── model (User, Birthday)
```

---

## 5) API Endpoints (Overview)

### Authentication / Users
- `POST /api/register`
- `POST /api/login`
- `POST /api/refresh`
- `GET /api/users`
- `GET /api/users/{id}`
- `PUT /api/users/{id}`

### Birthdays
- `GET /birthdayTable`
- `POST /birthdayTable`
- `GET /birthday/{id}`
- `PUT /birthday/{id}`
- `DELETE /birthday/{id}`

---

## 6) Run the Project

### 6.1 Prerequisites
- Node.js + npm
- Java 8+
- Maven
- Docker (optional)

### 6.2 Frontend (local)
```bash
cd front-end
npm install
npm run start
```
Available at `http://localhost:4200`.

### 6.3 Backend (local)
```bash
cd back-end/time2wish_api
./mvnw spring-boot:run
```
Available at `http://localhost:9000`.

### 6.4 Docker Compose (prod-like)
```bash
docker compose up --build
```
- Frontend: `http://localhost:80`
- Backend: `http://localhost:9000`

### 6.5 Docker Compose (dev)
```bash
docker compose -f docker-compose.dev.yml up --build
```
- Frontend: `http://localhost:4200`
- Backend: `http://localhost:9000`

---

## 7) Quality & Testing

### Frontend
```bash
cd front-end
npm run lint
npm run test
npm run build
```

### Backend
```bash
cd back-end/time2wish_api
./mvnw test
```

---

## 8) Security & Secrets

- JWT secrets and email credentials should be externalized with environment variables.
- Avoid committing real secrets to version control.
- Use isolated environment profiles (`dev`, `prod`) with secure config values.

---

## 9) Suggested Roadmap

- Add a production-grade persistent database (PostgreSQL/MySQL).
- Add a scheduler for automated reminders.
- Expand CI/CD with deployment stages.
- Improve observability (structured logs, metrics, tracing).
- Add end-to-end frontend tests.

---

---

## 🛠️ Technical Stack

| Layer         | Technologies                                | Status          |
|---------------|---------------------------------------------|-----------------|
| **Frontend**  | Angular 19+ with TypeScript                 | 🚧 In Progress  |
| **Backend**   | Spring Boot (2.3.2.RELEASE) | 🚧 In Progress  |
| **Database**  | Firestore / MongoDB / PostgreSQL            | 🟡 To be decided |
| **Notifications** | Web Push API / Firebase Cloud Messaging | 🟡 To be decided |
| **APIs**      | Twilio / SendGrid or similar messaging APIs | 🟡 To be decided |

---

---

## 🚀 Project Status

The project is currently in early-stage development. Core architecture and features are being built.

> 🔧 Contributions and ideas are welcome!

---

## 📌 Future Enhancements (Roadmap)

- ✅ PWA support for mobile use
- 🧠 AI-powered birthday message generator
- 📅 Calendar integrations (Google, Outlook)
- 🎁 Group gift reminders and planning (to be decided)
- 🗂️ Birthday history and wish archive

---

## 🙌 Contribution

Want to contribute or support the project?

- 🐛 [Open an issue](#) to report bugs or suggest features.
- 🚀 Submit a pull request.
- 💬 Share feedback and ideas.

## Usefull link
- Login and logout workflow explain: https://hasura.io/blog/best-practices-of-using-jwt-with-graphql
---
