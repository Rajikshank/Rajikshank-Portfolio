# Pre-deployment Motion and Type Polish

## User flow

The homepage introduction should feel crafted immediately, then become completely quiet so visitors can scan projects, activity, writing, and contact links. Interior pages should share the same typographic voice without inheriting homepage animation.

The static HTML is always the complete experience. Motion enhances the first homepage visit once per session and never blocks navigation or hides the name.

## Hero sequence

1. The orange guide rule grows downward while the role and location settle into place.
2. The two name lines resolve through the existing ScrambleText effect with a short stagger.
3. The surname spark scales and turns into position.
4. The maker glyph fades and scales in; its two orbit lines settle from wider angles.
5. The introduction and four profile tiles enter with a small upward stagger.
6. The document marks the sequence complete using `data-hero-ready="true"`.

Maximum sequence duration: 1.45 seconds. No element moves more than 12px. The name remains visible throughout. Returning within the same session skips the sequence.

Reduced-motion users receive the final state immediately, including `data-hero-ready="true"`.

## Typography system

- Load Fraunces full normal and italic variable files so optical size, softness, wonk, weight, and real italics are available.
- Hero name: Fraunces, optical size 96, moderate softness, 520 normal / 470 italic.
- Page and article titles: Fraunces, optical size 64-80, moderate softness, balanced wrapping.
- Project and subsection titles: Fraunces, optical size 28-36, lower softness for clarity.
- Body and interface: Manrope, weight 430-560, slight negative tracking, comfortable line height.
- Metadata: Geist Mono with neutral tracking; never inherit body tracking.
- Reading pages: 1.01rem body, 1.75 line height, 680px maximum measure, pretty wrapping.

## States and responsiveness

- Mobile uses the same animation order with shorter movement and unchanged font size limits.
- Theme switching does not replay the hero.
- No-JavaScript, storage failure, and reduced-motion states show all content immediately.
- Decorative glyphs remain hidden from assistive technology.
- Focus indicators and minimum control sizes remain unchanged.

## Acceptance criteria

- Fraunces full normal and italic files are loaded locally.
- Hero completion state is testable and reached within three seconds.
- All headings and body text use the intended family and hierarchy across homepage, indexes, project pages, blog pages, About, and 404.
- No layout shift, text clipping, horizontal overflow, console errors, serious accessibility violations, or broken images.
- Lint, Astro checks, production build, Playwright suite, and live desktop/mobile dark/light review pass before deployment.
