# Summit Web Brand & Digital Product Standards

**Status:** Proposed web standard derived from the attached Summit Brand Guidelines
**Brand source:** `2024 Brand Manual - FINAL - 10.31.23.pdf` and supplied page images
**Owner:** Marketing and Digital Product
**Version:** 1.0.0
**Last reviewed:** 2026-08-25

> The attached brand manual is the source of truth for the Summit identity. Values explicitly shown in the manual are marked **Brand requirement**. Responsive behavior, accessibility, implementation, analytics, security, and governance rules are **Web standard** extensions and must not alter the approved identity.

## 1. Brand foundation

### 1.1 Identity

- **Brand name:** Summit
- **Legal relationship shown in the manual:** Member of Great American Insurance Group
- **Primary tagline:** `Know the people who know workers’ comp.SM`
- **Registered mark:** The master logo includes `®`.
- **Service mark:** The tagline includes `SM`.
- **Brand character:** Expert, dependable, human, practical, confident, and clear.
- **Digital expression:** Calm, credible, information-first, highly legible, and operationally precise.

### 1.2 Voice

Write with informed confidence and human clarity. Prefer direct language, active voice, concrete next steps, and plain explanations of insurance or workers’ compensation concepts.

| Use | Avoid |
|---|---|
| “Review the open tasks due this week.” | “Leverage next-generation task optimization.” |
| “Your changes were saved.” | “The operation was successfully persisted.” |
| “We need a few more details.” | “Input validation has failed.” |
| Specific dates, owners, and actions | Vague urgency, jargon, or unexplained acronyms |

Never promise coverage, compliance, savings, or outcomes that have not been approved by the appropriate business owner.

## 2. Logo and symbol standards

### 2.1 Approved assets

The master logo consists of the Summit wordmark, mountain symbol, registered mark, tagline, horizontal rule, and `MEMBER OF GREAT AMERICAN INSURANCE GROUP` line. Use the supplied production asset; do not redraw, typeset, crop, or reconstruct it.

Approved forms shown in the manual:

1. **Full-color master logo:** use on white or lightly tinted branded backgrounds.
2. **Black logo:** use on single-color print materials or monochrome contexts.
3. **Reverse logo:** use on imagery or solid dark backgrounds.
4. **Sans-GA variation:** only with Marketing approval.
5. **Tagless variation:** only with Marketing approval.
6. **Symbol alone:** a design element or background element, never a replacement for the full logo on an external piece.

### 2.2 Digital usage

- Use the full master logo in site headers, authentication entry points, public landing pages, email headers, and application footers where brand identification is required.
- Use the reverse logo only when the background makes the full-color logo unreadable.
- Preserve the original aspect ratio at every size.
- Keep the registered and service marks intact in approved assets.
- Do not tilt, skew, flip, stretch, recolor, crop, trace, add effects to, or change the spacing within the logo.
- Do not place the symbol alone where users could mistake it for the complete Summit identity.
- Do not place the logo over busy imagery without an approved quiet area or sufficient overlay.
- Do not place text, controls, borders, or imagery inside the approved clear space.
- Prefer SVG for web. Provide a PNG fallback only when required by an external system.
- Use descriptive alternative text: `Summit — Know the people who know workers’ comp.` Do not include “logo” unless needed to distinguish the asset.

### 2.3 Clear space and minimum size

The supplied manual shows a clear-space construction but does not publish a numeric web minimum. Until Marketing provides a production minimum, use these Web standards:

- Define clear space as at least the height of the lowercase `s` in the wordmark on every side.
- Use a minimum digital lockup width of **160 CSS px** for the full logo with tagline.
- Use a minimum header lockup width of **128 CSS px** only when the tagline remains legible and Marketing approves the context.
- Never reduce the master logo below the point where the registered mark, tagline, or member line becomes unreadable.
- Measure minimum size using the rendered asset, not a surrounding container.

## 3. Brand color system

### 3.1 Colors shown in the manual

| Name | Reference | HEX | RGB | CMYK | Digital role |
|---|---|---:|---:|---:|---|
| Summit Blue | PMS 2187 | `#004677` | `0, 70, 119` | `100, 47, 0, 48` | Primary brand, links, primary actions |
| Summit Gray | PMS 430 | `#7C878E` | `124, 135, 142` | `33, 18, 13, 40` | Symbol, secondary text, neutral brand elements |
| Accent Teal | — | `#06786A` | `6, 120, 106` | `95, 0, 12, 53` | Approved accent, positive/secondary emphasis |
| Accent Blue | — | `#3B8BC4` | `59, 139, 196` | `70, 29, 0, 23` | Approved accent, information/data emphasis |
| Monochromatic Deep Blue | — | `#003559` | `0, 55, 94` | `100, 41, 0, 63` | Dark brand surface, reverse contexts |
| White | — | `#FFFFFF` | `255, 255, 255` | `0, 0, 0, 0` | Reverse logo, surfaces, text on dark |
| Black | — | `#000000` | `0, 0, 0` | `0, 0, 0, 100` | Approved black logo / monochrome |

The manual states that monochromatic and accent colors should comprise no more than **25% of the graphic canvas**. Treat this as a default digital composition rule: Summit Blue, white, and neutral surfaces establish the primary field; accents support hierarchy and status.

### 3.2 Digital color rules

