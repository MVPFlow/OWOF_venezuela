# `12-testing-strategy.md`

# Testing Strategy

# OWOFVzla Social Platform

Version: 0.1
Status: Draft

---

# 1. Purpose

This document defines the official testing strategy for the OWOFVzla Social Platform.

The testing philosophy prioritizes:

- reliability
- maintainability
- mobile usability
- business-critical workflows
- predictable deployments

The goal is to ensure:

- operational stability
- safe iteration
- scalable development
- reduced regressions

without introducing unnecessary testing complexity.

---

# 2. Testing Philosophy

The platform follows:

```text
Pragmatic Testing
+
Business-Critical Coverage
+
Mobile-First Validation
```

The project intentionally avoids:

- overengineered testing systems
- excessive snapshot testing
- unrealistic coverage obsession

Testing exists to:

- protect workflows
- protect data integrity
- prevent regressions
- improve confidence

---

# 3. Core Testing Principles

---

## 3.1 Critical Workflows First

Testing priority order:

1. Authentication (including invitation acceptance)
2. Permissions
3. Financial operations
4. Upload workflows
5. Data integrity
6. Mobile usability
7. UI rendering

---

## 3.2 Test What Matters

Focus testing effort on:

- business logic
- validations
- workflows
- permissions
- integrations
- **invitation token validation and expiration**

Avoid excessive testing of:

- trivial UI wrappers
- implementation details
- low-risk boilerplate

---

## 3.3 Maintainable Tests

Tests should remain:

- readable
- isolated
- explicit
- deterministic

Avoid:

- fragile tests
- magic mocks
- hidden dependencies

---

# 4. Testing Layers

The platform uses multiple testing layers:

```text
Type Safety
    ↓
Unit Tests
    ↓
Integration Tests
    ↓
End-to-End Tests
    ↓
Manual Mobile Validation
```

---

# 5. Type Safety as First Validation

---

## 5.1 TypeScript Validation

Minimum required validation:

```text
tsc
```

All AI-generated code must pass TypeScript validation.

---

## 5.2 Strict Type Safety

TypeScript strict mode must remain enabled.

Avoid:

- unsafe any
- unchecked casts
- implicit unknown behavior

---

# 6. Unit Testing Strategy

---

## 6.1 Unit Testing Scope

Unit tests should focus on:

- utilities
- helpers
- validation logic
- business rules
- formatting logic
- permissions
- **invitation token generation and expiration logic**
- **email template rendering (without sending)**

---

## 6.2 Recommended Tooling

Official unit testing stack:

```text
Vitest
```

---

## 6.3 Unit Test Philosophy

Unit tests should:

- remain fast
- avoid infrastructure dependencies
- isolate behavior clearly

---

## 6.4 Business Logic Priority

Prioritize testing:

- calculations
- contribution logic
- permission checks
- validation logic
- state transformations
- **invitation token validation (expired, used, invalid)**
- **role checks for invitation creation (SUPER_ADMIN only)**

---

# 7. Integration Testing Strategy

---

## 7.1 Integration Scope

Integration tests should validate:

- API behavior
- database interactions
- service orchestration
- authentication flows
- upload flows
- **invitation creation → email sending → acceptance flow**
- **public project landing page data fetching**

---

## 7.2 Integration Goals

Ensure:

- modules communicate correctly
- validation layers work together
- permissions remain enforced
- **invitation tokens are properly stored and invalidated after use**

---

# 8. End-to-End Testing Strategy

---

## 8.1 E2E Philosophy

E2E tests should validate:

- critical operational workflows
- mobile navigation
- real user flows

---

## 8.2 Recommended Tooling

Official E2E stack:

```text
Playwright
```

---

## 8.3 Critical E2E Flows

Critical workflows include:

```text
Authentication (login)
Invitation acceptance (full flow: create invitation → email → accept → login)
Create Person
Create Project
Assign Participant
Create Contribution
Register Payment
Upload Evidence
Permission Restrictions
Public project landing page visibility
```

---

## 8.4 Mobile E2E Priority

E2E tests should prioritize:

- mobile layouts
- touch interactions
- responsive flows
- upload workflows
- **invitation acceptance on mobile**

---

# 9. Mobile Testing Strategy

---

## 9.1 Mobile-First Validation

All major workflows must be validated on:

- small phones
- medium phones
- tablet layouts

---

## 9.2 Manual Mobile Testing

Manual mobile validation remains mandatory.

Automated tests alone are insufficient.

---

## 9.3 Mobile UX Validation

Validate:

- touch targets
- scrolling behavior
- keyboard interactions
- upload usability
- navigation ergonomics
- **invitation acceptance form usability**

---

# 10. Permission Testing

---

## 10.1 Role Validation

Permissions must be tested across:

- roles
- ownership states

Specifically for invitations:

- **SUPER_ADMIN** can create, resend, revoke invitations
- **DIRECTOR, COORDINATOR, etc.** cannot access invitation endpoints

---

## 10.2 Forbidden Access Testing

Tests should verify:

- unauthorized access prevention
- hidden actions
- protected routes
- restricted resources

---

## 10.3 RLS Validation

Supabase Row-Level Security must be validated explicitly, especially for:

- `invitations` table (only SUPER_ADMIN can read/write)
- `users` table (only SUPER_ADMIN can modify roles)

---

# 11. API Testing Strategy

---

## 11.1 API Validation

API tests should validate:

- payload validation
- error handling
- permissions
- ownership
- response consistency

---

## 11.2 Invitation-Specific API Tests

Test endpoints:

