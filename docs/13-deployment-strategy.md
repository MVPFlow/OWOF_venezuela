# `13-deployment-strategy.md`

# Deployment Strategy

# OWOFVzla Social Platform

Version: 0.1
Status: Draft

---

# 1. Purpose

This document defines the official deployment and environment strategy for the OWOFVzla Social Platform.

The deployment architecture prioritizes:

- simplicity
- maintainability
- security
- low operational overhead
- scalability
- predictable releases

The strategy intentionally avoids:

- premature infrastructure complexity
- heavy DevOps overhead
- unnecessary enterprise tooling

---

# 2. Deployment Philosophy

The platform follows:

```text
Lean Infrastructure
+
Progressive Scaling
+
Operational Simplicity
```

Infrastructure decisions should:

- support rapid iteration
- reduce maintenance burden
- minimize operational complexity
- remain easy for small teams to manage

---

# 3. Infrastructure Overview

Initial infrastructure stack:

```text
Frontend:
Vercel

Backend:
Supabase

Database:
PostgreSQL (Supabase)

Storage:
Supabase Storage

Email Service:
Resend

Version Control:
GitHub
```

---

# 4. Environment Strategy

The platform uses isolated environments:

```text
development
staging
production
```

---

# 5. Environment Responsibilities

---

## 5.1 Development

Purpose:

- local development
- feature implementation
- experimentation
- debugging

Characteristics:

- unstable allowed
- rapid iteration
- developer-focused

---

## 5.2 Staging

Purpose:

- QA validation
- pre-release testing
- integration validation
- stakeholder review

Characteristics:

- production-like
- safer validation
- controlled testing

**Note**: Staging should use a separate Supabase project and Resend test API keys to avoid sending real emails to actual users.

---

## 5.3 Production

Purpose:

- real users
- operational workflows
- public access

Characteristics:

- stable
- monitored
- protected
- audited

---

# 6. Frontend Deployment Strategy

---

## 6.1 Frontend Hosting

Official frontend platform:

```text
Vercel
```

---

## 6.2 Deployment Benefits

Reasons for choosing Vercel:

- native Next.js support
- preview deployments
- edge CDN
- simplified environment management
- easy rollback support

---

## 6.3 Preview Deployments

Every feature branch may generate:

- isolated preview deployments
- QA testing environments
- stakeholder review links

when operationally useful.

**Important**: Preview deployments must have their own environment variables, including `RESEND_API_KEY` (test key) to test invitation emails without affecting production.

---

# 7. Backend Deployment Strategy

---

## 7.1 Backend Platform

Official backend platform:

```text
Supabase
```

Responsibilities:

- PostgreSQL
- authentication
- storage
- row-level security
- edge functions

---

## 7.2 Backend Simplicity

The backend architecture intentionally avoids:

- custom server infrastructure
- self-hosted database management
- complex orchestration systems

during early phases.

---

# 8. Database Deployment Strategy

---

## 8.1 Database Environment Separation

Each environment should maintain isolated databases whenever possible.

Avoid shared production/development databases.

**Recommendation**: Use separate Supabase projects for dev, staging, and production.

---

## 8.2 Migration Strategy

Database changes should occur through:

- tracked migrations (Drizzle)
- reviewed schema changes
- version-controlled database evolution

---

## 8.3 Migration Ownership

Schema migrations should remain:

- explicit
- reviewable
- reversible whenever possible

---

# 9. Branching & Release Strategy

---

## 9.1 Protected Branches

Protected branches:

```text
main
master
```

Direct commits are forbidden.

---

## 9.2 Feature Branch Workflow

Development must occur through dedicated branches.

Branch naming:

```text
dev-[task]-[date]
ai-[task]-[date]
```

Examples:

```text
dev-auth-system-2026-05-21
ai-people-module-2026-05-21
ai-invitations-flow-2026-05-28
```

---

## 9.3 Pull Request Workflow

All changes should:

- use pull requests
- remain reviewable
- remain isolated
- include clear descriptions

Avoid giant PRs.

---

# 10. CI/CD Philosophy

---

## 10.1 Lightweight CI

GitHub Actions should remain lightweight initially.

Recommended CI tasks:

```text
TypeScript validation
Linting
Unit tests
```

---

## 10.2 Heavy Validation

Heavy operations may remain local initially.

Examples:

- full builds
- large E2E suites
- deep performance testing

---

## 10.3 Progressive CI Evolution

CI/CD complexity should evolve only when operational needs justify it.

Avoid premature DevOps complexity.

---

# 11. GitHub Actions Strategy

---

## 11.1 Initial GitHub Actions Scope

Recommended initial workflows:

```text
lint.yml
typecheck.yml
unit-tests.yml
```

---

