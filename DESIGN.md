# Novelpedia Design System

> Blended from Airbnb (warmth, shadows, rounding) and Mintlify (content-first layout, readability, spacing).
> Brand accent: Coral Pink `#f43f5e`.

---

## 1. Visual Theme & Atmosphere

Novelpedia is a warm, reading-first wiki and review platform for novels and manga. The design balances the information density of a wiki with the inviting warmth of a content-discovery experience. The canvas is pure white (`#ffffff`) with a near-warm-black (`#1a1a1a`) text — not cold, not clinical. The singular brand accent, Coral Pink (`#f43f5e`), appears only on CTAs, active states, rating highlights, and hover moments — a spark of energy on an otherwise calm page.

Typography runs entirely on **Inter**, chosen for its documentation-grade legibility. Display headings use tight negative tracking (-0.8px to -1.28px) like Mintlify — focused, information-dense. Body text at 16–18px with 150% line-height gives readers comfortable lanes, essential for review content. Code labels and technical metadata use **Geist Mono** at 12px, uppercase.

Elevation comes from Airbnb's three-layer shadow system (`rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px`) — warm and natural, not sharp. Combined with generous border-radius (8px buttons, 16px cards, 24px featured panels) and Mintlify's near-invisible 5% opacity borders, every surface feels approachable and bookshelf-warm.

**Key Characteristics:**
- Pure white canvas, near-warm-black text (`#1a1a1a`) — never pure `#000000`
- Coral Pink (`#f43f5e`) as the singular accent — CTAs, ratings, active states only
- Inter for all readable content; Geist Mono for technical/metadata labels
- Airbnb three-layer card shadows — warm natural lift
- 5% opacity borders (`rgba(0,0,0,0.05)`) as primary separation mechanism
- Generous radius: 8px buttons, 16px cards, 24px featured, 9999px pills/badges
- Section breathing room: 48px–96px vertical padding (Mintlify-style chapter breaks)
- Dark mode supported — near-black background, coral accent unchanged

---

## 2. Color Palette & Roles

### Brand
- **Coral Pink** (`#f43f5e`): Primary CTA, rating stars active, links on hover, focus rings, active nav states
- **Coral Deep** (`#e11d48`): Pressed/hover variant of coral — button active state, strong emphasis
- **Coral Tint** (`#ffe4e8`): Badge backgrounds, tag surfaces, subtle highlight areas

### Text Scale
- **Near Black** (`#1a1a1a`): Primary headings and body text — warm, not cold
- **Secondary** (`#4b4b4b`): Secondary text, descriptions, metadata
- **Muted** (`#6b6b6b`): Captions, timestamps, tertiary labels
- **Placeholder** (`#a0a0a0`): Input placeholders, disabled states

### Surface
- **Background** (`#ffffff`): Page background, card surfaces
- **Surface Tint** (`#fafafa`): Alternate row backgrounds, subtle section fills
- **Border Subtle** (`rgba(0,0,0,0.05)`): Standard card and divider borders
- **Border Medium** (`rgba(0,0,0,0.08)`): Interactive element borders, input fields

### Shadows
- **Card Shadow**: `rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px` (Airbnb three-layer)
- **Hover Shadow**: `rgba(0,0,0,0.08) 0px 4px 12px` (lift on interaction)
- **Button Shadow**: `rgba(0,0,0,0.06) 0px 1px 2px` (micro-depth)

### Dark Mode
- **Background**: `#111111`
- **Surface**: `#1c1c1c`
- **Text Primary**: `#ededed`
- **Text Secondary**: `#a0a0a0`
- **Border**: `rgba(255,255,255,0.08)`
- **Coral Pink**: `#f43f5e` (unchanged — coral reads well on dark)

### Semantic
- **Error**: `#dc2626`
- **Warning**: `#d97706`
- **Success**: `#16a34a`
- **Info**: `#2563eb`

---

## 3. Typography Rules

### Font Families
- **Primary**: `Inter`, fallback: `Inter Fallback, system-ui, -apple-system, sans-serif`
- **Monospace**: `Geist Mono`, fallback: `ui-monospace, SFMono-Regular, monospace`

### Hierarchy

