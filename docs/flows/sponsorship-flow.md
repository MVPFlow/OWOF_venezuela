# Sponsorship Flow (Student Sponsorship Example)

## OWOFVzla Social Platform

Version: 0.1
Status: Draft

---

## 1. Overview

This document describes the complete user flow for managing a **student sponsorship** within a scholarship project (e.g., "Beca el Futuro"). The flow covers:

1. Creating a sponsorship agreement (contribution) linking a sponsor to a student (beneficiary) within a project.
2. Recording periodic payments (e.g., monthly).
3. Uploading receipts and evidence.
4. Tracking payment history and contribution status.

This is a core operational workflow for the foundation.

---

## 2. Actors

- **Coordinator / Accounting user** – The foundation staff member who manages sponsorships.
- **Sponsor** – A person (external) who contributes money. (For MVP, sponsors are managed as `people` without user accounts; future portal will allow them to log in.)
- **Student (Beneficiary)** – A person who receives the sponsorship.
- **Project** – The scholarship initiative (e.g., "Beca el Futuro").

---

## 3. Preconditions

- The **Project** already exists and is active.
- The **Sponsor** and **Student** are already registered as `people` in the system.
- The user performing the actions has role `ACCOUNTING`, `SUPER_ADMIN`, or `DIRECTOR` (COORDINATOR may have read‑only access in MVP).

---

## 4. Flow Diagram (Textual)

```
Coordinator/Accounting            System                         Sponsor (future portal)
      |                             |                                       |
      | 1. Navigate to project      |                                       |
      |    detail page              |                                       |
      |---------------------------->|                                       |
      |                             |                                       |
      | 2. Click "Add Sponsorship"  |                                       |
      |---------------------------->|                                       |
      |                             |                                       |
      | 3. Fill form:               |                                       |
      |    - Sponsor (search)       |                                       |
      |    - Beneficiary (search)   |                                       |
      |    - Amount, frequency      |                                       |
      |    - Start date             |                                       |
      |---------------------------->|                                       |
      |                             |                                       |
      |                             | 4. Create contribution record        |
      |                             |    (status = active)                 |
      |                             |                                       |
      | 5. See contribution in list |                                       |
      |<----------------------------|                                       |
      |                             |                                       |
      | ... (monthly payment) ...   |                                       |
      |                             |                                       |
      | 6. Open contribution detail |                                       |
      |---------------------------->|                                       |
      |                             |                                       |
      | 7. Click "Record Payment"   |                                       |
      |---------------------------->|                                       |
      |                             |                                       |
      | 8. Enter:                   |                                       |
      |    - Amount                 |                                       |
      |    - Payment date           |                                       |
      |    - Method, reference      |                                       |
      |    - Upload receipt (photo) |                                       |
      |---------------------------->|                                       |
      |                             |                                       |
      |                             | 9. Store payment & attachment       |
      |                             |    (immutable)                       |
      |                             |                                       |
      | 10. See payment added       |                                       |
      |<----------------------------|                                       |
      |                             |                                       |
      |                             |                    11. (Future) Sponsor logs in
      |                             |<--------------------------------------|
      |                             |                                       |
      |                             |                    12. Sees own contributions
      |                             |                        and payment history
```

---

## 5. Detailed Steps

### Step 1: Navigate to Project

- **User:** Coordinator or Accounting.
- **Action:** Go to `/dashboard/projects`, search for project "Beca el Futuro", open its detail page.
- **UI:** Project detail shows a section "Sponsorships" (or "Contributions").

### Step 2: Initiate Contribution Creation

- **Action:** Click button "Add Sponsorship" or "Register Sponsor".
- **UI:** Opens a modal or dedicated page with a form.

### Step 3: Fill Contribution Form

- **Fields (mobile‑friendly):**
  - **Sponsor:** Search existing people by name/email. If not found, user must first create the person (via People module).
  - **Beneficiary (student):** Search existing people. Must be a person (could be tagged as `student`).
  - **Amount:** USD (numeric, e.g., 50.00).
  - **Frequency:** Monthly (typical for scholarships), quarterly, yearly, or one‑time.
  - **Start date:** Default today, but can be set in the past (e.g., January 2026).
  - **End date (optional):** If fixed term (e.g., school year).
  - **Notes (optional):** Internal comments.

- **Validation:** Sponsor and beneficiary cannot be same? (Allowed if a sponsor sponsors themselves? Not typical, but not forbidden.)

### Step 4: Submit & Create Contribution

