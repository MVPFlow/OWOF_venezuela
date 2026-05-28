# Contributions & Payments Module Specification

## OWOFVzla Social Platform

Version: 0.1
Status: Draft

---

## 1. Objective

Provide a **sponsorship and financial tracking system** that allows authenticated users (with appropriate roles) to:

- Create and manage contributions (sponsorship agreements) linking a sponsor (person) to a project (and optionally a beneficiary person).
- Record payments against contributions.
- Upload receipts as evidence.
- View contribution and payment history.
- Maintain audit trail and immutability of financial records.

**Contributions** represent the _commitment_ (e.g., monthly sponsorship of $50).  
**Payments** represent the _actual transactions_ (e.g., January payment received).

---

## 2. Business Rules

| Rule ID | Description                                                                                                                                         |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| CON‑001 | A contribution belongs to one organization (OWOFVzla), one project, and one sponsor (person).                                                       |
| CON‑002 | A contribution may optionally have a beneficiary (person).                                                                                          |
| CON‑003 | Contribution frequency: `one_time`, `weekly`, `monthly`, `quarterly`, `yearly`.                                                                     |
| CON‑004 | Contribution status: `pending`, `active`, `paused`, `completed`, `cancelled`.                                                                       |
| CON‑005 | A payment must belong to exactly one contribution.                                                                                                  |
| CON‑006 | Payment amount must be positive and in the same currency as contribution (MVP: USD only).                                                           |
| CON‑007 | Payments should be immutable once confirmed. Corrections via adjustment or reversal (not deletion).                                                 |
| CON‑008 | A receipt can be attached to a payment (file upload, category `receipt`).                                                                           |
| CON‑009 | Only users with role ACCOUNTING or higher can create/edit payments (COORDINATOR may have limited access? MVP: ACCOUNTING and SUPER_ADMIN/DIRECTOR). |
| CON‑010 | Deleting a contribution or payment is not allowed. Instead, change status to `cancelled` or `completed`, or use reversal entries.                   |

---

## 3. UI & UX (Mobile‑First)

### 3.1 Contributions List Page

- **Route:** `/dashboard/contributions`
- **Layout:** Card list. Each card shows:
  - Sponsor name, project title, beneficiary name (if any)
  - Amount, frequency, status badge
  - Next payment date (if recurring) or last payment date
  - Quick actions: add payment, view details, pause/cancel (if active)
- **Search & filters:** by sponsor, project, status, date range.
- **FAB:** “Create Contribution” (opens form).

### 3.2 Contribution Detail Page

- **Route:** `/dashboard/contributions/[id]`
- **Sections:**
  - **Header:** Sponsor, project, beneficiary, status, amount, frequency.
  - **Timeline:** Start date, end date (if any), next expected payment.
  - **Payments list:** Table/cards of payments with date, amount, receipt, created by.
  - **Actions:** Add payment, pause/resume, cancel (change status), edit (limited fields, e.g., end date).
  - **Notes & attachments (optional):** General notes about the contribution.

### 3.3 Payments List (sub‑page or modal)

- **Route:** `/dashboard/contributions/[id]/payments`
- **Layout:** List of payments (most recent first). Each payment shows: date, amount, receipt link, created by.
- **Action:** “Record Payment” button.

### 3.4 Create / Edit Contribution Form

- **Fields:**
  - Sponsor (search person, required)
  - Project (search project, required)
  - Beneficiary (optional, search person)
  - Amount (number, positive)
  - Currency (fixed USD for MVP)
  - Frequency (select)
  - Start date (date picker, default today)
  - End date (optional, for fixed‑term)
  - Status (default `active` or `pending`)
  - Notes (optional)
- **Save:** After creation, redirect to contribution detail.

### 3.5 Record Payment Form

