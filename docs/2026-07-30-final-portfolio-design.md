# Final Portfolio Design

## Direction

The portfolio is a narrow, portrait-first personal index. It uses an editorial serif for personality, a quiet sans-serif for readable copy, and a restrained mono face for small evidence labels. The atmosphere is warm, dark, slightly vintage, and premium without becoming decorative or nostalgic.

The interface avoids the usual oversized marketing hero, floating cards, skill clouds, fake statistics, availability badges, newsletters, RSS, and novelty copy. Every visible element should help a visitor understand the person, inspect a project, read a post, or verify recent work.

## Design system

- Dark theme: espresso canvas, warm ivory type, muted stone text, burnt-orange accent.
- Light theme: warm paper canvas, dark brown type, muted umber text, burnt-orange accent.
- Typography: Fraunces for names and titles, Manrope for body copy and controls, Geist Mono for small labels and metadata.
- Layout: centered 860px shell with hairline dividers and generous vertical rhythm.
- Icons: small outline icons used consistently in navigation, links, section labels, and activity metadata.
- Motion: a short GSAP ScrambleText name reveal per browser session, restrained hover underlines and arrow movement, and full reduced-motion support.

## Homepage

1. Compact navigation with Projects, Blog, About, Résumé, and theme control.
2. Name-led introduction with one direct sentence and four useful profile links.
3. Projects with numbered rows, compact 3:2 screenshots, short descriptions, and only real destinations.
4. GitHub activity with a cached contribution grid, recent public updates, source link, and last-sync time.
5. Blog with plain titles, dates, and reading times.
6. One-sentence About summary and a compact email/time footer.

## Content and updating

- Project case studies live in `src/content/projects/*.mdx`.
- Blog posts live in `src/content/notes/*.mdx`.
- `pnpm content:new blog <slug>` scaffolds a blog post.
- `pnpm content:new project <slug>` scaffolds a project.
- `pnpm github:refresh` refreshes the cached public GitHub activity.
- The scheduled GitHub Action refreshes that cache and commits only when data changes.

## Quality gates

- `pnpm lint`
- `pnpm build`
- `pnpm test`
- Desktop and mobile visual review in both themes.
- No horizontal overflow, serious accessibility violations, or browser console errors.
