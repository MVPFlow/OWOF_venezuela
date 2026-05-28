# `99-glossary.md`

# Glossary

# OWOFVzla Social Platform

Version: 0.1
Status: Draft

---

# 1. Purpose

This document defines the official terminology and naming conventions for the OWOFVzla Social Platform.

Consistent terminology is critical for:

- clear communication
- accurate implementation
- AI-assisted development
- documentation alignment
- reducing semantic bugs

All stakeholders, contributors, and AI systems must use these terms as defined.

---

# 2. Core Naming Principles

- Use **exact** terms from this glossary in code, APIs, and documentation.
- Avoid synonyms (e.g., do not use "beneficiary" when the correct term is "person with role student").
- New terms must be added here before being used in specs or code.

---

# 3. Organization & Tenant

## Organization

**Definition**: A foundation or entity using the platform.  
**MVP**: Only one organization exists: "One World One Family Venezuela" (slug: `owofvzla`).  
**Fields**: `id`, `name`, `slug`, `logo_url`, etc.  
**Relations**: Owns `users`, `people`, `projects`, etc.

---

# 4. User Account & Access

## User

**Definition**: An authenticated account with access to the private dashboard.  
**Registration**: Invitation-only (by SUPER_ADMIN).  
**Fields**: `id`, `email`, `role`, `status`, `invited_by`.  
**NOT the same as**: Person (see below).

## SUPER_ADMIN

**Definition**: Highest privilege role. Can manage users, invitations, and all data.  
**Initial**: Only Saturno Mangieri. Can promote others in the future.

## DIRECTOR

**Definition**: Strategic role. Can view all projects, reports, and financial data, but cannot manage users.

## COORDINATOR

**Definition**: Operational role. Can create projects, manage participants, upload evidence, and handle contributions/payments.

## VOLUNTEER

**Definition**: Limited field role. Can view assigned projects, upload evidence, and create notes.

## ACCOUNTING

**Definition**: Financial role. Can manage contributions, payments, receipts, and financial reports.

## VIEWER

**Definition**: Read-only role. Can view projects, reports, and participants.

## SPONSOR

**Definition**: External role (future). Can view own contributions and assigned beneficiaries. Not implemented in MVP.

---

# 5. People & Participants

## Person

**Definition**: A human record (student, sponsor, volunteer, beneficiary, etc.). Exists independently of projects.  
**Fields**: `id`, `first_name`, `last_name`, `document_id`, `email`, `phone`, `photo_url`, etc.  
**Optional link**: May have a `user_id` (future sponsor portal).  
**NOT the same as**: User.

## Participant

**Definition**: A person linked to a specific project with a contextual role.  
**Stored in**: `project_participants` table.  
**Example**: Maria is a Person; in Project "Beca el Futuro" she is a Participant with role `student`.

## Role (project-level)

**Definition**: Contextual function of a participant within a project.  
**Examples**: `student`, `sponsor`, `volunteer`, `doctor`, `beneficiary`, `coordinator`.

---

# 6. Projects & Types

## Project

**Definition**: A social initiative (scholarship, medical campaign, food program, etc.).  
**Fields**: `title`, `description`, `status`, `visibility`, `start_date`, `end_date`.  
**Visibility**: `public` (visible on landing page), `private` (internal only), `internal` (restricted).

## Project Type

**Definition**: A configurable category of project.  
**Examples**: `scholarship`, `medical`, `food`, `emergency`.  
**Stored in**: `project_types` table.

## Project Participant

**Definition**: See "Participant" above.

---

# 7. Sponsorship & Financials

## Contribution

**Definition**: An agreement or commitment to sponsor a project or beneficiary.  
**Fields**: `amount`, `frequency`, `status`, `start_date`, `end_date`.  
**Links**: Sponsor (person), beneficiary (person, optional), project.

## Payment

**Definition**: An actual financial transaction recorded against a contribution.  
**Fields**: `amount`, `payment_method`, `reference_number`, `payment_date`, `receipt_attachment_id`.  
**Immutability**: Payments should not be deleted; corrections via reversals/adjustments.

## Receipt

