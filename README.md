# Time2Wish

A full-stack web application to manage birthdays, automate reminders, and centralize useful contact information (preferences, notes, and more).

---

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

## 10) License

Internal project under active development. Add an explicit license before public release.
