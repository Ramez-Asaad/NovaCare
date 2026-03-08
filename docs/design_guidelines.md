# NovaCare — Design Guidelines

> **Version:** 1.0 · **Last Updated:** March 8, 2026
> Extracted from the existing codebase. All values reference `tailwind.config.ts` and `globals.css`.

---

## 1. Color Palette

All colors are defined in `tailwind.config.ts` with 50–900 shade scales.

### Brand Colors

| Role | Name | Default | Usage |
|------|------|---------|-------|
| **Primary** | Deep Teal | `#0f766e` (700) | Buttons, active nav, links, focus rings, branding |
| **Secondary** | Peach/Warm Orange | `#fb923c` (400) | Warnings, secondary actions, navigation accent |
| **Accent** | Rose | `#f43f5e` (500) | Danger/destructive actions, emergency UI, error states |
| **Success** | Sage Green | `#16a34a` (600) | Status online, confirmations, health indicators |

### Semantic Colors

```
primary-50  → info backgrounds      (e.g., tip banners, info badges)
secondary-50 → warning backgrounds   (e.g., warning alerts)
accent-50   → error/danger backgrounds
success-50  → success backgrounds

primary-700 → info text on light bg
secondary-700 → warning text
accent-700  → error text
success-700 → success text
```

### Neutrals

| Token | Hex | Usage |
|-------|-----|-------|
| `background-cream` | `#fafaf9` | Light mode page background |
| `background-light` | `#f5f5f4` | Subtle surface variation |
| `text-primary` | `#1f2937` | Headings, body text |
| `text-secondary` | `#334155` | Subheadings, nav labels |
| `text-muted` | `#64748b` | Captions, placeholders, timestamps |
| `text-light` | `#94a3b8` | Disabled text, subtle hints |

### Dark Mode

| Element | Light | Dark |
|---------|-------|------|
| Page background | `bg-background-cream` | `bg-gray-900` |
| Card / surface | `bg-white` | `bg-gray-800` |
| Borders | `border-gray-200` | `border-gray-700` |
| Dividers | `border-gray-100` | `border-gray-700` |
| Text primary | `text-text-primary` | `text-white` |
| Text secondary | `text-text-secondary` | `text-gray-300/400` |
| Hover backgrounds | `hover:bg-gray-100` | `hover:bg-gray-700` |

> **Rule:** Always pair light classes with their `dark:` equivalents.

### Gradients

Defined in `globals.css`:

| Class | Gradient | Usage |
|-------|----------|-------|
| `gradient-bg` | `#fafaf9 → #f0fdfa` (light) / `#111827 → #0f172a` (dark) | Page backgrounds |
| `gradient-primary` | `#0f766e → #14b8a6` | Buttons, feature cards, logo |
| `gradient-secondary` | `#fb923c → #f97316` | Accent cards |

Feature cards on the Rover dashboard also use inline gradients:
- `from-primary to-primary-600`, `from-purple-400 to-purple-600`, `from-secondary to-secondary-600`, `from-accent to-accent-600`, `from-success to-success-600`, `from-indigo-400 to-indigo-600`

---

## 2. Typography

### Fonts

| Font | Tailwind Token | Usage |
|------|---------------|-------|
| **Inter** (300–700) | `font-sans` | Body text, labels, inputs, descriptions |
| **Plus Jakarta Sans** (500–800) | `font-display` | Headings, card titles, feature labels, logo text |

Both loaded via Google Fonts in `globals.css`.

### Type Scale

| Element | Classes | Example |
|---------|---------|---------|
| Page heading | `text-4xl font-display font-bold` | "Hello, Sarah! 👋" on Rover home |
| Section heading | `text-2xl font-display font-bold` | Feature card labels |
| Page title (header) | `text-xl font-display font-bold` | "Caring for Sarah" in Guardian |
| Card title | `text-lg font-display font-semibold` | CardTitle component |
| Modal title | `text-xl font-display font-semibold` | ModalHeader component |
| Body text | `text-base` (default) | Regular content |
| Supporting text | `text-sm text-text-muted` | Timestamps, descriptions |
| Label | `text-sm font-medium text-text-secondary` | Input labels |
| Badge | `text-xs font-medium` | Badge component |
| Tiny | `text-2xs` (custom: `0.625rem`) | Medical badge in sidebar |

---

## 3. Spacing & Layout

### Page Spacing

| Dashboard | Main padding | Max width |
|-----------|-------------|-----------|
| Rover | `p-8` | `max-w-5xl mx-auto` |
| Guardian | `p-4 lg:p-8` | Full width |
| Medical | `p-4 lg:p-8` | Full width |

### Content Spacing