- Never use color as the only indicator of status, validity, selection, or urgency.
- Test every foreground/background pairing at its actual text size.
- Do not use Summit Gray as small body text on white without verifying contrast; use a darker neutral when needed.
- Reserve red, amber, and green for semantic states, not decorative branding.
- Do not invent gradients, neon treatments, or unapproved accent colors.
- Use tints and shades only when they preserve the approved hue and pass accessibility testing.

## 4. Complete design token architecture

Use three layers. Raw brand values are primitives; semantic tokens express purpose; component tokens define controlled implementation behavior. Product code should consume semantic or component tokens, never raw values.

```text
Brand primitives → semantic roles → component contracts → framework adapters
```

### 4.1 CSS variables

```css
:root {
  /* Brand primitives: source values from the manual */
  --brand-summit-blue: #004677;
  --brand-summit-gray: #7c878e;
  --brand-accent-teal: #06786a;
  --brand-accent-blue: #3b8bc4;
  --brand-deep-blue: #003559;
  --brand-white: #ffffff;
  --brand-black: #000000;

  /* Neutral primitives */
  --gray-0: #ffffff;
  --gray-50: #f7f9fa;
  --gray-100: #eef2f4;
  --gray-200: #d9e1e5;
  --gray-300: #c2cdd2;
  --gray-500: #6b7880;
  --gray-700: #34434d;
  --gray-900: #17232b;

  /* Semantic color tokens */
  --color-bg: var(--gray-50);
  --color-surface: var(--gray-0);
  --color-surface-raised: var(--gray-0);
  --color-surface-subtle: var(--gray-100);
  --color-text: var(--gray-900);
  --color-text-secondary: var(--gray-700);
  --color-text-muted: var(--gray-500);
  --color-text-on-brand: var(--brand-white);
  --color-border: var(--gray-200);
  --color-border-strong: var(--gray-300);
  --color-brand: var(--brand-summit-blue);
  --color-brand-hover: var(--brand-deep-blue);
  --color-brand-subtle: #e6f0f6;
  --color-link: var(--brand-summit-blue);
  --color-link-hover: var(--brand-deep-blue);
  --color-info: var(--brand-accent-blue);
  --color-info-subtle: #eaf4fb;
  --color-success: var(--brand-accent-teal);
  --color-success-subtle: #e8f5f2;
  --color-warning: #8a5a00;
  --color-warning-subtle: #fff5d9;
  --color-danger: #a52b2b;
  --color-danger-subtle: #fcebea;
  --color-focus: #146da3;
  --color-overlay: rgb(0 53 89 / 0.56);

  /* Typography */
  --font-display: "Verb", Arial, sans-serif;
  --font-body: "Verb", Arial, sans-serif;
  --font-accent: "Merriweather", Georgia, serif;
  --font-mono: "IBM Plex Mono", "Courier New", monospace;
  --weight-light: 300;
  --weight-regular: 400;
  --weight-medium: 500;
  --weight-bold: 700;
  --weight-ultra: 800;

  /* Type scale */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-md: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.375rem;
  --text-2xl: 1.75rem;
  --text-3xl: 2.25rem;
  --text-4xl: 3rem;
  --leading-tight: 1.15;
  --leading-snug: 1.3;
  --leading-normal: 1.5;
  --leading-relaxed: 1.7;

  /* 8-point spacing rhythm */
  --space-0: 0;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;

  /* Shape, elevation, motion */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 999px;
  --shadow-sm: 0 1px 2px rgb(23 35 43 / 0.08);
  --shadow-md: 0 4px 12px rgb(23 35 43 / 0.12);
  --shadow-lg: 0 12px 32px rgb(23 35 43 / 0.16);
  --duration-fast: 120ms;
  --duration-base: 200ms;
  --duration-slow: 320ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-emphasized: cubic-bezier(0.2, 0.8, 0.2, 1);

  /* Layout */
  --content-max: 75rem;
  --gutter: clamp(1rem, 3vw, 3rem);
  --control-height: 2.75rem;
  --touch-target: 2.75rem;
  --focus-ring: 0 0 0 3px rgb(20 109 163 / 0.35);
}

[data-theme="dark"] {
  --color-bg: #101b22;
  --color-surface: #17262f;
  --color-surface-raised: #20343f;
  --color-surface-subtle: #263d49;
  --color-text: #f4f8fa;
  --color-text-secondary: #d3e0e6;
  --color-text-muted: #b2c3cb;
  --color-border: #405762;
  --color-border-strong: #637983;
  --color-brand: #69add2;
  --color-brand-hover: #9bcbe4;
  --color-brand-subtle: #173b51;
  --color-link: #9bcbe4;
  --color-link-hover: #d5edf8;
  --color-info: #8bc5e5;
  --color-success: #70c7b6;
  --color-warning: #f0c66e;
  --color-danger: #f08d8d;
  --color-focus: #9bcbe4;
}
```

### 4.2 JSON tokens

