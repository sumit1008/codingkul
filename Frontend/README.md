# Codingkul — Frontend

Next.js 15 (App Router) student-facing web application.

## Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Lucide icons
- **Animations**: Framer Motion
- **Auth**: httpOnly JWT cookie via `AuthContext` — no client-side token storage

## Structure

```
src/
├── app/
│   ├── (auth)/          # login, signup pages (no navbar layout)
│   ├── (app)/           # dashboard pages (sidebar layout)
│   ├── layout.tsx        # root layout with AuthProvider
│   ├── page.tsx          # landing page
│   └── providers.tsx     # client providers wrapper
├── components/
│   ├── auth/             # shared auth UI (left panel)
│   ├── dashboard/        # sidebar, top-navbar, widgets
│   ├── navbar.tsx        # landing page navbar (auth-aware)
│   └── ui/               # shadcn base components
└── lib/
    └── auth-context.tsx  # global auth state, API calls
```

## Auth Flow

1. On mount, `AuthContext` calls `GET /api/auth/me` to restore session from cookie
2. Login / signup call backend REST endpoints, cookie is set server-side
3. Google OAuth redirects to `http://localhost:5000/api/auth/google` — backend handles the full flow and redirects back to `/dashboard`
4. Logout calls `POST /api/auth/logout` to clear the cookie, then redirects to `/login`

## Running Locally

```bash
npm install
npm run dev      # http://localhost:3000
```

Backend must be running on `http://localhost:5000`.

## Building for Production

```bash
npm run build
npm start
```
