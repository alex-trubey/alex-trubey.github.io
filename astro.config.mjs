// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// User site: served at the domain root, so no `base` path.
// When alextrubey.com goes live, change `site` and add public/CNAME.
export default defineConfig({
  site: 'https://alex-trubey.github.io',
  integrations: [sitemap()],
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Bodoni Moda',
      cssVariable: '--font-display',
      weights: ['400 900'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Didot', 'Bodoni MT', 'Georgia', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Bodoni Moda SC',
      cssVariable: '--font-sc',
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Jost',
      cssVariable: '--font-sans',
      weights: ['300 700'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Futura', 'Avenir Next', 'Helvetica Neue', 'sans-serif'],
    },
  ],
});