```json
{
  "$schema": "https://schemas.tokens.studio/tokens.schema.json",
  "color": {
    "brand": {
      "summitBlue": { "$value": "#004677", "$type": "color", "$description": "PMS 2187 digital approximation" },
      "summitGray": { "$value": "#7C878E", "$type": "color", "$description": "PMS 430 digital approximation" },
      "accentTeal": { "$value": "#06786A", "$type": "color" },
      "accentBlue": { "$value": "#3B8BC4", "$type": "color" },
      "deepBlue": { "$value": "#003559", "$type": "color" }
    },
    "semantic": {
      "background": { "$value": "{color.neutral.50}" },
      "surface": { "$value": "#FFFFFF" },
      "text": { "$value": "{color.neutral.900}" },
      "textSecondary": { "$value": "{color.neutral.700}" },
      "brand": { "$value": "{color.brand.summitBlue}" },
      "brandHover": { "$value": "{color.brand.deepBlue}" },
      "link": { "$value": "{color.brand.summitBlue}" },
      "focus": { "$value": "#146DA3" }
    },
    "neutral": {
      "50": { "$value": "#F7F9FA", "$type": "color" },
      "100": { "$value": "#EEF2F4", "$type": "color" },
      "200": { "$value": "#D9E1E5", "$type": "color" },
      "300": { "$value": "#C2CDD2", "$type": "color" },
      "500": { "$value": "#6B7880", "$type": "color" },
      "700": { "$value": "#34434D", "$type": "color" },
      "900": { "$value": "#17232B", "$type": "color" }
    }
  },
  "typography": {
    "fontFamily": {
      "body": { "$value": "Verb, Arial, sans-serif", "$type": "fontFamily" },
      "accent": { "$value": "Merriweather, Georgia, serif", "$type": "fontFamily" }
    },
    "size": {
      "xs": { "$value": "12px", "$type": "dimension" },
      "sm": { "$value": "14px", "$type": "dimension" },
      "md": { "$value": "16px", "$type": "dimension" },
      "lg": { "$value": "18px", "$type": "dimension" },
      "xl": { "$value": "22px", "$type": "dimension" },
      "2xl": { "$value": "28px", "$type": "dimension" },
      "3xl": { "$value": "36px", "$type": "dimension" },
      "4xl": { "$value": "48px", "$type": "dimension" }
    }
  },
  "spacing": {
    "1": { "$value": "4px", "$type": "dimension" },
    "2": { "$value": "8px", "$type": "dimension" },
    "3": { "$value": "12px", "$type": "dimension" },
    "4": { "$value": "16px", "$type": "dimension" },
    "6": { "$value": "24px", "$type": "dimension" },
    "8": { "$value": "32px", "$type": "dimension" },
    "12": { "$value": "48px", "$type": "dimension" }
  }
}
```

### 4.3 Tailwind configuration

```ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,ts,tsx,vue,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: 'var(--brand-summit-blue)',
          gray: 'var(--brand-summit-gray)',
          teal: 'var(--brand-accent-teal)',
          accent: 'var(--brand-accent-blue)',
          deep: 'var(--brand-deep-blue)'
        },
        surface: 'var(--color-surface)',
        canvas: 'var(--color-bg)',
        ink: 'var(--color-text)',
        muted: 'var(--color-text-muted)',
        border: 'var(--color-border)'
      },
      fontFamily: {
        sans: ['Verb', 'Arial', 'sans-serif'],
        accent: ['Merriweather', 'Georgia', 'serif'],
        mono: ['IBM Plex Mono', 'Courier New', 'monospace']
      },
      spacing: { 1: 'var(--space-1)', 2: 'var(--space-2)', 3: 'var(--space-3)', 4: 'var(--space-4)', 6: 'var(--space-6)', 8: 'var(--space-8)', 12: 'var(--space-12)' },
      borderRadius: { sm: 'var(--radius-sm)', md: 'var(--radius-md)', lg: 'var(--radius-lg)', full: 'var(--radius-full)' },
      boxShadow: { sm: 'var(--shadow-sm)', md: 'var(--shadow-md)', lg: 'var(--shadow-lg)' }
    }
  },
  plugins: []
} satisfies Config;
```

### 4.4 Figma Variables mapping

Create collections named `Brand`, `Semantic`, `Typography`, `Spacing`, and `Motion`. Primitive variables are hidden from product designers where possible; semantic variables are used in component properties and modes.

| Figma collection | Variable | CSS output | Manual source |
|---|---|---|---|
| Brand | `brand/summit-blue` | `--brand-summit-blue` | PMS 2187 / `#004677` |
| Brand | `brand/summit-gray` | `--brand-summit-gray` | PMS 430 / `#7C878E` |
| Brand | `brand/accent-teal` | `--brand-accent-teal` | `#06786A` |
| Brand | `brand/accent-blue` | `--brand-accent-blue` | `#3B8BC4` |
| Brand | `brand/deep-blue` | `--brand-deep-blue` | `#003559` |
| Semantic | `color/text/default` | `--color-text` | Web extension |
| Semantic | `color/action/primary` | `--color-brand` | Brand blue |
| Semantic | `color/focus/ring` | `--color-focus` | Web extension |
| Typography | `font/body` | `--font-body` | Verb; Arial fallback in manual |
| Typography | `font/accent` | `--font-accent` | Merriweather |
| Spacing | `space/1` through `space/12` | `--space-*` | Web 8-point system |

Figma modes: `Light`, `Dark`, and `High Contrast`. Every component must reference semantic variables rather than direct color literals.

## 5. Type scale system

**Brand requirement:** Verb is the primary font for headlines, subheads, and body copy in print and on screen. Merriweather is the accent font for specialty items and callouts. If restricted to system fonts, Arial is an acceptable option.

