import React from 'react';
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";
import MarketMarquee from "./components/layout/MarketMarquee";
import type { Metadata } from 'next';
import { Providers } from './components/providers'
import "./global.css";

export const metadata: Metadata = {
  title: "The Profit Papers",
  description: "Financial insights, news and stocks",
  icons: {
    icon: '/favicon-32x32.png',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://theprofitpapers.com",
    siteName: "The Profit Papers",
  },
  twitter: {
    card: "summary_large_image",
    creator: "",
    title: "The Profit Papers",
    description: "Financial insights, news and stocks",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen overflow-x-hidden">
        <Providers>
          <MarketMarquee></MarketMarquee>
          <Header />
          <div className="flex flex-1 overflow-x-hidden">
            <Sidebar />
            <main className="flex-1 overflow-x-hidden">
             {children}
            </main>
          </div>  
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