**Definition**: An uploaded file (image, PDF) serving as proof of payment.  
**Stored as**: Attachment with category `receipt`.

---

# 8. Files & Evidence

## Attachment

**Definition**: A file (image, PDF, document) linked to an entity (person, project, payment, etc.).  
**Stored in**: Supabase Storage.  
**Categories**: `receipt`, `transfer`, `student_photo`, `report`, `invoice`, `evidence`, `medical_document`.

## Evidence

**Definition**: An attachment that demonstrates an activity or outcome (e.g., a photo of a delivered meal, a student's report card).  
**Visibility**: Can be public or internal.

---

# 9. Invitations & User Onboarding

## Invitation

**Definition**: A token-based record allowing a new user to create an account.  
**Created by**: SUPER_ADMIN only.  
**Fields**: `email`, `role`, `token`, `expires_at`, `used_at`.  
**Expiration**: Default 7 days; single-use.

## Invitation Token

**Definition**: A cryptographically random UUID (or similar) embedded in the acceptance link.  
**Security**: One-time, expiring, validated server-side.

## Accept Invitation

**Definition**: The public flow where an invited user sets a password and activates their account.

---

# 10. Public Interfaces

## Public Project Landing Page

**Definition**: A publicly accessible webpage at `/proyectos/[slug]` for a project with `visibility = 'public'`.  
**Content**: Title, description, cover image, status, public notes, public evidence, participant summaries (limited).  
**SEO**: Server-rendered.

## Public Portal

**Definition**: The set of public-facing pages (home, about, projects listing, transparency, etc.) accessible without authentication.

---

# 11. System & Technical

## Organization ID

**Definition**: The UUID of the single organization (OWOFVzla). Every major entity includes `organization_id`.

## RLS (Row-Level Security)

**Definition**: Supabase policies that enforce data isolation and permissions at the database level.

## Resend

**Definition**: The email service used to send invitation emails and future notifications. Free tier: 100 emails/day.

## Seed

**Definition**: Initial data inserted into the database (organization, SUPER_ADMIN user, project types).

---

# 12. Status Values

## User Status

- `active` – can log in
- `inactive` – disabled, cannot log in
- `suspended` – temporarily blocked
- `invited` – invitation sent, account not yet activated

## Project Status

- `draft` – not yet active
- `active` – ongoing
- `completed` – finished
- `archived` – read-only, no modifications

## Contribution Status

- `pending` – commitment made but no payments
- `active` – payments expected
- `paused` – temporarily stopped
- `completed` – fully fulfilled
- `cancelled` – terminated

## Participant Status

- `active` – currently participating
- `inactive` – temporarily not active
- `removed` – no longer part of the project
- `completed` – finished their role

---

# 13. Relationship Summary

- **Organization** → has many Users, People, Projects.
- **User** → authenticates, belongs to Organization.
- **Person** → exists independently, may link to User (optional).
- **Project** → belongs to Organization, has many Participants (People with roles).
- **Contribution** → links a Sponsor (Person) to a Project (and optionally a Beneficiary Person).
- **Payment** → belongs to a Contribution.
- **Invitation** → created by SUPER_ADMIN, used to create a User.

---

# 14. Forbidden Synonyms

Do NOT use these terms interchangeably:

| Incorrect           | Correct                            |
| ------------------- | ---------------------------------- |
| User                | Person                             |
| Person              | User                               |
| Beneficiary         | Person with role `beneficiary`     |
| Sponsor (as role)   | Person with role `sponsor`         |
| Project participant | Participant                        |
| Invite link         | Invitation token                   |
| Receipt file        | Attachment with category `receipt` |
| Public page         | Public project landing page        |
| Super admin         | SUPER_ADMIN (exact case)           |

---

# 15. Future Terms (Not in MVP)

The following terms may be added in later phases:

- **Sponsor Portal** – authenticated area for sponsors (using `people.user_id`).
- **Donation** – online payment integration (Stripe).
- **Notification** – email or in-app alert.
- **Inventory** – physical goods tracking.
- **OCR** – receipt text extraction.

---

# 16. Current Status

Current phase:

- Glossary definition (completed)

Next phase:

- Specs implementation planning