| Role | Desktop | Mobile | Weight | Leading | Font |
|---|---:|---:|---:|---:|---|
| Display | 48px | 36px | Ultra/Bold | 1.1 | Verb |
| H1 | 36px | 30px | Bold | 1.15 | Verb |
| H2 | 28px | 24px | Bold | 1.2 | Verb |
| H3 | 22px | 20px | Bold | 1.25 | Verb |
| H4 | 18px | 18px | Bold | 1.3 | Verb |
| Body large | 18px | 17px | Regular | 1.5 | Verb |
| Body | 16px | 16px | Regular | 1.5 | Verb |
| Body small | 14px | 14px | Regular | 1.5 | Verb |
| Label | 12px | 12px | Bold | 1.3 | Verb |
| Caption | 12px | 12px | Regular | 1.4 | Verb |
| Callout | 18px | 17px | Regular/Bold | 1.5 | Merriweather |

Rules: use one expressive display treatment per view; avoid all-caps paragraphs; use sentence case for controls; use uppercase only for short labels and approved lockups; never encode hierarchy with weight alone.

## 6. Responsive grid specifications

Use a mobile-first, fluid grid with a maximum content width of `1200px`. Use a 4px/8px rhythm for spacing and never allow text measure above approximately 75 characters for long-form content.

| Viewport | Columns | Gutter | Max content | Recommended layout |
|---|---:|---:|---:|---|
| 0–479px | 4 | 16px | 100% | Single column; horizontal overflow prohibited |
| 480–767px | 4 | 20px | 100% | Single column; optional two-up cards |
| 768–1023px | 8 | 24px | 100% | Two-column detail and filter layouts |
| 1024–1279px | 12 | 32px | 1160px | Full application shell and dashboard layouts |
| 1280px+ | 12 | 40px | 1200px | Centered content; expanded data regions |

- Columns use `minmax(0, 1fr)` to prevent accidental overflow.
- Use container queries for reusable components where supported.
- Preserve reading order when columns collapse.
- Data tables may scroll within their own region only when no accessible alternative exists; never make the entire page horizontally scroll.
- Fixed navigation, banners, and dialogs must account for safe areas and browser zoom.

## 7. Component standards

All components require semantic HTML, keyboard support, visible focus, disabled and loading states where applicable, responsive behavior, accessible names, and token-based styling.

| # | Component | Standard |
|---:|---|---|
| 1 | Alert | Short title, clear severity, dismiss only when safe, live-region behavior for dynamic alerts |
| 2 | Alert dialog | Requires explicit action, focus trap, labelled title, destructive action last |
| 3 | Avatar | Image alt or initials fallback; never rely on color alone |
| 4 | Badge | Short status/category only; not a paragraph or sole error signal |
| 5 | Breadcrumbs | `nav` landmark, ordered links, current page announced |
| 6 | Button | Native button, verb-first label, minimum 44×44px target |
| 7 | Button group | Related actions grouped; one primary action per context |
| 8 | Calendar | Keyboard grid, selected date, min/max, localized formatting |
| 9 | Card | Clear heading, predictable padding, no clickable card without named control |
| 10 | Carousel | Pause/previous/next controls; no autoplay by default |
| 11 | Checkbox | Label, mixed state support, group legend when related |
| 12 | Chip | Removable control has accessible name and undo-safe behavior |
| 13 | Combobox | Input, listbox, active option, keyboard and screen-reader announcements |
| 14 | Command palette | Dialog semantics, search label, escape handling, grouped results |
| 15 | Confirmation | Explain consequence, preserve cancel, do not use for routine actions |
| 16 | Context menu | Menu button, arrow-key navigation, escape and outside-click behavior |
| 17 | Date input | Format hint, parsing errors, keyboard entry, locale-safe storage |
| 18 | Date range picker | Start/end relationship, invalid range message, mobile alternative |
| 19 | Data table | Caption, headers, sort state, row/column scope, responsive strategy |
| 20 | Dialog | Labelled, focus managed, inert background, escape policy documented |
| 21 | Divider | Decorative unless announced; never replace structural headings |
| 22 | Drawer | Named region, focus management, close control, responsive full-screen mode |
| 23 | Dropdown menu | Menu semantics; do not use for form selection |
| 24 | Empty state | Explain why empty, give a relevant next action, no blame |
| 25 | File upload | Accepted formats, size limits, progress, cancellation, errors |
| 26 | Form | Native submission semantics, grouped fields, summary and inline errors |
| 27 | Hover card | Never contain essential information unavailable by keyboard or touch |
| 28 | Icon button | Visible tooltip where needed, accessible label, 44×44px hit target |
| 29 | Link | Describes destination; distinguish visited/current states accessibly |
| 30 | List | Correct list semantics; preserve order and scanability |
| 31 | Loading indicator | Announces status when meaningful; determinate progress where possible |
| 32 | Menu | Correct `menuitem` model only for application menus; otherwise use nav/list |
| 33 | Notification/toast | Non-blocking, pause timeout on hover/focus, persistent alternative for critical messages |
| 34 | Pagination | Current page, total context, disabled boundaries, keyboard access |
| 35 | Popover | Anchored, dismissible, focus behavior matched to content |
| 36 | Progress | Label, value, min/max, text alternative for meaningful progress |
| 37 | Radio group | Fieldset and legend, one selected value, arrow-key navigation |
| 38 | Search | Label, submit behavior, clear control, no destructive implicit action |
| 39 | Select | Native select preferred for simple choices; searchable alternative for long lists |
| 40 | Side navigation | Landmarks, current item, collapsed accessible labels, responsive drawer |
| 41 | Skeleton | Match final geometry; never replace content indefinitely |
| 42 | Slider | Label, value, keyboard increments, non-pointer alternative |
| 43 | Snackbar | Brief confirmation only; do not hide critical errors |
| 44 | Spinner | Use sparingly; pair with status text for longer waits |
| 45 | Stepper | Announces current, completed, and unavailable steps |
| 46 | Switch | Use only for immediate on/off settings; label resulting state |
| 47 | Tabs | Correct tab/tabpanel linkage, keyboard model, responsive overflow strategy |
| 48 | Tag | Informational classification; do not use as the only control |
| 49 | Textarea | Visible label, character guidance, resize without loss |
| 50 | Text input | Label, autocomplete, input mode, error and hint association |
| 51 | Timeline | Ordered events, dates, status text, accessible linear reading order |
| 52 | Tooltip | Supplemental only, keyboard reachable, no essential content |
| 53 | Tree | Correct hierarchy and keyboard navigation; disclose loading state |
| 54 | Wizard | Step summary, recoverable progress, validation at useful boundaries |

