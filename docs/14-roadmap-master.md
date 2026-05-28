# `14-roadmap-master.md`

# Master Roadmap

# OWOFVzla Social Platform

Version: 0.1
Status: Draft

---

# 1. Purpose

This document defines the official development roadmap for the OWOFVzla Social Platform.

The roadmap establishes:

- implementation phases
- delivery priorities
- validation criteria
- operational milestones
- development sequencing

The roadmap prioritizes:

- functionality first
- mobile-first usability
- modular growth
- stable iteration
- maintainable scaling

---

# 2. Roadmap Philosophy

The platform follows:

```text
Foundation First
→ Core Operations
→ Transparency
→ Optimization
→ Expansion
```

The project intentionally avoids:

- premature complexity
- giant feature releases
- overengineered MVPs

Each phase should produce:

- usable deliverables
- testable workflows
- operational improvements

---

# 3. Development Priorities

Priority order:

```text
1. Functional Stability
2. Mobile Usability
3. Security
4. Data Integrity
5. Transparency
6. Performance
7. Visual Polish
```

Visual polish intentionally comes later.

---

# 4. Delivery Methodology

The roadmap follows:

```text
Blueprint
→ Architecture
→ Foundation
→ Core Modules
→ Public Portal
→ Optimization
→ Expansion
```

Each phase must:

- define scope
- define acceptance criteria
- define testing requirements
- define technical boundaries

---

# 5. Roadmap Structure

The roadmap is divided into:

```text
Phase 00 → Foundation
Phase 01 → Authentication & Invitations
Phase 02 → People Module
Phase 03 → Projects Module
Phase 04 → Contributions & Payments
Phase 05 → Files & Evidence
Phase 06 → Public Portal & Landing Pages
Phase 07 → Reporting & Analytics
Phase 08 → UX Polish & Optimization
Phase 09 → Future Expansion
```

---

# 6. Current Status

Current project phase:

```text
Architecture & Documentation
```

Current focus:

- system design
- business rules
- standards
- roadmap planning

---

# 7. Phase 00 — Foundation

---

## Objective

Build the technical and architectural foundation of the platform.

---

## Includes

```text
Next.js setup
TypeScript setup
TailwindCSS setup
shadcn/ui setup
Supabase integration
Drizzle ORM setup
Authentication scaffolding
PWA configuration
Mobile layout foundation
Navigation foundation
Environment setup
GitHub repository setup
CI baseline
Seed data:
  - Organization (OWOFVzla)
  - SUPER_ADMIN user (Saturno)
```

---

## Deliverables

```text
Working application shell
Protected routing
PWA installability
Responsive mobile layout
Environment configuration
Base repository structure
Pre-seeded organization and super-admin
```

---

## Acceptance Criteria

```text
Application runs locally
TypeScript passes
Authentication scaffold works
Protected routes work
PWA installs successfully
Mobile navigation usable
Folder structure established
Seed data loads correctly
```

---

## Testing Requirements

```text
TypeScript validation
Mobile responsive testing
Basic authentication testing
PWA validation
Environment validation
Seed data verification
```

---

## Technical Notes

Focus on:

- architecture stability
- modularity
- maintainability

Avoid:

- premature feature development
- advanced UI polish

---

# 8. Phase 01 — Authentication & Invitations

---

## Objective

Implement secure authentication and invitation-based user registration.

---

## Includes

```text
Login flows
Session handling
Protected routes
Role handling
Permission middleware
Supabase Auth integration
Invitation system:
  - invitations table (token, expires_at, role)
  - SUPER_ADMIN panel to invite users (email, role)
  - Email sending via Resend
  - Public accept-invite page (set password)
  - Token expiration and single-use validation
Organization isolation (single org)
```

---

## Deliverables

```text
Secure login system
Authenticated dashboard access
Role-aware routing
Session persistence
Invitation-only registration flow
SUPER_ADMIN user management panel
```

---

## Acceptance Criteria

