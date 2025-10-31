import { createClient } from 'contentful';


const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

if (!spaceId || !accessToken) {
    throw new Error(
        "Contentful API keys are missing."
    );
}

const client = createClient({
    space: spaceId,
    accessToken: accessToken,
});

/**
    @param {string} tag 
    @returns {Promise<{slug: string, headline: string} | null>}
*/

export async function getLatestArticlesByTag(tag) {
    try {
        const response = await client.getEntries ({
            content_type: 'article',
            'fields.category[in]': tag,
            order: '-sys.createdAt',
            limit: 1,
        });

        if (response.items.length === 0) {
            return null;
        }

        const latestArticle = response.items[0];
        const articleData = {
            slug: latestArticle.fields.slug,
            headline: latestArticle.fields.title,
        };

        return articleData;

    } catch (error) {
        console.error(`Error fetching article for tag "${tag}":`, error);
        return null;
    }
}

/**
 * @returns {Promise<Array<{slug: string, headline: string, publishedAt: string}>>}
 */
export async function getLatestNewsArticles() {
    try {
        const response = await client.getEntries ({
            content_type: 'article',
            order: '-fields.publishDate',
            limit: 8,
        });

        if (response.items.length === 0) {
            return [];
        }

        const newsItems = response.items.map(item => ({
            slug: item.fields.slug,
            headline: items.fields.title,
            publishedAt: items.fields.publishDate,
        }));

        return newsItems;
    } catch (error) {
        console.error("Error fetching latest news articles:", error);
        return [];
    }
}