| Role | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|--------|-------------|----------------|-------|
| Display Hero | 56px | 600 | 1.10 | -1.12px | Page hero, landing headers |
| Section Heading | 36px | 600 | 1.15 | -0.72px | Feature section titles |
| Page Title | 28px | 600 | 1.20 | -0.56px | Novel/Author page H1 |
| Sub-heading | 22px | 600 | 1.27 | -0.22px | Card headings, wiki sections |
| Card Title | 18px | 600 | 1.33 | -0.18px | Novel card title, review header |
| Body Large | 18px | 400 | 1.60 | normal | Synopses, intro paragraphs |
| Body | 16px | 400 | 1.60 | normal | Review body, wiki content |
| Body Medium | 16px | 500 | 1.60 | normal | Nav links, emphasized text |
| Button | 15px | 500 | 1.50 | normal | Button labels |
| Label | 13px | 500 | 1.50 | 0.60px | `text-transform: uppercase` — genre tags, section labels |
| Caption | 13px | 400 | 1.50 | normal | Timestamps, author metadata |
| Mono Tag | 12px | 500 | 1.50 | 0.60px | `text-transform: uppercase` — status badges, technical metadata |

### Principles
- **Tight tracking at display**: Headings above 22px use negative letter-spacing for a focused, wiki-authoritative feel
- **Generous body leading**: 160% line-height for all review/body content — comfortable long-form reading
- **Three weights**: 400 (read), 500 (interact/navigate), 600 (announce/head). No 700 except in special emphasis
- **Uppercase for metadata**: Genre tags, serialization status, section labels use uppercase + positive tracking as a clear content-type signal
- **Mono for system data**: Star counts, view counts, version numbers use Geist Mono

---

## 4. Component Stylings

### Buttons

**Primary (Coral)**
- Background: `#f43f5e`
- Text: `#ffffff`
- Padding: 8px 24px
- Radius: 8px
- Font: Inter 15px weight 500
- Shadow: `rgba(0,0,0,0.06) 0px 1px 2px`
- Hover: `#e11d48` background
- Use: "리뷰 작성", "작품 등록", primary actions

**Secondary / Ghost**
- Background: `#ffffff`
- Text: `#1a1a1a`
- Padding: 7px 20px
- Radius: 8px
- Border: `1px solid rgba(0,0,0,0.12)`
- Hover: background `#fafafa`
- Use: "편집", "더보기", secondary actions

**Pill Badge (Genre / Status)**
- Background: `#ffe4e8` (coral tint)
- Text: `#e11d48` (coral deep)
- Padding: 2px 10px
- Radius: 9999px
- Font: Inter 13px weight 500, `text-transform: uppercase`, letter-spacing 0.6px
- Use: Genre tags, serialization status labels

**Transparent Nav**
- Background: transparent
- Text: `#1a1a1a`
- Hover: color `#f43f5e`
- Radius: 6px

### Cards

**Novel Card**
- Background: `#ffffff`
- Shadow: three-layer Airbnb shadow
- Radius: 16px
- Padding: 16px
- Thumbnail on top (3:4 portrait ratio for novels/manga)
- Title: Inter 18px weight 600, near-black
- Meta (author, genre): Inter 13px weight 400, muted `#6b6b6b`
- Rating: Coral stars + Geist Mono count
- Hover: shadow lifts to `rgba(0,0,0,0.08) 0px 4px 12px`

**Author Card**
- Background: `#ffffff`
- Border: `1px solid rgba(0,0,0,0.05)`
- Radius: 16px
- Padding: 20px
- Profile image: circular (50% radius)
- Name: Inter 18px weight 600
- Bio excerpt: Inter 14px weight 400, `#6b6b6b`

**Review Card**
- Background: `#ffffff`
- Border: `1px solid rgba(0,0,0,0.05)`
- Radius: 16px
- Padding: 20px 24px
- Rating stars: coral `#f43f5e`
- Body: Inter 16px weight 400, line-height 1.60 — comfortable long-form reading
- Reviewer meta: 13px Geist Mono uppercase, `#a0a0a0`

**Wiki Info Panel (Novel / Author Detail)**
- Background: `#fafafa`
- Border: `1px solid rgba(0,0,0,0.05)`
- Radius: 16px
- Padding: 24px
- Field labels: Inter 13px weight 500, uppercase, `#6b6b6b`
- Field values: Inter 15px weight 400, `#1a1a1a`

