import { NextResponse } from 'next/server';

const CRYPTOS = ['BTC', 'ETH', 'LTC', 'BNB'];
const FIATS = ['USD', 'EUR'];

const CURRENT_DATE = new Date();
const FIVE_DAY_AGO = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
const ONE_MONTH_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
const THREE_MONTH_AGO = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
const ONE_YEAR_AGO = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
const THREE_YEAR_AGO = new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000);
const FIVE_YEAR_AGO = new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000);
const TEN_YEAR_AGO = new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000);
const YTD_START = new Date(new Date().getFullYear(), 0, 1);

interface CorrelationData {
  crypto: string;
  fiat: string;
  correlation: number;
  lastUpdated: string;
  fiveDay?: number;
  oneMonth?: number;
  threeMonth?: number;
  ytd?: number;
  oneYear?: number;
  threeYear?: number;
  fiveYear?: number;
  tenYear?: number;
}

export async function GET() {
  try {
    const correlations: CorrelationData[] = [];

    for (const crypto of CRYPTOS) {
      for (const fiat of FIATS) {
        correlations.push({
          crypto,
          fiat,
          correlation: Math.random(), 
          lastUpdated: new Date().toISOString(),
          fiveDay: Math.random(),
          oneMonth: Math.random(),
          threeMonth: Math.random(),
          ytd: Math.random(),
          oneYear: Math.random(),
          threeYear: Math.random(),
          fiveYear: Math.random(),
          tenYear: Math.random(),
        });
      }
    }

    return NextResponse.json(correlations);
  } catch (error) {
    console.error('Error fetching correlation:', error);
    return NextResponse.json([], { status: 500 });
  }
}
