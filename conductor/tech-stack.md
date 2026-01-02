# Technology Stack: HomeLab Connect

## Core Framework & Language
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Runtime:** Node.js (via Next.js)

## Frontend
- **Library:** React 19
- **Styling:** Tailwind CSS 4
- **UI Components:**
    - **Shadcn UI:** High-quality, accessible component primitives.
    - **Radix UI:** Headless UI components for accessibility.
    - **Base UI:** Foundation for building custom components.
- **Icons:** Lucide React
- **Data Visualization:** Recharts (for health marker trend analysis).
- **Forms & Validation:** (Inferred usage of React standards or simple state management).
- **Animations:** tw-animate-css, Vaul (drawers), Embla Carousel.

## Backend & API
- **API Routes:** Next.js Route Handlers (Server-side logic).
- **Database:** (Proposed in product documents) MongoDB.
- **Object Storage:** (Proposed) AWS S3 (for medical reports).
- **Authentication:** (Inferred) Likely NextAuth.js or custom JWT-based flow.

## Infrastructure & Tools
- **Package Manager:** (Detected) Bun (lockfile present) / npm / yarn.
- **Linting:** ESLint (with `eslint-config-next`).
- **Development Server:** Next.js Dev Server.
- **Deployment:** Vercel (Recommended for Next.js) or AWS (as per docs).

## Utilities
- **class-variance-authority:** For managing component variants.
- **clsx / tailwind-merge:** For dynamic Tailwind class management.
- **date-fns:** For date manipulation and formatting.
- **sonner:** For toast notifications.
