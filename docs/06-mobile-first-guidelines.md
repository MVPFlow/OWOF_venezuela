# `06-mobile-first-guidelines.md`

# Mobile-First Guidelines

# OWOFVzla Social Platform

Version: 0.1
Status: Draft

---

# 1. Purpose

This document defines the official mobile-first UX and UI guidelines for the OWOFVzla Social Platform.

The platform is primarily designed for:

- mobile devices
- field operations
- non-technical users
- unstable internet conditions

Desktop layouts are secondary adaptations.

All product decisions must prioritize mobile usability first.

---

# 2. Mobile-First Philosophy

The platform must optimize for:

- operational speed
- touch usability
- simplicity
- clarity
- low cognitive load
- one-handed interaction

The system should feel:

- lightweight
- intuitive
- fast
- accessible

even on modest devices.

---

# 3. Core UX Principles

---

## 3.1 Functionality Over Aesthetics

Early phases prioritize:

- workflows
- usability
- speed
- clarity

Visual polish comes later.

---

## 3.2 Minimize Cognitive Load

Interfaces should:

- reduce decision fatigue
- minimize steps
- simplify navigation
- avoid clutter

---

## 3.3 Thumb-Friendly Interaction

Critical actions should remain reachable using one-handed mobile interaction whenever possible.

---

## 3.4 Fast Operations

Most common operations should require:

- minimal taps
- minimal scrolling
- minimal typing

---

# 4. Mobile Layout Strategy

---

## 4.1 Mobile as Primary Breakpoint

Design should start from:

```text
320px → 480px
```

Desktop layouts are progressive enhancements.

---

## 4.2 Responsive Expansion

Recommended breakpoint philosophy:

```text
Mobile First
    ↓
Tablet Adaptation
    ↓
Desktop Expansion
```

Never:

- desktop first
- then shrink to mobile

---

# 5. Navigation Guidelines

---

## 5.1 Primary Navigation

Preferred navigation patterns:

```text
Bottom Navigation
Mobile Drawer
Floating Action Button (FAB)
Sticky Actions
```

---

## 5.2 Navigation Simplicity

Primary navigation should avoid:

- deep nesting
- excessive menu levels
- hidden critical actions

---

## 5.3 Recommended Navigation Structure

```text
Dashboard
Projects
People
Reports
Settings
```

Avoid large enterprise-style sidebars on mobile.

---

# 6. Touch Interaction Guidelines

---

## 6.1 Minimum Touch Targets

Interactive elements should use:

```text
44px minimum height
```

Preferred:

```text
48px+
```

---

## 6.2 Spacing

Touch targets should include:

- safe spacing
- accidental tap prevention
- visual separation

---

## 6.3 Swipe Usage

Swipe interactions should remain:

- optional
- intuitive
- non-critical

Never hide core functionality behind gestures only.

---

# 7. Typography Guidelines

---

## 7.1 Readability First

Typography should prioritize:

- readability
- accessibility
- contrast
- spacing

---

## 7.2 Font Sizes

Recommended minimum sizes:

```text
Body: 16px
Small Text: 14px
Titles: 20px+
```

Avoid tiny text.

---

## 7.3 Text Density

Avoid:

- large text blocks
- dense paragraphs
- overloaded screens

Prefer:

- short sections
- grouped information
- progressive disclosure

---

# 8. Form UX Guidelines

---

## 8.1 Form Philosophy

Forms must prioritize:

- speed
- simplicity
- mobile usability

---

## 8.2 Long Forms

Avoid giant forms.

Preferred approaches:

```text
Step-based forms
Accordion sections
Progressive disclosure
Tabbed grouping
```

---

## 8.3 Input Types

Use optimized mobile inputs whenever possible.

Examples:

```text
type="tel"
type="email"
type="date"
type="number"
```

---

## 8.4 Labels

Inputs must always include:

- visible labels
- helper text when needed
- validation clarity

Avoid placeholder-only labels.

---

## 8.5 Validation UX

Validation should:

- appear immediately when relevant
- explain problems clearly
- avoid technical language

---

## 8.6 Save Behavior

Forms should support:

- autosave when reasonable
- draft states
- explicit save feedback

---

# 9. List & Table Guidelines

---

## 9.1 Avoid Desktop Tables on Mobile

Large horizontal tables are discouraged.

Preferred mobile patterns:

```text
Cards
Stacked rows
Expandable sections
Grouped lists
```

---

## 9.2 Search & Filters

Lists should support:

- fast search
- lightweight filters
- mobile-friendly filtering UI

---

## 9.3 Infinite Scrolling

Use carefully.

Preferred:

- pagination
- progressive loading
- load more buttons

when operational clarity matters.

---

# 10. Cards Guidelines

---

## 10.1 Card Usage

Cards are preferred for:

- people
- projects
- contributions
- reports
- activities

---

## 10.2 Card Content

Cards should prioritize:

- hierarchy
- quick scanning
- important actions
- minimal clutter

---

