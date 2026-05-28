# `02-tech-stack.md`

# Tech Stack

# OWOFVzla Social Platform

Version: 0.1
Status: Draft

---

# 1. Purpose

This document defines the official technology stack for the OWOFVzla Social Platform.

The selected technologies prioritize:

- rapid development
- mobile-first performance
- maintainability
- scalability
- low operational complexity
- developer productivity
- AI/Codex compatibility

---

# 2. Stack Philosophy

The platform architecture intentionally avoids:

- unnecessary complexity
- premature microservices
- overengineered infrastructure
- enterprise-heavy tooling

The goal is to maximize:

- delivery speed
- stability
- maintainability
- long-term scalability

using a lean and modern stack.

---

# 3. Core Technology Decisions

---

## 3.1 Frontend Framework

```text
Next.js
```

### Reasoning

Chosen because it provides:

- React ecosystem
- App Router architecture
- Server Components
- Server Actions
- SEO support
- excellent PWA support
- strong developer ecosystem
- deployment simplicity

---

## 3.2 Frontend Language

```text
TypeScript
```

### Reasoning

Required for:

- type safety
- scalability
- maintainability
- shared contracts
- safer refactors
- AI/Codex consistency

---

## 3.3 UI Library

```text
React
```

### Reasoning

Provides:

- component architecture
- ecosystem maturity
- reusable UI patterns
- compatibility with modern tooling

---

# 4. Styling Stack

---

## 4.1 CSS Framework

```text
TailwindCSS
```

### Reasoning

Chosen because it:

- accelerates development
- improves consistency
- simplifies responsive design
- works extremely well for mobile-first UI
- reduces CSS complexity

---

## 4.2 Component System

```text
shadcn/ui
```

### Reasoning

Provides:

- accessible primitives
- composable components
- clean Tailwind integration
- low styling overhead
- full customization control

---

## 4.3 Icons

```text
lucide-react
```

### Reasoning

Chosen for:

- lightweight bundle size
- consistency
- mobile-friendly iconography
- excellent React support

---

# 5. Backend Stack

---

## 5.1 Backend Platform

```text
Supabase
```

### Responsibilities

Supabase handles:

- PostgreSQL database
- authentication
- file storage
- row-level security
- realtime capabilities
- edge functions

---

## 5.2 Database Engine

```text
PostgreSQL
```

### Reasoning

Chosen because it supports:

- relational integrity
- JSONB fields
- scalability
- advanced querying
- long-term maintainability

---

## 5.3 ORM

```text
Drizzle ORM
```

### Reasoning

Chosen because:

- schema-first approach
- strong TypeScript support
- simple mental model
- better AI/Codex generation
- lower abstraction complexity
- explicit SQL-friendly architecture

---

# 6. Authentication Stack

---

## 6.1 Authentication Provider

```text
Supabase Auth
```

### Initial Authentication Methods

Supported initially:

- email/password (only for invited users)

**Registration flow**:

- No public sign-up.
- Only SUPER_ADMIN can invite new users.
- Invited users receive an email with a magic-like invitation link (one-time token) to set their password and activate their account.

### Future Authentication Methods

- Magic links
- OAuth providers (Google, etc.)

---

# 7. State Management

---

## 7.1 Server State

```text
TanStack Query
```

### Responsibilities

- server caching
- background refetching
- optimistic updates
- async state handling

---

## 7.2 Client State

```text
Zustand
```

### Usage Rules

Only use Zustand for:

- lightweight global UI state
- temporary client state
- UI coordination

Avoid unnecessary global state.

---

# 8. Forms & Validation

---

## 8.1 Forms

```text
React Hook Form
```

### Reasoning

Chosen because:

- lightweight
- performant
- mobile-friendly
- low re-render overhead
- excellent TypeScript support

---

## 8.2 Validation

```text
Zod
```

### Responsibilities

- form validation
- shared schemas
- API validation
- type inference

---

# 9. File Storage

---

## 9.1 Storage Provider

```text
Supabase Storage
```

### Responsibilities

- uploads
- evidence storage
- receipt storage
- profile photos
- public assets

---

# 10. PWA Stack

---

## 10.1 PWA Support

```text
next-pwa
```

### Features

- installable app
- offline caching
- service workers
- mobile optimization

---

# 11. Deployment Stack

---

## 11.1 Frontend Hosting

```text
Vercel
```

### Reasoning

Provides:

- seamless Next.js deployment
- preview deployments
- fast CDN
- easy environment management

---

## 11.2 Backend Hosting

```text
Supabase Cloud
```

---

## 11.3 Email Service

```text
Resend
```

### Reasoning

Chosen for:

