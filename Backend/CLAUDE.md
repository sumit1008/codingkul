# CLAUDE.md — Backend Engineering Rules

## Core Principles

- Write production-grade backend code only
- Prioritize scalability, maintainability, and security
- Use TypeScript everywhere
- Avoid quick hacks and temporary fixes
- Prefer explicitness over magic
- Keep business logic separated from controllers
- Never duplicate logic
- Follow SOLID principles
- Use clean architecture concepts where practical
- Backend should remain framework-independent as much as possible

---

# Tech Stack Rules

## Runtime
- Node.js LTS only

## Language
- TypeScript strict mode enabled

## Framework
- Express.js or NestJS depending on project setup

## Database
- Prefer PostgreSQL for relational systems
- Use MongoDB only when document flexibility is actually needed

## ORM / ODM
- Prisma for PostgreSQL
- Mongoose for MongoDB

## Authentication
- JWT access token + refresh token flow
- HTTP-only secure cookies preferred
- Passwords hashed using bcrypt

## Validation
- Use Zod for request validation
- Never trust frontend validation

## Realtime
- Socket.IO for realtime communication

## File Storage
- Cloudinary / S3 / R2
- Never store uploaded files locally in production

---

# Project Architecture

Use feature-based modular architecture.

Example:

src/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── problems/
│   ├── submissions/
│   ├── contests/
│   └── payments/
│
├── common/
│   ├── middleware/
│   ├── utils/
│   ├── constants/
│   ├── validators/
│   ├── errors/
│   └── types/
│
├── config/
├── database/
├── services/
├── jobs/
├── sockets/
└── app.ts

---

# Layer Rules

## Controllers
- Handle request/response only
- No business logic
- No direct DB queries
- Must stay thin

## Services
- All business logic belongs here
- Reusable and testable

## Repositories / Data Layer
- Handle database operations only
- No request handling
- No business logic

## Middleware
- Authentication
- Authorization
- Validation
- Error handling
- Rate limiting

---

# API Design Rules

- Follow REST conventions consistently
- Use plural resource names

Good:
GET /api/problems
POST /api/submissions

Bad:
GET /api/getProblems

---

# Response Format

Always return consistent API responses.

Success:
```json
{
  "success": true,
  "message": "Problem fetched successfully",
  "data": {}
}
```

Error:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

# Error Handling

- Use a centralized error handler middleware
- Create custom error classes (AppError, ValidationError, NotFoundError, etc.)
- Never expose stack traces in production
- Always log errors with context

---

# Security Rules

- Sanitize all user input
- Use helmet for HTTP security headers
- Rate limit all public endpoints
- Never log sensitive data (passwords, tokens, PII)
- Use environment variables for all secrets
- Validate file uploads (type, size, MIME)
- Use CORS with explicit origins

---

# Code Style

- Use `async/await` over callbacks or raw promises
- Always handle promise rejections
- Prefer named exports over default exports
- Keep functions small and single-purpose
- Use meaningful variable and function names
- No `any` types in TypeScript
- Use interfaces for object shapes, types for unions/intersections

---

# Environment

- `.env` for local development
- Never commit `.env` files
- Document all required env vars in `.env.example`

---

# Testing

- Unit test all service-layer logic
- Integration test all API routes
- Use Jest as the test runner
- Mock external services in unit tests
- Minimum 80% coverage on business-critical paths
