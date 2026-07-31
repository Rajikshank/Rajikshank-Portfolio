import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const [kind, rawSlug] = process.argv.slice(2);
const slug = rawSlug
  ?.trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

if (!["blog", "note", "project"].includes(kind) || !slug) {
  console.error("Usage: pnpm content:new <blog|project> <slug>");
  process.exit(1);
}

const isNote = kind !== "project";
const directory = resolve(`src/content/${isNote ? "notes" : "projects"}`);
const target = resolve(directory, `${slug}.mdx`);
const date = new Date().toISOString().slice(0, 10);
const template = isNote
  ? `---
title: Replace with a specific title
thesis: One sentence that makes a useful claim.
description: A plain-language search and social description.
publishedAt: ${date}
readMinutes: 5
type: engineering
draft: true
tags:
  - Draft
---

Write the observation first. Publish only after the note contains a real example.
`
  : `---
title: Project name
number: "04"
thesis: One clear sentence about the problem and result.
summary: A concise project summary.
role: Your role
period: YYYY-YYYY
thumbnail: /projects/${slug}.webp
thumbnailAlt: Describe the real interface shown in the image.
accent: orange
stack:
  - TypeScript
  - Add another technology
featured: false
order: 4
links: []
proof: Add a verifiable source
sourceType: public
verifiedAt: ${date}
---

## The problem

## What I built

## The important decision

## What I learned
`;

await mkdir(directory, { recursive: true });
await writeFile(target, template, { encoding: "utf8", flag: "wx" });
console.log(`Created ${target}`);