### Inputs & Forms

**Text Input**
- Background: `#ffffff`
- Border: `1px solid rgba(0,0,0,0.12)`
- Radius: 8px
- Padding: 10px 14px
- Font: Inter 15px
- Focus: `1px solid #f43f5e` border + `0 0 0 3px rgba(244,63,94,0.12)` ring
- Placeholder: `#a0a0a0`

**Textarea (Review Body / Markdown Editor)**
- Same as text input
- Min-height: 120px
- Font: Inter 16px, line-height 1.60 — matches reading experience

**Search Bar**
- Background: `#ffffff`
- Shadow: three-layer card shadow
- Radius: 24px (pill-like, prominent)
- Padding: 12px 20px
- Focus border: `#f43f5e`

### Rating Display

**Star Rating (Read-only)**
- Filled star: `#f43f5e` (coral)
- Empty star: `rgba(0,0,0,0.12)`
- Size: 16px inline, 20px on detail pages
- Average display: Geist Mono weight 600, `#1a1a1a`
- Count: Geist Mono weight 400, `#6b6b6b`

**Star Rating (Interactive)**
- Hover: stars fill progressively with coral
- Selected: coral fill + micro-scale(1.1) animation
- 0.5-step increments supported

### Navigation

- Sticky white header, `backdrop-filter: blur(12px)`
- Logo left-aligned, coral accent
- Nav links: Inter 15px weight 500, `#1a1a1a`; hover: `#f43f5e`
- Search bar centered or prominent
- CTA "리뷰 작성" or "로그인" right-aligned — coral primary button
- Bottom border: `1px solid rgba(0,0,0,0.05)`

---

## 5. Layout Principles

### Spacing System (8px base)
- `2px, 4px, 6px, 8px, 12px, 16px, 20px, 24px, 32px, 48px, 64px, 96px`
- Card padding: 16px–24px
- Section padding: 48px–96px vertical
- Grid gap: 16px–24px

### Grid & Container
- Max content width: 1200px, centered
- Novel grid: 2→3→4→5 columns (responsive)
- Author grid: 2→3→4 columns
- Detail pages: main column (70%) + sidebar (30%) on desktop → stacked on mobile
- Consistent horizontal padding: 16px (mobile) → 24px (tablet) → 32px (desktop)

### Whitespace Philosophy
- **Chapter breaks**: Each page section has 48px–96px vertical padding — content breathes like chapters in a book
- **Card density**: Novel grids are moderately packed — enough to browse, not cramped
- **Detail pages**: Generous leading and padding — built for reading, not scanning

### Border Radius Scale
- Micro (4px): Inline tags, tooltips, small chips
- Small (6px): Transparent nav buttons
- Standard (8px): Buttons, form inputs, tabs
- Card (16px): Novel/author/review cards, info panels
- Featured (24px): Hero panels, featured content, large containers
- Pill (9999px): Genre badges, status pills, avatar badges
- Circle (50%): Avatar images, circular icon buttons

---

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (0) | No shadow, no border | Page background, text blocks |
| Border (1) | `1px solid rgba(0,0,0,0.05)` | Standard card separation |
| Border Medium (1b) | `1px solid rgba(0,0,0,0.08)` | Input fields, interactive borders |
| Card Shadow (2) | Three-layer Airbnb shadow | Novel cards, panels — warm natural lift |
| Hover Shadow (3) | `rgba(0,0,0,0.08) 0px 4px 12px` | Card hover state |
| Focus Ring | `0 0 0 3px rgba(244,63,94,0.12)` | Focused inputs, active elements |

**Shadow Philosophy**: Airbnb's three-layer system. Layer 1 (`0px 0px 0px 1px` at 0.02) is a micro-border. Layer 2 (`0px 2px 6px` at 0.04) adds soft ambient depth. Layer 3 (`0px 4px 8px` at 0.1) provides the primary lift. The result feels like sunlight on paper — warm and natural.

---

## 7. Do's and Don'ts

