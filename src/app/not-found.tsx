import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-6">
          Stock Not Found? Or Page Vanished Like a Bear Market.
        </h2>
        <p className="text-gray-500 mb-8 max-w-md">
          Sorry, the page you&apos;re looking for isn&apos;t trading today. Head back to the dashboard for revenue trends and tickers.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}