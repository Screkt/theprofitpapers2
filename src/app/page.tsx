"use client";  // Enables client-side interactivity for the chart

import dynamic from 'next/dynamic';  // Lazy-loads the chart (faster loads)
import { ApexOptions } from 'apexcharts';  // NEW: For proper TS typing

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function HomePage() {
  const chartOptions: ApexOptions = {  // NEW: Typed as ApexOptions
    chart: {
      type: 'line' as const,
      height: 350,
      zoom: { enabled: true },  // Zoom/pan for trends
    },
    xaxis: {
      categories: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    },
    yaxis: {
      title: { text: 'Revenue ($M)' },
    },
    title: {
      text: 'Sample 10-Year Revenue Trend',
      align: 'center',
    },
    stroke: { curve: 'smooth' },  // Nice curves for financial lines
    tooltip: { shared: true, intersect: false },  // Hovers with details
    colors: ['#3b82f6'],  // Tailwind blue for branding
  };

  const chartSeries = [
    {
      name: 'Revenue',
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 150],  // Mock data—replace with real later
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        The Profit Papers v2
      </h1>
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="line"
          height={350}
        />
      </div>
      <p className="mt-4 text-sm text-gray-600 text-center">
        Hover/zoom to explore—powered by ApexCharts & Tailwind.
      </p>
    </main>
  );
}