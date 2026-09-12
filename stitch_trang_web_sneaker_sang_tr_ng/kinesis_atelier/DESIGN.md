---
name: KINESIS / ATELIER
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f21'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#c5c9ac'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#8f9378'
  outline-variant: '#444932'
  surface-tint: '#b0d500'
  primary: '#ffffff'
  on-primary: '#2a3400'
  primary-container: '#caf300'
  on-primary-container: '#596c00'
  inverse-primary: '#536600'
  secondary: '#c1c7cf'
  on-secondary: '#2b3137'
  secondary-container: '#41474e'
  on-secondary-container: '#afb6bd'
  tertiary: '#ffffff'
  on-tertiary: '#233143'
  tertiary-container: '#d4e4fa'
  on-tertiary-container: '#576679'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#caf300'
  primary-fixed-dim: '#b0d500'
  on-primary-fixed: '#171e00'
  on-primary-fixed-variant: '#3e4c00'
  secondary-fixed: '#dde3eb'
  secondary-fixed-dim: '#c1c7cf'
  on-secondary-fixed: '#161c22'
  on-secondary-fixed-variant: '#41474e'
  tertiary-fixed: '#d4e4fa'
  tertiary-fixed-dim: '#b9c8de'
  on-tertiary-fixed: '#0d1c2d'
  on-tertiary-fixed-variant: '#39485a'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-xl:
    fontFamily: Syne
    fontSize: 84px
    fontWeight: '800'
    lineHeight: 88px
    letterSpacing: -0.04em
  display-xl-mobile:
    fontFamily: Syne
    fontSize: 44px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.03em
  display-lg:
    fontFamily: Syne
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Syne
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Syne
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Syne
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-technical:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.12em
  label-micro:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 12px
    letterSpacing: 0.18em
spacing:
  space-3xs: 0.125rem
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4.5rem
  space-4xl: 6rem
  space-5xl: 9rem
  gutter-mobile: 1rem
  gutter-desktop: 2rem
  margin-mobile: 1.25rem
  margin-desktop: 4rem
---

## Brand & Style
This design system lives at the intersection of haute couture editorial poise and aggressive cyberpunk streetwear engineering. It speaks to high-end collectors, design technologists, and tastemakers who demand both architectural precision and raw kinetic energy. 

The aesthetic is characterized by high-fashion editorial asymmetry, razor-sharp micro-borders, stark atmospheric contrast, and moments of radical chromatic disruption. It evokes the feeling of entering a restricted, climate-controlled prototype lab in Milan or Tokyo: silent, imposing, sterile, and punctuated by hyper-functional technical hardware. Layouts balance expansive, ceremonial negative space with compressed, industrial typographic metadata.

## Colors
The palette relies on absolute darkness to establish an aura of luxury rarity, heightened by titanium chrome surfaces and interrupted by an explosive, energetic neon charge.

- **Primary (`#D4FF00` - Acid Volt):** The kinetic pulse. Reserved strictly for primary call-to-actions, live drop indicators, technical specifications, and key active states. It should never cover large surface areas; treat it as an electric ignition spark.
- **Secondary (`#E2E8F0` - Liquid Titanium):** High-sheen chrome metal used for structural hairline borders, display headings, interactive iconography, and reflective UI accents.
- **Tertiary (`#94A3B8` - Matte Platinum):** Industrial mid-tone slate used for technical metadata, dimension callouts, secondary typography, and structural grid rules.
- **Neutral (`#0A0A0C` - Deep Obsidian):** Pitch-black core foundation. Supported by layered surfaces of `#121216` (Obsidian Base) and `#18181E` (Raised Atelier Surface) to sculpt architectural depth without relying on traditional drop shadows.
- **Accent White (`#F8FAFC` - Pure Atelier White):** Razor-sharp, pristine white used exclusively for primary typographic messaging and high-contrast editorial labels.

## Typography
Typographic rhythm is established through aggressive scale disparity and distinct functional segregation:

1. **Editorial Headlines (`Syne`):** Brutalist, sculptural, wide-tracking display forms. Employed for silhouette names, exhibition concepts, and seasonal manifesto quotes. Rendered with tight leading to produce solid typographic monoliths.
2. **Body & Interface (`Geist`):** Monolithic, geometric, ultra-neutral sans-serif providing crystal-clear product descriptions, sizing breakdowns, checkout logistics, and client service narratives.
3. **Spec Sheets & Atelier Badging (`JetBrains Mono`):** Rigorous monospace utility. Every drop edition number, SKU, material breakdown, archival timestamp, and pricing metric is typeset in strictly uppercase JetBrains Mono with widened tracking to simulate industrial laser engraving.

