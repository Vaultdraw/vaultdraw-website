import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/** Sidebar groups, in display order. */
export const DOC_GROUPS = [
  "Getting started",
  "Using Vaultdraw",
  "Customise",
  "Command line",
  "Plugins",
  "Help",
  "About",
] as const;

const docs = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/docs" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    group: z.enum(DOC_GROUPS),
    order: z.number(),
  }),
});

const changelog = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/changelog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
  }),
});

export const collections = { docs, changelog };
