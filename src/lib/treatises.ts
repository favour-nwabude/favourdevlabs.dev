import { getCollection, type CollectionEntry } from 'astro:content';

export type Treatise = CollectionEntry<'treatises'>;

/** Published treatises, newest first. Drafts show only in local dev. */
export async function getPublished(): Promise<Treatise[]> {
  const all = await getCollection('treatises', ({ data }) => import.meta.env.DEV || !data.draft);
  return all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });

export const readingMinutes = (body = '') => {
  const prose = body.replace(/```[\s\S]*?```/g, '');
  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
};
