import type { APIRoute, GetStaticPaths } from 'astro';
import { getPublished, formatDate } from '../../lib/treatises';
import { renderCard } from '../../lib/card';

export const getStaticPaths = (async () => {
  const posts = await getPublished();
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: Awaited<ReturnType<typeof getPublished>>[number] };
  const tags = post.data.tags.slice(0, 3).map((t) => t.toUpperCase());
  const foot = [formatDate(post.data.pubDate).toUpperCase(), ...tags].join('  ·  ');
  const png = await renderCard({ label: 'TREATISE', title: post.data.title, foot });
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
