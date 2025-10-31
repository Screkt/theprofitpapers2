"use client";

import React, { useState } from 'react';
import SmallStockChart from './charts/SmallStockChart';
import TrendingSmallCaps from './stock-banner/TrendingSmallCaps';
import InFocus from './stock-banner/InFocus';
import Link from 'next/link';
import CommoditiesGrid from './stock-banner/CommoditiesGrid';
import YieldsGrid from './stock-banner/YieldsGrid';
import ValuationsGrid from './stock-banner/ValuationsGrid';
import VolatilityGrid from './stock-banner/VolatilityGrid';
import ForexGrid from './stock-banner/ForexGrid';
import CryptoGrid from './stock-banner/CryptoGrid';
import TrendingDividendStocks from './stock-banner/TrendingDividendStocks';
import TrendingAIStocks from './stock-banner/TrendingAIStocks';

interface Article {
  slug: string;
  headline: string;
}

interface NewsItem {
  slug: string;
  headline: string;
  publishedAt?: string;
}

interface HomePageClientProps {
  weeklyFocusArticle: Article | null;
  featuredAnalysisArticle: Article | null;
  latestNews: NewsItem[];
}

interface TruncateWithFadeProps {
  href: string;
  title: string;
  children: React.ReactNode;
}

const TruncateWithFade: React.FC<TruncateWithFadeProps> = ({ href, title, children }) => (
  <a
    href={href}
    className="group h-full flex items-center w-full px-2"
    title={title}
  >
    <div className="truncate-with-fade text-sm font-medium text-gray-800 group-hover:text-black transition-colors w-full">
      {children}
    </div>
  </a>
);