## 11.2 Deployment Triggers

Suggested behavior:

```text
feature branches → preview deployments
main → production deployment
```

---

# 12. Secret Management

---

## 12.1 Environment Variables

Secrets must ONLY exist in:

- environment variables
- secure deployment platforms

Never hardcode secrets.

Required variables for production:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Resend
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=noreply@owofvzla.org

# App
NEXT_PUBLIC_APP_URL=https://app.owofvzla.org
```

---

## 12.2 Public Variables

Only public-safe variables may use:

```text
NEXT_PUBLIC_
```

---

## 12.3 Secret Exposure Prevention

Sensitive credentials must never appear:

- in repositories
- in logs
- in screenshots
- in frontend bundles

---

# 13. Infrastructure Security

---

## 13.1 Access Restriction

Production infrastructure access should remain restricted to authorized maintainers only.

---

## 13.2 Principle of Minimal Exposure

Expose only infrastructure that is operationally necessary.

---

## 13.3 Security Validation

Production deployments should validate:

- environment correctness
- secret availability (especially Resend API key)
- migration integrity

before release.

---

# 14. Rollback Strategy

---

## 14.1 Frontend Rollbacks

Frontend deployments should support:

- fast rollback
- previous deployment recovery

using Vercel deployment history.

---

## 14.2 Database Rollbacks

Database changes should:

- minimize destructive migrations
- support recovery planning
- remain reviewable

---

# 15. Deployment Approval Philosophy

---

## 15.1 Human Oversight

Critical production deployments should receive human review before release.

---

## 15.2 AI Deployment Restrictions

AI systems should NOT:

- directly deploy to production
- bypass review
- execute irreversible operations

without explicit approval.

---

# 16. Monitoring Strategy

---

## 16.1 Initial Monitoring

Initial monitoring stack:

```text
Vercel Analytics
Supabase Logs
Console Logging
```

**Email monitoring**: Resend provides delivery logs and open/click tracking.

---

## 16.2 Future Monitoring Expansion

Future additions may include:

- Sentry
- BetterStack
- PostHog
- uptime monitoring

as the platform grows.

---

# 17. Logging Strategy

---

## 17.1 Operational Logging

Critical operations should generate:

- audit logs
- deployment logs
- infrastructure events

when appropriate.

---

## 17.2 AI Development Logs

AI execution sessions should append entries to:

```text
/ops/dev-logs.md
```

---

# 18. Release Strategy

---

## 18.1 Incremental Releases

Releases should remain:

- small
- isolated
- reviewable
- reversible

Avoid giant release batches.

---

## 18.2 Feature Completion Philosophy

Features should only deploy when:

- operationally usable
- tested
- reviewed
- stable enough for intended usage

---

# 19. Mobile Deployment Considerations

---

## 19.1 PWA Deployment

The platform should support:

- installable PWA behavior
- service workers
- offline resilience

through the web deployment pipeline.

---

## 19.2 Mobile Testing Before Release

Mobile validation should occur before production release.

Critical checks:

- responsive layouts
- uploads
- navigation
- touch interactions
- **invitation acceptance flow on mobile**

---

# 20. Dependency Deployment Rules

---

## 20.1 Dependency Validation

Before deployment:

- dependency vulnerabilities should be reviewed
- suspicious packages should be investigated

---

## 20.2 Unsafe Dependency Policy

Do not deploy packages that:

- contain known critical vulnerabilities
- appear malicious
- compromise platform integrity

---

# 21. Technical Debt & Deployment

---

## 21.1 Technical Debt Visibility

Deployment-related technical debt must remain:

- documented
- visible
- traceable

---

## 21.2 Temporary Workarounds

Temporary deployment workarounds should:

- include explicit notes
- include follow-up tasks
- avoid silent persistence

---

# 22. Disaster Recovery Philosophy

---

## 22.1 Backup Importance

Production data should remain recoverable.

Critical assets:

- database
- uploads
- environment configuration
- **invitation tokens table** (though tokens are short-lived)

should support recovery planning.

---

## 22.2 Recovery Simplicity

Recovery processes should remain:

- documented
- understandable
- reproducible

---

# 23. Deployment Anti-Patterns

Avoid:

- direct production commits
- hidden infrastructure changes
- manual secret sharing
- irreversible destructive migrations
- giant unreviewed deployments
- untracked environment changes
- overengineered CI pipelines

---

# 24. Long-Term Deployment Vision

Future infrastructure evolution may include:

- automated rollback systems
- staging approval pipelines
- deployment health checks
- infrastructure monitoring
- security scanning
- performance budgets

depending on platform growth.

---

# 25. Current Status

Current phase:

- Deployment strategy definition (updated for email service and invitation flow)

Next phase:

- Master roadmap definition