- developer-friendly API
- **free plan: 100 emails/day** (sufficient for MVP)
- React Email integration for template rendering
- reliable delivery
- simple setup with Next.js (server actions or route handlers)

### Usage in the Platform

Emails are used for:

- **User invitations** – sending unique invitation links with one-time tokens to new organizers (COORDINATOR, DIRECTOR, ACCOUNTING, etc.)
- Future: password reset, notifications, sponsor communications

### Cost & Scalability

- The free tier (100 emails/day) is adequate for initial growth (inviting organizers and basic notifications).
- If volume exceeds this threshold, the team can:
  - Upgrade Resend plan (pay-as-you-go)
  - Migrate to AWS SES or SendGrid

### Environment Variables

```env
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=noreply@owofvzla.org (or verified domain)
```

---

# 12. Version Control

---

## 12.1 Repository Hosting

```text
GitHub
```

---

## 12.2 Branch Strategy

Initial strategy:

```text
main
develop
feature/*
hotfix/*
```

---

# 13. Package Management

---

## 13.1 Package Manager

```text
pnpm
```

### Reasoning

Chosen because:

- fast installs
- efficient disk usage
- monorepo-friendly
- deterministic dependencies

---

# 14. Monorepo Strategy

Recommended structure:

```text
/apps
    /web

/packages
    /ui
    /db
    /types
    /validators
    /config
```

---

# 15. Testing Stack

---

## 15.1 Unit Testing

```text
Vitest
```

---

## 15.2 Component Testing

```text
Testing Library
```

---

## 15.3 End-to-End Testing

```text
Playwright
```

### Responsibilities

Critical workflow testing:

- authentication (invitation acceptance)
- mobile navigation
- forms
- uploads
- permissions

---

# 16. Code Quality Tooling

---

## 16.1 Linting

```text
ESLint
```

---

## 16.2 Formatting

```text
Prettier
```

---

## 16.3 Git Hooks

```text
Husky
```

### Responsibilities

- pre-commit validation
- lint checks
- formatting checks

---

# 17. Environment Management

---

## 17.1 Environment Files

```text
.env.local
.env.development
.env.staging
.env.production
```

---

## 17.2 Environment Separation

Separate environments for:

- development
- staging
- production

must always exist.

---

# 18. API Strategy

Primary communication methods:

- Server Actions
- Route Handlers

REST endpoints should only be added when necessary.

---

# 19. Realtime Strategy

Realtime capabilities may be used for:

- notifications
- live updates
- collaborative operations

Initial versions should minimize realtime complexity.

---

# 20. Image Strategy

Early phases should prioritize:

- placeholders
- compressed uploads
- optimized rendering

Advanced media handling comes later.

---

# 21. Logging & Monitoring

Initial monitoring stack:

```text
Vercel Analytics
Supabase Logs
Console Logging
```

Future additions may include:

- Sentry
- PostHog
- BetterStack

---

# 22. Security Stack

Core security mechanisms:

- Supabase RLS
- Zod validation
- protected route middleware
- server-side validation
- secure uploads
- invitation token system (one-time, expiring)

---

# 23. Mobile-First Technical Strategy

Technical decisions must prioritize:

- fast mobile rendering
- reduced bundle size
- touch interactions
- responsive layouts
- offline resilience

Desktop optimization is secondary.

---

# 24. AI/Codex Optimization Strategy

The stack was intentionally selected to improve:

- AI-assisted development
- code consistency
- prompt efficiency
- modular generation

Technologies were chosen partly because they:

- have predictable patterns
- strong TypeScript support
- lower architectural ambiguity

---

# 25. Explicit Non-Goals

The initial stack intentionally avoids:

- Redux
- GraphQL
- microservices
- Kubernetes
- Prisma
- React Native
- complex event systems
- heavy enterprise tooling

These may be evaluated later if necessary.

---

# 26. Future Stack Possibilities

Future additions may include:

- Sentry
- PostHog
- Stripe
- Cloudflare Images
- Expo
- Queue systems
- AI integrations

depending on platform growth.

---

# 27. Current Status

Current phase:

- Technical foundation definition (including invitation system)

Next phase:

- Business rules definition (invitation rules, public project pages)

---

# 28. Official Stack Decisions

Approved stack decisions:

Frontend:

- Next.js
- React
- TypeScript
- TailwindCSS
- shadcn/ui

Backend:

- Supabase
- PostgreSQL

ORM:

- Drizzle ORM

State:

- TanStack Query
- Zustand

Validation:

- Zod

Forms:

- React Hook Form

Testing:

- Vitest
- Playwright

Deployment:

- Vercel

Email:

- Resend (free tier, for invitations and notifications)