## 8. Framework standards

### 8.1 React

- Use function components, TypeScript, semantic HTML, and composition.
- Keep server/client boundaries explicit; never expose secrets in client bundles.
- Use stable keys from domain IDs, not array indexes for mutable lists.
- Prefer controlled form primitives with schema validation for complex workflows.
- Keep tokens in CSS variables or the shared package; do not hardcode brand colors in JSX.
- Use `aria-*` only to supplement correct native semantics.
- Memoize only measured hot paths; avoid premature memoization.
- Test keyboard behavior and loading/error states as first-class UI behavior.

### 8.2 Angular

- Use standalone components, strict TypeScript, signals for local reactive state, and injected services for shared state.
- Prefer `ChangeDetectionStrategy.OnPush` and track lists by stable domain IDs.
- Use Angular Router guards and resolvers for access and data dependencies; enforce authorization server-side.
- Use reactive forms for non-trivial forms and typed controls where available.
- Keep templates declarative; move transformation and business rules into typed services or computed state.
- Use Angular CDK primitives for overlays, focus management, and keyboard interaction where appropriate.
- Keep brand tokens in global SCSS/CSS variables and component styles token-based.
- Verify production budgets in `angular.json` and avoid importing large libraries for small utilities.

### 8.3 Vue

- Use Vue 3 Composition API with `<script setup lang="ts">`.
- Keep reusable behavior in composables and visual primitives in components.
- Use `defineProps` and `defineEmits` with explicit types.
- Prefer native controls and semantic templates over generic clickable containers.
- Use stable keys and avoid watchers for derivable state.
- Keep CSS variables as the theme contract; do not couple components to page-specific hex values.
- Test SSR/hydration boundaries if using Nuxt and do not access browser APIs during server render.

### 8.4 Storybook

- Every component has a default story, meaningful variants, disabled/loading/error stories, and responsive examples where relevant.
- Use Controls for user-facing props and Actions for emitted events.
- Add accessibility testing with `@storybook/addon-a11y` and fail CI on critical violations.
- Use interaction tests for keyboard navigation, validation, open/close, and async states.
- Keep stories deterministic and free of production credentials or customer data.
- Document token usage, do/don’t guidance, content constraints, and ownership in component docs.
- Test light, dark, and high-contrast modes.

## 9. WCAG 2.2 AA/AAA guidance

### 9.1 Required baseline: WCAG 2.2 AA

- Text contrast: **4.5:1** for normal text and **3:1** for large text.
- Non-text contrast: **3:1** for essential UI boundaries, controls, and graphical information.
- Keyboard: all functionality operable without a pointer; no keyboard trap.
- Focus: visible, not obscured, and at least 2 CSS px equivalent area with sufficient contrast where applicable.
- Target size: at least **24×24 CSS px** minimum under WCAG 2.2, with **44×44px** Summit product target for primary controls.
- Reflow: usable at 320 CSS px width without two-dimensional scrolling except content requiring comparison such as data tables.
- Text resize: usable at 200% without loss of content or function.
- Status messages: programmatically exposed without stealing focus.
- Error identification: identify the field, problem, and correction.
- Authentication: do not require a cognitive function test when an accessible alternative is possible.

### 9.2 AAA target where practical

Target AAA for core public content, help content, authentication guidance, and critical workflows: 7:1 normal text, 4.5:1 large text, enhanced contrast, simpler language, longer time limits, and redundant instructions. AAA is not a universal conformance claim; document exceptions and business constraints.

### 9.3 Accessibility implementation rules

- Use semantic landmarks: `header`, `nav`, `main`, `aside`, `footer`.
- Maintain logical focus order and a skip link.
- Provide captions/transcripts for media and meaningful alternatives for imagery.
- Never use placeholder text as the only label.
- Pair icons with visible text or accessible names; do not use emoji as structural icons.
- Respect `prefers-reduced-motion`, forced colors, increased contrast, zoom, and text spacing.

## 10. Content design standards

- Use sentence case, short paragraphs, descriptive headings, and one clear action per region.
- Put the most important information first; use progressive disclosure for detail.
- Use “you” and “we” appropriately; avoid blame and unexplained internal terminology.
- Use consistent terms for task, claim, policy, client, consultant, manager, and status.
- Dates: use a locale-aware readable format in user-facing content; retain ISO 8601 for APIs and machine data.
- Currency: show currency symbol and localized formatting; never rely on color for financial status.
- Provide examples and input formats before errors occur.
- Button labels describe the result: `Save changes`, `Download report`, `Assign consultant`.
- Empty, loading, and error copy must state what happened and what the user can do next.
- Legal, privacy, coverage, and claims language requires subject-matter approval.

## 11. SEO standards

