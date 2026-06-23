# DEYAA Design System

## Brand
**ΔΕΥΑΑ Αποκορώνου** — Municipal water & sewer utility (Apokoronas, Crete)

## Pattern
Trust & Authority — clear hierarchy, emergency contacts visible, accessible navigation

## Style
Accessible & Ethical + Soft UI Evolution — professional government service, calm water tones

## Colors
| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#0B3D6B` | Headers, nav, trust elements |
| Accent | `#0891B2` | CTAs, links, highlights |
| Background | `#F8FAFC` | Page background |
| Surface | `#FFFFFF` | Cards, panels |
| Muted text | `#475569` | Body secondary |
| Emergency | `#DC2626` | Fault hotline emphasis |

## Typography
- **Display/Headings:** Source Serif 4 — authority, Greek-friendly
- **UI/Body:** Plus Jakarta Sans — clean, modern

## Effects
- Soft shadows (`shadow-sm` → `shadow-lg` on hover)
- Transitions: 200ms ease
- Glass: `bg-white/80 backdrop-blur-xl border border-white/40`
- Water pattern: subtle SVG wave at 5% opacity

## Anti-patterns (avoid)
- Emoji as icons — use Lucide SVG only
- AI purple/pink gradients
- `scale` transforms that shift layout on hover
- Hardcoded `#2161ab` — use design tokens
- Debug overlays in production

## Components
- Floating sticky header with glass on scroll
- PageHero for inner pages (gradient + breadcrumb)
- TrustBar for emergency numbers
- SectionHeader for content sections

## Accessibility
- 4.5:1 text contrast minimum
- `cursor-pointer` on all interactive elements
- `prefers-reduced-motion` respected
- Focus rings visible
- Responsive: 375, 768, 1024, 1440px
