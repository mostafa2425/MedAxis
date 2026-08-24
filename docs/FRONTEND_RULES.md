# MedAxis Frontend Rules

## UI / UX

- Ant Design 6 is the default UI component library.
- Build screens mobile-first; desktop layouts are an enhancement, not the baseline.
- Prefer compact, clear information hierarchy over large text and excessive spacing.
- Reuse shared Design System components before creating one-off equivalents.
- Actions should remain compact on mobile; use icon buttons with tooltips when text buttons consume unnecessary space.
- Keep status, date/time, phone, and money presentation consistent across the project.
- Preserve Arabic RTL and English LTR behavior for every new screen and component.

## CSS / SCSS Naming

- Use **kebab-case** for all CSS/SCSS class names.
- Good: `.follow-up-item`, `.follow-up-stat`, `.page-header-info`.
- Avoid camelCase: `.followUpItem`, `.followUpStat`, `.pageHeaderInfo`.
- Component class names should describe the visual role, not implementation details.
- Keep responsive rules in the component's stylesheet and design for small screens first.
- Prefer existing design tokens / CSS variables over hard-coded project-wide values.

## TypeScript / TSX

- Do not use `any` to silence TypeScript errors.
- Explicitly type callback parameters when inference is lost, especially for API data and array operations.
- Prefer imported type-only symbols (`import type`) for types.
- Remove unused imports before committing.
- Keep API response typing aligned with the service layer; do not reshape response objects with unsafe casts.
- Run typecheck and build after meaningful TSX changes.

## Follow-up UI Pattern

- Summary metrics use compact Ant Design Cards.
- Follow-up items use a clear content/actions split.
- Complete and delete actions should be compact icon actions with tooltips when appropriate.
- Avoid wide action buttons inside dense mobile cards.