```text
Users can authenticate (existing users)
SUPER_ADMIN can create invitations
Invited user receives email with link
Invited user can accept, set password, and login
Expired tokens cannot be used
Used tokens cannot be reused
Only SUPER_ADMIN can access invitation panel
Protected routes enforced
Role restrictions functional
```

---

## Testing Requirements

```text
Authentication testing
Invitation creation & acceptance testing
Token expiration & reuse prevention
Permission testing (SUPER_ADMIN only)
RLS validation
Email delivery (Resend) - test with staging keys
```

---

# 9. Phase 02 — People Module

---

## Objective

Build the master people management system.

---

## Includes

```text
People CRUD
Tags
Search
Filters
Profiles
Notes
Attachments
Mobile forms
Optional user_id field (reserved for future)
```

---

## Deliverables

```text
Operational people management
Reusable participant system
Mobile-friendly workflows
```

---

## Acceptance Criteria

```text
Create person
Edit person
Archive person
Search people
Upload profile image
Tag participants
Mobile usability validated
```

---

## Testing Requirements

```text
CRUD validation
Duplicate detection testing
Mobile form testing
Upload testing
Permission testing
```

---

## Technical Notes

Prioritize:

- reusable people architecture
- modular forms
- mobile workflows

The `user_id` field remains unused in this phase (future sponsor portal).

---

# 10. Phase 03 — Projects Module

---

## Objective

Implement project management workflows.

---

## Includes

```text
Projects CRUD
Project types
Participants
Project statuses
Visibility rules (public, private, internal)
Timeline support
Project notes
```

---

## Deliverables

```text
Operational project management
Participant assignment system
Project visibility system
```

---

## Acceptance Criteria

```text
Create project
Assign participants
Change project status
Public/private/internal visibility works
Archive project
Participant relationships preserved
```

---

## Testing Requirements

```text
Project CRUD testing
Permission validation
Participant relationship testing
Visibility testing
```

---

# 11. Phase 04 — Contributions & Payments

---

## Objective

Implement sponsorship and financial tracking workflows.

---

## Includes

```text
Contributions
Sponsors
Payments
Receipts
Contribution history
Financial timelines
```

---

## Deliverables

```text
Operational sponsorship tracking
Payment registration workflows
Contribution history visibility
```

---

## Acceptance Criteria

```text
Create contribution
Register payment
Upload receipt
View payment history
Track sponsor relationships
Maintain audit traceability
```

---

## Testing Requirements

```text
Payment validation
Contribution logic testing
Upload testing
Permission validation
Audit log validation
```

---

## Technical Notes

Financial history must remain:

- traceable
- immutable
- auditable

---

# 12. Phase 05 — Files & Evidence

---

## Objective

Build centralized evidence and file management workflows.

---

## Includes

```text
Uploads
Evidence galleries
Mobile camera support
File previews
Document attachments
Upload permissions
```

---

## Deliverables

```text
Operational evidence workflows
Mobile upload support
Attachment visibility system
```

---

## Acceptance Criteria

```text
Upload files from mobile
Preview attachments
Validate permissions
Restrict unsafe uploads
Associate evidence correctly
```

---

## Testing Requirements

```text
Upload validation
Mobile upload testing
Permission testing
File restriction validation
```

---

# 13. Phase 06 — Public Portal & Landing Pages

---

## Objective

Build the public-facing transparency platform, including per-project landing pages.

---

## Includes

```text
Landing page (home)
About page
Public projects listing
Public project landing pages (/proyectos/[slug]):
  - Project title, description, cover image
  - Status and timeline
  - Public notes and evidence
  - Participant summaries (limited)
Transparency pages
Public metrics
SEO basics
```

---

## Deliverables

```text
Operational public portal
Public project visibility with individual landing pages
Transparency workflows
SEO-friendly public routes
```

---

## Acceptance Criteria

