@AGENTS.md
# Cycle — Agent Context

## Project Overview
Cycle is a self-awareness app for understanding why habits break, not just tracking whether they happen. It is a journal, not a dashboard. The tone is private, honest, intimate. Think 2am, not productivity tool.

## Tech Stack
- Next.js (App Router, TypeScript)
- Tailwind CSS
- shadcn/ui
- Supabase (auth + database)

## Design System

### Colors (CSS Variables — always use these, never hardcode hex)
```css
/* Dark Mode */
--background: #0F1117
--surface: #161B27
--surface-high: #1E2535
--text-primary: #E8EAF0
--text-secondary: #8B91A8
--border: #252D3D
--accent: #B08A9E         /* Dusty mauve — use SPARINGLY */
--accent-hover: #9A7389
--accent-subtle: rgba(176, 138, 158, 0.08)

/* Light Mode */
--background: #F4F5F8
--surface: #FFFFFF
--surface-high: #ECEEF3
--text-primary: #1A1F2E
--text-secondary: #6B7280
--border: #E2E4EC
--accent: #B08A9E
--accent-hover: #9A7389
--accent-subtle: rgba(176, 138, 158, 0.08)
```

### Accent Color Rule
The accent (`#B08A9E`) appears ONLY on:
- Graduate button and graduate screen
- Reversion moment feeling selector
- Monthly reflection prompt
- Active cycle status dot
Everywhere else uses neutral palette. This makes the accent feel meaningful.

### Typography
- Font: Plus Jakarta Sans
- H1: 28px, weight 600, tracking -0.02em
- H2: 20px, weight 600, tracking -0.01em
- H3: 16px, weight 600
- Body: 15px, weight 400, line-height 1.6
- Label: 13px, weight 500, uppercase, tracking 0.02em
- Micro: 12px, weight 400 (timestamps, metadata)

### Spacing
- Base unit: 4px, all spacing multiples of 4
- Page max-width: 720px, always centered
- Page horizontal padding: 24px mobile, 48px desktop
- Card padding: 24px
- Section spacing: 48px

### Layout Rules
- Single column ALWAYS. No sidebars, no multi-column.
- 720px max-width centered. Never expands on wide screens.
- No shadows in dark mode. Subtle shadow in light: `0 1px 3px rgba(0,0,0,0.06)`
- No borders for sectioning — use background color shifts (tonal layering)
- Cards: bg-surface, border-radius 12px
- No gradients except very subtle on primary button
- Fade transitions only: 150ms ease

### Copy Rules
- NEVER say: streak, failed, broke, missed, behind, should, quit
- ALWAYS say: cycle, paused, closed, graduated, fell apart, got harder
- No red or green for any emotional state
- Notifications are invitations, never reminders

---

## Folder Structure
```
src/
├── api/           # Supabase query functions (no hooks, no components)
├── components/    # Reusable UI components
├── hooks/         # One hook per file, prefixed with 'use'
├── types/         # TypeScript types (PascalCase)
├── layouts/       # Layout components
├── context/       # React context
├── pages/         # Next.js pages (app router)
├── services/      # Business logic
└── App.tsx
```

---

## Engineering Standards (NON-NEGOTIABLE)

### 1. No Barrel Files
Never create `index.ts` that re-exports multiple things.
```ts
// BAD
// components/index.ts
export { CycleCard } from './CycleCard'
export { CheckInSheet } from './CheckInSheet'

// GOOD
// Import directly from file
import { CycleCard } from '@/components/CycleCard'
```

### 2. No Supabase in Components
Never call Supabase client directly in a component.
Always: component → hook → api → supabase
```ts
// BAD — component calling supabase directly
const { data } = await supabase.from('cycles').select()

// GOOD
// api/cycles.ts
export async function getCycles(userId: string) {
  return supabase.from('cycles').select().eq('user_id', userId)
}

// hooks/useCycles.ts
export function useCycles() {
  // calls getCycles from api/cycles.ts
}

// components/Dashboard.tsx
const { cycles } = useCycles() // only the hook
```

