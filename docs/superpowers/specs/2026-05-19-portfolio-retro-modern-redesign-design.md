# Portfolio Retro-Modern Redesign Design

Date: 2026-05-19
Project: `D:\source codes\JavaScript\portfolio`
Approved direction: Soft Graphite + Apricot

## Goal

Redesign the portfolio into a minimal, sleek, retro-modern personal site for Rajikshan K, a recently graduated full-stack AI engineer looking for junior full-stack, frontend, and AI SaaS roles.

The site should feel job-ready and memorable without becoming arcade, neon, or cringe. The visual language should be restrained: soft graphite black, warm apricot-orange, cream text, crisp modern typography, subtle texture, and tiny retro interface details.

## Source Material

Use the existing portfolio data plus the supplied CV:

- Name: Krishnakumar Rajikshan / Rajikshan K
- Location: Batticaloa, Sri Lanka
- Email: `krajikshan637@gmail.com`
- Role framing: Full-stack AI engineer / full-stack developer
- Education: BSc (Hons) Software Engineering, Sri Lanka Technological Campus, 2021-2025, GPA 3.60/4.00
- Experience: Trainee FullStack AI Engineer at SPM Batticaloa, May 2023-present
- Experience proof points: 4 scalable web apps, 3 LangChain LLM APIs, Pinecone/PGVector search, 1200+ requests/day, 99.9% uptime, UI redesign impact, GitHub Actions/Docker CI/CD, Python backend latency and cost improvements
- Projects: Gizume, Hive Hub, Zaylo
- Stack: JavaScript, Java, Python, C, React, Next.js, Tailwind CSS, Node.js, Express.js, Spring Boot, FastAPI, LangChain, CrewAI, Pinecone, PostgreSQL, Prisma/Drizzle, Docker, GitHub Actions

## Design Language

Use the approved Soft Graphite + Apricot direction.

Palette:

- Background: deep graphite, near black, slightly warm rather than blue-black
- Surface: low-contrast charcoal layers
- Text: warm cream, never pure white
- Muted text: taupe/stone
- Accent: soft apricot-orange and muted copper, not hot orange
- Light mode: warm paper/cream with graphite ink and muted apricot accents

Temperature rule:

- Avoid sharp fire orange, neon orange, cyan, bright green, purple, and heavy bloom.
- Orange should feel like printed ink or warm hardware plastic.
- Use glow only as a localized hover response, never as a permanent background style.

Texture rule:

- Texture is allowed as dot grids, low-opacity scanlines, very subtle paper/noise overlays, and thin borders.
- Avoid large decorative blobs, gradient orbs, oversized glows, and dramatic fog.

Typography:

- Use a sleek modern sans for headings, preferably `Instrument Sans` or `Manrope`.
- Use `IBM Plex Mono` or `JetBrains Mono` only for small labels, metrics, code-like chips, and activity graph labels.
- Do not use heavy pixel fonts for main text. Pixel style belongs to icons, cells, and animation details only.
- Keep text tight, clear, and confident. No over-fancy or gimmicky copy.

## Hero

Hero should be energetic but minimal.

Content:

- Eyebrow: `Rajikshan K / Full-stack AI Engineer`
- Main headline direction: `Quiet UI. Useful AI. Shipped systems.` or similar
- Supporting copy: explain that he builds Next.js, AI workflow, vector-search, and database-backed products that work beyond screenshots
- CTAs: `View work`, `Resume`, and a subtle contact/social path
- Proof chip: mention 1200+ requests/day LLM APIs and 99.9% uptime from the CV

Visual:

- Replace large project screenshot hero with a compact, custom 8-bit workbench or tiny avatar scene.
- The 8-bit element should be unique to Rajikshan: laptop/workbench, activity cells, small AI/API/data symbols, and RK initials.
- It should be small, stylish, and theme-matched. It must not dominate the page.

Hero animation:

- Initial load: calm staggered reveal, short duration, soft ease.
- Pointer interaction: use the pressure-field dot background described below.
- Hero 8-bit scene can react lightly to pointer movement and activity pulses, but should stay subtle.

## Pressure-Field Dot Background

This is the refined version of the user's hover-glow idea.

Behavior:

- The background uses a sparse grid of tiny dots/cells.
- Dots are calm and low-contrast by default.
- The cursor creates a localized pressure wave around itself.
- When the cursor moves slowly, nearby dots brighten slightly and lift a little.
- When the cursor moves fast, the wave stretches in the movement direction and decays with a soft water-like ripple.
- The reaction should feel like pressure passing through a physical surface, not a glowing trail.
- Dots should settle back quickly and smoothly.

Implementation direction:

- Prefer a lightweight canvas layer for the pressure field.
- Track pointer position and velocity.
- Render only visible viewport dots at a reasonable spacing.
- Brightness, radius, displacement, and decay should be derived from velocity.
- Use `requestAnimationFrame`; pause/reduce work when tab is hidden.
- Respect `prefers-reduced-motion` by disabling physics and leaving a static texture.
- Keep performance safe on mobile. On coarse pointer devices, use a static dot texture or very lightweight tap ripple.

Suggested visual parameters:

- Dot spacing: 22-32px desktop, 28-36px mobile
- Dot base alpha: very low
- Dot active alpha: modest apricot, no bloom
- Max displacement: 4-8px
- Decay: quick, smooth, no long comet trails
- Blend: normal or soft alpha; avoid screen/additive glow

## Activity Graph

