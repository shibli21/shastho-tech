# Specification: Comprehensive User Authentication

## 1. Overview
This track focuses on implementing a robust, secure, and scalable authentication system for the HomeLab Connect platform using **Better-Auth**. The goal is to support multiple user roles (Patients, Admins, Partners) with seamless sign-up, login, and session management capabilities.

## 2. Goals
- **Secure Authentication:** Implement email/password and social login (Google) using Better-Auth.
- **Role-Based Access Control (RBAC):** distinct roles for Patients, Admins, and Lab Partners.
- **Session Management:** Secure handling of user sessions across devices.
- **User Profile Management:** Basic profile setup linked to authentication identity.
- **Developer Experience:** Type-safe authentication hooks and utilities.

## 3. User Stories
- **As a Patient:**
  - I want to sign up using my email and password or Google account so that I can access the platform.
  - I want to log in securely to view my dashboard and book tests.
  - I want to reset my password if I forget it.
- **As an Admin:**
  - I want to log in with privileged access to manage the platform.
- **As a Partner:**
  - I want to log in to my dedicated dashboard to view orders.

## 4. Technical Requirements
- **Library:** `better-auth` (latest version).
- **Database:** MongoDB (using Mongoose or a compatible adapter for Better-Auth).
- **Framework:** Next.js 15+ App Router.
- **Styling:** Tailwind CSS + Shadcn UI for auth forms.
- **Encryption:** Secure hashing for passwords (handled by Better-Auth).

## 5. API Design
- **Auth Routes:**
  - `POST /api/auth/sign-up`: Register a new user.
  - `POST /api/auth/sign-in`: Authenticate a user.
  - `POST /api/auth/sign-out`: Terminate session.
  - `GET /api/auth/session`: Retrieve current session.
  - (Better-Auth likely handles these via a unified handler).

## 6. UI/UX Design
- **Sign-Up Page:** Clean form with Email, Password, Name, and "Continue with Google" button.
- **Sign-In Page:** Similar to sign-up, with "Forgot Password" link.
- **Protected Routes:** Middleware to redirect unauthenticated users from `/dashboard` and `/admin`.

## 7. Security Considerations
- **CSRF Protection:** built-in or middleware-enforced.
- **Rate Limiting:** Prevent brute-force attacks on login endpoints.
- **Data Validation:** Zod schemas for all auth inputs.