- `POST /api/invitations` (SUPER_ADMIN only, validate email and role)
- `POST /api/invitations/accept` (public, test expired token, already used token, invalid token)
- `DELETE /api/invitations/[id]` (SUPER_ADMIN only)
- `PATCH /api/invitations/[id]/resend` (SUPER_ADMIN only, regenerate token)

---

## 11.3 Error Scenarios

Test:

- invalid payloads
- missing permissions
- malformed requests
- invalid uploads
- forbidden access
- **attempt to accept invitation twice**
- **attempt to accept expired invitation**

---

# 12. Upload Testing Strategy

---

## 12.1 Upload Validation

Upload flows should validate:

- file types
- file sizes
- upload permissions
- mobile uploads
- failure recovery

---

## 12.2 Mobile Upload Priority

Upload testing must prioritize:

- camera uploads
- unstable networks
- retry behavior

---

# 13. Form Testing Strategy

---

## 13.1 Validation Testing

Forms should validate:

- required fields
- invalid formats
- edge cases
- server validation failures

Include invitation acceptance form (password, name).

---

## 13.2 Mobile Form Testing

Validate:

- keyboard behavior
- scrolling
- field focus
- multi-step flows
- autosave behavior

---

# 14. UI Testing Philosophy

---

## 14.1 Avoid Fragile UI Tests

Avoid excessive testing of:

- implementation details
- CSS specifics
- visual minutiae

---

## 14.2 Focus on User Behavior

UI tests should prioritize:

- interactions
- workflows
- accessibility
- navigation

---

# 15. Regression Prevention

---

## 15.1 Critical Regression Areas

High-priority regression areas:

```text
Authentication (including invitation flow)
Permissions (especially invitation creation)
Payments
Uploads
Visibility Rules (public project pages)
Mobile Navigation
Invitation token validation
```

---

## 15.2 Bug Regression Tests

Critical bugs should receive:

- dedicated regression tests
- reproducible coverage

when possible.

---

# 16. Test Organization Standards

---

## 16.1 Test Location

Tests should remain close to related modules whenever possible.

Example:

```text
/domain-name/__tests__
```

---

## 16.2 E2E Structure

Recommended structure:

```text
/tests/e2e
```

---

## 16.3 Naming Conventions

Examples:

```text
people.service.test.ts
payments.validation.test.ts
auth.e2e.spec.ts
invitations.accept.e2e.spec.ts
```

---

# 17. Mocking Strategy

---

## 17.1 Mocking Philosophy

Mock only what is necessary.

Avoid:

- excessive mocking
- unrealistic behavior
- hidden assumptions

For email tests: mock Resend client to avoid actual email sending.

---

## 17.2 Preferred Testing Style

Prefer:

- realistic behavior
- integration confidence
- predictable fixtures

---

# 18. Seed & Fixture Strategy

---

## 18.1 Test Fixtures

Reusable fixtures should remain:

- minimal
- explicit
- predictable

Include:

- a pre-seeded organization (OWOFVzla)
- a SUPER_ADMIN user (Saturno)
- a valid invitation token for tests

---

## 18.2 Seed Data

Test seed data should include:

- users (SUPER_ADMIN, COORDINATOR, etc.)
- projects
- participants
- contributions
- permissions
- **invitations in various states (pending, expired, used)**

---

# 19. Performance Testing Philosophy

---

## 19.1 Early Performance Priorities

Initial performance validation should prioritize:

- mobile responsiveness
- bundle size awareness
- rendering speed
- upload responsiveness

---

## 19.2 Avoid Premature Load Testing

Heavy performance testing is not required during early phases.

---

# 20. Accessibility Testing

---

## 20.1 Accessibility Scope

Accessibility validation should prioritize:

- readable contrast
- keyboard navigation
- touch accessibility
- screen-reader compatibility

when possible.

---

## 20.2 Accessibility Focus

Focus on:

- operational usability
- real-world accessibility
- mobile readability

---

# 21. CI Testing Strategy

---

## 21.1 Lightweight CI Philosophy

GitHub Actions should remain lightweight initially.

Recommended CI tasks:

```text
TypeScript validation
Linting
Unit tests (excluding email sending)
```

---

## 21.2 Heavy Validation Philosophy

Heavy validation may remain local initially.

Examples:

- full builds
- large E2E suites
- performance testing
- end-to-end invitation email testing (uses external API)

---

# 22. AI-Assisted Development Validation

---

## 22.1 AI Code Expectations

AI-generated code must:

- pass TypeScript validation
- follow coding standards
- remain modular
- avoid unsafe patterns

---

## 22.2 AI Limitations

If behavior cannot be verified:

- document assumptions
- report uncertainty
- avoid false confidence

---

## 22.3 Technical Debt Visibility

Testing gaps and limitations should remain visible.

Never silently ignore missing coverage.

---

# 23. Manual QA Strategy

---

## 23.1 Human Validation

Human QA remains mandatory for:

- mobile UX
- operational workflows
- upload flows
- permissions
- responsiveness
- **email delivery and acceptance flow**

---

## 23.2 Operational Testing

Real-world workflows should be validated periodically using:

- realistic devices
- realistic connectivity
- realistic usage patterns
- **real email inboxes for invitation tests**

---

# 24. Testing Anti-Patterns

Avoid:

- testing implementation details
- giant brittle test suites
- meaningless coverage inflation
- excessive mocking
- flaky E2E tests
- hidden test dependencies
- duplicated test logic

---

# 25. Long-Term Testing Vision

Future testing expansion may include:

- visual regression testing
- accessibility automation
- security scanning
- performance budgets
- automated mobile device testing
- **email delivery monitoring**

depending on platform growth.

---

# 26. Current Status

Current phase:

- Testing strategy definition (updated for invitations, public project pages, email)

Next phase:

- Deployment strategy definition
