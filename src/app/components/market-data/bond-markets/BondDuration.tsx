import React, { useState, useEffect, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

interface YieldCurvePoint {
  maturity: string;
  yield: number;
  change: number;
}

const formatBasisPoints = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)} bps`;
};

const App: React.FC = () => {
  const [data, setData] = useState<YieldCurvePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const maturityOrder = ['1M', '3M', '6M', '1Y', '2Y', '3Y', '5Y', '7Y', '10Y', '20Y', '30Y'];
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/us-bonds'); 
        if (!response.ok) {
          throw new Error('Failed to fetch yield curve data from API.');
        }
        const result: YieldCurvePoint[] = await response.json();
        
        const sortedData = result.sort((a, b) => maturityOrder.indexOf(a.maturity) - maturityOrder.indexOf(b.maturity));
        
        if (sortedData.length === 0 || !sortedData.every(p => 'maturity' in p && 'yield' in p)) {
             throw new Error("Received unexpected data format. Check if the backend is returning the YieldCurvePoint interface.");
        }

        setData(sortedData);
      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError(err.message || 'An unknown error occurred. Using mock data.');
        
        const mockCurveData: YieldCurvePoint[] = maturityOrder.map((m, i) => ({
            maturity: m,
            yield: 2.0 + (i * 0.2), 
            change: Math.random() * 0.1 - 0.05 
        }));
        setData(mockCurveData);
        
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const curveStatus = useMemo(() => {
      const tenYearYield = data.find(p => p.maturity === '10Y')?.yield;
      const twoYearYield = data.find(p => p.maturity === '2Y')?.yield;
      
      if (tenYearYield === undefined || twoYearYield === undefined) {
          return { status: 'Calculating...', color: 'bg-gray-100 text-gray-700', spread: 'N/A' };
      }
      
      const spread = tenYearYield - twoYearYield;
      const spreadFormatted = spread.toFixed(2);
      
      if (spread < -0.1) {
          return { status: 'Inverted (Recession Signal)', color: 'bg-red-100 text-red-700', spread: spreadFormatted };
      } else if (spread < 0.2) {
          return { status: 'Flat (Transition/Uncertainty)', color: 'bg-yellow-100 text-yellow-700', spread: spreadFormatted };
      } else {
          return { status: 'Normal (Expansion)', color: 'bg-green-100 text-green-700', spread: spreadFormatted };
      }
  }, [data]);

  const chartOptions: ApexCharts.ApexOptions = useMemo(() => ({
    chart: {
        type: 'line',
        toolbar: { show: true, tools: { download: true } },
        zoom: { enabled: true },
        background: '#ffffff', 
    },
    xaxis: {
        categories: data.map(p => p.maturity),
        title: {
            text: 'Maturity (Duration)',
            style: { color: '#4b5563', fontSize: '14px', fontWeight: 600 },
        },
        labels: {
            style: { colors: '#4b5563' },
        },
        axisBorder: { show: true, color: '#4b5563' },
        axisTicks: { show: true, color: '#4b5563' },
    },
    yaxis: {
        title: {
            text: 'Yield (%)',
            style: { color: '#4b5563', fontSize: '14px', fontWeight: 600 },
        },
        labels: {
            formatter: (value) => `${value.toFixed(2)}%`,
            style: { colors: '#4b5563' },
        },
        min: data.length > 0 ? Math.min(...data.map(p => p.yield)) - 0.1 : undefined,
        max: data.length > 0 ? Math.max(...data.map(p => p.yield)) + 0.1 : undefined,
    },
    stroke: {
        curve: 'smooth',
        width: 4,
        colors: ['#4f46e5'],
    },
    markers: {
        size: 6,
        colors: ['#4f46e5'],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: { size: 9 },
    },
    tooltip: {
        custom: function({ series, seriesIndex, dataPointIndex, w }) {
            const point = data[dataPointIndex];
            if (!point) return '';
            
            const changeValue = point.change;
            const changeIcon = changeValue > 0 ? '▲' : changeValue < 0 ? '▼' : '—'; 
            const formattedChange = formatBasisPoints(changeValue);

            const colorStyle = `color: ${changeValue > 0 ? 'green' : changeValue < 0 ? 'red' : 'gray'};`;

            return (
                '<div class="bg-white/95 backdrop-blur-sm p-3 border border-gray-200 shadow-xl rounded-lg text-sm">' +
                `<p class="font-semibold text-gray-700">${point.maturity} Maturity</p>` +
                `<p class="text-xl font-extrabold text-indigo-700 mt-1">${point.yield.toFixed(2)}%</p>` +
                `<div class="mt-1 font-medium" style="${colorStyle}">` +
                    `<span class="mr-1">${changeIcon}</span>` +
                    `<span>${formattedChange} (Daily Change)</span>` +
                '</div>' +
                '</div>'
            );
        },
        shared: false,
        intersect: true,
    },
    grid: {
        borderColor: '#e0e0e0',
        strokeDashArray: 4,
    }
  }), [data]);
  
  const series = useMemo(() => [{
    name: 'Yield (%)',
    data: data.map(p => p.yield),
  }], [data]);


  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[500px] bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-indigo-600">Loading US Treasury Yield Curve Data...</p>
        <p className="mt-2 text-sm text-gray-500">Retrieving maturities from 1 month to 30 years.</p>
      </div>
    );
  }

  if (error) {
      return (
        <div className="flex flex-col w-full h-full font-sans bg-gray-50 p-4 sm:p-6 rounded-lg shadow-xl border border-gray-200">
            <div className={`p-3 mb-2 rounded-lg font-bold text-lg text-center shadow-md ${curveStatus.color}`}>
                Curve Status (10Y - 2Y Spread: {curveStatus.spread}%): {curveStatus.status}
            </div>
            <div className="bg-white p-2 rounded-xl shadow-inner h-[400px] w-full border border-gray-100">
                <ReactApexChart options={chartOptions} series={series} type="line" height="100%" />
            </div>
            <div className="mt-2 p-4 bg-gray-100 rounded-lg border border-gray-300">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Duration Summary</h3>
                <p className="text-sm text-gray-600">
                    The slope of this curve directly relates to **bond duration**. When rates rise (the line shifts up), the prices of bonds with **longer maturities** (higher duration, right side of the chart) fall more dramatically than those with shorter maturities. This chart allows you to visually select the desired duration exposure.
                </p>
            </div>
        </div>
    );
  }
  
  return (
    <div className="flex flex-col w-full h-full font-sans bg-gray-50 p-4 sm:p-6 rounded-lg shadow-xl border border-gray-200">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">US Treasury Yield Curve (Maturity vs. Yield)</h1>
      <p className="text-gray-600 mb-4 border-b pb-4">
        This line chart plots the current interest rates for Treasury securities, providing a visual assessment of market risk and economic expectations.
      </p>
      
      <div className={`p-3 mb-6 rounded-lg font-bold text-lg text-center shadow-md ${curveStatus.color}`}>
          Curve Status (10Y - 2Y Spread: {curveStatus.spread}%): {curveStatus.status}
      </div>

      <div className="bg-white p-2 rounded-xl shadow-inner h-[400px] w-full border border-gray-100">
        <ReactApexChart options={chartOptions} series={series} type="line" height="100%" />
      </div>
      
      <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-300">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Duration Summary</h3>
          <p className="text-sm text-gray-600">
              The slope of this curve directly relates to **bond duration**. When rates rise (the line shifts up), the prices of bonds with **longer maturities** (higher duration, right side of the chart) fall more dramatically than those with shorter maturities. This chart allows you to visually select the desired duration exposure.
          </p>
      </div>
      
    </div>
  );
};

export default App;