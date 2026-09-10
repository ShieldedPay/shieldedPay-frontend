# shieldedPay-frontend — Minor Issues Backlog (8 Issues)

Sized strictly as **100 pts (Trivial / Good First Issue)** in Drips Wave criteria.

---

## #1: Add accessible aria-label attributes to copy-to-clipboard and modal close buttons

- **Labels**: `complexity:trivial, frontend, accessibility, good first issue`

- **Complexity**: `100 pts` (Trivial)


### Summary
Fix accessibility audit findings by adding explicit `aria-label` tags to icon-only interactive elements.

### Requirements
- Add `aria-label="Copy claim voucher link"` to voucher copy buttons.
- Add `aria-label="Close dialog"` to modal dismiss buttons.
- Verify screen reader accessibility using browser developer tools.

---

## #2: Add favicon, OpenGraph metadata, and page descriptions in app/layout.tsx

- **Labels**: `complexity:trivial, frontend, seo`

- **Complexity**: `100 pts` (Trivial)


### Summary
Complete Next.js metadata configuration for social sharing and browser tab display.

### Requirements
- Configure title template, description, and OpenGraph tags in `app/layout.tsx`.
- Place SVG favicon in `app/favicon.ico` or `public/favicon.svg`.
- Verify social card preview using metadata inspector.

---

## #3: Add fallback alt text and accessibility labels to Stellar wallet provider icons

- **Labels**: `complexity:trivial, frontend, accessibility`

- **Complexity**: `100 pts` (Trivial)


### Summary
Ensure all wallet connection icons (Freighter, xBull, Albedo) have descriptive `alt` and accessibility text.

### Requirements
- Add `alt="Freighter Wallet logo"`, `alt="xBull Wallet logo"`, etc. to `Image` components.
- Ensure images specify width, height, and display cleanly on high-DPI displays.
- Verify no empty alt warnings in console.

---

## #4: Document React component props using TypeScript interfaces and JSDoc in components/

- **Labels**: `complexity:trivial, frontend, documentation, good first issue`

- **Complexity**: `100 pts` (Trivial)


### Summary
Standardize component documentation across common UI widgets (`Button`, `Modal`, `StatusBadge`).

### Requirements
- Add JSDoc comments describing each prop on component interfaces.
- Ensure all components export their prop types for clean IDE autocompletion.
- Verify zero TypeScript type-check errors with `npm run typecheck`.

---

## #5: Add friendly empty-state illustration and copy for employee payroll claim list

- **Labels**: `complexity:trivial, frontend, ui/ux`

- **Complexity**: `100 pts` (Trivial)


### Summary
Provide informative empty state when an organization or employee has no registered payroll batches.

### Requirements
- Design clean empty state card with icon, headline, and actionable CTA button.
- Display message: "No payroll vouchers found. Create your first disbursement batch to get started."
- Verify layout renders responsively on mobile and desktop.

---

## #6: Standardize button hover, focus-visible, and active ring states in Tailwind classes

- **Labels**: `complexity:trivial, frontend, ui/ux`

- **Complexity**: `100 pts` (Trivial)


### Summary
Ensure interactive buttons have high-contrast focus rings for keyboard navigation accessibility.

### Requirements
- Apply `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500` to interactive buttons.
- Add smooth transition styling (`transition-colors duration-150`).
- Test keyboard tab navigation through all form controls.

---

## #7: Add smoke test using React Testing Library for header wallet connection button

- **Labels**: `complexity:trivial, frontend, testing, good first issue`

- **Complexity**: `100 pts` (Trivial)


### Summary
Add automated smoke test ensuring the main navigation bar and connect wallet button render without runtime errors.

### Requirements
- Create `components/Header.test.tsx` using Vitest and `@testing-library/react`.
- Assert connect wallet button is rendered with accessible name.
- Verify test passes with `npm test`.

---

## #8: Adjust responsive card margins and padding for mobile viewports under 380px

- **Labels**: `complexity:trivial, frontend, ui/ux`

- **Complexity**: `100 pts` (Trivial)


### Summary
Prevent horizontal content clipping and edge cramping on narrow mobile screens (e.g., iPhone SE 375px).

### Requirements
- Audit padding and margins on payroll detail cards and voucher claim views.
- Use `px-3 sm:px-6` responsive spacing classes.
- Verify layout renders without horizontal overflow or scrollbars at 360px viewport.

---