- One unique, accurate `<title>` and one descriptive H1 per indexable page.
- Use semantic headings in order; do not style headings solely by visual size.
- Use canonical URLs, XML sitemaps, robots rules, Open Graph metadata, and structured data where applicable.
- Include descriptive metadata and social preview images using approved brand assets.
- Provide meaningful alt text; decorative imagery uses empty alt text.
- Public content must render meaningful text without client-side interaction where SEO requires it.
- Use clean URLs, redirects for changed routes, and noindex for authenticated, duplicate, or sensitive pages.
- Do not expose client names, claims data, policy data, or internal search content to crawlers.
- Monitor Core Web Vitals: LCP, INP, and CLS.

## 12. Analytics standards

- Define an event taxonomy before implementation: `object_action`, for example `task_filter_applied`.
- Required event fields: event name, timestamp, route, anonymous session ID, product area, and schema version.
- Never collect claim details, policy numbers, names, addresses, email addresses, free-text notes, authentication secrets, or other sensitive data in analytics.
- Obtain consent where required; honor opt-out, Global Privacy Control, and retention policies.
- Track business outcomes, not surveillance: task completion, successful search, filter use, form completion, errors, and accessibility mode usage.
- Document owner, purpose, payload, destination, retention, and privacy classification for every event.
- Version schemas and test analytics in CI to prevent accidental PII regression.

## 13. Data visualization standards

- Select the simplest chart that answers the question: line for trend, bar for comparison, stacked bar for composition, table for exact values, funnel for sequential conversion, map only for geographic decisions.
- Use Summit Blue as the primary series; use approved teal and accent blue for supporting series.
- Reserve red, amber, and green for semantic meaning; never use a rainbow palette.
- Provide titles, units, source/date context, legends, annotations, and a table or text alternative.
- Use patterns, labels, or symbols in addition to color.
- Maintain readable labels at 200% zoom and on small screens; allow horizontal scrolling inside a chart/table region only when necessary.
- Do not use 3D effects, decorative gradients, misleading truncated axes, or dual axes without strong justification.
- Define empty, partial, stale, unavailable, and failed-data states.

## 14. Motion design standards

- Motion communicates state, hierarchy, continuity, and cause/effect; it is never required to understand or operate the product.
- Default durations: fast `120ms`, base `200ms`, slow `320ms`.
- Use transform and opacity for performant transitions; avoid animating layout-heavy properties.
- Entering content may be slightly slower than exiting content; never delay primary task completion.
- Respect `prefers-reduced-motion: reduce` by removing non-essential motion and preserving state changes.
- Do not use flashing content, parallax that harms readability, or continuous animation without pause controls.
- Keep focus and screen-reader announcements independent of animation completion.

## 15. Form standards

- Use one visible label per field and a concise hint only when it prevents error.
- Preserve user input after validation errors and network failures.
- Validate on submit and, where useful, after blur; do not interrupt users on every keystroke.
- Associate errors with fields and provide a summary for multi-field forms.
- Use `autocomplete`, `inputmode`, `type`, `min`, `max`, and `required` accurately.
- Never disable paste in password or identity fields.
- Explain required versus optional fields once per form.
- Avoid asking for information already available; support correction and review before irreversible submission.
- For destructive actions, state the consequence and provide a recoverable path when possible.

## 16. Navigation standards

- Use a persistent global shell for authenticated products and a simplified header for public journeys.
- Show current location with text and programmatic state; do not rely only on color or bold.
- Keep primary navigation to the most important destinations; move secondary actions into contextual navigation.
- Support keyboard traversal, skip links, browser back, deep links, refresh, and direct route access.
- On mobile, collapse navigation into an explicitly labelled menu or drawer; preserve current location.
- Avoid hidden navigation, ambiguous icons, and links that open new windows without warning.
- Breadcrumbs are useful for nested enterprise workflows but do not replace global navigation.

## 17. Authentication screens

Required screens: sign in, password reset request, password reset completion, invitation acceptance, MFA challenge, session timeout, access denied, and account recovery/help.

- Use the approved full-color or reverse logo with clear space.
- Provide visible labels, password visibility control, autocomplete attributes, and keyboard-first operation.
- Do not reveal whether an email/account exists in reset flows; use neutral confirmation copy.
- Never log passwords, tokens, MFA codes, or recovery answers.
- Make MFA alternatives and recovery support accessible without weakening security.
- Explain timeout and preserve safe, non-sensitive form state where policy permits.
- Do not use CAPTCHA as the only path; provide an accessible alternative.

## 18. Dashboard patterns

- Start with a page title, scope/date context, and one primary action.
- Put high-value summary metrics first, then trends, exceptions, and detail.
- Every metric needs a label, value, time range, comparison context, and definition where ambiguity is possible.
- Use consistent card anatomy: heading, value/content, context, action.
- Keep dashboards scannable; do not turn every metric into a chart.
- Provide filter state in the URL when a view is shareable and preserve user-selected filters when safe.
- Define loading, partial data, no data, error, stale data, and permission-limited states.
- Ensure all dashboard content is reachable in a linear mobile order.

## 19. Error, empty, and loading states

### Error states

State what failed, whether data was saved, what the user can do next, and how to get help. Use inline errors for field issues, a page-level message for failed regions, and a full error page only when the route cannot render. Include a retry action only when retry can plausibly succeed.

### Empty states

Differentiate first-use empty, filtered empty, permission empty, completed empty, and unavailable data. Explain the state in one sentence and provide the most relevant next action; do not display a dead end or fake metrics.

