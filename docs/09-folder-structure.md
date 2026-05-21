# `09-folder-structure.md`

# Folder Structure

# UMAF Social Platform

Version: 0.1
Status: Draft

---

# 1. Purpose

This document defines the official repository and folder structure standards for the UMAF Social Platform.

The structure prioritizes:

- scalability
- maintainability
- modularity
- developer clarity
- domain isolation
- AI/Codex compatibility

The architecture intentionally follows:

- domain-driven organization
- feature isolation
- reusable shared packages
- mobile-first frontend structure

---

# 2. Structure Philosophy

The repository structure must:

- reduce coupling
- improve discoverability
- isolate business domains
- simplify onboarding
- reduce architectural chaos

The system should avoid:

- giant shared folders
- unclear ownership
- deeply tangled dependencies
- monolithic code organization

---

# 3. Repository Strategy

The platform uses a lightweight monorepo structure.

Recommended structure:

```text
/apps
/packages
/docs
```

---

# 4. Root Repository Structure

```text
root/
│
├── apps/
├── packages/
├── docs/
├── .github/
├── .env.example
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── README.md
└── tsconfig.base.json
```

---

# 5. Apps Structure

Applications live inside:

```text
/apps
```

Initial structure:

```text
/apps
    /web
```

Future expansion may include:

```text
/apps
    /web
    /mobile
    /admin
```

---

# 6. Web Application Structure

Recommended structure:

```text
/apps/web
│
├── public/
├── src/
├── tests/
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── middleware.ts
```

---

# 7. Source Structure

Main application source:

```text
/src
```

Recommended structure:

```text
/src
│
├── app/
├── domains/
├── components/
├── services/
├── hooks/
├── lib/
├── config/
├── types/
├── styles/
├── providers/
├── middleware/
└── constants/
```

---

# 8. App Router Structure

The platform uses:

```text
Next.js App Router
```

Recommended structure:

```text
/app
│
├── (public)/
├── (auth)/
├── (dashboard)/
├── api/
├── layout.tsx
├── page.tsx
├── loading.tsx
├── error.tsx
└── not-found.tsx
```

---

# 9. Route Group Structure

---

## 9.1 Public Routes

```text
(public)
```

Examples:

```text
/
about
projects
transparency
donate
```

---

## 9.2 Auth Routes

```text
(auth)
```

Examples:

```text
/login
/register
/forgot-password
```

---

## 9.3 Dashboard Routes

```text
(dashboard)
```

Examples:

```text
/dashboard
/people
/projects
/payments
/reports
/settings
```

---

# 10. Domain-Driven Structure

Core business logic should live inside:

```text
/domains
```

Each domain owns:

- UI
- business logic
- validations
- queries
- actions
- types
- services

---

# 11. Domain Structure Template

Recommended domain structure:

```text
/domains
    /domain-name
        /actions
        /components
        /constants
        /hooks
        /queries
        /schemas
        /services
        /types
        /utils
        /validators
```

---

# 12. Example Domain Structure

Example:

```text
/domains
    /people
        /actions
        /components
        /hooks
        /queries
        /schemas
        /services
        /types
```

---

# 13. Core Domains

Initial platform domains:

```text
/auth
/dashboard
/people
/projects
/contributions
/payments
/files
/reports
/settings
/public
```

---

# 14. Shared Components Structure

Reusable UI components live inside:

```text
/components
```

Recommended structure:

```text
/components
│
├── ui/
├── forms/
├── layout/
├── navigation/
├── feedback/
├── cards/
├── data-display/
└── mobile/
```

---

# 15. UI Components

Primitive reusable components:

```text
/components/ui
```

Examples:

- buttons
- inputs
- modals
- sheets
- badges
- tables

These should primarily wrap:

- shadcn/ui
- shared design patterns

---

# 16. Mobile Components

Mobile-specific patterns:

```text
/components/mobile
```

Examples:

- bottom navigation
- floating actions
- mobile drawers
- bottom sheets
- mobile cards

---

# 17. Forms Structure

Shared form patterns:

```text
/components/forms
```

Examples:

- form wrappers
- field groups
- validation helpers
- upload fields

---

# 18. Services Structure

Business services live inside:

```text
/services
```

Examples:

```text
auth.service.ts
upload.service.ts
permissions.service.ts
```

Services should contain:

- reusable business logic
- integrations
- external communication

Avoid placing business logic directly inside pages.

---

# 19. Hooks Structure

Reusable hooks:

```text
/hooks
```

Examples:

```text
use-mobile.ts
use-auth.ts
use-permissions.ts
use-upload.ts
```

---

# 20. Lib Structure

Shared technical utilities:

```text
/lib
```

Examples:

