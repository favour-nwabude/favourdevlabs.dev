import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getPublished } from '../lib/treatises';

export async function GET(context) {
  const posts = await getPublished();
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/treatises/${post.id}/`,
      categories: post.data.tags,
    })),
  });
}
