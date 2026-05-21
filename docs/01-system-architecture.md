# `02-system-architecture.md`

# System Architecture

# UMAF Social Platform

Version: 0.1
Status: Draft

---

# 1. Architecture Overview

UMAF Social Platform is designed as a modular, mobile-first, fullstack web platform built around a Progressive Web Application (PWA) architecture.

The system is structured to support:

- Modular growth
- Rapid iteration
- Mobile-first operations
- Flexible project types
- Transparent workflows
- Scalable data structures

The architecture prioritizes:

- simplicity
- maintainability
- developer velocity
- operational usability

---

# 2. High-Level System Architecture

```text
┌──────────────────────────────────────────────┐
│                PUBLIC WEBSITE                │
│----------------------------------------------│
│ Landing                                      │
│ About                                        │
│ Public Projects                              │
│ Transparency                                 │
│ Donations                                    │
│ Login                                         │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                 PRIVATE PWA                  │
│----------------------------------------------│
│ Dashboard                                    │
│ Projects                                     │
│ People                                       │
│ Sponsors                                     │
│ Contributions                                │
│ Files & Evidence                             │
│ Reports                                      │
│ Users & Roles                                │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│               APPLICATION LAYER              │
│----------------------------------------------│
│ Auth                                         │
│ Permissions                                  │
│ Business Rules                               │
│ Services                                     │
│ Workflows                                    │
│ Validation                                   │
│ Audit Logs                                   │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                DATABASE LAYER                │
│----------------------------------------------│
│ PostgreSQL                                   │
│ Dynamic Fields                               │
│ Storage References                           │
│ Relations                                    │
│ Activity Logs                                │
└──────────────────────────────────────────────┘
```

---

# 3. Architectural Goals

The system architecture must guarantee:

- Modular development
- Independent domains
- Mobile-first usability
- Low maintenance complexity
- Rapid feature iteration
- Scalable project structures
- High transparency
- Clear separation of concerns

---

# 4. Core Architectural Principles

---

## 4.1 Mobile-First Architecture

All user experiences must be designed for mobile devices first.

Desktop layouts are adaptations of the mobile experience, not the opposite.

Design decisions must prioritize:

- touch interaction
- one-handed usage
- fast navigation
- reduced cognitive load
- offline resilience

---

## 4.2 Domain-Driven Structure

The system is divided into independent domains/modules.

Each domain owns:

- UI
- business logic
- validations
- services
- database interactions
- types

---

## 4.3 Functional-First Development

The platform prioritizes:

- workflows
- usability
- data integrity
- operational speed

Visual polish is intentionally delayed until later stages.

---

## 4.4 Modular Expansion

New project types must be supported without major architecture rewrites.

The system should support:

- scholarships
- medical campaigns
- food programs
- future humanitarian initiatives

using the same core engine.

---

## 4.5 Transparency by Design

The architecture must support:

- evidence uploads
- activity tracking
- traceability
- audit logs
- public transparency pages

from the beginning.

---

# 5. Frontend Architecture

---

# 5.1 Frontend Stack

```text
Framework: Next.js
Language: TypeScript
UI: React
Styling: TailwindCSS
Components: shadcn/ui
State: Zustand + React Query
Forms: React Hook Form
Validation: Zod
```

---

# 5.2 Frontend Strategy

The frontend should:

- maximize reusability
- minimize complexity
- favor server components when possible
- reduce client-side overhead
- optimize mobile performance

---

# 5.3 UI Strategy

Early phases should use:

- placeholder imagery
- utility-first layouts
- minimal visual complexity

Focus areas:

- speed
- usability
- accessibility
- consistency

---

# 5.4 Navigation Strategy

The application should use:

## Mobile:

- bottom navigation
- mobile drawers
- floating action buttons
- stacked flows

## Desktop:

- sidebar navigation
- expanded layouts

---

# 6. Backend Architecture

---

# 6.1 Backend Stack

```text
Backend Platform: Supabase
Database: PostgreSQL
ORM: Drizzle ORM
Authentication: Supabase Auth
Storage: Supabase Storage
```

---

# 6.2 Backend Responsibilities

The backend handles:

- authentication
- authorization
- database operations
- file storage
- business rules
- audit logs
- security
- realtime capabilities

---

# 6.3 API Strategy

Primary communication methods:

- Server Actions
- Route Handlers
- Typed service layer

REST endpoints may be added when needed.

---

# 7. Database Architecture

---

# 7.1 Database Philosophy

The database uses a hybrid approach:

- relational core structure
- flexible JSON fields
- dynamic field support

This allows:

- scalability
- customization
- future project flexibility

---

# 7.2 Core Entities

```text
Organization
Users
People
Projects
Project Types
Project Participants
Contributions
Payments
Attachments
Notes
Activity Logs
```

---

# 7.3 Dynamic Fields Strategy