### 3. One Hook Per File
Never put multiple hooks in the same file.
```ts
// BAD
// hooks/cycleHooks.ts
export function useCycles() {}
export function useCheckins() {}

// GOOD
// hooks/useCycles.ts
export function useCycles() {}

// hooks/useCheckins.ts
export function useCheckins() {}
```

### 4. Component Standards
- One React component per file
- Always use TSX syntax
- PascalCase filenames: `CycleCard.tsx`
- camelCase hook filenames: `useCycles.ts`
- Import from direct path, never barrel

### 5. Functional Component Ordering
1. useContext
2. useState / useReducer
3. Custom hooks
4. Variables / Constants
5. useCallback / useMemo
6. Functions
7. Handlers
8. useEffect
9. return

### 6. Naming
- Components: PascalCase (`CycleCard`)
- Hooks: camelCase with `use` prefix (`useCycles`)
- Types: PascalCase (`CycleStatus`)
- Functions: camelCase (`handleCheckIn`)
- API functions: camelCase (`getCycles`, `createCheckin`)

### 7. JSX Rules
- Double quotes for JSX props
- No space inside JSX curly braces: `bar={baz}` not `bar={ baz }`
- Self-close tags when no children: `<Foo />`
- Wrap multi-line JSX in parentheses

### 8. Conditional Rendering
```tsx
// BAD
{ isShow ? <SmallComponent /> : null }

// GOOD
{ isShow && <SmallComponent /> }
```

### 9. useCallback / useMemo
Use when:
- Passing function/variable as prop to child component
- Using as dependency in useEffect
- Function has high computational complexity

---

## Database Schema (Supabase)

```sql
users (id, created_at, onboarding_completed)

emotional_snapshots (
  id, user_id, created_at,
  home_stress int,     -- 1-5
  loneliness int,      -- 1-5
  energy int,          -- 1-5
  general_stress int,  -- 1-5
  context varchar      -- 'onboarding' | 'monthly' | 'reversion'
)

cycles (
  id, user_id, created_at,
  name text,
  why_now text,
  success_vision text,
  status varchar,              -- 'active' | 'paused' | 'graduated' | 'closed'
  ended_at timestamp,
  closing_context_tags text[],
  closing_note text,
  graduating_note text
)

checkins (
  id, cycle_id, user_id, created_at,
  did_the_thing varchar,  -- 'yes' | 'no' | 'partially'
  general_feeling int,    -- 1-5
  note text
)

reversion_events (
  id, cycle_id, user_id, created_at,
  declared_by varchar,    -- 'user' | 'app_nudge'
  unraveling varchar,     -- 'gradual' | 'specific_moment'
  feeling varchar,        -- 'relief' | 'shame' | 'numbness' | 'unknown' | 'other'
  context_tags text[],
  free_text text,
  outcome varchar         -- 'resumed' | 'paused' | 'graduated' | 'closed'
)

reflections (id, user_id, created_at, content)
```

---

## Routes
```
/                     → Landing / onboarding entry
/onboarding           → Onboarding flow
/dashboard            → Active cycles
/cycle/new            → Start new cycle
/cycle/[id]           → Individual cycle view + timeline
/cycle/[id]/checkin   → Daily check-in flow
/cycle/[id]/reversion → Reversion moment
/cycle/[id]/graduate  → Graduate flow
/cycle/[id]/close     → Close flow
/patterns             → Pattern view
/reflections          → Monthly reflections
/settings             → Account settings
```

---

## Key Component Contracts

### CycleCard
Props: `{ cycle: Cycle, onCheckIn: () => void }`
Shows: name, days active, last check-in, status dot
No progress bars, no percentages, no streak language

### CheckInSheet
Bottom sheet on mobile, modal on desktop
3 steps, one question at a time
Auto-advances on selection, no Next button

### ReversionFlow
Triggered by: user tapping "Things fell apart" OR app nudge after 3 days
Bottom sheet / modal
Steps: unraveling type → feeling → context tags → outcome choice

### WeatherScale
5 pill selectors in a row
Labels are words not numbers
Selected: accent subtle bg + accent border + accent text
Questions: energy, loneliness, home stress, general stress

### CycleStatus
active → small accent dot
paused → small secondary text dot  
graduated → small star icon, accent color
closed → no dot, text secondary color