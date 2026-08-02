# alex-trubey.github.io

Source for Alex Trubey's personal site. Astro 6, deployed to GitHub Pages by
`.github/workflows/deploy.yml` on every push to `main`, plus a daily cron
(11:23 UTC) that refreshes the Substack RSS strip, plus manual dispatch.

## Working on the site

```
npm run dev       # live dev server at localhost:4321
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

## Where things live

- `src/content/papers/` — one markdown file per paper. Body = abstract. A paper
  renders fully (abstract + link buttons) only when `links.ssrn` or `links.pdf`
  is set; otherwise it appears under "Work in progress" as title + `oneLine`.
  That is the house rule: papers get featured once publicly posted, not before.
- `src/content/essays/` — hand-curated featured essays for /writing and the
  cover. `url` must match the Substack permalink (it dedupes against the RSS
  list). Excerpts are hand-written.
- `src/content/projects/` — `standalone: true` gets a big entry on /projects;
  paper-tied projects surface as code links on the paper.
- `src/lib/substack.ts` — build-time fetch of the Substack feed. On failure it
  falls back to `src/data/substack-fallback.json`; refresh that snapshot
  occasionally during normal maintenance.
- `src/styles/tokens.css` — the whole design system: palette (three accent
  candidates, sapphire active), type scale, spacing, rules.
- `public/cv/alex-trubey-cv.pdf` — copied from
  `~/Documents/Career/` when the CV updates.

## Fonts

Bodoni Moda, Bodoni Moda SC, and Jost, self-hosted at build time by Astro's
Fonts API (configured in `astro.config.mjs`). No runtime requests to Google.

## To do

- GoatCounter analytics: create the account, then uncomment the snippet in
  `src/layouts/Base.astro` with the real code.
- Custom domain (alextrubey.com): see the domain-switchover section of the
  project plan. Requires DNS changes at Squarespace, then `public/CNAME` and a
  `site` update in `astro.config.mjs`.
- Note: GitHub pauses scheduled workflows after ~60 days without repo
  activity and emails a re-enable link. Any commit resets the clock.
