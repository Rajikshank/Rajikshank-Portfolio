# Minimal Personality Layer

## User and flow

The visitor still follows one simple path: identify the person, inspect projects, verify GitHub activity, read writing, and reach contact details. The visual layer should make those destinations easier to recognize while giving the portfolio a memorable, crafted character.

Decorative elements never create a separate interaction path. If motion, hover, or JavaScript is unavailable, all content and links remain unchanged.

## Components

### Maker glyph

- A small abstract mark beside the desktop hero: code brackets at the center, two fine orbits, one orange dot, one paper dot, and one diamond.
- Default state is still. Pointer hover or keyboard focus on the hero gently rotates the orbit and nudges its shapes.
- The mark is decorative and hidden from assistive technology.
- On mobile it becomes a compact watermark behind the context block, with reduced contrast and no overlap with the name.

### Profile link tiles

- Email, GitHub, LinkedIn, and Résumé become compact outlined tiles instead of plain underlined text.
- Each tile contains a small icon well and a plain label.
- Hover raises the tile by 2px, fills the icon well with a light accent tint, and moves the icon by at most 1px.
- Tiles retain a minimum 40px target and visible focus ring.

### Project preview frame

- Every screenshot receives a slim browser-style top rail containing three muted dots and a short project identifier.
- The rail sits inside the existing image boundary and does not increase card width.
- Hover slightly brightens the active dot and lifts the frame; screenshots remain the dominant element.

### Section icon tile

- Each Projects, GitHub, Blog, and About icon sits inside the same 24px rounded tile.
- Section hover uses one tiny icon-specific movement while the title and divider stay fixed.
- The tile is decorative; the section heading remains the accessible label.

### GitHub rhythm

- Add one plain contribution total above the grid.
- Heatmap cells rise by 1px on hover and use a soft local glow only for active levels.
- No animated counters, arcade styling, or fake live indicator.

## Tokens

- Tile radius: 7px.
- Tile border: existing `--border`; hover border mixes 55% accent.
- Accent wash: 8-12% accent mixed with the active surface.
- Micro-motion: 160-240ms using the existing ease curve.
- Orbit motion: 900ms on interaction only; never continuously rotating.
- Shadows: one restrained 0 8px 24px ambient shadow on raised tiles and project frames.

## States and accessibility

- Hover effects are duplicated by `:focus-visible` where the element is interactive.
- `prefers-reduced-motion` disables orbit movement, lifts, icon nudges, and GSAP animation.
- Light and dark themes use the same structure and semantic color roles.
- At 580px and below, profile tiles use two columns and the project frame remains inside the current compact thumbnail.
- The page must preserve its accessible names, reading order, keyboard path, and no-overflow guarantee.

## Implementation target and acceptance criteria

Target: existing Astro components and global CSS; no additional runtime library.

- The new layer is visibly different at first glance but adds no new marketing content.
- Maker glyph, four profile tiles, four icon tiles, and three browser rails render on the homepage.
- All decorative SVG and chrome is hidden from screen readers.
- Build, lint, animation, route, responsive, and accessibility tests pass.
- Desktop and mobile are visually checked in dark and light themes.
