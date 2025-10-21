import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/private/',  // Block sensitive (e.g., admin/DB queries)
      crawlDelay: 10,
    },
    sitemap: 'https://theprofitpapers.com/sitemap.xml',  // Your domain—matches sitemap
  };
}