const timeAgo = (dateString: string): string => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d`;
};

export default function HomePageClient({ 
  weeklyFocusArticle, 
  featuredAnalysisArticle, 
  latestNews 
}: HomePageClientProps) {
  const [selectedDays, setSelectedDays] = useState(1);

  const timeframeOptions = [
    {label: '1D', days: 1 },
    {label: '5D', days: 5 },
    {label: '1M', days: 30 },
    {label: '6M', days: 180 },
    {label: 'YTD', days: 255 },
    {label: '1Y', days: 365 },
    {label: '5Y', days: 1825 },
    {label: 'MAX', days: 3650 },
  ];

  const weeklyFocusLink = weeklyFocusArticle ? `/articles/${weeklyFocusArticle.slug}` : '#';
  const weeklyFocusTitle = weeklyFocusArticle 
    ? weeklyFocusArticle.headline 
    : 'No Weekly Focus Article Published';

  const featuredAnalysisLink = featuredAnalysisArticle ? `/articles/${featuredAnalysisArticle.slug}` : '#';
  const featuredAnalysisTitle = featuredAnalysisArticle 
    ? featuredAnalysisArticle.headline 
    : 'No Featured Analysis Article Published';

  const renderNews = () => {
    if (latestNews.length === 0) {
      return <div className="p-2 text-sm text-gray-500">No recent articles found.</div>;
    }

    return (
      <div className="flex flex-col space-y-1 mt-1 overflow-y-auto max-h-[170px] pr-1">
        {latestNews.map((item, index) => (
          <a
            key={item.slug + index}
            href={`/articles/${item.slug}`}
            className="flex items-start px-2 py-0.5 hover:bg-gray-300 transition-colors group"
          >
            {item.publishedAt && (
              <span className="text-[10px] w-6 text-gray-500 font-bold mr-1.5 flex-0 pt-0.5">
                {timeAgo(item.publishedAt)}
              </span>
            )}
            <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 leading-tight">
              {item.headline}
            </span>
          </a>
        ))}
        <a href="/news" className="text-right text-xs text-blue-600 hover:underline pt-1 pr-2">
          See All News &raquo;
        </a>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="h-60 m-2 rounded grid grid-cols-3 gap-4 bg-gray-200 font-serif shadow-md">
        <div className="p-4 flex items-center justify-center text-gray-500">
        </div>
        <div className="mt-1 mr-8 flex flex-col items-center">
          <div className="flex space-x-1 mb-2">
            {timeframeOptions.map((option) => (
            <button
              key={option.label}
              onClick={() => setSelectedDays(option.days)}
              className={`px-3 py-2 text-[10px] flex flex-col rounded transition-colors cursor-pointer ${
                selectedDays === option.days
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              {option.label}
            </button>
          ))}
          </div>
          <SmallStockChart
            days={selectedDays}
            width={450}
            height={190}
          />
        </div>
        <div className="border-gray-400 p-1">
          <div className="flex justify-between items-center border-b border-gray-400 mb-1 pb-1">
            <h4 className="text-[16px] text-black font-semibold ml-1">
              Latest
            </h4>
          </div>
          {renderNews()}
        </div>
      </div>
      <div className="h-15 m-2 bg-gray-200 rounded flex items-stretch min-w-0 overflow-x-auto">
        <div className="w-full">
          <InFocus />
        </div>
      </div>
      <div>
        <div className="h-12 ml-2 mr-2 flex rounded border border-black bg-gray-200 items-center">
          <h3 className="text-[18px] w-35 p-2 rounded text-black font-semibold bg-red-200 border-2 border-red-500">
            Weekly Focus
          </h3>
          <div className="flex-1 h-full flex items-center justify-center rounded overflow-hidden">
            <TruncateWithFade
              href={weeklyFocusLink}
              title={weeklyFocusTitle}
            >
              {weeklyFocusTitle}
            </TruncateWithFade>
          </div>
          <h3 className="text-[18px] w-44 p-2 rounded text-black font-semibold bg-green-200 border-2 border-green-500">
            Featured Analysis
          </h3>
          <div className="flex-1 h-full flex items-center justify-center rounded overflow-hidden">
            <TruncateWithFade
              href={featuredAnalysisLink}
              title={featuredAnalysisTitle}
            >
              {featuredAnalysisTitle}
            </TruncateWithFade>
          </div>
        </div>
      </div>
      <div className="h-full m-2 pb-2 pt-1 rounded grid grid-cols-2 bg-gray-200 font-serif">
        <div>
          <h4 className="text-[32px] m-1 rounded border border-gray-800 text-black bg-gray-300 flex flex-col items-center">
            Featured Articles
          </h4>
        </div>
        <div className="flex flex-col h-full border-l">
          <Link href="/markets/market-data">
            <h4 className="text-[22px] m-1 rounded border border-gray-800 text-black bg-gray-300 flex flex-col items-center justify-center">
                Market Data
            </h4>
          </Link>
          <div className="flex flex-col gap-0">
            <Link href="/markets/commodities">
              <div className="bg-gray-400 border border-black rounded p-1 m-1 hover:bg-gray-300">
                <h5 className="text-[14px] text-bold font-serif text-center">
                  Commodities
                </h5>
              </div>
            </Link>
            <div className="flex-1 cursor-pointer">
              <CommoditiesGrid />
            </div>
          </div>
          <div className="flex flex-col gap-0">
            <div className="bg-gray-400 border border-black rounded p-1 m-1">
              <h5 className="text-[14px] text-bold font-serif text-center">
                Treasury Yields
              </h5>
            </div>
            <div className="flex-1">
              <YieldsGrid />
            </div>
          </div>
          <div className="flex flex-col gap-0">
            <div className="bg-gray-400 border border-black rounded p-1 m-1">
              <h5 className="text-[14px] text-bold font-serif text-center">
                Market Valuations
              </h5>
            </div>
            <div className="flex-1">
              <ValuationsGrid />
            </div>
          </div>
          <div className="flex flex-col gap-0">
            <div className="bg-gray-400 border border-black rounded p-1 m-1">
              <h5 className="text-[14px] text-bold font-serif text-center">
                Volatility Indicators
              </h5>
            </div>
            <div className="flex-1">
              <VolatilityGrid />
            </div>
          </div>
          <div className="flex flex-col gap-0">
            <div className="bg-gray-400 border border-black rounded p-1 m-1">
              <h5 className="text-[14px] text-bold font-serif text-center">
                Forex Majors
              </h5>
            </div>
            <div className="flex-1">
              <ForexGrid />
            </div>
          </div>
          <div className="flex flex-col gap-0">
            <div className="bg-gray-400 border border-black rounded p-1 m-1">
              <h5 className="text-[14px] text-bold font-serif text-center">
                Crypto Markets
              </h5>
            </div>
            <div className="flex-1">
              <CryptoGrid />
            </div>
          </div>
        </div>
      </div>
      <div className="h-15 m-2 bg-gray-200 rounded flex items-stretch min-w-0 overflow-x-auto">
        <div className="w-full">
          <TrendingSmallCaps />
        </div>
      </div>
      <div className="flex-1 h-full bg-gray-200 m-2 rounded flex flex-col">
        <div className="m-2 font-serif">
          <h4 className="w-full text-center text-[32px] rounded border border-black bg-gray-300">        
            Weekly Market Calendar  
          </h4>
        </div>
        <div className="ml-2 mr-2 mb-2 rounded flex-1 grid grid-cols-5 gap-1 p-2 overflow-y-auto bg-gray-300">
          <div className="bg-white rounded p-2 text-center border border-gray-800">
            <h5 className="text-[20px] font-bold text-black mb-1">Monday</h5>
            <p className="text-[14px] text-black">2:00 PM ET</p>
            <p className="text-[14px] text-gray-800"></p>
          </div>
          <div className="bg-white rounded p-2 text-center border border-gray-800">
            <h5 className="text-[20px] font-bold text-black mb-1">Tuesday</h5>
            <p className="text-[14px] text-black">2:00 PM ET</p>
            <p className="text-[14px] text-gray-800"></p>
          </div>
          <div className="bg-white rounded p-2 text-center border border-gray-800">
            <h5 className="text-[20px] font-bold text-black mb-1">Wednesday</h5>
            <p className="text-[14px] text-black">2:00 PM ET</p>
            <p className="text-[14px] text-gray-800"></p>
          </div>
          <div className="bg-white rounded p-2 text-center border border-gray-800">
            <h5 className="text-[20px] font-bold text-black mb-1">Thursday</h5>
            <p className="text-[14px] text-black">2:00 PM ET</p>
            <p className="text-[14px] text-gray-800"></p>
          </div>
          <div className="bg-white rounded p-2 text-center border border-gray-800">
            <h5 className="text-[20px] font-bold text-black mb-1">Friday</h5>
            <p className="text-[14px] text-black">2:00 PM ET</p>
            <p className="text-[14px] text-gray-800"></p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 m-2 gap-2">
        <div className="h-full bg-gray-200 rounded">
          <TrendingDividendStocks />
        </div>
        <div className="h-full bg-gray-200 rounded">
          <TrendingAIStocks />
        </div>
      </div>
      <div className="flex-1 h-full bg-gray-200 m-2 rounded flex flex-col">
        <div className="items-center p-2 font-serif">
          <h5 className="text-[30px] text-center bg-gray-300 rounded border border-black">
            Popular Investment Tools
          </h5>
        </div>
        <div className="ml-2 mr-2 mb-2 rounded flex-1 grid grid-cols-5 gap-1 p-2 overflow-y-auto bg-gray-300">
          <Link href="stocks/stock-screener">
            <div className="bg-white rounded p-2 text-center border border-gray-800 cursor-pointer">
              <h5 className="text-[20px] font-bold text-black mb-1 bg-gray-200 rounded p-1 hover:bg-gray-300">
                Stock Screener
              </h5>
              <p className="text-[14px] text-black">
                Use our stock screener to find the best opportunities in the market today
              </p>
            </div>
          </Link>
          <Link href="tools/dcf-calculator">
            <div className="bg-white rounded p-2 text-center border border-gray-800 cursor-pointer">
              <h5 className="text-[20px] font-bold text-black mb-1 bg-gray-200 rounded p-1 hover:bg-gray-300">
                DCF Calculator
              </h5>
              <p className="text-[14px] text-black">
                Our Discounted Cash Flow calculator lets you see the true value of a company in seconds
              </p>
            </div>
          </Link>
          <Link href="portfolios/model-portfolios">
            <div className="bg-white rounded p-2 text-center border border-gray-800 cursor-pointer">
              <h5 className="text-[20px] font-bold text-black mb-1 bg-gray-200 rounded p-1 hover:bg-gray-300">
                Model Portfolio
              </h5>
              <p className="text-[14px] text-black">
                Create custom portfolios and track their performance through market changes
              </p>
            </div>
          </Link>
          <Link href="tools/dividend-calculator">
            <div className="bg-white rounded p-2 text-center border border-gray-800 cursor-pointer">
              <h5 className="text-[20px] font-bold text-black mb-1 bg-gray-200 rounded p-1 hover:bg-gray-300">
                Dividend Calculator
              </h5>
              <p className="text-[14px] text-black">
                Calculate the future dividend income a company could provide you, with reinvestment options too
              </p>
            </div>
          </Link>
          <Link href="tools/stock-comparison-tool">
            <div className="bg-white rounded p-2 text-center border border-gray-800 cursor-pointer">
              <h5 className="text-[20px] font-bold text-black mb-1 bg-gray-200 rounded p-1 hover:bg-gray-300">
                Stock Comparison
              </h5>
              <p className="text-[14px] text-black">
                Compare companies on valuation, profitability, momentum and much more
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}