| Pattern | Class |
|---------|-------|
| Section gap (vertical) | `space-y-8` |
| Grid gap | `gap-6` (feature cards), `gap-4` (status items) |
| Card internal padding | `p-6` (default), `p-4` (sm), `p-8` (lg) |
| Card header margin | `mb-4` |
| Card footer border | `mt-4 pt-4 border-t border-gray-100` |
| Nav item spacing | `space-y-1` |

### Grid Patterns

| Layout | Grid |
|--------|------|
| Rover feature cards | `grid-cols-2 md:grid-cols-3` |
| Rover status bar | `grid-cols-4` |
| Responsive generally | Mobile-first, `md:` and `lg:` breakpoints |

---

## 4. Border Radius

| Size | Class | Usage |
|------|-------|-------|
| Full round | `rounded-full` | Avatars, badges, status dots |
| Extra large | `rounded-3xl` | Rover feature cards |
| Large | `rounded-2xl` | Cards, buttons, nav items, inputs |
| Medium | `rounded-xl` | Inner elements, dropdowns, sidebar nav links |
| Small | `rounded-lg` | Close buttons, minor interactive elements |

> **Rule:** Default to `rounded-2xl` for containers and `rounded-xl` for inner elements.

---

## 5. Shadows

| Token | CSS | Usage |
|-------|-----|-------|
| `shadow-soft` | `0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)` | Rover cards, sidebar, status items |
| `shadow-card` | `0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)` | Default card style |
| `shadow-elevated` | `0 10px 40px -10px rgba(0,0,0,0.1)` | Elevated cards, modals, dropdowns |

---

## 6. Animations & Transitions

### CSS Transitions

Every interactive element uses `transition-all duration-200` or `transition-colors`.

### Custom Keyframe Animations

| Animation | Class | Usage |
|-----------|-------|-------|
| Fade in | `animate-fade-in` (0.3s) | Page content, dropdown menus |
| Slide up | `animate-slide-up` (0.4s) | Content entry from bottom |
| Slide down | `animate-slide-down` (0.3s) | Dropdown menus |
| Scale in | `animate-scale-in` (0.2s) | Toast notifications |
| Pulse | `animate-pulse` (2s infinite) | Online status dots |

### Framer Motion (Modals)

```
Entry:  { opacity: 0, scale: 0.95, y: 20 } → { opacity: 1, scale: 1, y: 0 }
Exit:   reverse, duration: 0.2s
Overlay: opacity 0 → 1, with backdrop-blur-sm
```

### Micro-interactions

| Interaction | Class |
|-------------|-------|
| Button press | `active:scale-[0.98]` |
| Rover button press | `active:scale-95` (stronger) |
| Feature card hover | `hover:scale-[1.02]` |
| Card hover shadow | `hover:shadow-elevated transition-shadow` |

---

## 7. Dashboard Layouts

### Rover (Primary User — Touchscreen)

```
┌─────────────────────────────────────┐
│ Status Bar (time, logo, battery)    │ ← header, bg-white, border-b
├─────────────────────────────────────┤
│                                     │
│          Content Area               │ ← p-8, max-w-5xl mx-auto
│       (large touch targets)         │
│                                     │
├─────────────────────────────────────┤
│ 🏠  💬  💊  🧭  ⚠️  ❤️  🎵  ⚙️  ❓  │ ← bottom nav, horizontal scroll
└─────────────────────────────────────┘
```

**Key patterns:**
- Bottom navigation bar with large touch targets (`min-w-[80px]`, `rounded-2xl`)
- Feature cards minimum height `200px`, gradient backgrounds
- Icon size: `w-7 h-7` in nav, `w-8 h-8` in feature cards, `w-16 h-16` icon containers
- Emergency button is always `accent` color (red)
- Status bar shows time, connection, battery

### Guardian (Caregiver — Desktop/Tablet)

```
┌──────────┬──────────────────────────┐
│ Sidebar  │  Sticky Header           │ ← bg-white/80 backdrop-blur-md
│ w-64     │  (title, notifications)  │
│          ├──────────────────────────┤
│ Logo     │                          │
│ Patient  │    Content Area          │ ← p-4 lg:p-8
│ Nav      │                          │
│ Logout   │                          │
└──────────┴──────────────────────────┘
```

**Key patterns:**
- Sidebar fixed `w-64`, slides in on mobile (`-translate-x-full`)
- Sticky header with `backdrop-blur-md` and `bg-white/80`
- Patient card: `bg-primary-50 rounded-xl` with Avatar + status
- Active nav: `bg-primary text-white`
- Profile dropdown: `rounded-xl shadow-elevated animate-fade-in`

### Medical (Doctor — Desktop/Tablet)