### Loading states

Use skeletons when the final layout is known, spinners for short indeterminate actions, and determinate progress for uploads/exports. Preserve layout dimensions to prevent CLS. Announce meaningful waits and allow cancellation for long-running work.

## 20. Dark mode

- Dark mode is a semantic theme, not a color inversion.
- Preserve Summit identity through brand roles, using lighter accessible tints of Summit Blue for text/actions when required.
- Use layered dark surfaces rather than pure black; maintain visible borders and focus states.
- Re-test every text, icon, chart, image, logo, status, and disabled pairing in dark mode.
- Use the reverse logo on dark brand surfaces when the full-color master does not pass contrast.
- Respect system preference by default and provide an explicit user preference where product policy allows.
- Persist preference without blocking first paint; prevent theme flash where possible.

## 21. Email standards

- Use the approved full-color logo on light backgrounds and reverse logo on dark backgrounds.
- Use a table-based responsive layout with a 600–640px content width and a 16px minimum body size where clients permit.
- Inline critical CSS; provide plain-text multipart alternatives.
- Use descriptive preheaders, one primary CTA, and a visible unsubscribe/manage-preferences path.
- Avoid critical information in images; provide alt text and accessible link labels.
- Test Outlook, Gmail, Apple Mail, mobile clients, dark mode, zoom, and images-disabled rendering.
- Do not put sensitive claims, policy, or health information in subject lines or preview text.
- Track links with approved, privacy-reviewed parameters; never place PII in URLs.

## 22. Performance budgets

Budgets are production targets for a typical authenticated application route; public landing pages should target lower values where possible.

| Metric | Warning | Error/acceptance |
|---|---:|---:|
| Initial JavaScript | 250 KB gzip | 400 KB gzip |
| Initial CSS | 50 KB gzip | 100 KB gzip |
| Largest Contentful Paint | 2.0s | 2.5s |
| Interaction to Next Paint | 150ms | 200ms |
| Cumulative Layout Shift | 0.05 | 0.1 |
| First Contentful Paint | 1.5s | 2.0s |
| Long task | 100ms | 200ms |
| Image transfer | 150 KB/page | 300 KB/page |
| Third-party scripts | 100 KB gzip | 200 KB gzip |

Use responsive images, SVG icons, font subsetting, lazy loading below the fold, route-level code splitting, caching, compression, and performance regression checks in CI.

## 23. Security requirements

- Enforce authorization and tenant/role scoping at the API; UI hiding is not security.
- Use secure, HttpOnly, SameSite cookies where appropriate; never store long-lived secrets in localStorage.
- Enforce TLS, HSTS, secure headers, CSP, frame protections, and safe referrer policy.
- Protect against XSS, CSRF, injection, SSRF, open redirects, clickjacking, and insecure direct object references.
- Validate and encode untrusted input on the server and client; sanitize rich text with an approved library.
- Apply least privilege, MFA for privileged access, rate limiting, audit logging, and session revocation.
- Classify and minimize personal, claims, policy, financial, and health-related data.
- Redact sensitive data from logs, analytics, URLs, screenshots, test fixtures, and error messages.
- Pin and scan dependencies, review licenses, sign builds where required, and remediate critical vulnerabilities before release.

## 24. Enterprise architecture guidance

- Separate presentation, domain, application, and infrastructure concerns.
- Define API contracts with versioning, typed schemas, correlation IDs, consistent errors, pagination, filtering, and idempotency where relevant.
- Use centralized identity, authorization policy, feature flags, configuration, observability, and audit services.
- Prefer modular feature boundaries and shared design-system packages over global utility sprawl.
- Design for retries, timeouts, partial failures, offline/poor-network behavior, and graceful degradation.
- Keep customer/tenant boundaries explicit in every read, write, cache key, export, and event.
- Document data ownership, retention, residency, backup, recovery objectives, and integration dependencies.

## 25. CI/CD requirements

Every pull request must run:

- Type checking and production build.
- Unit, component, interaction, and critical end-to-end tests.
- Linting, formatting, dependency and secret scanning.
- Accessibility automation with representative keyboard and screen-reader assertions.
- Visual regression checks for Storybook and critical routes.
- Token validation preventing unapproved hardcoded brand values.
- Performance budget checks and bundle-diff reporting.
- License and supply-chain checks.

Release gates require approval from code owners, passing security and accessibility checks, a rollback plan, migration compatibility, feature-flag strategy, and post-release monitoring. Use immutable artifacts, environment promotion, signed provenance where available, and zero-downtime deployment patterns for customer-facing systems.

## 26. Accessibility testing procedures

1. Test keyboard-only navigation from page load through every primary workflow.
2. Test with NVDA/Chrome and VoiceOver/Safari; include TalkBack/Android for mobile-critical flows.
3. Run automated checks with axe or equivalent, but do not treat automation as complete conformance.
4. Verify headings, landmarks, accessible names, focus order, focus visibility, dialogs, menus, tables, live regions, and validation messages.
5. Test 200% zoom, 400% zoom where practical, 320px reflow, landscape, forced colors, high contrast, and reduced motion.
6. Test light/dark themes and approved brand pairings using a contrast analyzer.
7. Test touch targets, pointer cancellation, drag alternatives, timeout extensions, and error recovery.
8. Include users with disabilities in moderated usability research for critical journeys.
9. Record criterion, severity, reproduction steps, affected component, owner, and remediation date.
10. Re-test fixed findings and retain evidence with the release record.

