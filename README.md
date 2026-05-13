# Codingkul

India's structured DSA learning platform — live classes, curated problem sheets, mock contests, and placement mentorship.

---

## Monorepo Structure

```
AlgoShashtra/
├── Frontend/          # Next.js 15 — student-facing web app
└── Backend/           # Express 5 — REST API + auth service
```

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion |
| Backend    | Express 5, Node.js (ES Modules)                 |
| Database   | MongoDB Atlas via Mongoose 9                    |
| Auth       | JWT (httpOnly cookie) + Google OAuth 2.0 (Passport.js) |
| UI         | shadcn/ui, Lucide icons                         |

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [MongoDB Atlas](https://cloud.mongodb.com) cluster
- A [Google Cloud Console](https://console.cloud.google.com) OAuth 2.0 app

---

### 1. Backend

```bash
cd Backend
npm install
```

Create `Backend/.env` (see [Backend/.env.example](Backend/.env.example)):

```bash
npm run dev        # starts on http://localhost:5000
```

---

### 2. Frontend

```bash
cd Frontend
npm install
npm run dev        # starts on http://localhost:3000
```

The frontend expects the backend running on `http://localhost:5000`. No extra env vars needed for local development.

---

## Features

### Authentication
- Email / password signup & login
- Google OAuth 2.0 — one-click sign-in, automatic account linking if email already exists
- JWT stored in httpOnly cookie (7-day expiry)
- Session-less — OAuth handshake uses a short-lived express-session (10 min), destroyed after JWT is issued

### Student Dashboard
- Activity heatmap
- XP, streak, and rank tracking
- Goals and achievements
- Leaderboard
- Responsive sidebar navigation

### Landing Page
- Marketing sections (Courses, DSA Sheets, Pricing, Testimonials)
- Auth-aware navbar — shows Login/Sign Up or Dashboard depending on session state

---

## Environment Variables

### Backend — `Backend/.env`

| Variable              | Description                                      |
|-----------------------|--------------------------------------------------|
| `MONGO_URI`           | MongoDB Atlas connection string                  |
| `JWT_SECRET`          | Secret key for signing JWTs                      |
| `JWT_EXPIRES_IN`      | Token lifespan (default: `7d`)                   |
| `PORT`                | Server port (default: `5000`)                    |
| `NODE_ENV`            | `development` or `production`                    |
| `CLIENT_URL`          | Frontend origin (default: `http://localhost:3000`) |
| `GOOGLE_CLIENT_ID`    | Google OAuth client ID                           |
| `GOOGLE_CLIENT_SECRET`| Google OAuth client secret                       |
| `GOOGLE_CALLBACK_URL` | Must match Google Console — e.g. `http://localhost:5000/api/auth/google/callback` |

---

## API Reference

### Auth

| Method | Endpoint                    | Description                          | Auth |
|--------|-----------------------------|--------------------------------------|------|
| POST   | `/api/auth/signup`          | Register with email + password       | —    |
| POST   | `/api/auth/login`           | Login with email + password          | —    |
| GET    | `/api/auth/me`              | Get current user from cookie         | JWT  |
| POST   | `/api/auth/logout`          | Clear JWT cookie                     | —    |
| GET    | `/api/auth/check-username`  | Check username availability          | —    |
| GET    | `/api/auth/google`          | Initiate Google OAuth flow           | —    |
| GET    | `/api/auth/google/callback` | Google OAuth callback                | —    |

### Health

| Method | Endpoint        | Description       |
|--------|-----------------|-------------------|
| GET    | `/api/health`   | Server liveness   |

---

## Project Scripts

### Backend
```bash
npm run dev      # nodemon — auto-restart on file changes
npm start        # production start
```

### Frontend
```bash
npm run dev      # Next.js dev server with Turbopack
npm run build    # production build
npm start        # production server
npm run lint     # ESLint
```

---

## Deployment Notes

- Set `NODE_ENV=production` on the backend — enables `secure` and `sameSite: strict` on cookies
- Add your production domain to the Google Console Authorised Redirect URIs
- Update `CLIENT_URL` and `GOOGLE_CALLBACK_URL` in production env vars
- Frontend can be deployed to Vercel; Backend to Railway, Render, or any Node host

---

## License

MIT
