# Krishnakumar Rajikshan - Portfolio

A proof-first personal portfolio for a full-stack AI engineer. The site is a
static Astro build with schema-validated projects and blog posts, a cached public
GitHub activity snapshot, light/dark themes, and no client framework.

## What is included

- compact portrait-oriented homepage;
- three verified project case studies with real product screenshots;
- a simple MDX blog workflow;
- About, experience, education, and capabilities;
- public GitHub activity refreshed every six hours by GitHub Actions;
- local résumé PDF;
- generated sitemap, canonical metadata, Open Graph metadata, and JSON-LD;
- responsive, keyboard-accessible light and dark themes;
- Playwright route, interaction, responsive, and Axe accessibility tests.

## Local development

Node.js 22.12 or newer and pnpm are required.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

The development server is available at `http://localhost:4321`.

Quality gates:

```bash
pnpm lint
pnpm check
pnpm build
pnpm test
```

## Publishing a blog post

Create a schema-valid draft:

```bash
pnpm content:new blog my-specific-observation
```

Edit the generated file in `src/content/notes/`. Keep `draft: true` while
writing, then set `draft: false` and add a real publish date. A blog post needs:

- a specific title and thesis;
- a plain-language description;
- a publish date and honest reading time;
- one of the supported note types;
- at least one tag;
- content based on a real observation, decision, or failure.

The Blog index and detail route are generated automatically. No page component
change is needed.

## Adding or updating a project

Project entries live in `src/content/projects/`. To scaffold one:

```bash
pnpm content:new project project-slug
```

Add an optimized 3:2 screenshot at `public/projects/project-slug.webp`, complete
the evidence fields, and run `pnpm check`. Claims must be supported by a public
source, the approved résumé, or explicitly confirmed private evidence.

## GitHub activity

Run a manual refresh with:

```bash
pnpm github:refresh
```

The script reads only public `Rajikshank` activity, filters low-signal events,
groups same-day pushes, and writes a normalized snapshot to
`src/data/github-activity.json`. With `GITHUB_TOKEN`, it also retrieves the
12-week contribution rhythm through GraphQL. If GitHub is unavailable, the last
successful snapshot remains usable.

`.github/workflows/activity.yml` runs this refresh every six hours and commits
only the normalized JSON snapshot. No credential is shipped to the browser.

## Deployment

The production output is `dist/`. `netlify.toml` configures the current Netlify
target, security headers, and redirects from the old route structure.

Set `SITE_URL` in the deployment environment when moving to another canonical
domain:

```bash
SITE_URL=https://example.com pnpm build
```

The same `dist/` directory can be deployed to Vercel, Cloudflare Pages, GitHub
Pages with a custom domain, or any static host.

## Structure

```text
src/
  components/       shared Astro UI
  content/projects/ case-study MDX
  content/notes/    blog-post MDX
  data/             profile and normalized GitHub snapshot
  layouts/          metadata and page shell
  pages/            static routes
  styles/           design system
scripts/            content and GitHub maintenance commands
tests/              Playwright and Axe verification
```