## 27. Browser support matrix

| Browser/platform | Support | Notes |
|---|---|---|
| Chrome current and previous major | Full | Primary automated coverage |
| Edge current and previous major | Full | Chromium parity expected |
| Firefox current and previous major | Full | Verify form, focus, and layout behavior |
| Safari current and previous major | Full | Required for macOS/iOS public journeys |
| iOS Safari current and previous major | Full | Test viewport, keyboard, safe areas, and file inputs |
| Android Chrome current and previous major | Full | Test touch, zoom, and assistive technology |
| Samsung Internet current major | Best effort | Verify critical workflows |
| Internet Explorer 11 | Not supported | Do not add compatibility code |
| Embedded legacy webviews | Case-by-case | Security and feature baseline required |

Support means the current design, accessibility, security, and critical workflows function as specified. A browser exception requires documented business approval.

## 28. Governance model

### Roles

| Role | Responsibility |
|---|---|
| Marketing/Brand owner | Approves identity, logo, colors, typography, voice, and external applications |
| Product design | Owns patterns, Figma library, research, and component behavior |
| Design system engineering | Owns tokens, component packages, Storybook, and releases |
| Product engineering | Implements features and meets framework/performance standards |
| Accessibility lead | Defines test strategy, reviews exceptions, and tracks conformance |
| Security/privacy | Reviews data, auth, telemetry, threats, and release risks |
| Product owner | Approves business behavior, content, and prioritization |

### Change control

- Patch: typo, metadata, or non-visual clarification; one owner approval.
- Minor: new component variant, token, or guidance; design-system and engineering review.
- Major: logo, brand color, type family, voice, architecture, or accessibility baseline change; Marketing, Product, Accessibility, Security, and Engineering approval.
- Every release records version, owner, decision, affected products, migration notes, and deprecation date.

## 29. Design review checklist

- [ ] Approved Summit logo asset and correct variation used.
- [ ] Logo proportions, clear space, marks, and minimum size preserved.
- [ ] Brand colors match the manual and remain within the 25% accent guidance.
- [ ] Verb/Merriweather roles and fallback behavior are correct.
- [ ] Hierarchy, grid, spacing, density, and responsive collapse are intentional.
- [ ] Component states include hover, focus, active, disabled, loading, error, empty, and permission variants as relevant.
- [ ] Content is clear, specific, inclusive, and approved where regulated.
- [ ] Color is not the sole means of communicating meaning.
- [ ] Light, dark, zoom, reduced-motion, and high-contrast states reviewed.
- [ ] Data visualizations have labels, units, source context, and alternatives.
- [ ] Design file uses semantic Figma variables and documents exceptions.

## 30. Development review checklist

- [ ] Semantic HTML and correct native controls used.
- [ ] Tokens used instead of hardcoded brand values.
- [ ] Accessible names, roles, states, descriptions, and focus behavior verified.
- [ ] Keyboard-only and screen-reader paths work.
- [ ] Loading, error, empty, offline, permission, and retry states implemented.
- [ ] Responsive behavior tested at supported breakpoints and browser zoom.
- [ ] No sensitive data in client logs, analytics, URLs, test data, or errors.
- [ ] Authorization enforced by the server and tenant boundaries verified.
- [ ] Performance budgets, bundle size, and Core Web Vitals checked.
- [ ] Unit, interaction, visual, accessibility, and end-to-end tests pass.
- [ ] Storybook stories, changelog, migration notes, and ownership updated.
- [ ] CI security, dependency, secret, license, and provenance checks pass.

## 31. Brand compliance matrix

| Area | Required standard | Evidence | Owner |
|---|---|---|---|
| Logo | Approved master/approved exception only | Asset link and visual review | Marketing |
| Symbol | Design element only; full logo also present externally | Design review | Marketing |
| Color | Manual values; semantic token usage; contrast verified | Token diff and contrast report | Design system |
| Typography | Verb primary; Merriweather accent; Arial fallback if restricted | Figma/code review | Design |
| Composition | Accents/monochromes generally ≤25% of canvas | Visual review | Design |
| Voice | Clear, expert, human, plain language | Content review | Content owner |
| Accessibility | WCAG 2.2 AA baseline; AAA where designated | Automated + manual evidence | Accessibility |
| Privacy | Consent, minimization, no sensitive analytics | Data review | Privacy |
| Security | Threat model and secure implementation | Security gate | Security |
| Performance | Budgets and Core Web Vitals targets met | CI report | Engineering |
| Responsive | Supported matrix and reflow tested | Browser evidence | Engineering |
| Email | Logo, contrast, multipart, unsubscribe, client tests | Campaign QA | Marketing |
| Release | Approvals, rollback, monitoring, version record | Release record | Product |

## 32. Decision log and open items

- Confirm the licensed web delivery method and available weights for Verb.
- Confirm whether the tagline must remain in every authenticated application header.
- Obtain the official digital logo package, clear-space measurement, and minimum-size specifications from Marketing.
- Validate the supplied print color conversions against the approved digital asset package and production display profiles.
- Confirm product data classifications, retention, analytics consent requirements, and regional obligations.
- Confirm the supported enterprise browser baseline for customer deployments.

## 33. Source and maintenance

This document records the attached brand manual as the visual source of truth and adds web implementation guidance. When the official brand manual or approved digital asset package changes, update the Brand sections first, then review tokens, Figma variables, framework adapters, Storybook, templates, email assets, and compliance evidence. Do not silently reinterpret or redraw the Summit identity.

