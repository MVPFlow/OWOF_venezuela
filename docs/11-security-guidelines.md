# `11-security-guidelines.md`

# Security Guidelines

# UMAF Social Platform

Version: 0.1
Status: Draft

---

# 1. Purpose

This document defines the official security guidelines for the UMAF Social Platform.

The platform manages:

- personal information
- operational records
- financial contributions
- evidence uploads
- internal organizational data

Security is therefore considered a foundational requirement.

These guidelines apply to:

- frontend
- backend
- APIs
- database operations
- file uploads
- infrastructure
- dependencies
- AI-generated code

---

# 2. Security Philosophy

The platform prioritizes:

```text
Simple
Secure
Explicit
Auditable
Maintainable
```

Security decisions should favor:

- predictable behavior
- least privilege access
- explicit validation
- defense in depth

Avoid:

- hidden magic
- unsafe shortcuts
- unnecessary complexity

---

# 3. Core Security Principles

---

## 3.1 Least Privilege

Users should only access:

- data
- modules
- operations

required for their role.

---

## 3.2 Server-Side Enforcement

Critical security validation must ALWAYS happen server-side.

Frontend validation is not a security boundary.

---

## 3.3 Organization Isolation

All organization data must remain isolated.

Cross-organization access is forbidden unless explicitly approved by future architecture decisions.

---

## 3.4 Auditability

Sensitive operations must remain:

- traceable
- logged
- reviewable

---

# 4. Authentication Security

---

## 4.1 Authentication Provider

Official authentication provider:

```text id="jlwm30"
Supabase Auth
```

---

## 4.2 Protected Routes

Protected routes must validate:

- active session
- organization membership
- permissions

before rendering sensitive data.

---

## 4.3 Session Validation

Sensitive operations should verify:

- authenticated session
- current permissions
- valid organization scope

server-side.

---

## 4.4 Password Security

Passwords must:

- never be stored manually
- never be logged
- never be exposed in responses

Authentication handling should remain delegated to Supabase Auth.

---

# 5. Authorization Security

---

## 5.1 Role Validation

All protected operations must validate:

- role permissions
- ownership
- organization scope

before execution.

---

## 5.2 Row-Level Security

Supabase RLS is mandatory.

RLS policies should enforce:

- organization ownership
- resource ownership
- visibility rules
- role restrictions

---

## 5.3 Frontend Restrictions

Frontend permission checks are only:

- UX helpers
- visibility helpers

They are NOT security enforcement.

---

# 6. API Security Standards

---

## 6.1 Input Validation

All API payloads must validate:

- schema shape
- field types
- required fields
- permissions
- business rules

using:

```text id="jlwm31"
Zod
```

---

## 6.2 Server Validation

Critical validation must NEVER rely only on frontend validation.

---

## 6.3 Forbidden API Patterns

The following are forbidden:

```text id="jlwm32"
raw SQL concatenation
unsafe eval execution
dynamic code execution
unvalidated payload persistence
```

---

## 6.4 Sensitive Error Exposure

APIs must never expose:

- stack traces
- SQL details
- internal infrastructure
- secrets
- environment variables

---

# 7. Database Security

---

## 7.1 SQL Injection Prevention

All database access must use:

- ORM protections
- parameterized queries
- validated inputs

Never interpolate user input into raw SQL.

---

## 7.2 Direct SQL Usage

Raw SQL should remain rare.

If raw SQL becomes necessary:

- document justification
- validate inputs strictly
- review carefully

---

## 7.3 Data Isolation

Queries must always remain scoped to:

- organization ownership
- permissions
- visibility rules

---

## 7.4 Sensitive Data Protection

Sensitive fields should avoid unnecessary exposure.

Examples:

- internal notes
- financial details
- private documents

---

# 8. File Upload Security

---

## 8.1 Upload Validation

All uploads must validate:

- mime type
- file extension
- file size
- authentication
- ownership
- permissions

---

## 8.2 Forbidden File Types

The following file types are forbidden:

```text id="jlwm33"
.exe
.bat
.cmd
.sh
.js
.php
```

and any executable or dangerous formats.

---

## 8.3 Upload Storage

Uploads should remain:

- isolated
- permission-controlled
- non-public by default

---

## 8.4 File Access Rules

Protected uploads must require:

- authentication
- ownership validation
- visibility validation

before access.

---

# 9. Frontend Security

---

## 9.1 Unsafe Rendering

The following is forbidden unless explicitly approved:

```text id="jlwm34"
dangerouslySetInnerHTML
```

---

## 9.2 XSS Prevention

User-generated content must:

- remain sanitized
- avoid unsafe rendering
- avoid HTML injection

---

## 9.3 Sensitive Data Exposure

