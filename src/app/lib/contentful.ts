// lib/contentful.ts
import { createClient, EntryCollection, EntrySkeletonType, EntriesQueries, Entry, EntryFieldTypes } from 'contentful';

interface ArticleFields {
  slug: EntryFieldTypes.Symbol;
  title: EntryFieldTypes.Symbol;
  category?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
  publishDate?: EntryFieldTypes.Date;
}

type ArticleSkeleton = EntrySkeletonType<ArticleFields, 'article'>;
type ArticleEntry = Entry<ArticleSkeleton, undefined, 'en-US'>;

function getContentfulClient() {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

  if (!spaceId || !accessToken) {
    throw new Error('Contentful API keys are missing. Make sure they are set in Vercel.');
  }

  return createClient({
    space: spaceId,
    accessToken,
  });
}

/**
 * Get latest article by tag
 */
export async function getLatestArticlesByTag(
  tag: string
): Promise<{ slug: string; headline: string } | null> {
  try {
    const client = getContentfulClient();

    const params: EntriesQueries<ArticleSkeleton, undefined> = {
      content_type: 'article',
      'fields.category[in]': [tag],
      order: ['-sys.createdAt'],
      limit: 1,
      locale: 'en-US',
    };

    const response: EntryCollection<ArticleSkeleton, undefined, 'en-US'> =
      await client.getEntries<ArticleSkeleton>(params);

    const item = response.items[0];

    if (!item?.fields?.slug || !item.fields.title) return null;

    return { slug: item.fields.slug, headline: item.fields.title };
  } catch (err) {
    console.error('Error fetching article by tag:', err);
    return null;
  }
}

/**
 * Get latest news articles
 */
export async function getLatestNewsArticles(): Promise<
  Array<{ slug: string; headline: string; publishedAt?: string }>
> {
  try {
    const client = getContentfulClient();

    const params: EntriesQueries<ArticleSkeleton, undefined> = {
      content_type: 'article',
      order: ['-fields.publishDate'],
      limit: 8,
      locale: 'en-US',
    };

    const response: EntryCollection<ArticleSkeleton, undefined, 'en-US'> =
      await client.getEntries<ArticleSkeleton>(params);

    return response.items
      .filter((item): item is ArticleEntry => !!item.fields?.slug && !!item.fields.title)
      .map((item) => ({
        slug: item.fields.slug,
        headline: item.fields.title,
        publishedAt: item.fields.publishDate,
      }));
  } catch (err) {
    console.error('Error fetching latest news:', err);
    return [];
  }
}
