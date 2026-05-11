# CLAUDE.md — Frontend Engineering Rules

## Core Principles

- Build production-grade frontend applications
- Prioritize scalability, maintainability, responsiveness, and accessibility
- Use TypeScript everywhere
- Focus on reusable architecture and consistent UI systems
- Maintain clean component boundaries
- Optimize for performance and smooth UX
- Avoid unnecessary complexity and visual clutter

---

# Tech Stack Rules

## Framework
- Use Next.js App Router

## Language
- TypeScript strict mode enabled

## Styling
- Tailwind CSS only
- No inline styles
- No CSS modules unless explicitly required

## UI Library
- Use ShadCN UI as primary component base

## State Management
Preferred:
- Zustand

Use Redux Toolkit only for large complex global state.

## Data Fetching
Use:
- TanStack Query
- Server Actions where appropriate

## Forms
Use:
- React Hook Form
- Zod validation

## Animations
Use:
- Framer Motion

Animations must remain subtle and purposeful.

---

# Folder Structure Rules

Use feature-based architecture.

src/
├── app/
├── components/
│   ├── ui/
│   ├── shared/
│   ├── layouts/
│   └── sections/
│
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── problems/
│   ├── contests/
│   ├── profile/
│   └── settings/
│
├── hooks/
├── services/
├── store/
├── lib/
├── constants/
├── types/
├── styles/
├── utils/
└── providers/

---

# UI/UX Rules

## Design Philosophy

UI should feel:
- modern
- premium
- clean
- minimal
- fast
- structured

Inspired by:
- Stripe
- Linear
- Vercel
- GitHub
- Notion
- LeetCode

---

# Responsive Design Rules

Mandatory support:
- mobile
- tablet
- desktop

Approach:
- mobile-first

Never:
- leave horizontal overflow
- use fixed layouts unnecessarily
- ignore tablet layouts

---

# Component Rules

Components must:
- be reusable
- stay modular
- remain typed properly
- remain visually consistent

Avoid:
- giant JSX files
- deeply nested markup
- duplicated UI blocks
- excessive prop drilling

---

# Styling Rules

Use consistent spacing scale.

Preferred spacing:
- 2
- 4
- 6
- 8
- 12
- 16
- 24

Preferred styling:
- rounded-2xl
- subtle borders
- soft shadows
- balanced whitespace

Avoid:
- random arbitrary values
- inconsistent spacing
- inconsistent radii
- overuse of gradients

---

# Typography Rules

Maintain clear hierarchy.

Use:
- large readable headings
- proper line heights
- consistent font sizing

Avoid:
- tiny text
- excessive font weights
- inconsistent heading scales

---

# Accessibility Rules

Mandatory:
- semantic HTML
- keyboard navigation
- focus states
- aria labels where needed
- proper contrast ratios

Never:
- remove outlines without replacement
- rely only on color indicators

---

# Performance Rules

Optimize:
- bundle size
- rendering
- image loading
- hydration cost

Use:
- dynamic imports
- lazy loading
- Next.js Image component

Avoid:
- unnecessary client components
- excessive useEffect
- unnecessary re-renders

---

# API Integration Rules

- Centralize API logic
- Use service layers
- Handle loading/error/empty states
- Never place random fetch logic everywhere

---

# Authentication Rules

Frontend auth must:
- handle refresh properly
- protect private routes
- manage auth state cleanly
- avoid exposing sensitive data

---

# Error Handling Rules

Every async UI must include:
- loading state
- error state
- empty state

Never leave blank sections.

---

# Form Rules

Forms must:
- validate properly
- show inline errors
- prevent duplicate submissions
- remain accessible

Use:
- React Hook Form
- Zod

---

# Table Rules

Large tables must support:
- pagination
- filtering
- sorting

Use:
- TanStack Table

---

# DSA Platform Specific Rules

## Problem Pages

Must support:
- formatted statements
- syntax highlighted examples
- constraints section
- hints
- editorial section
- submissions history

## Code Editor

Use:
- Monaco Editor

Features:
- syntax highlighting
- autosave
- language selection
- fullscreen mode
- themes

---

# Dashboard Rules