- **Fields:**
  - Amount (pre‑filled with contribution amount? editable)
  - Payment date (default today)
  - Payment method (select: cash, bank transfer, credit card, other)
  - Reference number (optional)
  - Receipt upload (file, image/PDF)
  - Notes (optional)
- **Submit:** Creates payment record, updates contribution’s last payment date.

### 3.6 Receipt Upload & Preview

- Upload via camera or gallery.
- Preview thumbnail.
- After upload, file stored in Supabase Storage (private bucket) with RLS.

---

## 4. API Endpoints (Server Actions)

### 4.1 Create Contribution

- **Action:** `createContribution(data: ContributionCreateInput)`
- **Permissions:** ACCOUNTING, SUPER_ADMIN, DIRECTOR (COORDINATOR? MVP: restrict to ACCOUNTING+)
- **Validation:** Sponsor and project exist; amount > 0; frequency valid; dates logical.
- **Return:** `{ success: true, contributionId }`

### 4.2 Update Contribution

- **Action:** `updateContribution(contributionId: string, data: ContributionUpdateInput)`
- **Permissions:** ACCOUNTING+
- **Allowed updates:** end_date, status, notes (amount and frequency should be immutable after payments? MVP: allow but warn).
- **Return:** `{ success: true }`

### 4.3 Create Payment

- **Action:** `createPayment(contributionId: string, data: PaymentCreateInput)`
- **Permissions:** ACCOUNTING+
- **Validation:** Contribution exists and is not `cancelled` or `completed`; amount > 0.
- **Process:** Insert payment; optionally update contribution’s `last_payment_date` (store in contribution for quick access).
- **Return:** `{ success: true, paymentId }`

### 4.4 List Contributions

- **Query:** `getContributions(params: { sponsorId?, projectId?, status?, page? })`
- **Permissions:** Authenticated, filtered by role (ACCOUNTING+ see all; COORDINATOR see contributions of projects they manage; VIEWER read‑only).
- **Return:** Paginated list with sponsor, project, beneficiary names.

### 4.5 Get Contribution by ID

- **Query:** `getContributionById(contributionId: string)`
- **Permissions:** Same as list.
- **Return:** Full contribution with payments.

### 4.6 List Payments for Contribution

- **Query:** `getPayments(contributionId: string, page?: number)`
- **Permissions:** Same as contribution.
- **Return:** Paginated list of payments.

### 4.7 Upload Receipt for Payment

- **Action:** `uploadReceipt(paymentId: string, file: File)`
- **Permissions:** ACCOUNTING+
- **Process:** Upload to Storage, create attachment record linked to payment, update payment’s `receipt_attachment_id`.
- **Return:** `{ success: true, attachmentId, url }`

---

## 5. Validation Schema (Zod)

```typescript
import { z } from "zod";

export const ContributionSchema = z.object({
  sponsor_person_id: z.string().uuid(),
  project_id: z.string().uuid(),
  beneficiary_person_id: z.string().uuid().optional(),
  amount: z.number().positive(),
  currency: z.literal("USD").default("USD"),
  frequency: z.enum(["one_time", "weekly", "monthly", "quarterly", "yearly"]),
  status: z
    .enum(["pending", "active", "paused", "completed", "cancelled"])
    .default("active"),
  start_date: z.string().date(),
  end_date: z.string().date().optional(),
  notes: z.string().optional(),
});

export const PaymentSchema = z.object({
  amount: z.number().positive(),
  payment_date: z.string().date(),
  payment_method: z.enum(["cash", "bank_transfer", "credit_card", "other"]),
  reference_number: z.string().optional(),
  notes: z.string().optional(),
});
```

---

## 6. Edge Cases & Error Handling

