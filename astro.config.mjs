import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import { portfolioIcons } from './utils/portfolio-icons.js';

import react from '@astrojs/react';

import db from '@astrojs/db';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  integrations: [icon({
      include: portfolioIcons,
  }), react(), db()],

  adapter: netlify()
});