## Layout & Spacing
The layout adheres to a strict 12-column architectural fluid grid on desktop (8 columns on tablet, 4 columns on mobile), bracketed by razor-thin vertical guide lines that visually ground the viewport.

- **Editorial Pacing:** Alternate between hyper-dense technical telemetry readouts (packed with `space-xs` and `space-sm`) and cavernous negative space surrounding footwear silhouettes (`space-4xl` to `space-5xl`).
- **Edge-to-Edge Full Bleed:** Hero imagery and 3D viewport canvas stages break container boundaries, framed only by delicate outer gutters and hairline crosshairs.
- **Asymmetric Offsets:** Staggered product listings mimic the composition of an avant-garde publication, avoiding symmetrical e-commerce tiles in favor of dynamic 7/5 or 8/4 column pairings.

## Elevation & Depth
Elevation rejects fuzzy, diffuse shadows entirely in favor of calibrated architectural layering, specular chrome highlights, and cryogenic frosted glass.

- **Layer 0 (Void):** `#0A0A0C` background canvas, often featuring subtle metallic noise or a 1px technical coordinate grid pattern overlay (`rgba(226, 232, 240, 0.03)`).
- **Layer 1 (Card / Chassis):** `#121216` base filled with semi-transparent frosted backdrops (`rgba(18, 18, 22, 0.7)`), 16px to 24px backdrop blur, bounded by a 1px border of `rgba(226, 232, 240, 0.12)`.
- **Layer 2 (Floating Modal / Drawer):** `#18181E` elevated plane with an outer hairline stroke of `rgba(226, 232, 240, 0.25)` and a directional 1px top-edge titanium highlight (`rgba(255, 255, 255, 0.4)`).
- **Neon Glow Displacement:** For active drop elements or selected states, omit standard shadows in favor of a compressed, directional neon halo: `0 0 24px rgba(212, 255, 0, 0.22)`.

## Shapes
Zero rounding (`0px`). Geometry is unapologetically monolithic, clinical, and precise. Every container, button, modal window, badge, and input field terminates at sharp, 90-degree right angles. 

To reinforce cyber-industrial manufacturing paradigms, key containers and interactive primary triggers may incorporate chamfered 45-degree corner notches (4px to 8px clips via CSS clip-path), evoking precision-milled carbon fiber plates and aeronautical chassis panels.

## Components

### Action Triggers (Buttons)
- **Primary Kinetic Trigger:** Solid `#D4FF00` block background, pure `#0A0A0C` bold `JetBrains Mono` uppercase text, 0px border radius, zero ambient shadow. On hover, background shifts to pure white (`#F8FAFC`) with immediate micro-scale inversion; on press, background inverts to `#0A0A0C` with a 1px `#D4FF00` outline and text rendering in `#D4FF00`.
- **Secondary Chrome Trigger:** Transparent background, 1px solid titanium stroke (`rgba(226, 232, 240, 0.4)`), uppercase `#F8FAFC` label. On hover, stroke illuminates to 100% opacity titanium with subtle backdrop glass brightening (`rgba(255, 255, 255, 0.06)`).
- **Destructive / Depleted:** Background `#121216`, hairline border `rgba(148, 163, 184, 0.2)`, text struck through with a central 1px line.

### Spec Badges & Drop Pills
- Monospaced metadata tags (e.g., `[ EDITION 001 // PROTO ]`, `[ 48 PAIRS WORLDWIDE ]`, `[ HAND-FINISHED ]`).
- Encapsulated in 1px `rgba(226, 232, 240, 0.2)` borders with a solid `#0A0A0C` interior or translucent glassmorphism fill. Small Acid Volt dot indicator (`6px × 6px`) pulsed on the left for live inventory status.

### Sneaker Showcase Cards
- Architectural vertical modules with high-aspect-ratio photography against dark obsidian or cold ambient gray voids.
- Bottom third features a frosted obsidian glass overlay panel holding the silhouette name in `Syne`, with sizing matrices and raw technical metrics typeset beneath in small-caps `JetBrains Mono`.
- Subdued 1px perimeter border that illuminates to Acid Volt (`#D4FF00`) only upon pointer focus or active selection.

### Form Inputs & Selectors
- Flat rectangular fields with solid `#121216` background and a 1px perimeter stroke of `rgba(148, 163, 184, 0.2)`.
- Labels float above input boxes in `label-technical` (`JetBrains Mono`, all-caps, tracking 0.12em).
- Focus state instantly snaps border color to `#D4FF00` with a zero-blur 1px outer rim; no rounded corners or soft focus halos.

### Selection Controls (Checkboxes & Radios)
- Exact square form factors (16px × 16px) with 1px titanium border. 
- Active state renders a solid inner `#D4FF00` square with a 3px inset margin, dispensing with traditional checkmark glyphs in favor of a calibrated industrial switch aesthetic.