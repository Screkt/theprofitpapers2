import React from 'react';
import { getLatestArticlesByTag, getLatestNewsArticles } from './lib/contentful';
import HomePageClient from './components/HomePageClient';

// This is now a Server Component (no "use client")
export default async function HomePage() {
  // Fetch data on the server during build/request
  let weeklyFocusArticle = null;
  let featuredAnalysisArticle = null;
  let latestNews: Array<{ slug: string; headline: string; publishedAt?: string }> = [];

  try {
    const [wfData, faData, newsData] = await Promise.all([
      getLatestArticlesByTag('weekly-focus'),
      getLatestArticlesByTag('featured-analysis'),
      getLatestNewsArticles(),
    ]);

    weeklyFocusArticle = wfData;
    featuredAnalysisArticle = faData;
    latestNews = newsData;
  } catch (error) {
    console.error("Failed to fetch articles:", error);
  }

  // Pass the data to the Client Component
  return (
    <HomePageClient
      weeklyFocusArticle={weeklyFocusArticle}
      featuredAnalysisArticle={featuredAnalysisArticle}
      latestNews={latestNews}
    />
  );
}