```text
Public projects visible on listing
Individual project landing pages accessible
Sensitive data (internal notes, private uploads) never exposed
Responsive public pages (mobile-first)
Basic SEO functional (meta tags, sitemap)
Public evidence filtered correctly (visibility = 'public')
```

---

## Testing Requirements

```text
Visibility testing (public vs private)
SEO validation (meta tags, robots.txt)
Responsive testing on mobile devices
Public data security testing (ensure no leaks)
```

---

## Technical Notes

Public pages must NEVER expose:

- internal notes
- sensitive financial data
- restricted uploads

Project landing pages are server-rendered for SEO and caching.

---

# 14. Phase 07 — Reporting & Analytics

---

## Objective

Build operational reporting and analytics workflows.

---

## Includes

```text
Operational dashboards
Reports
Metrics
Exports
Contribution summaries
Project statistics
```

---

## Deliverables

```text
Operational reporting system
Basic analytics visibility
Exportable operational data
```

---

## Acceptance Criteria

```text
Generate reports
Export operational data
View contribution summaries
View project metrics
Mobile dashboards usable
```

---

## Testing Requirements

```text
Export testing
Data consistency validation
Permission testing
Dashboard responsiveness testing
```

---

# 15. Phase 08 — UX Polish & Optimization

---

## Objective

Improve UI quality, performance, and UX refinement.

---

## Includes

```text
Branding
Refined UI
Animation polish
Performance optimization
Accessibility improvements
Dark mode
Design consistency
```

---

## Deliverables

```text
Refined production-ready UX
Improved performance
Improved accessibility
```

---

## Acceptance Criteria

```text
Improved Lighthouse scores
Consistent UI patterns
Accessibility improvements validated
Improved mobile responsiveness
```

---

## Testing Requirements

```text
Performance testing
Accessibility testing
Responsive testing
Regression testing
```

---

## Technical Notes

This phase intentionally comes AFTER functional stability.

---

# 16. Phase 09 — Future Expansion

---

## Objective

Support future platform growth.

---

## Potential Future Modules

```text
Sponsor portal (using people→user relationship)
DIRECTOR ability to invite users (if needed)
Online donations
Notifications (email, in-app)
Inventory management
Volunteer attendance
OCR receipt processing
Advanced analytics
WhatsApp integrations
Native mobile apps
```

---

## Notes

Future expansion should:

- reuse existing architecture
- preserve modularity
- avoid major rewrites

The `people.user_id` field (added in Phase 02 but unused) will enable sponsor portal where a person logs in to view their own contributions.

---

# 17. Cross-Phase Requirements

The following requirements apply to ALL phases:

```text
TypeScript validation
Mobile-first usability
Permission validation
Security compliance
Audit logging
Documentation updates
Technical debt reporting
```

---

# 18. AI-Assisted Development Rules

---

## AI Output Requirements

AI-generated work must:

- follow coding standards
- remain modular
- avoid unsafe patterns
- update documentation
- report technical debt

---

## AI Logging Requirements

Every AI execution session should append entries to:

```text
/ops/dev-logs.md
```

---

# 19. Release Philosophy

Releases should remain:

- incremental
- stable
- reviewable
- reversible

Avoid giant unstable deployments.

---

# 20. Risk Management Philosophy

The roadmap intentionally prioritizes:

- stable foundations
- predictable iteration
- modular architecture

before:

- aggressive feature velocity
- visual polish
- advanced infrastructure

---

# 21. Definition of Done

A phase is considered complete only when:

```text
Acceptance criteria pass
Testing requirements pass
Documentation updated
Technical debt documented
Mobile usability validated
TypeScript validation passes
```

---

# 22. Long-Term Vision

The roadmap is intentionally designed to support:

- organizational growth
- additional humanitarian initiatives
- public transparency
- future scalability

without major architectural rewrites.

---

# 23. Current Status

Current phase:

- Master roadmap definition complete (updated with invitations and public landing pages)

Next phase:

- Specs & implementation planning
