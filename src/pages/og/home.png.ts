import type { APIRoute } from 'astro';
import { renderCard } from '../../lib/card';

export const GET: APIRoute = async () => {
  const png = await renderCard({
    label: 'ANDROID CONSULTANT',
    title: 'Favour Nwabude',
    foot: 'INTERNALS  ·  LINUX  ·  JVM',
  });
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
