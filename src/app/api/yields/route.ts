import { NextResponse } from 'next/server';

const FRED_API_KEY = process.env.FRED_API_KEY;
const BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';
const SERIES_IDS = ['DGS3MO', 'DGS1', 'DGS2', 'DGS3', 'DGS5', 'DGS7', 'DGS10', 'DGS30'];

const SYMBOL_MAP: { [key: string]: string } = {
  'DGS3MO': '3M', 'DGS1': '1Y', 'DGS2': '2Y', 'DGS3': '3Y',
  'DGS5': '5Y', 'DGS7': '7Y', 'DGS10': '10Y', 'DGS30': '30Y'
};

export async function GET() {
  if (!FRED_API_KEY) {
    return NextResponse.json({ error: 'FRED API key not set' }, { status: 500 });
  }

  try {
    const fetches = SERIES_IDS.map(async (seriesId) => {
      const url = `${BASE_URL}?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&limit=2&sort_order=desc`; // Last 2 obs for change calc
      const res = await fetch(url);
      if (!res.ok) throw new Error(`FRED error for ${seriesId}: ${res.status}`);
      const data = await res.json();
      const obs = data.observations || [];
      if (obs.length < 2) throw new Error(`Insufficient data for ${seriesId}`);
      
      const latest = parseFloat(obs[0].value);
      const prev = parseFloat(obs[1].value);
      const change = Math.round((latest - prev) * 100);

      return { symbol: SYMBOL_MAP[seriesId], yield: latest, change };
    });

    const yields = await Promise.all(fetches);
    return NextResponse.json(yields);
  } catch (error: any) {
    console.error('Yields fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}