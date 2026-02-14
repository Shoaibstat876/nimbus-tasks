# Nimbus UI Skill — Constitution Implementation (Tailwind + CSS Variables)

## Objective
Upgrade Nimbus UI to a cognitive-optimized, enterprise-modern, production-safe design system.
Deliver a responsive, accessible experience across Android phones and laptops without changing backend behavior.

## Safety Contract (Non-Negotiable)
- UI-only scope: changes limited to `phase2-frontend/` UI layer.
- No auth/business logic changes.
- No environment variable changes (`.env*` forbidden).
- No deployment config changes.
- No redeploy unless explicitly authorized.

## Single Source of Truth: Tokens
All UI styling must come from tokens (CSS variables).
No raw hex values inside components.
No random spacing/radius.
No ad-hoc shadows.

### Token File Location
- `phase2-frontend/app/globals.css` (defines CSS variables in `:root`)
- Components reference variables via Tailwind arbitrary values: `bg-[var(--bg)]`, `text-[var(--text)]`, `border-[var(--border)]`.

## Core Tokens (Locked)
### Base
- `--bg`: #F8FAFC
- `--surface`: #FFFFFF
- `--text`: #0F172A
- `--muted`: #475569
- `--border`: #E2E8F0

### Accent
- `--accent`: #0F766E
- `--accent-hover`: #115E59
- `--ring`: rgba(15,118,110,0.25)

### Semantic (Only These)
- Success: `--success-text`, `--success-bg`, `--success-border`
- Danger: `--danger-text`, `--danger-bg`, `--danger-border`
- Warning: `--warning-text`, `--warning-bg`, `--warning-border`
- Info: `--info-text`, `--info-bg`, `--info-border`

## Spacing Scale (8px System)
Allowed spacing only: 8 / 16 / 24 / 32 / 48 / 64

Mapping:
- Page padding: mobile 24, desktop 32
- Card padding: 24
- Form field gap: 16
- Section gap: 32–48
- Table row height: 48
- Modal padding: 32

## Radius (Locked)
- Card: 12
- Button: 10
- Input: 10

## Elevation (Max 2)
- SM shadow: cards
- MD shadow: modal/popover
No heavy shadows.

## Typography
Font: Inter (fallback: system-ui)
- H1 32 (mobile ~28)
- H2 24
- H3 18
- Body 16
- Small 14
Line height:
- Headings 1.2–1.3
- Body 1.5–1.7
Max readable width: 65–80 chars.

## Accessibility Standards
- Contrast: body text ≥ 4.5:1, large text ≥ 3:1
- Focus ring visible on all interactive elements
- No color as the only indicator (icons + text for errors)
- Keyboard navigation supported
- Tap targets ≥ 40px height

## Responsive Rules (Locked)
- Desktop: sidebar fixed (if present)
- Tablet: collapsible sidebar
- Mobile: drawer navigation
- No horizontal layout scrolling
- Tables must be wrapped with horizontal scroll container on small screens

## Component State Matrix (Required)
Interactive components must implement:
- Default / Hover / Active / Focus / Disabled / Loading

Forms must implement:
- Idle / Error / Success / Warning

## Definition of Done
- Tokens defined and used everywhere
- No raw hex colors inside components
- No horizontal scroll on mobile (360px, 412px tested)
- Consistent spacing/radius/shadow rules
- Visible focus rings and proper states
- UI changes do not alter API/auth behavior
