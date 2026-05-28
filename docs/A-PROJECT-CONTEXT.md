# OWOFVzla Social Platform – Resumen Ejecutivo

## 1. Propósito

Plataforma PWA mobile‑first para gestión de proyectos sociales, patrocinios, beneficiarios y transparencia. Una sola organización: "One World One Family Venezuela" (slug: `owofvzla`).

## 2. Stack Técnico

- **Frontend:** Next.js (App Router), React, TypeScript, TailwindCSS, shadcn/ui
- **Backend & DB:** Supabase (PostgreSQL, Auth, Storage), Drizzle ORM
- **Email:** Resend (invitaciones)
- **Estado:** TanStack Query, Zustand (mínimo)
- **Formularios:** React Hook Form + Zod
- **Testing:** Vitest, Playwright
- **Deploy:** Vercel

## 3. Arquitectura Base

- **Organización única** (pre‑sembrada en seed).
- **Usuarios** vs **Personas** (personas pueden tener `user_id` opcional para futuro portal de patrocinadores).
- **Proyectos** genéricos con tipos (beca, médico, alimentos, emergencia).
- **Invitaciones**: solo SUPER_ADMIN puede invitar a nuevos usuarios (COORDINATOR, DIRECTOR, ACCOUNTING, etc.). Token único, expiración 7 días, email con Resend.
- **Participantes**: personas vinculadas a proyectos con roles contextuales (student, sponsor, volunteer, etc.).
- **Contribuciones y pagos**: trazables, inmutables, con recibos adjuntos.

## 4. Estado Actual (Mayo 2026)

✅ Documentación completa (14 documentos + glossary).  
✅ Corrección de errores críticos de TypeScript en People module.  
✅ Tablas base en Supabase (organizations, users, people, projects, project_participants).  
🟡 Falta implementar: sistema de invitaciones (Phase 01), completar People (tags, notas, attachments), Projects, Contributions, Payments, Files, Public Portal.  
🟡 Drizzle no configurado, migraciones pendientes.  
🟡 RLS pendiente de implementar.

## 5. Tablas Base (ya creadas)

- `organizations` (única: OWOFVzla)
- `users` (con `invited_by`, `role`, `status`)
- `people` (con `user_id` nullable)
- `projects` (con `visibility`, `status`, `project_type_id`)
- `project_participants`

### Tablas pendientes de crear (según schema v1)

`invitations`, `person_tags`, `people_tags_relations`, `project_types`, `contributions`, `payments`, `attachments`, `notes`, `activity_logs`, `custom_field_definitions`, `custom_field_values`.

## 6. Próximas Tareas Prioritarias (nuevo TODO)

1. **Configurar Drizzle** en `packages/db`, generar migraciones para todas las tablas.
2. **Crear tabla `invitations`** y seed de organización + SUPER_ADMIN (Saturno).
3. **Implementar sistema de invitaciones** (server actions, panel SUPER_ADMIN, página pública `/accept-invite`, email con Resend).
4. **Unificar naming** (cambiar `UMAF` → `OWOFVzla` en código y configuración).
5. **Completar People Module** (tags, notas, attachments, filtros).
6. **Implementar Projects Module** (CRUD, participantes, visibilidad).
7. **Implementar Contributions & Payments**.
8. **Public Portal** (landing pública por proyecto).

## 7. Documentos de Referencia (disponibles en `/docs`)

- `00-project-charter.md` – visión y alcance
- `01-system-architecture.md` – arquitectura detallada
- `02-tech-stack.md` – tecnologías y justificación
- `03-database-schema-v1.md` – diseño completo de tablas
- `04-business-rules.md` – reglas de negocio
- `05-user-roles-permissions.md` – matriz de roles
- `14-roadmap-master.md` – fases del proyecto
- `99-glossary.md` – definiciones oficiales

## 8. Variables de Entorno Necesarias

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...
EMAIL_FROM=noreply@owofvzla.org
```