Same layout as Guardian with two additions:
- **Patient selector** dropdown in sidebar (multiple patients)
- **Doctor badge** in header: `Avatar + name + specialty`

---

## 8. Component API Summary

All components live in `src/components/ui/` and use `cn()` for class merging.

| Component | Variants | Sizes |
|-----------|----------|-------|
| **Button** | `primary`, `secondary`, `outline`, `danger`, `ghost` | `sm`, `md`, `lg`, `xl` |
| **Card** | `default`, `elevated`, `outline` | Padding: `none`, `sm`, `md`, `lg` |
| **Modal** | — | `sm`, `md`, `lg`, `xl`, `full` |
| **Input** | — (states: `error`, `success`) | — |
| **Badge** | `default`, `success`, `warning`, `danger`, `info` | `sm`, `md` |
| **Alert** | `success`, `warning`, `error`, `info` | — |
| **Avatar** | — | `sm`, `md`, `lg`, `xl` |
| **ProgressBar** | `primary`, `success`, `warning`, `danger` | `sm`, `md`, `lg` |
| **ThemeToggle** | `icon`, `buttons`, `dropdown` | — |

### Component Composition Rules

- **Card** uses sub-components: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- **Modal** uses sub-components: `ModalHeader`, `ModalBody`, `ModalFooter`
- All components accept `className` for overrides via `cn()` merging
- Components use Lucide React icons exclusively

---

## 9. Icons

- **Library:** [Lucide React](https://lucide.dev/) — used exclusively throughout
- **Sizes:**
  - Navigation: `w-5 h-5` (sidebar), `w-7 h-7` (rover bottom nav)
  - Feature cards: `w-8 h-8` inside `w-16 h-16` containers
  - Header/actions: `w-5 h-5` to `w-6 h-6`
  - Inline: `w-4 h-4`
- **Color:** Inherit from parent text color, or use semantic tokens (`text-primary`, `text-accent`, etc.)

---

## 10. Dark Mode Strategy

- **Method:** Class-based (`darkMode: "class"` in Tailwind config)
- **Provider:** Custom `ThemeProvider` in `src/components/ThemeProvider.tsx`
- **Modes:** Light, Dark, System (OS preference detection)
- **Persistence:** `localStorage` key: `novacare-theme`
- **Flash prevention:** Content hidden until theme is resolved (`visibility: hidden`)
- **Transition:** `transition-colors duration-300` on body

### Dark Mode Patterns

```tsx
// ✅ Correct: always pair light + dark
className="bg-white dark:bg-gray-800 text-text-primary dark:text-white border-gray-200 dark:border-gray-700"

// ✅ Correct: semi-transparent dark backgrounds for colored surfaces
className="bg-primary-50 dark:bg-primary-900/30"
className="bg-success-50 dark:bg-success-900/30"

// ❌ Wrong: missing dark variant
className="bg-white text-text-primary"
```

---

## 11. Accessibility Principles

| Principle | Implementation |
|-----------|---------------|
| **Large touch targets** | Rover buttons: `min-w-[80px] min-h-[80px]`; standard buttons: `py-3 px-6` |
| **Focus indicators** | `focus:ring-2 focus:ring-primary/20 focus:ring-offset-2` on all buttons/inputs |
| **Keyboard navigation** | Buttons use native `<button>` elements with proper `disabled` states |
| **Screen reader support** | `aria-label` on icon-only buttons (e.g., ThemeToggle) |
| **Color contrast** | Semantic text tokens match WCAG AA against their backgrounds |
| **Multimodal feedback** | Visual + audio output on rover (STT/TTS integration) |
| **Error visibility** | Red border + icon + text message on Input error state |

---

## 12. Quick Reference — Do's and Don'ts

### ✅ Do

- Use the existing component library (`@/components/ui`) — don't create ad hoc elements
- Use `cn()` from `@/lib/utils` for merging Tailwind classes
- Use the design tokens from `tailwind.config.ts` for colors — never hardcode hex values inline
- Pair every light class with its `dark:` counterpart
- Use `rounded-2xl` for containers, `rounded-xl` for inner elements
- Use `transition-all duration-200` on interactive elements
- Use `font-display` (Plus Jakarta Sans) for headings
- Use Lucide React for all icons

### ❌ Don't

- Don't use raw hex colors — use `text-primary`, `bg-accent-50`, etc.
- Don't use `border-radius` CSS — use Tailwind's `rounded-*` utilities
- Don't create new button styles — use the `Button` component with variants
- Don't use different icon libraries — stick to Lucide React
- Don't use `className="..."` without `cn()` when composing classes
- Don't forget dark mode — every new surface/text needs a dark variant
- Don't use inline styles unless truly dynamic (e.g., progress bar width)
