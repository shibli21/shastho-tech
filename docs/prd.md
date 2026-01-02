# Product Requirements Document (PRD)

## 1. Product Overview

**Product Name:** [Your App Name] – At-Home Diagnostic Test Booking Platform (tentative)

**Version:** 1.0 (MVP)

**Date:** January 02, 2026

**Author:** Product Manager / Founder

**Description:**  
A SaaS platform inspired by AmarLab.com, enabling users to discover, book, and manage at-home diagnostic lab tests (blood, urine, etc.) with home sample collection. The platform acts as a marketplace connecting users (patients) with partnered diagnostic labs. Samples are collected at home/work, processed at partner labs, and reports delivered digitally (with optional hardcopy).

Core value proposition: Convenient, safe, and affordable access to diagnostic tests without visiting labs – especially beneficial for elderly, busy professionals, disabled individuals, or those in traffic-heavy urban areas.

## 2. Purpose and Objectives

**Problem Solved:**

- Traditional lab visits are time-consuming, involve travel risks, and are inconvenient for vulnerable groups.
- Fragmented options for comparing labs, prices, and availability.
- Lack of easy home collection booking in many regions.

**Goals:**

- Validate demand for at-home diagnostics in target market (initially 1-2 cities).
- Achieve 500+ bookings in first 3 months post-launch.
- Gather feedback on user experience, lab partnerships, and pricing.
- Establish a scalable marketplace model with revenue from service fees/comissions.

**Success Metrics (MVP):**

- User sign-ups: 1,000+ in first quarter.
- Booking conversion rate: >20%.
- Repeat bookings: >15%.
- Net Promoter Score (NPS): >40.
- Operational: Successful end-to-end flow for 90%+ orders (collection to report delivery).

## 3. Target Audience and User Personas

**Primary Users:** Patients (end-consumers booking tests).

**Personas:**

- **Busy Professional (30-45 years):** Works long hours, prefers home collection to save time. Books packages for annual checkups.
- **Elderly/Family Caregiver (50+):** Books for self/parents, values safety and digital reports.
- **Parent with Young Children:** Needs quick tests without taking kids to labs.

**Secondary Users:**

- Admin/Operations team (internal).
- Partner Labs (view/manage assigned orders).
- Phlebotomists/Collectors (future expansion).

**Geographic Focus (MVP):** Limited to 1-2 major cities (e.g., Dhaka-like urban area or equivalent in your target country) for logistics feasibility.

## 4. Competitive Landscape

Key competitors (based on similar models like AmarLab in Bangladesh and Indian players):

- AmarLab.com: Direct inspiration – home collection, partner labs (e.g., Ibn Sina, Thyrocare equivalents).
- Indian analogs: Healthians, Redcliffe Labs, Thyrocare, Pathkind Labs, Pharmeasy Diagnostics – strong in home collection, packages, digital reports.

**Differentiation:**

- User choice of partner lab (transparency in pricing/ratings).
- Curated packages with clear preparation instructions.
- Seamless digital report access and family profiles.
- Future: Faster scheduling, real-time tracking.

## 5. Features and Requirements

Prioritized using MoSCoW method (Must-have for MVP, Should-have for near-term, etc.).

### Must-Have (Core MVP Features)

#### Patient-Facing (Web + Mobile-Responsive; Mobile App optional post-MVP)

- User authentication: Sign-up/login via email/phone + OTP (Google/Apple optional).
- Profile management: Save addresses, add family members (multiple patients per account).
- Test catalog: Search/browse individual tests and packages (descriptions, prices, fasting requirements, report TAT).
- Lab selection: Choose preferred partner lab (show ratings, prices if varying).
- Booking flow:
  - Cart system for multiple tests/packages.
  - Date/time slot selection (calendar with availability).
  - Patient details selection.
  - Address confirmation (geolocation/pin code validation for service areas).
- Payment: Online gateways (e.g., Stripe/Razorpay equivalents) + Cash on Collection.
- Order dashboard: View upcoming/past orders, track status (booked → collector assigned → collected → processing → report ready).
- Report delivery: Secure PDF view/download, email/SMS notifications.
- Notifications: SMS/Email for confirmations, reminders, status updates, report ready.

#### Admin/Operations Dashboard

- Test/package management: Add/edit tests, prices, assign to labs.
- Partner lab onboarding: Basic profiles, tests offered.
- Order management: View orders, manually assign to collectors/labs, update statuses.
- Basic analytics: Orders count, revenue, popular tests.

#### Non-Functional

- Security: HTTPS, data encryption (health data sensitive), role-based access.
- Compliance: Align with local health data regulations (e.g., equivalent to HIPAA/GDPR).
- Notifications integration: SMS/Email (Twilio/SendGrid equivalents).

### Should-Have (Post-MVP Iteration 1)

- Ratings/reviews for labs.
- Discounts/coupons.
- Push notifications (mobile app).
- Basic collector assignment map.

### Could-Have (Later)

- Phlebotomist mobile app for assignments/tracking.
- AI test recommendations.
- Insurance integration.
- Hardcopy report delivery.

### Won't-Have (Out of Scope for MVP)

- Multi-city expansion.
- In-lab visit booking.
- Consultations with doctors.
- Advanced analytics/AI insights.

## 6. User Flows (High-Level)

1. **New User Booking:**

   - Homepage → Search tests → Add to cart → Select lab → Choose slot/address → Payment → Confirmation.

2. **Order Tracking:**

   - Dashboard → Select order → View status updates.

3. **Report Access:**
   - Notification → Login → Dashboard → Download PDF.

## 7. Technical Requirements

- **Frontend:** React.js (web), React Native (cross-platform mobile).
- **Backend:** Node.js/Express or Django.
- **Database:** PostgreSQL.
- **Payments:** Integrated gateway (region-specific).
- **Hosting:** Cloud (AWS/Heroku/DigitalOcean) for scalability.
- **Integrations:** Maps API for address validation, SMS/Email services.

**Performance:** Page load <3s, support 1,000 concurrent users initially.

**Scalability:** Designed for easy addition of cities/labs.

## 8. Non-Functional Requirements

- **Security & Privacy:** Encrypt sensitive data, secure auth, audit logs.
- **Accessibility:** WCAG basics (text resize, contrasts).
- **Reliability:** 99% uptime, backups.
- **Support:** In-app help, hotline integration.

## 9. Risks and Assumptions

**Assumptions:**

- Partnerships with 5-10 labs secured pre-launch.
- Logistics (collectors) handled manually initially.
- Demand validated via pre-signups/landing page.

**Risks & Mitigations:**

- Logistics delays: Start in limited area, manual oversight.
- Low adoption: Targeted marketing (social ads, partnerships).
- Regulatory issues: Consult local health authorities early.

## 10. Release Plan

- **MVP Timeline:** 3-6 months development.
- **Launch:** Soft launch in one city, gather feedback.
- **Post-Launch:** Bi-weekly iterations based on user data.

This PRD serves as the guiding document for development. It focuses on a lean MVP to quickly validate the core marketplace model while ensuring a complete end-to-end user experience. Feedback welcome – let's iterate!
