  "use client";

  import React, { useState, useEffect } from 'react';
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  );

  interface ChartDataPoint {
    date: string;
    close: number;
  }

  interface SmallStockChartProps {
    symbol?: string;
    days?: number;
    height?: number;
    width?: number;
  }

  const SmallStockChart: React.FC<SmallStockChartProps> = ({
    symbol = 'SPY',
    days = 7,
    height = 100,
    width = 300,
  }) => {
    const [data, setData] = useState<ChartDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`/stock-market?symbol=${symbol}&days=${days}`);
          if (response.ok) {
            const chartData: ChartDataPoint[] = await response.json();
            setData(chartData);
          } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        } catch (error) {
          console.error('Chart data fetch failed:', error);
          setError('Using fallback data');
          setData([
            { date: 'Oct 19', close: 580.5 },
            { date: 'Oct 20', close: 582.1 },
            { date: 'Oct 21', close: 579.8 },
            { date: 'Oct 22', close: 583.2 },
            { date: 'Oct 23', close: 585.0 },
            { date: 'Oct 24', close: 584.5 },
            { date: 'Oct 25', close: 587.3 },
          ]);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [symbol, days]);

    if (loading) {
      return (
        <div
          className="w-full bg-gray-100 animate-pulse rounded border border-gray-200"
          style={{ height, width }}
        />
      );
    }

    if (data.length === 0) {
      return (
        <div className="text-xs text-gray-500 text-center py-4" style={{ height, width }}>
          No data available
        </div>
      );
    }

    const chartData = {
      labels: data.map((d) => d.date),
      datasets: [
        {
          label: symbol,
          data: data.map((d) => d.close),
          borderColor: '#0A00DB',
          backgroundColor: 'transparent',
          borderWidth: 2,
          tension: 0.1,
          pointRadius: 0,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          cornerRadius: 4,
          callbacks: {
            title: (context: any[]) => `${symbol} on ${context[0].label}`,
            label: (context: any) => `Close: $${context.parsed.y.toFixed(2)}`,
          },
        },
      },
      scales: {
        x: { display: true, grid: { display: true } },
        y: {
          display: true,
          grid: {display: true },
          position: 'right',
        }
      },
      elements: { point: { radius: 0 } },
      interaction: { intersect: false, mode: 'index' }, 
    };

    return (
      <div
        className="relative bg-slate-300 border border-gray-500 rounded-sm shadow-sm overflow-hidden"
        style={{ height, width }}
      >
        <div className="absolute inset-0 p-2">
          <Line data={chartData} options={options as any} />
        </div>
        {error && (
          <div className="absolute bottom-1 right-1 text-xs text-red-500">
          </div>
        )}
      </div>
    );
  };

  export default SmallStockChart;