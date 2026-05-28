# TODO - OWOFVzla Social Platform

Estado actual: ✅ Errores críticos de código resueltos.  
Siguiente fase: **Documentación ejecutable para Codex** (specs → flows → decisions).

---

## 🎯 PRIORIDAD MÁXIMA (ahora mismo)

### 1. Crear `/specs` – Especificaciones técnicas por módulo

Cada spec debe incluir: objetivo, business rules, UI/UX, APIs, validación, edge cases, permisos, criterios de aceptación.

**Iniciales requeridas (orden sugerido):**

- [ ] `specs/invitations.spec.md` – flujo de invitación (más crítico porque es la base del registro)
- [ ] `specs/people.spec.md` – CRUD de personas, búsqueda, etiquetas
- [ ] `specs/projects.spec.md` – CRUD de proyectos, tipos, visibilidad
- [ ] `specs/contributions.spec.md` – patrocinios y contribuciones
- [ ] `specs/payments.spec.md` – registros de pago y recibos
- [ ] `specs/files.spec.md` – gestión de evidencias y adjuntos

### 2. Crear `/flows` – Workflows operativos reales

Describe paso a paso cómo un usuario (organizador) realiza una tarea completa.

- [ ] `flows/invitation-flow.md` – desde SUPER_ADMIN crea invitación → email → usuario acepta y establece contraseña → login
- [ ] `flows/sponsorship-flow.md` – asignar un sponsor a un beneficiario dentro de un proyecto
- [ ] `flows/payment-flow.md` – registrar un pago contra una contribución
- [ ] `flows/project-creation-flow.md` – crear proyecto, asignar participantes
- [ ] `flows/evidence-upload-flow.md` – subir evidencia (foto, PDF) desde móvil

### 3. Crear `/decisions` – Architecture Decision Records

Documentar decisiones clave para mantener contexto.

- [ ] `decisions/ADR-001-use-supabase.md` (ya existe en mente, pero escribirlo formalmente)
- [ ] `decisions/ADR-002-mobile-first.md`
- [ ] `decisions/ADR-003-drizzle-over-prisma.md`
- [ ] `decisions/ADR-004-invitation-only-registration.md`
- [ ] `decisions/ADR-005-resend-for-emails.md`
- [ ] `decisions/ADR-006-public-project-landing-pages.md`
- [ ] `decisions/ADR-007-single-organization-mvp.md`

---

## 📋 LO QUE YA ESTÁ COMPLETO (no tocar)

- [x] 00-project-charter.md
- [x] 01-system-architecture.md
- [x] 02-tech-stack.md
- [x] 03-database-schema-v1.md
- [x] 04-business-rules.md
- [x] 05-user-roles-permissions.md
- [x] 06-mobile-first-guidelines.md
- [x] 07-ui-design-principles.md
- [x] 08-api-standards.md
- [x] 09-folder-structure.md
- [x] 10-coding-standards.md
- [x] 11-security-guidelines.md
- [x] 12-testing-strategy.md
- [x] 13-deployment-strategy.md
- [x] 14-roadmap-master.md
- [x] 99-glossary.md
- [x] Corrección de errores de TypeScript y configuración

---

## ⏳ LO QUE PUEDE ESPERAR (siguientes sprints)

- [ ] `/wireframes` – estructuras móviles simples (dashboard, people, project, payments)
- [ ] `/database/erd-v1.png` y `/database/erd-v1.md` – diagrama visual
- [ ] `/ops/dev-logs.md`, `/ops/technical-debt.md`, `/ops/release-notes.md`
- [ ] `/prompts` – plantillas para Codex (feature-template.md, etc.)
- [ ] `/database/drizzle-schema-plan.md`, `migration-strategy.md`, `rls-strategy.md`, `seed-strategy.md`
- [ ] `technical-debt-policy.md`
- [ ] `ai-collaboration-guidelines.md`
- [ ] `definition-of-ready.md`, `definition-of-done.md`
- [ ] Backlog detallado (`/backlog/epics.md`, `phase-00-tasks.md`, etc.)
- [ ] `local-development-setup.md`
- [ ] `environment-variables.md`
- [ ] `mobile-navigation-map.md`
- [ ] `component-inventory.md`

---

## 🚀 Acción inmediata sugerida

**Crear los specs, flows y decisions** en ese orden, empezando por `specs/invitations.spec.md` (porque es la base para Phase 01). Una vez tengamos esos documentos, Codex podrá implementar el código mucho mejor.

¿Procedemos con la creación de `invitations.spec.md`?