The system must support:

- custom forms
- configurable fields
- project-specific metadata

without requiring frequent schema migrations.

---

# 8. File & Evidence Architecture

---

# 8.1 File Strategy

Files are stored using:

```text
Supabase Storage
```

Supported files:

- images
- receipts
- PDFs
- reports
- evidence uploads

---

# 8.2 Upload Philosophy

Uploads must be:

- mobile-friendly
- camera-friendly
- compressed when possible
- resumable in unstable networks

---

# 9. Authentication & Permissions

---

# 9.1 Authentication

Authentication handled through:

- email/password
- magic links (future)
- role-based access

---

# 9.2 Role System

Initial roles:

```text
SUPER_ADMIN
DIRECTOR
COORDINATOR
VOLUNTEER
ACCOUNTING
VIEWER
SPONSOR
```

---

# 9.3 Authorization Strategy

Authorization should combine:

- global roles
- project-level permissions
- row-level security

---

# 10. Monorepo Structure

Recommended repository structure:

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

# 11. Application Structure

Recommended app structure:

```text
/src
    /app
    /domains
    /components
    /services
    /lib
    /hooks
    /types
    /config
```

---

# 12. Domain Structure

Each domain should follow:

```text
/domain-name
    /components
    /actions
    /queries
    /schemas
    /types
    /services
    /validators
```

Example:

```text
/projects
    /components
    /actions
    /queries
    /schemas
    /types
```

---

# 13. Core Domains

Initial domains:

```text
/auth
/dashboard
/people
/projects
/contributions
/payments
/files
/reports
/public
/settings
```

---

# 14. State Management Strategy

Use local-first state whenever possible.

Preferred hierarchy:

```text
Server State
    ↓
React Query
    ↓
Local UI State
    ↓
Zustand (only when needed)
```

Avoid unnecessary global state.

---

# 15. Form Architecture

Forms should be:

- schema-driven
- reusable
- mobile-optimized
- progressively enhanced

Recommended stack:

```text
React Hook Form
+
Zod
```

---

# 16. Validation Strategy

Validation layers:

```text
Client Validation
    ↓
Server Validation
    ↓
Database Constraints
```

Validation rules must exist in shared schemas whenever possible.

---

# 17. Security Architecture

Security priorities:

- row-level security
- secure uploads
- permission isolation
- audit logs
- protected routes
- input validation

Sensitive operations must always be server-validated.

---

# 18. Audit & Traceability

Critical operations should generate activity logs.

Tracked operations:

- creation
- updates
- deletions
- payments
- uploads
- role changes

---

# 19. Performance Strategy

Performance priorities:

- mobile speed
- low JS payload
- server rendering
- lazy loading
- image optimization
- incremental fetching

---

# 20. Offline & PWA Strategy

The platform should support:

- installable PWA
- offline caching
- background sync
- resilient mobile usage

Initial versions may provide partial offline support only.

---

# 21. Deployment Architecture

---

# 21.1 Frontend Deployment

```text
Vercel
```

---

# 21.2 Backend Infrastructure

```text
Supabase Cloud
```

---

# 21.3 Environment Strategy

Separate environments:

```text
development
staging
production
```

---

# 22. Testing Philosophy

Testing priorities:

1. Business-critical workflows
2. Mobile usability
3. Permissions
4. Data integrity
5. Form validation

---

# 23. Scalability Strategy

The architecture should support future growth including:

- multiple organizations
- increased project types
- sponsor portals
- analytics
- public APIs
- mobile apps

without major rewrites.

---

# 24. Architectural Non-Goals

The initial architecture will NOT prioritize:

- microservices
- overly complex infrastructure
- Kubernetes
- advanced event-driven systems
- enterprise-scale distributed systems

The goal is pragmatic scalability.

---

# 25. Current Architectural Status

Current phase:

- Blueprint & architecture definition

Next phase:

- Database schema design

---

# 26. Architecture Decision Log

The following decisions have been officially approved for the initial platform version:

## Approved Decisions

- Mobile-first architecture
- Functional-first development
- PWA instead of native mobile apps
- Next.js as frontend framework
- Supabase as backend platform
- PostgreSQL as primary database
- Drizzle ORM for schema management
- Modular domain-driven architecture
- Placeholder-first UI strategy
- Dynamic/custom field support
- People-centric relational architecture
- Phase-based delivery roadmap

---

# 27. Immediate Next Steps

The next documentation and planning phases are:

1. Database schema design
2. Business rules definition
3. Mobile-first UX guidelines
4. Core domain specifications
5. Delivery roadmap definition
6. Acceptance criteria per module
7. Initial wireframes
8. Repository structure setup

---

# 28. Document Ownership

This document should evolve as the platform architecture evolves.

Major architectural decisions must be reflected here before implementation.

All contributors should review this document before starting development work.