### Do
- Use `#1a1a1a` (warm near-black) for text — never pure `#000000`
- Apply Coral Pink (`#f43f5e`) only for CTAs, active ratings, and accent moments — it's the singular brand touch
- Use Inter at 400/500/600 — the three-weight system is intentional
- Apply the three-layer shadow for all card surfaces
- Use generous border-radius: 8px buttons, 16px cards, 9999px badges
- Use 5% opacity borders (`rgba(0,0,0,0.05)`) as the primary separation tool
- Apply 160% line-height to all review/body content
- Use `text-transform: uppercase` + positive tracking for genre tags and metadata labels

### Don't
- Don't use pure black (`#000000`) for text — always `#1a1a1a`
- Don't apply Coral Pink to large backgrounds or decorative fills — accent only
- Don't use thin font weights (300) for any UI element — 400 is the minimum
- Don't use heavy drop shadows — the three-layer warm system is the ceiling
- Don't use sharp corners (0–4px) on cards — 16px is standard
- Don't mix Inter and Geist Mono in the same semantic context — Inter for content, Mono for system data
- Don't omit line-height on review body text — 1.60 is mandatory for readability

---

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <640px | Single column, compact nav, full-width cards |
| Tablet | 640–1024px | 2-column novel grid, expanded header |
| Desktop | 1024–1280px | 3–4 column grid, sidebar layout on detail pages |
| Wide | >1280px | 4–5 column grid, max content width 1200px |

### Collapsing Strategy
- Novel grid: 5 → 4 → 3 → 2 → 1 column
- Detail page: sidebar → stacked below main content
- Navigation: full header → hamburger at 640px
- Section padding: 96px → 48px on mobile
- Search: prominent bar → compact icon/overlay on mobile

---

## 9. Agent Prompt Guide

### Quick Color Reference
- Brand accent: Coral Pink (`#f43f5e`)
- Brand pressed: Coral Deep (`#e11d48`)
- Badge surface: Coral Tint (`#ffe4e8`)
- Background: `#ffffff`
- Text primary: `#1a1a1a`
- Text secondary: `#4b4b4b`
- Text muted: `#6b6b6b`
- Border: `rgba(0,0,0,0.05)`
- Card shadow: `rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px`

### Example Component Prompts

- **Novel card**: "White background, 16px radius, three-layer shadow (`rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px`). Portrait thumbnail (3:4, 16px top radius). Title: Inter 18px weight 600 `#1a1a1a`. Genre badge: `#ffe4e8` bg, `#e11d48` text, 9999px radius, uppercase 13px. Rating: coral `#f43f5e` stars + Geist Mono count."

- **Review card**: "White background, `1px solid rgba(0,0,0,0.05)` border, 16px radius, 20px 24px padding. Star rating in coral. Body: Inter 16px weight 400, line-height 1.60, `#1a1a1a`. Reviewer: 13px Geist Mono uppercase `#a0a0a0`."

- **Primary button**: "Coral `#f43f5e` background, white text, 8px radius, Inter 15px weight 500, 8px 24px padding. Hover: `#e11d48`."

- **Navigation**: "White sticky header, backdrop blur. Logo with coral accent left. Nav links: Inter 15px weight 500 `#1a1a1a`, hover coral. CTA coral button right. Bottom: `1px solid rgba(0,0,0,0.05)`."

- **Wiki info panel**: "`#fafafa` background, `1px solid rgba(0,0,0,0.05)` border, 16px radius, 24px padding. Label: Inter 13px uppercase weight 500 `#6b6b6b`, tracking 0.6px. Value: Inter 15px weight 400 `#1a1a1a`."

- **Search bar**: "White, three-layer shadow, 24px radius, 12px 20px padding. Focus border coral `#f43f5e`."

### Iteration Guide
1. Coral Pink (`#f43f5e`) is the singular accent — CTAs, ratings, hover states only
2. Three-layer shadow for all elevated surfaces — the warmth is in all three layers
3. `#1a1a1a` text, never `#000000` — the warmth matters
4. Inter 400/500/600 — no other weights needed
5. 160% line-height for any review or long-form body text — mandatory
6. 5% opacity borders (`rgba(0,0,0,0.05)`) as the primary separation tool — stronger breaks the airy feel
7. Uppercase + tracking for metadata labels (genre, status, author) — signals "system data" vs "content"
8. 16px radius on cards, 8px on buttons, 9999px on badges — the three-tier radius system