- **Action:** Server action `createContribution`.
- **System:**
  - Inserts into `contributions` table.
  - Sets `organization_id` to OWOFVzla.
  - Status = `active` (if start date <= today) or `pending` (if start date in future).
  - Logs audit entry.
- **UI:** Shows success toast; redirects to contribution detail.

### Step 5: View Contribution

- **Contribution detail page** displays:
  - Sponsor name, beneficiary name, project title.
  - Amount, frequency, status.
  - Timeline (start date, next expected payment).
  - Payments list (initially empty).
  - Buttons: "Record Payment", "Edit", "Pause/Cancel".

### Step 6 (Later): Record a Payment

- **User** (Accounting) receives notification (offline) that sponsor sent money.
- **Action:** Open contribution detail, click "Record Payment".

### Step 7: Fill Payment Form

- **Mobile optimised:**
  - **Amount:** Pre‑filled with contribution amount (editable, e.g., partial payment).
  - **Payment date:** Default today.
  - **Payment method:** Cash, bank transfer, credit card, other.
  - **Reference number:** Optional (e.g., transfer ID).
  - **Receipt upload:** Tap to take photo or choose from gallery.
  - **Notes:** Optional.

### Step 8: Submit Payment

- **Action:** `createPayment` + `uploadReceipt` (if file provided).
- **System:**
  - Stores payment record (immutable).
  - Stores receipt in Supabase Storage (`receipts` bucket).
  - Updates `contributions.last_payment_date` (optional).
  - Logs audit entry.
- **UI:** Shows success; payment appears in list with receipt thumbnail.

### Step 9: Continue Over Time

- For monthly sponsorship, the same process repeats each month.
- The user can see all payments in the contribution detail.

### Step 10 (Future): Sponsor Portal

- When the `people.user_id` link is added, the sponsor can log in and view:
  - Their active contributions.
  - Beneficiary information (e.g., student’s progress, photos – respecting privacy).
  - Payment history and receipts.
  - Option to download donation certificates.

---

## 6. Edge Cases & Handling

| Case                                                         | Handling                                                                                                         |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Sponsor not yet registered as a person                       | User must first create person via People module. Contribution form should provide a link to "Create new person". |
| Beneficiary not yet registered                               | Same as above.                                                                                                   |
| Contribution already completed                               | Hide "Record Payment" button; show message "This contribution is completed."                                     |
| Payment amount exceeds remaining commitment (for fixed‑term) | Allow but show warning: "This payment exceeds the remaining amount."                                             |
| Duplicate receipt upload                                     | Allow multiple receipts per payment; no automatic deduplication.                                                 |
| Cancelling a contribution with existing payments             | Allow cancellation; set status to `cancelled`. Future payments cannot be added. Past payments remain visible.    |
| Pausing a contribution                                       | Status `paused`. No payments can be recorded. Resume sets status back to `active`.                               |

---

## 7. Mobile UX Considerations

- **Search for sponsor/beneficiary:** Use a searchable modal (infinite scroll). Show avatar, name, email.
- **Date pickers:** Use native `input type="date"`.
- **Amount input:** Use `type="number"` with step="0.01".
- **Receipt upload:** Use `capture="environment"` for camera, or `accept="image/*,application/pdf"`.
- **Payment list:** Card layout with amount, date, receipt thumbnail. Tap on receipt to preview.

---

## 8. Example User Journey (Text)

**Coordinator "Maria"** logs into the platform on her phone. She goes to the "Projects" section, selects "Beca el Futuro". Under "Sponsorships", she clicks "Add Sponsorship". She searches for sponsor "Carlos López" (already registered) and beneficiary "Ana García". She enters $50, monthly, starting April 1, 2026. She submits.

Two weeks later, Carlos sends $50 via bank transfer. Maria opens the contribution, clicks "Record Payment", enters the amount, selects "bank transfer", adds reference number "TRF123", takes a photo of the transfer receipt, and submits. The payment is saved. Maria can now see the payment history and the receipt.

At the end of the school year, Maria changes the contribution status to "completed". No further payments can be added.

---

## 9. Related Documents

- [Spec: Contributions & Payments](../specs/contributions.spec.md)
- [Spec: People Module](../specs/people.spec.md)
- [Spec: Projects Module](../specs/projects.spec.md)
- [Database Schema: contributions & payments tables](../03-database-schema-v1.md)

---

**Created:** 2026-05-28  
**Next:** Create `flows/payment-flow.md` (if needed) or `specs/files.spec.md`
