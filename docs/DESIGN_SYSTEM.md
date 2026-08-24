# MedAxis UI Design System

## Purpose

The MedAxis frontend uses Ant Design 6 as the base component library and a small reusable component layer to keep the product visually consistent across desktop, tablet and mobile.

The system follows the existing project principles: mobile-first, one-hand operation, RTL/LTR, light/dark themes, accessible touch targets and minimal enterprise UI. The implementation should prefer existing Ant Design primitives over bespoke controls.

## Shared Components

All reusable primitives live under `client/src/components/common/` and are exported from `index.ts`.

| Component | Responsibility |
|---|---|
| `PageHeader` | Page title, metadata, optional back action and responsive actions |
| `StatusTag` | Semantic status labels with consistent colors |
| `InfoCard` | Standard information card shell |
| `EmptyState` | Consistent empty state with optional action |
| `DataCard` | Compact label/value metadata block |
| `PhoneLink` | Universal `tel:` action for phone numbers |
| `DateTimeTag` | Consistent date/time tag |
| `MoneyInput` | Numeric monetary input with stable currency suffix and comma formatting |
| `FileCard` | File preview/open/delete presentation |
| `StaffCard` | Doctor, nurse and team member presentation |
| `SectionHeader` | Section title, description and contextual action |
| `ConfirmAction` | Standard destructive confirmation action |

## Rules

### Ant Design

- Use Ant Design 6 components for forms, feedback, navigation, overlays and data presentation.
- Do not create custom controls when Ant Design already provides the behavior.
- Keep Ant Design `ConfigProvider` tokens as the source of global component styling.

### Mobile

- Design for 375px first.
- Primary controls should be easy to reach with one hand.
- Use a minimum practical touch target of about 44px.
- Prefer one-column layouts on mobile.
- Do not allow page-level horizontal scrolling.
- Tables may scroll inside their own container.
- Keep money inputs and currency labels on one visual line.

### Phone numbers

Use `PhoneLink` anywhere a user-visible phone number is displayed. It normalizes the value and renders a `tel:` action so mobile users can call directly.

### Money

Use `MoneyInput` for editable monetary values. Currency must remain visually attached to the field without becoming part of the numeric value. The parser removes grouping commas before submission.

### Empty states

Use `EmptyState` for missing content instead of one-off empty markup. Add an action when the user can immediately resolve the empty state.

### Sections and metadata

Use `PageHeader` for page-level hierarchy, `SectionHeader` for card/section hierarchy and `DataCard` for compact metadata such as patient, hospital, room, status and dates.

### Clinical files

Use `FileCard` for before/after images, imaging, lab results and supporting documents. Before and After should remain visually prioritized above secondary file categories.

### Medical team

Use `StaffCard` for doctors, nurses and other clinical team members. Phone numbers inside the card should use `PhoneLink`.

### Destructive actions

Use `ConfirmAction` for destructive operations such as deleting an operation, file or other persistent record.

## Accessibility and localization

- Keep labels and user-facing strings compatible with i18next.
- Preserve RTL/LTR behavior; do not hard-code left/right layout assumptions when logical CSS properties are available.
- Use semantic headings and descriptive button labels.
- Keep color from being the only indicator of status.

## Adoption checklist

When touching an existing page, replace local implementations where practical:

- [ ] Local page header → `PageHeader`
- [ ] Local status tag mapping → `StatusTag`
- [ ] Local info card wrapper → `InfoCard`
- [ ] Local empty markup → `EmptyState`
- [ ] Repeated label/value blocks → `DataCard`
- [ ] Any phone number → `PhoneLink`
- [ ] Date/time status metadata → `DateTimeTag`
- [ ] Any editable cost → `MoneyInput`
- [ ] File preview tile → `FileCard`
- [ ] Doctor/nurse card → `StaffCard`
- [ ] Section title → `SectionHeader`
- [ ] Delete confirmation → `ConfirmAction`

## Product direction

This component layer is intentionally small. It should evolve with the product without becoming a second UI framework. New components should be added only when a pattern is repeated across multiple features or when the pattern encodes a meaningful healthcare workflow.