Dashboard should:
- remain uncluttered
- provide clear navigation
- show progress visually
- surface key actions immediately

Use:
- cards
- charts
- progress indicators

---

# Animation Rules

Animations should:
- improve smoothness
- improve UX clarity

Avoid:
- excessive motion
- long delays
- distracting effects

Preferred:
- fade
- subtle scale
- smooth transitions

---

# Dark Mode Rules

Mandatory:
- proper dark mode support
- consistent colors
- readable contrast

Never:
- use washed-out text
- use low-contrast combinations

---

# SEO Rules

Use:
- proper metadata
- semantic structure
- Open Graph tags
- clean URLs

---

# Code Quality Rules

Mandatory:
- ESLint
- Prettier
- strict TypeScript
- proper imports
- reusable utilities

Avoid:
- any type
- unused code
- giant components
- hardcoded production data

---

# Naming Rules

Components:
- PascalCase

Hooks:
- useSomething

Constants:
- UPPER_SNAKE_CASE

Files:
- maintain naming consistency

---

# Git Rules

Commit format:
- feat:
- fix:
- refactor:
- style:
- docs:
- test:
- chore:

Example:
feat(problem-page): add Monaco editor integration

---

# Testing Rules

Minimum:
- component tests
- integration tests for major flows

Critical flows:
- auth
- payments
- submissions
- contests

---

# Deployment Rules

Preferred:
- Vercel deployment

Mandatory:
- production build checks
- environment separation
- Lighthouse optimization

---

# Screenshot Progress Tracking Rules

## Mandatory Workflow

After every major frontend update:

1. Run the application
2. Open updated page
3. Capture screenshots
4. Verify visuals
5. Save screenshots properly
6. Continue only after verification

Never continue blindly after large UI changes.

---

# Screenshot Folder Structure

project-root/
├── progress-screenshots/
│
├── landing-page/
├── auth/
├── dashboard/
├── problems/
├── problem-page/
├── contests/
├── profile/
├── mobile/
└── misc/

---

# Screenshot Naming Convention

Format:

[page]-[milestone]-[timestamp].png

Examples:

landing-hero-final-2026-05-10-18-30.png

dashboard-sidebar-update-2026-05-10-19-15.png

problem-page-editor-added-2026-05-10-20-05.png

mobile-navbar-fix-2026-05-10-20-40.png

---

# Mandatory Screenshot Events

Capture screenshots after:
- new page creation
- major layout updates
- responsive fixes
- component redesigns
- animation additions
- navbar/sidebar changes
- dashboard updates
- auth UI updates
- editor integrations
- modal/dialog implementations

---

# Responsive Screenshot Rules

For important pages capture:

## Desktop
- 1440px width

## Tablet
- 768px width

## Mobile
- 375px width

Mandatory for:
- landing page
- dashboard
- auth pages
- problem pages

---

# Screenshot Validation Checklist

Verify:
- no overflow
- no broken layout
- spacing consistency
- typography consistency
- dark mode correctness
- alignment correctness
- responsive behavior
- animation smoothness

---

# Screenshot Tooling Rules

Preferred:
- Playwright screenshots
- Puppeteer screenshots
- browser full-page captures

Preferred automation:
- Playwright visual regression testing

---

# Playwright Screenshot Rules

Maintain:

tests/screenshots/

Automate screenshots for:
- landing page
- dashboard
- problem page
- mobile layouts

Flow:
- start app
- navigate page
- wait for load
- capture screenshot
- compare baseline

---

# Visual Regression Rules

Track:
- layout shifts
- spacing changes
- responsiveness issues
- accidental UI regressions

Never merge major frontend changes without visual verification.

---

# AI Generation Workflow Rules

When generating frontend code:

1. Analyze existing design system first
2. Preserve UI consistency
3. Generate reusable components
4. Avoid touching unrelated files
5. Keep architecture modular
6. Use responsive layouts by default
7. Verify UI visually after implementation
8. Capture screenshots before continuing

---

# Output Expectations

Generated frontend code must:
- compile successfully
- remain responsive
- look production-ready
- follow accessibility basics
- avoid placeholder styling
- use proper typing
- avoid pseudo-code

Avoid unnecessary overengineering unless explicitly requested.
