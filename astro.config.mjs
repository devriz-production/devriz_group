import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Static build. Every route is a real folder with an index.html so the URLs match
// the slugs the live WordPress site already publishes (/about/, /companies/kotil-skin-science/).
export default defineConfig({
  site: 'https://devrizgroup.com',
  trailingSlash: 'always',
  compressHTML: true,
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !/\/(search|404|admin)\/$/.test(page),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
