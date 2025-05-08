import { defineCollection, z } from 'astro:content';

import { file } from 'astro/loaders';

const projects = defineCollection({
    loader: file("src/content/projects/projects.json"),
 });

export const collections = { projects };