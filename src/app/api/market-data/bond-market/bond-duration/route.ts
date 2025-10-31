import { NextResponse } from 'next/server';

// NOTE: Polygon API Key is assumed to be set in the environment variables.
// For Yield Curve data, we would typically use the Federal Reserve (FRED) or a specialized bond data API, 
// as Polygon's direct ETF/stock endpoints are not ideal for official Treasury yields.
const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
const BASE_URL = 'https://api.polygon.io';
const TICKERS = ['TLT', 'BNDX', 'BWX', 'IGOV', 'EMB', 'PCY', 'IBND', 'ISTB', 'BND', 'SPGB', 'IHYF'];
const CURRENT_DATE = new Date().toISOString().split('T')[0];

const FIVE_DAY_AGO = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const ONE_MONTH_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const THREE_MONTH_AGO = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const ONE_YEAR_AGO = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const THREE_YEAR_AGO = new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const FIVE_YEAR_AGO = new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const TEN_YEAR_AGO = new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const YTD_START = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];

interface YieldCurvePoint {
  maturity: string;
  yield: number;
  change: number; 
}

export async function GET() {
  if (!POLYGON_API_KEY) {
    console.warn('Polygon API key not set. Returning mock Yield Curve data.');
  }

  try {
    const mockCurveData: YieldCurvePoint[] = [
      { maturity: '1M', yield: 5.51, change: 0.01 },
      { maturity: '3M', yield: 5.48, change: 0.00 },
      { maturity: '6M', yield: 5.45, change: -0.01 },
      { maturity: '1Y', yield: 5.35, change: -0.02 },
      { maturity: '2Y', yield: 5.15, change: -0.03 },
      { maturity: '3Y', yield: 5.00, change: -0.01 },
      { maturity: '5Y', yield: 4.80, change: 0.02 },
      { maturity: '7Y', yield: 4.75, change: 0.03 },
      { maturity: '10Y', yield: 4.70, change: 0.04 },
      { maturity: '20Y', yield: 4.90, change: 0.03 },
      { maturity: '30Y', yield: 4.85, change: 0.05 },
    ];
    
    return NextResponse.json(mockCurveData);

  } catch (error: any) {
    console.error('Yield Curve fetch error:', error);
    
    const fallbackCurveData: YieldCurvePoint[] = [
      { maturity: '1M', yield: 5.51, change: 0.01 },
      { maturity: '3M', yield: 5.48, change: 0.00 },
      { maturity: '6M', yield: 5.45, change: -0.01 },
      { maturity: '1Y', yield: 5.35, change: -0.02 },
      { maturity: '2Y', yield: 5.15, change: -0.03 },
      { maturity: '3Y', yield: 5.00, change: -0.01 },
      { maturity: '5Y', yield: 4.80, change: 0.02 },
      { maturity: '7Y', yield: 4.75, change: 0.03 },
      { maturity: '10Y', yield: 4.70, change: 0.04 },
      { maturity: '20Y', yield: 4.90, change: 0.03 },
      { maturity: '30Y', yield: 4.85, change: 0.05 },
    ];

    return NextResponse.json(fallbackCurveData);
  }
}