```text
supabase.ts
drizzle.ts
logger.ts
utils.ts
```

---

# 21. Config Structure

Application configuration:

```text
/config
```

Examples:

```text
navigation.config.ts
roles.config.ts
upload.config.ts
```

---

# 22. Constants Structure

Application constants:

```text
/constants
```

Examples:

```text
roles.ts
statuses.ts
permissions.ts
```

---

# 23. Types Structure

Global shared types:

```text
/types
```

Examples:

```text
api.types.ts
database.types.ts
common.types.ts
```

Avoid duplicated types across domains.

---

# 24. Providers Structure

Application providers:

```text
/providers
```

Examples:

```text
query-provider.tsx
theme-provider.tsx
auth-provider.tsx
```

---

# 25. Styles Structure

Global styling:

```text
/styles
```

Examples:

```text
globals.css
tokens.css
```

Avoid scattered CSS files across the application.

---

# 26. Middleware Structure

Middleware logic:

```text
/middleware
```

Examples:

- auth guards
- permission guards
- organization validation

---

# 27. API Structure

API routes:

```text
/app/api
```

Recommended structure:

```text
/api
    /auth
    /people
    /projects
    /payments
    /uploads
```

---

# 28. Packages Structure

Reusable shared packages:

```text
/packages
```

Recommended structure:

```text
/packages
│
├── ui/
├── db/
├── types/
├── validators/
└── config/
```

---

# 29. UI Package

Reusable design system:

```text
/packages/ui
```

Examples:

- shared components
- theme utilities
- reusable patterns

---

# 30. Database Package

Database layer:

```text
/packages/db
```

Recommended structure:

```text
/db
│
├── schema/
├── migrations/
├── queries/
├── seeds/
└── index.ts
```

---

# 31. Validators Package

Shared validation schemas:

```text
/packages/validators
```

Examples:

- people validators
- payment validators
- project validators

---

# 32. Documentation Structure

Documentation lives inside:

```text
/docs
```

Recommended structure:

```text
/docs
│
├── roadmap/
├── specs/
├── flows/
├── wireframes/
├── decisions/
└── database/
```

---

# 33. Specs Structure

Feature specifications:

```text
/specs
```

Examples:

```text
people.spec.md
projects.spec.md
payments.spec.md
```

---

# 34. Flows Structure

Business workflows:

```text
/flows
```

Examples:

```text
sponsorship-flow.md
payment-flow.md
project-flow.md
```

---

# 35. Decisions Structure

Architecture Decision Records:

```text
/decisions
```

Examples:

```text
ADR-001-use-supabase.md
ADR-002-mobile-first.md
```

---

# 36. Testing Structure

Tests live close to their domains whenever possible.

Examples:

```text
/domain-name/__tests__
```

Shared E2E tests:

```text
/tests/e2e
```

---

# 37. File Naming Conventions

---

## 37.1 Components

Use:

```text id="jlwm12"
PascalCase.tsx
```

Examples:

```text
PersonCard.tsx
ProjectForm.tsx
```

---

## 37.2 Hooks

Use:

```text id="jlwm13"
use-*.ts
```

Examples:

```text
useAuth.ts
useUpload.ts
```

---

## 37.3 Services

Use:

```text id="jlwm14"
*.service.ts
```

Examples:

```text
auth.service.ts
payments.service.ts
```

---

## 37.4 Validators

Use:

```text id="jlwm15"
*.schema.ts
```

Examples:

```text
person.schema.ts
payment.schema.ts
```

---

# 38. Import Strategy

Preferred import hierarchy:

```text id="jlwm16"
1. External libraries
2. Shared packages
3. Internal domains
4. Relative imports
```

Avoid deeply nested relative imports.

---

# 39. Dependency Rules

Domains should avoid:

- circular dependencies
- cross-domain mutation logic
- hidden shared state

Communication should occur through:

- services
- typed contracts
- shared validators

---

# 40. Architectural Boundaries

Business logic should NOT live inside:

- page components
- UI-only components
- layout files

Business rules belong to:

- services
- actions
- domain logic

---

# 41. Mobile-First Structure Considerations

The structure should support:

- lightweight bundles
- lazy loading
- domain isolation
- mobile performance optimization

---

# 42. Scalability Considerations

The folder structure must support future expansion including:

- mobile apps
- sponsor portals
- analytics
- external APIs
- multilingual support

without major reorganization.

---

# 43. Folder Structure Anti-Patterns

Avoid:

- giant shared folders
- unclear ownership
- duplicated components
- business logic in UI
- deeply nested folders
- monolithic service files
- duplicated validation logic

---

# 44. Current Status

Current phase:

- Folder structure definition

Next phase:

- Coding standards definition