| Scenario                                                  | Expected Behavior                                                                                 |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Trying to record payment for a cancelled contribution     | Reject: "Contribution is cancelled. Cannot add payments."                                         |
| Overpayment (payment amount exceeds remaining commitment) | Allow but warn. For one‑time, if payment amount > contribution amount, still allow (overpayment). |
| Duplicate receipt upload                                  | Replace or add new? MVP: allow multiple receipts per payment.                                     |
| Deleting a payment                                        | Not allowed; provide "reversal" option (create a negative payment) if needed.                     |
| Contribution without end date for recurring payments      | System assumes indefinite.                                                                        |
| Changing contribution amount after payments already made  | Warn: "Changing amount may affect future payment expectations. Proceed?"                          |

---

## 7. Permissions Matrix

| Action                              | SUPER_ADMIN | DIRECTOR | COORDINATOR                | ACCOUNTING | VOLUNTEER | VIEWER         |
| ----------------------------------- | ----------- | -------- | -------------------------- | ---------- | --------- | -------------- |
| List contributions                  | ✅          | ✅       | ✅ (own projects)          | ✅         | ❌        | ✅ (read only) |
| View contribution detail            | ✅          | ✅       | ✅ (if project accessible) | ✅         | ❌        | ✅ (read only) |
| Create contribution                 | ✅          | ✅       | ❌                         | ✅         | ❌        | ❌             |
| Update contribution (status, dates) | ✅          | ✅       | ❌                         | ✅         | ❌        | ❌             |
| Cancel contribution                 | ✅          | ✅       | ❌                         | ✅         | ❌        | ❌             |
| Create payment                      | ✅          | ✅       | ❌                         | ✅         | ❌        | ❌             |
| Upload receipt                      | ✅          | ✅       | ❌                         | ✅         | ❌        | ❌             |
| Export financial data               | ✅          | ✅       | ❌                         | ✅         | ❌        | ❌             |

---

## 8. Mobile UX Requirements

- **Forms:** Use numeric keypad for amounts, date pickers, select dropdowns.
- **Receipt upload:** Camera integration (`capture="environment"`). Preview thumbnail.
- **Payments list:** Card layout with date, amount, receipt icon.
- **Contribution list:** Show status with color badge. Swipe actions for quick payment entry.
- **Search:** Search by sponsor name or project title.

---

## 9. Acceptance Criteria

- [ ] ACCOUNTING can create a contribution linking a sponsor to a project.
- [ ] Contribution appears in list; can be filtered by status.
- [ ] Detail page shows contribution info and payments list.
- [ ] ACCOUNTING can record a payment against a contribution, upload a receipt.
- [ ] Payment appears in list; receipt can be viewed/downloaded.
- [ ] Contribution can be paused, resumed, or cancelled (status change).
- [ ] Permissions: COORDINATOR cannot create contributions (read‑only).
- [ ] Payments are immutable (no edit/delete in MVP).
- [ ] All actions logged (audit trail).
- [ ] Mobile layout tested.

---

## 10. Technical Notes

- Use Drizzle ORM.
- Contributions table: `contributions` (id, organization_id, project_id, sponsor_person_id, beneficiary_person_id, amount, currency, frequency, status, start_date, end_date, notes, created_at, updated_at).
- Payments table: `payments` (id, contribution_id, amount, payment_date, payment_method, reference_number, receipt_attachment_id, notes, created_by, created_at).
- Receipts stored in Supabase Storage bucket `receipts` (private). RLS ensures only authorized roles can access.
- For audit, log `create`, `update`, `status_change`, `payment_create`, `receipt_upload`.
- No hard deletes; use status flags.

---

## 11. Dependencies

- `people` table (sponsor, beneficiary)
- `projects` table
- `attachments` table for receipts
- Supabase Storage bucket `receipts`

---

## 12. Definition of Done

- All acceptance criteria met.
- TypeScript passes.
- Unit tests for validation and business rules.
- E2E test for full contribution → payment → receipt flow.
- Mobile responsive tested.
- Documentation updated (spec, API, database).

---

**Created:** 2026-05-28  
**Next:** Create `flows/sponsorship-flow.md` (user journey from assigning sponsor to recording payment)
