import { parseFeed } from '@rowanmanning/feed-parser';
import fallback from '../data/substack-fallback.json';

export interface SubstackPost {
  title: string;
  url: string;
  /** ISO date, e.g. "2026-07-21" */
  date: string;
  subtitle: string;
}

const FEED_URL = 'https://alextrubey.substack.com/feed';

let cache: SubstackPost[] | null = null;

/**
 * Latest posts from the Substack feed, fetched once per build.
 * On any failure (network, non-200, parse) the committed fallback snapshot
 * is used instead, so a Substack hiccup can never fail a scheduled rebuild.
 */
export async function getSubstackPosts(limit = 10): Promise<SubstackPost[]> {
  if (cache === null) {
    cache = await loadPosts();
  }
  return cache.slice(0, limit);
}

/** Strips query, fragment, and trailing slash so curated essay URLs and feed URLs compare equal. */
export function normalizeUrl(url: string): string {
  return url.replace(/[?#].*$/, '').replace(/\/+$/, '');
}

/** "2026-07-21" -> "Jul 21, 2026" (UTC so the date never shifts across timezones). */
export function formatDate(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(`${iso}T00:00:00Z`) : iso;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

async function loadPosts(): Promise<SubstackPost[]> {
  try {
    const res = await fetch(FEED_URL, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) {
      throw new Error(`feed responded ${res.status}`);
    }
    const feed = parseFeed(await res.text());
    const posts: SubstackPost[] = [];
    for (const item of feed.items) {
      if (!item.title || !item.url || !item.published) continue;
      posts.push({
        title: item.title.trim(),
        url: normalizeUrl(item.url),
        date: item.published.toISOString().slice(0, 10),
        subtitle: (item.description ?? '').replace(/<[^>]+>/g, '').trim(),
      });
    }
    if (posts.length === 0) {
      throw new Error('feed parsed but contained no usable items');
    }
    posts.sort((a, b) => b.date.localeCompare(a.date));
    return posts;
  } catch (err) {
    console.warn(`[substack] falling back to committed snapshot: ${err}`);
    return fallback as SubstackPost[];
  }
}
