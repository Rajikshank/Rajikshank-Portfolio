import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const linkSchema = z.object({
  label: z.enum(["Live", "Source", "npm"]),
  href: z.url(),
});

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    number: z.string().regex(/^\d{2}$/),
    thesis: z.string(),
    summary: z.string(),
    role: z.string(),
    period: z.string(),
    thumbnail: z.string(),
    thumbnailAlt: z.string(),
    accent: z.enum(["orange", "paper", "green"]),
    stack: z.array(z.string()).min(2),
    featured: z.boolean().default(true),
    order: z.number().int().positive(),
    links: z.array(linkSchema),
    proof: z.string(),
    sourceType: z.enum(["public", "resume", "private-confirmed"]),
    verifiedAt: z.coerce.date(),
  }),
});

const notes = defineCollection({
  loader: glob({ base: "./src/content/notes", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    thesis: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    readMinutes: z.number().int().positive(),
    type: z.enum(["workflow", "engineering", "product"]),
    relatedProject: z.string().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).min(1),
  }),
});

export const collections = { projects, notes };