Create a git-style activity graph, but make it meaningful and personal.

Data:

- Use current local/static data first, derived from projects, CV proof points, and work timeline.
- If GitHub contribution data is fetched later, keep it optional and non-blocking.
- Do not fake live GitHub data unless clearly labeled as portfolio activity.

Meaning:

- Each cell can represent shipped work, learning streaks, project milestones, or contribution intensity.
- Tooltips or click states should reveal what a cluster means: Gizume, Hive Hub, Zaylo, SPM work, LangChain APIs, CI/CD, backend optimization.

Visual:

- Use the same dot/cell language as the pressure field.
- Cells should animate softly on scroll and react on hover.
- The graph should avoid random decorative noise; every cluster should map to a real item.

## Sections

Use these main sections:

1. Hero
2. Activity / signal graph
3. Projects
4. Skills
5. Experience
6. Education
7. Contact

Projects:

- Keep images small and stylized.
- Use compact project cards with a small thumbnail, strong title, one-line purpose, proof/impact, stack chips, and links.
- Do not make images huge. They are supporting artifacts, not the main layout.
- Use hidden details on hover/click: shipped features, stack, impact, and live/source links.

Skills:

- Use lucide icons plus small styled tooling marks.
- Group by Interface, Server, AI/Workflow, Tools.
- Add icons for React/Next.js/TypeScript-like categories using lucide where suitable; avoid importing a huge icon pack unless justified.
- Add subtle hover reveal: a chip can show where the skill was used, e.g. Pinecone in Hive Hub, Docker in Gizume/SPM work.

Experience:

- Present SPM as real experience with concise metrics.
- Motion can feel like a timeline tape or log entry, but keep it modern.
- Include proof points from the CV without overclaiming.

Education:

- Keep simple and confident.
- Include SLTC, BSc (Hons) Software Engineering, 2021-2025, GPA 3.60/4.00.
- Add one small easter egg: clicking the education card can reveal a compact "graduate mode unlocked" detail or coursework/tooling summary. Keep it tasteful.

Contact:

- Tone: open, direct, job-search appropriate.
- Avoid desperate wording. Use confidence with humility.
- Example direction: `I am looking for a junior role where I can keep shipping, learn fast, and own real product problems.`

## Easter Eggs and Interactions

Keep easter eggs quiet and discoverable:

- Hero 8-bit scene: pointer makes tiny cells react.
- Activity graph: clicking a cluster reveals the related project/proof point.
- Skills: hover reveals project usage.
- Education: click reveals a short unlocked note.
- Projects: hover or click exposes shipped details.

Avoid:

- Loud jokes
- Meme copy
- Big surprise animations
- Gimmicks that distract recruiters

## Motion

Use GSAP for scroll and section choreography.

Motion rules:

- Smooth, calm, premium easing
- No bounce-heavy UI
- No constant motion when idle, except extremely subtle texture/activity pulse if performance allows
- Section reveals should be staggered and short
- Cards can translate 4-8px and reveal details
- Use `ScrollTrigger` for section entrances and activity graph activation
- Use `prefers-reduced-motion` fallbacks

## Dark and Light Mode

The site must support both.

Dark mode:

- Primary mode
- Graphite surfaces, warm cream text, apricot accent

Light mode:

- Warm paper surface
- Graphite text
- Muted apricot/copper accents
- Retain the same layout and interactions

Theme toggle:

- Icon button, not text-heavy
- Persist preference in local storage
- Respect system preference on first visit
- Pressure-field colors must adapt to the active theme

## Wording Tone

Tone should be cool, clear, and job-ready:

- Confident but not arrogant
- Slightly sharp, not savage-for-no-reason
- Practical, product-minded, and honest
- Avoid corporate fluff and fake seniority

Good copy style:

- `Fresh graduate. Real systems shipped.`
- `Useful AI, not AI wallpaper.`
- `I like interfaces that connect to actual data.`
- `Open to junior roles where I can ship, learn, and own the annoying parts too.`

Avoid:

- `10x developer`
- `visionary`
- `ninja`
- cringe terminal roleplay
- fake hacker vibes

## Technical Plan Boundary

This design should be implemented inside the current Vite React app.

Likely changes:

- Update `src/data/portfolio.ts` with CV-backed copy and proof points
- Replace/expand hero in `src/components/Header.tsx`
- Add a pressure-field canvas component
- Add activity graph component
- Rework section components and CSS tokens
- Add theme state and toggle
- Update `src/index.css` for typography, palette, responsive layout, and motion
- Keep GSAP and lucide-react; avoid adding heavy dependencies unless needed

Validation requirements:

- `pnpm build`
- `pnpm lint`
- Browser visual check at desktop and mobile widths
- Confirm no text overflow on mobile
- Confirm pressure field does not cause obvious jank
- Confirm reduced-motion behavior
- Confirm dark/light mode

## Open Implementation Decision

Before implementation, decide whether the pressure field is:

1. Pure canvas dots with pointer physics
2. CSS variables plus radial hover masks
3. Hybrid: canvas only on desktop, static CSS texture on mobile

Recommended: hybrid. Canvas provides the unique physics on desktop while mobile stays fast and calm.

## Approval Status

Approved direction from user:

- Option A: Soft Graphite + Apricot
- Remove cringe glow and sharp color temperature
- Use better minimal sleek font
- Enhance hover-based background dots into a proper physics-inspired reaction

This spec chooses a grounded pressure-field interaction instead of a permanent glow background.
