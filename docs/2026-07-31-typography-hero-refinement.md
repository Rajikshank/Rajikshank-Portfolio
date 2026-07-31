# Typography and Hero Refinement

## User and context

Recruiters, collaborators, and developers should understand who Krishnakumar is, what he builds, and where to inspect the work within a few seconds. The site stays portrait-first, minimal, fast, keyboard accessible, and useful in both themes.

## Primary flow

1. Enter through any portfolio route.
2. On the homepage, read the role, name, and one-sentence description.
3. Use the clearly labelled profile links or continue to Projects, GitHub, Blog, and About.
4. Open a project or post without passing through decorative content.

If animation is unavailable, interrupted, or reduced-motion is enabled, the complete name remains visible and the flow is unchanged.

## Component specifications

### Identity hero

- Purpose: make the name memorable while keeping the introduction direct.
- Structure: role label with code icon, two-line name, short description, location note, and four profile links.
- Default: full name is present in server-rendered HTML.
- Animated: GSAP ScrambleText briefly resolves each name line once per browser session.
- Reduced motion: no scrambling or entrance movement.
- Screen readers: the heading exposes one stable `aria-label`; animated letter output is hidden from the accessibility tree.
- Mobile: name remains two lines, never exceeds the viewport, and links wrap without horizontal scrolling.

### Section heading

- Purpose: make the page easy to scan.
- Structure: one meaningful outline icon, a plain title, and a hairline extending across the remaining width.
- Labels remain Projects, GitHub, Blog, and About.

### Project and blog rows

- Purpose: communicate destination and content type quickly.
- Project actions use `Open project`, `Live`, `Source`, or `npm` with matching icons.
- Blog rows use a document icon, plain title, date, reading time, and arrow.
- Hover changes color and position slightly; focus uses the existing visible focus ring.

## Design tokens

- Display: Fraunces Variable, weight 460-560, optical size tuned for each scale, moderate softness.
- Body/UI: Manrope Variable, weight 420-600.
- Metadata: Geist Mono Variable.
- Hero size: maximum 64px desktop and 49px mobile.
- Motion: 0.8-1.05 second name resolution, 0.14 second stagger, `power3.out` easing.
- Accent: keep the existing burnt orange; use it for icons, the hero rule, and interaction feedback only.

## Implementation target and acceptance criteria

Target: the existing Astro static site, using bundled client-side GSAP only for the homepage identity animation.

- The server-rendered name and navigation remain usable without JavaScript.
- Animation runs once per session and respects `prefers-reduced-motion`.
- Fonts are self-hosted and do not introduce remote font requests.
- Copy is shorter and avoids internal product language.
- Both themes pass contrast checks.
- Desktop and mobile have no horizontal overflow or console errors.
- Build, lint, route, interaction, and accessibility tests pass.