Frontend code must never expose:

- secrets
- service keys
- private tokens
- internal credentials

---

# 10. Environment Security

---

## 10.1 Environment Variables

Sensitive credentials must only exist in:

- environment variables
- secure deployment configuration

Never hardcode secrets.

---

## 10.2 Client vs Server Variables

Only public-safe variables may use:

```text id="jlwm35"
NEXT_PUBLIC_
```

Sensitive secrets must remain server-only.

---

# 11. Dependency Security

---

## 11.1 Dependency Trust Policy

Do NOT install packages that:

- have known vulnerabilities
- appear abandoned
- have suspicious maintenance activity
- have unclear ownership
- introduce unnecessary risk

---

## 11.2 Dependency Review Requirement

When uncertainty exists:

- pause implementation
- request developer approval
- recommend deep package research

before adoption.

---

## 11.3 Minimize Dependencies

Prefer:

- native platform APIs
- lightweight utilities
- internal abstractions

before adding external dependencies.

---

# 12. Logging Security

---

## 12.1 Sensitive Logging Forbidden

Never log:

- passwords
- secrets
- access tokens
- private keys
- sensitive personal data

---

## 12.2 Audit Logging

Critical operations should generate:

- audit logs
- timestamps
- responsible user tracking

---

## 12.3 AI Development Logs

AI execution sessions should append entries to:

```text id="jlwm36"
/ops/dev-logs.md
```

without exposing secrets or credentials.

---

# 13. CI/CD Security

---

## 13.1 Lightweight CI Philosophy

GitHub Actions should remain lightweight initially.

Heavy pipelines may remain local until future architecture decisions expand CI/CD requirements.

---

## 13.2 Protected Branches

Protected branches:

```text id="jlwm37"
main
master
```

Direct commits are forbidden.

---

## 13.3 Branch Workflow

Development should occur through isolated branches:

```text id="jlwm38"
dev-[task]-[date]
ai-[task]-[date]
```

---

# 14. Infrastructure Security

---

## 14.1 Deployment Separation

Separate environments must exist:

```text id="jlwm39"
development
staging
production
```

---

## 14.2 Production Access

Production access should remain restricted to authorized maintainers only.

---

## 14.3 Principle of Minimal Exposure

Expose only infrastructure that is operationally necessary.

---

# 15. Mobile Security Considerations

---

## 15.1 Mobile Session Protection

Sensitive operations should validate:

- active session
- permission scope
- ownership

even on mobile devices.

---

## 15.2 Offline Considerations

Offline support must avoid exposing:

- sensitive cached data
- unrestricted local persistence

without proper safeguards.

---

# 16. AI-Assisted Development Security

---

## 16.1 AI Code Requirements

AI-generated code must:

- follow security standards
- avoid unsafe patterns
- validate inputs
- remain type-safe

---

## 16.2 AI Limitation Disclosure

If AI-generated code introduces:

- assumptions
- temporary workarounds
- unverified behavior

it must explicitly communicate those limitations.

---

## 16.3 Technical Debt Reporting

Security-related technical debt must:

- remain visible
- be documented
- be tracked explicitly

---

# 17. Public Portal Security

---

## 17.1 Public Visibility Rules

Only approved public content may appear:

- on landing pages
- public project pages
- transparency sections

---

## 17.2 Sensitive Data Protection

Public pages must NEVER expose:

- internal notes
- private uploads
- financial internals
- protected personal information

---

# 18. Rate Limiting & Abuse Prevention

---

## 18.1 Sensitive Endpoint Protection

Sensitive endpoints should support:

- rate limiting
- abuse detection
- throttling

when operationally necessary.

---

## 18.2 Upload Abuse Prevention

Uploads should support:

- file size limits
- upload throttling
- validation controls

---

# 19. Security Incident Philosophy

---

## 19.1 Explicit Incident Handling

Security issues should NEVER remain hidden.

Critical vulnerabilities must:

- be reported
- be documented
- receive priority remediation

---

## 19.2 Temporary Mitigations

Temporary mitigations should:

- remain documented
- include follow-up tasks
- avoid silent risk acceptance

---

# 20. Security Anti-Patterns

Avoid:

- raw SQL interpolation
- unsafe HTML rendering
- secret exposure
- excessive permissions
- hidden security assumptions
- hardcoded credentials
- unvalidated uploads
- blind trust in frontend validation
- giant unsafe dependencies

---

# 21. Long-Term Security Goals

Future versions may include:

- security scanning
- dependency auditing
- SAST tooling
- CSP policies
- advanced monitoring
- MFA
- intrusion detection

as the platform grows.

---

# 22. Current Status

Current phase:

- Security guidelines definition

Next phase:

- Testing strategy definition
