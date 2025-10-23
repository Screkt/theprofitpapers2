import React from 'react';
import Header from "@/app/components/layout/Header";
import Sidebar from "@/app/components/layout/Sidebar";
import Footer from "@/app/components/layout/Footer";
import type { Metadata } from 'next';
import "./global.css";

export const metadata: Metadata = {
  title: "The Profit Papers",
  description: "Financial insights, news and stocks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1">
            {children}
          </main>
        </div>  
        <Footer />
      </body>
    </html>
  );
}
