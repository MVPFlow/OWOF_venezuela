# `05-user-roles-permissions.md`

# User Roles & Permissions

# OWOFVzla Social Platform

Version: 0.1
Status: Draft

---

# 1. Purpose

This document defines the official user roles, permission model, and access control strategy for the OWOFVzla Social Platform.

The permission system must guarantee:

- operational security
- organizational isolation
- role clarity
- least privilege access
- scalable permission management

This document applies to:

- frontend permissions
- backend authorization
- API access
- database access
- file access
- public visibility rules

---

# 2. Permission Model Philosophy

The platform follows a hybrid permission model combining:

- global roles
- project-level roles
- resource ownership
- row-level security

The system prioritizes:

- simplicity
- maintainability
- security
- operational flexibility

---

# 3. Core Permission Principles

---

## 3.1 Least Privilege Principle

Users should only access:

- modules
- data
- actions

required for their responsibilities.

---

## 3.2 Single Organization (MVP)

The MVP operates with a single pre-seeded organization: **One World One Family Venezuela** (slug: `owofvzla`). All users belong to this organization. Cross-organization access is not applicable.

---

## 3.3 Server-Side Enforcement

Critical permissions must always be validated server-side.

Frontend restrictions alone are insufficient.

---

## 3.4 Auditability

Sensitive operations must generate:

- activity logs
- timestamps
- responsible user tracking

---

# 4. User Role Architecture

The platform uses:

```text
Global Roles
+
Project Context Roles
```

**Registration is invitation-only**. There is no public sign-up.

---

# 5. Global Roles

Global roles define broad platform permissions.

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

# 6. SUPER_ADMIN

Highest permission level.

## Responsibilities

- full platform administration
- user management (invite, promote, suspend)
- permission management
- system-wide operations
- **can assign other users to SUPER_ADMIN role in the future**

## Allowed Actions

```text
Full access to all modules
Invite new users (send invitation emails)
Delete users
Assign/change roles (including promotion to SUPER_ADMIN)
Manage settings
Manage visibility
View all reports
Manage projects
Manage financial records
Access audit logs
```

## Restrictions

None inside the organization scope.

---

# 7. DIRECTOR

Strategic organizational management role.

## Responsibilities

- supervise operations
- review projects
- monitor transparency
- approve sensitive operations

## Allowed Actions

```text
View all projects
Create/edit projects
View reports
View financial data
Manage participants
View audit logs
Approve visibility changes
```

## Restrictions

Cannot:

- manage users (invite, delete, change roles) – only SUPER_ADMIN can do that initially
- manage system infrastructure
- delete super admins

---

# 8. COORDINATOR

Operational management role.

## Responsibilities

- manage daily operations
- coordinate participants
- manage projects
- upload evidence
- oversee workflows

## Allowed Actions

```text
Create projects
Edit assigned projects
Manage participants
Create notes
Upload evidence
View operational reports
Manage contributions
Manage payments
```

## Restrictions

Cannot:

- manage global settings
- manage users or permissions
- access restricted audit data

---

# 9. VOLUNTEER

Limited operational role.

## Responsibilities

- field participation
- operational support
- evidence uploads

## Allowed Actions

```text
View assigned projects
Upload evidence
Create operational notes
View assigned participants
Update limited operational data
```

## Restrictions

Cannot:

- view sensitive financial data
- manage users
- manage permissions
- delete records
- access organization settings

---

# 10. ACCOUNTING

Financial operations role.

## Responsibilities

- contribution tracking
- payment management
- financial verification

## Allowed Actions

```text
View contributions
Create payments
Edit payment records
Upload receipts
View financial reports
Export financial data
```

## Restrictions

Cannot:

- manage system settings
- manage permissions
- access unrelated operational modules

---

# 11. VIEWER

Read-only role.

## Responsibilities

- monitoring
- supervision
- transparency review

## Allowed Actions

```text
View projects
View reports
View public operational data
View participants
```

## Restrictions

Cannot:

- create records
- edit records
- delete records
- upload files

---

# 12. SPONSOR

External or limited-access sponsor role. Optional future-facing role.

## Responsibilities

- review sponsorship information
- view contribution history
- access sponsor portal (future)

## Allowed Actions

```text
View own contributions
View assigned beneficiaries
View public evidence
View sponsor reports
```

## Restrictions

Cannot:

- access unrelated projects
- view internal notes
- manage participants
- view internal reports

---

# 13. Project-Level Roles

Projects may define contextual roles independent of global roles.

Examples:

```text
student
beneficiary
doctor
volunteer
coordinator
sponsor
```

---

# 14. Project-Level Permission Rules

Project-level roles:

- do not replace global roles
- provide contextual participation information
- help filter operational visibility

Example:

