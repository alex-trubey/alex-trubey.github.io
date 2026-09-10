import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

// A paper with an abstract (a non-empty body) has a draft and renders fully
// on /research: collapsible abstract plus a link row. A paper without one
// appears under "Work in progress" as title plus oneLine. Papers get a PDF
// button only once `links.pdf` is set, so a draft can be listed before it
// is ready to hand out.
const papers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/papers' }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()).default(['Alex Trubey']),
    status: z.enum(['working-paper', 'in-preparation', 'published']),
    year: z.number(),
    // Year of the latest revision, shown as "2024, updated 2026".
    updated: z.number().optional(),
    venue: z.string().optional(),
    // One line for the work-in-progress list (papers without an abstract).
    oneLine: z.string().optional(),
    // Small note under the link row, e.g. "Draft available on request."
    note: z.string().optional(),
    links: z
      .object({
        ssrn: z.string().url().optional(),
        pdf: z.string().optional(),
        code: z.string().url().optional(),
        data: z.string().url().optional(),
      })
      .default({}),
    featured: z.boolean().default(false),
    order: z.number().default(99),
  }),
});

// Curated essays only. The auto list on /writing comes from the Substack RSS
// feed at build time; `url` doubles as the dedupe key against that list.
const essays = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/essays' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    url: z.string().url(),
    date: z.coerce.date(),
    excerpt: z.string(),
    rank: z.number().default(99),
  }),
});

// standalone: true means the project earns its own feature page; paper-tied
// projects surface as a code link on the referenced paper's entry instead.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    year: z.number(),
    repo: z.string().url().optional(),
    live: z.string().url().optional(),
    paper: reference('papers').optional(),
    standalone: z.boolean().default(false),
    order: z.number().default(99),
  }),
});

export const collections = { papers, essays, projects };
