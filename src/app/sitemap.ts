import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages (unchanged—add more as you build)
  const staticPages = [
    {
      url: 'https://yourdomain.com',  // Replace with live URL (Vercel or theprofitpapers.com)
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 1,
    },
    {
      url: 'https://yourdomain.com/about',  // Example—remove if not ready
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ];

  // Dynamic entries: Mock fetch (simulate DB/API for stocks/tickers)
  // In real: await prisma.stock.findMany() or fetch from Polygon.io
  const dynamicPages = await Promise.resolve(  // Fake async fetch—replace with real
    [
      {
        url: 'https://theprofitpapers.com/stocks/AAPL',
        lastModified: new Date('2025-10-01'),  // Use actual last-updated date
        changeFrequency: 'daily' as const,  // Frequent for live prices
        priority: 0.9,
      },
      {
        url: 'https://theprofitpapers.com/stocks/TSLA',
        lastModified: new Date('2025-10-15'),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      // Add more: e.g., { url: 'https://yourdomain.com/financials/GOOGL/revenue' }
    ]
  );

  return [...staticPages, ...dynamicPages];
}