```text
Jose:
Global Role → VOLUNTEER

Project A Role → coordinator
Project B Role → sponsor
```

---

# 15. Permission Categories

Permissions should be grouped into categories:

```text
read
create
update
delete
approve
export
manage
invite (users) → only SUPER_ADMIN
```

---

# 16. Module Access Matrix

---

## 16.1 Dashboard

| Role        | Access  |
| ----------- | ------- |
| SUPER_ADMIN | Full    |
| DIRECTOR    | Full    |
| COORDINATOR | Full    |
| VOLUNTEER   | Limited |
| ACCOUNTING  | Limited |
| VIEWER      | Read    |
| SPONSOR     | Limited |

---

## 16.2 People Module

| Role        | Access  |
| ----------- | ------- |
| SUPER_ADMIN | Full    |
| DIRECTOR    | Full    |
| COORDINATOR | Full    |
| VOLUNTEER   | Limited |
| ACCOUNTING  | Read    |
| VIEWER      | Read    |
| SPONSOR     | None    |

---

## 16.3 Projects Module

| Role        | Access                         |
| ----------- | ------------------------------ |
| SUPER_ADMIN | Full                           |
| DIRECTOR    | Full                           |
| COORDINATOR | Full                           |
| VOLUNTEER   | Assigned Only                  |
| ACCOUNTING  | Read                           |
| VIEWER      | Read                           |
| SPONSOR     | Limited (public projects only) |

---

## 16.4 Contributions & Payments

| Role        | Access        |
| ----------- | ------------- |
| SUPER_ADMIN | Full          |
| DIRECTOR    | Full          |
| COORDINATOR | Limited       |
| VOLUNTEER   | None          |
| ACCOUNTING  | Full          |
| VIEWER      | Read          |
| SPONSOR     | Own Data Only |

---

## 16.5 Users & Permissions (including Invitations)

| Role        | Access                           |
| ----------- | -------------------------------- |
| SUPER_ADMIN | Full (invite, delete, promote)   |
| DIRECTOR    | None (read-only user list maybe) |
| COORDINATOR | None                             |
| VOLUNTEER   | None                             |
| ACCOUNTING  | None                             |
| VIEWER      | None                             |
| SPONSOR     | None                             |

**Note**: Only SUPER_ADMIN can invite new users, resend invitations, and revoke invitations. This restriction may be relaxed in the future for DIRECTOR, but not for MVP.

---

# 17. Sensitive Operations

The following operations are considered sensitive:

- deleting records
- changing permissions (including promoting to SUPER_ADMIN)
- visibility changes
- financial adjustments
- restoring archived records
- exporting sensitive data
- **creating or revoking user invitations**

These actions require:

- elevated permissions (SUPER_ADMIN for invitations)
- server validation
- audit logs

---

# 18. Public Visibility Rules

Public users (non-authenticated) should only access:

- public project landing pages
- public notes
- approved evidence
- public reports

Internal information must remain protected.

---

# 19. File Access Rules

File visibility depends on:

- user role
- ownership
- entity visibility
- organization scope

Protected files must never be publicly exposed without explicit approval.

---

# 20. Audit Log Permissions

Only elevated roles should access:

- full activity logs
- permission history
- sensitive operational changes
- invitation logs

Recommended roles:

- SUPER_ADMIN
- DIRECTOR (may have limited audit view)

---

# 21. Row-Level Security Strategy

Supabase RLS should enforce:

- organization ownership (only OWOFVzla data)
- role restrictions
- entity ownership
- project visibility
- file visibility

RLS must be considered mandatory.

---

# 22. Frontend Permission Rules

Frontend permissions are for:

- UX guidance
- navigation filtering
- conditional rendering

Frontend restrictions are NOT security boundaries.

---

# 23. API Authorization Rules

Every protected endpoint must validate:

```text
authentication
organization ownership (implicitly OWOFVzla)
role permissions
resource permissions
```

before executing operations.

---

# 24. Soft Delete Permissions

Only elevated roles may:

- archive records
- restore records
- permanently delete records

---

# 25. Export Permissions

Sensitive exports should require elevated permissions.

Examples:

- financial reports
- people exports
- contribution exports

---

# 26. Future Permission Expansion

Future versions may support:

- custom permissions
- granular permission builders
- temporary access
- approval workflows
- multi-organization administration
- allowing DIRECTOR to invite users

without replacing the current architecture.

---

# 27. Permission Non-Goals

Initial versions will NOT support:

- highly granular enterprise ACL systems
- complex policy builders
- workflow engines
- external IAM integrations

The goal is operational simplicity.

---

# 28. Current Status

Current phase:

- Roles & permission definition (updated for invitation-only, single SUPER_ADMIN, future promotion)

Next phase:

- Mobile-first UX guidelines
