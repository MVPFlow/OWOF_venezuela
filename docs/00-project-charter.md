# Project Charter

# OWOFVzla Social Platform

Version: 0.1
Status: Draft
Organization: One World One Family - Venezuela

---

# 1. Project Overview

OWOFVzla Social Platform is a mobile-first Progressive Web Application (PWA) designed to centralize the management of social impact projects, beneficiaries, sponsors, volunteers, contributions, evidences, and transparency processes for the foundation "One World One Family Venezuela".

The platform aims to provide operational efficiency, transparency, scalability, and ease of use for both internal members and public users.

The system is intended to evolve into a modular social operations platform capable of supporting multiple types of humanitarian and community projects.

---

# 2. Core Mission

Build a centralized digital platform that allows the foundation to:

- Manage social projects
- Register and track beneficiaries
- Manage sponsors and donations
- Record contributions and payments
- Upload evidences and receipts
- Coordinate volunteers and members
- Maintain transparency
- Publish public impact information
- Scale new project types without rebuilding the platform

---

# 3. Initial Project Types

The first version of the platform should support:

## 3.1 Scholarship Programs

Example:

- "Apadrina un estudiante"

Features:

- Student registration
- Sponsor assignment
- Monthly contributions
- School support tracking
- Evidence uploads

---

## 3.2 Community Medical Campaigns

Features:

- Beneficiary registration
- Medical records
- Volunteer coordination
- Medical evidence tracking

---

## 3.3 Food Distribution Programs

Features:

- Community activity tracking
- Beneficiary lists
- Volunteer coordination
- Delivery evidences

---

# 4. Product Philosophy

The platform must prioritize:

1. Functionality over aesthetics
2. Mobile-first user experience
3. Simplicity of use
4. Operational speed
5. Scalability
6. Transparency
7. Low technical complexity for end users

---

# 5. Mobile-First Principle

The system is primarily designed for mobile device usage.

All modules, forms, workflows, and navigation patterns must be optimized for:

- Small screens
- One-handed usage
- Slow internet conditions
- Non-technical users
- Fast field operations

Desktop experience is secondary.

---

# 6. Functional-First Development Strategy

During early phases:

- Focus on functionality
- Use placeholder assets
- Avoid spending time on visual polish
- Prioritize workflows and usability
- Delay branding/styling refinements until later phases

Initial UI should prioritize:

- Clarity
- Accessibility
- Speed
- Usability

---

# 7. Platform Scope

## Internal Platform (Private PWA)

Modules:

- Authentication
- Projects
- People
- Sponsors
- Contributions
- Payments
- Evidence & Files
- Reports
- Users & Roles

---

## Public Platform

Sections:

- Landing page
- About the foundation
- Public projects
- Transparency pages
- Public impact metrics
- Donation information

---

# 8. Technical Vision

The platform should be:

- Modular
- Scalable
- API-oriented
- Mobile-first
- Offline-friendly
- Easy to maintain
- Optimized for rapid iteration

---

# 9. Proposed Tech Stack

Frontend:

- Next.js
- React
- TypeScript
- TailwindCSS
- shadcn/ui

Backend:

- Supabase
- PostgreSQL
- Storage
- Authentication

ORM:

- Drizzle ORM

Deployment:

- Vercel

---

# 10. Architectural Principles

## 10.1 Single Organization Model

The MVP operates with a single pre-seeded organization: "One World One Family Venezuela" (slug: "owofvzla"). No organization creation form is needed. This simplifies the data model and seed strategy while keeping the schema future-ready for multi-organization scenarios.

---

## 10.2 People-Centric Architecture

People exist independently from projects.

Projects create relationships between people.

People may eventually hold user accounts (1:1 optional relationship between `people` and `users`). This allows future sponsor/donor portals where a person logged in can view their own contributions, beneficiaries, and project history.

---

## 10.2 Modular Project System

Projects must support multiple project types without requiring major architectural changes.

---

## 10.3 Flexible Data Structures

The system must support dynamic/custom fields to avoid rigid database structures.

---

## 10.4 Transparency by Design

All relevant operations should support:

- Evidence uploads
- Audit logs
- Traceability
- Public transparency

---

# 11. Non-Goals (Initial Versions)

The first versions will NOT prioritize:

- Advanced visual design
- Complex animations
- Native mobile apps
- AI integrations
- Advanced analytics
- Complex accounting systems

These may be added later.

---

# 12. Success Criteria

The platform will be considered successful if:

- Foundation members can operate it from mobile devices easily
- New projects can be created without engineering changes
- Sponsors and contributions are traceable
- Evidence uploads are simple
- Public transparency is improved
- Internal operations become faster and more organized

---

# 13. Development Methodology

Development will follow:

- Phase-based roadmap
- Spec-driven development
- Domain-driven modular architecture
- Acceptance-criteria validation
- Mobile-first testing

---

# 14. Documentation Strategy

All major modules must include:

- Technical specifications
- Business rules
- Acceptance criteria
- Mobile UX considerations
- API contracts
- Validation rules

---

# 15. Future Vision

Future versions may include:

- Sponsor portals
- Online donations
- WhatsApp integrations
- OCR receipt scanning
- Analytics dashboards
- Native mobile apps
- Geolocation features
- Volunteer attendance systems

---

# 16. Current Status

Current phase:

- Blueprint & architecture planning

Next phase:

- System architecture definition