## 10.3 Quick Actions

Cards may include:

- edit
- call
- upload
- view details

using icon-first actions when appropriate.

---

# 11. Iconography Guidelines

---

## 11.1 Icon Philosophy

Icons should:

- reinforce meaning
- improve speed
- reduce visual clutter

Icons must not replace clarity.

---

## 11.2 Recommended Style

Use:

- simple outline icons
- consistent sizing
- predictable positioning

---

## 11.3 Accessibility

Icons with important meaning should include:

- labels
- tooltips
- accessible descriptions

---

# 12. Mobile Action Patterns

---

## 12.1 Floating Action Button

Use FABs for:

- create actions
- high-frequency operations

Examples:

```text
Create Person
Create Project
Upload Evidence
```

---

## 12.2 Sticky Bottom Actions

Critical actions should remain visible during long workflows.

Examples:

- save
- continue
- upload
- submit

---

# 13. File Upload UX

---

## 13.1 Mobile Camera Support

Uploads should support:

- camera capture
- gallery selection
- document uploads

---

## 13.2 Upload Feedback

Uploads must provide:

- progress indicators
- success states
- retry states
- failure feedback

---

## 13.3 Image Compression

Mobile uploads should optimize:

- bandwidth
- storage
- performance

when possible.

---

# 14. Offline & Network Resilience

---

## 14.1 Slow Network Tolerance

The UI should remain usable under:

- unstable connections
- slow mobile networks
- temporary offline conditions

---

## 14.2 Offline Indicators

When relevant, the UI should communicate:

- syncing
- pending uploads
- offline states

clearly.

---

# 15. Loading States

---

## 15.1 Perceived Performance

The platform should prioritize:

- fast feedback
- optimistic updates
- skeleton loading
- progressive rendering

---

## 15.2 Loading Feedback

Avoid blank screens.

Always provide:

- loaders
- placeholders
- visual feedback

---

# 16. Empty States

---

## 16.1 Empty State Philosophy

Empty states should:

- guide the user
- explain next actions
- reduce confusion

---

## 16.2 Example Empty States

```text
"No participants yet"
"Create your first project"
"No evidence uploaded"
```

---

# 17. Accessibility Guidelines

---

## 17.1 Accessibility Priority

The platform should prioritize:

- readable contrast
- touch accessibility
- keyboard accessibility
- screen reader compatibility

when possible.

---

## 17.2 Motion Reduction

Animations should remain:

- subtle
- optional
- non-blocking

---

# 18. Notification Guidelines

---

## 18.1 Notifications

Notifications should be:

- concise
- actionable
- non-intrusive

---

## 18.2 Toast Usage

Use toasts for:

- confirmations
- upload feedback
- success messages
- warnings

Avoid notification overload.

---

# 19. Modal & Drawer Guidelines

---

## 19.1 Mobile Modals

Prefer:

- bottom sheets
- slide drawers
- fullscreen mobile flows

over tiny desktop-style modals.

---

## 19.2 Critical Actions

Critical confirmations should:

- clearly explain consequences
- avoid accidental confirmation

---

# 20. Mobile Dashboard Guidelines

---

## 20.1 Dashboard Philosophy

Dashboards should prioritize:

- operational shortcuts
- recent activity
- quick metrics
- actionable information

---

## 20.2 Dashboard Density

Avoid:

- overly dense analytics
- enterprise dashboards
- excessive charts

Early versions should remain operationally focused.

---

# 21. Performance Guidelines

---

## 21.1 Bundle Size

Frontend code should prioritize:

- lightweight dependencies
- lazy loading
- minimal JS overhead

---

## 21.2 Image Strategy

Images should:

- load progressively
- use placeholders
- remain optimized

---

# 22. Mobile Testing Requirements

All major features must be tested on:

```text
Small phones
Medium phones
Tablet layouts
```

Testing should prioritize:

- touch interactions
- form usability
- scrolling behavior
- upload flows

---

# 23. Mobile-Specific Flows

---

## 23.1 Invitation Acceptance Page

The invitation acceptance page (`/accept-invite`) must be fully mobile-optimized:

- Clear instructions
- Large touch-friendly input for password and name
- Prominent submit button
- Minimal distractions

---

## 23.2 Admin Invitation Panel

The SUPER_ADMIN panel for inviting users (`/admin/users`) must be usable on mobile:

- Simple form (email, role selector)
- List of pending invitations with clear actions (resend, revoke)
- Card-based layout, not a dense table

---

# 24. UX Anti-Patterns

Avoid:

- giant forms
- horizontal scrolling
- overloaded tables
- tiny buttons
- hidden actions
- deeply nested menus
- desktop-first layouts
- excessive animations

---

# 25. Future UI Expansion

Future versions may include:

- dark mode
- branding systems
- animations
- advanced dashboards
- richer interactions

without replacing the mobile-first foundation.

---

# 26. Current Status

Current phase:

- Mobile-first UX definition (updated for invitation flows)

Next phase:

- UI design principles
