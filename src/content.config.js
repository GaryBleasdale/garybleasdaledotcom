import { defineCollection, z } from "astro:content";

import { file } from "astro/loaders";

const projects = defineCollection({
  loader: file("src/data/cv.json", {
    parser: (text) => JSON.parse(text).projects,
  }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    year_published: z.number(),
    last_updated: z.number(),
    still_participating: z.boolean(),
    isActive: z.boolean(),
    highlights: z.array(z.string()),
    github: z.string(),
    url: z.string(),
    has_full_description: z.boolean(),
  }),
});

export const collections = { projects };
