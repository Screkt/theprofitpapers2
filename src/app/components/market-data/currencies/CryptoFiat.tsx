"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";

interface CryptoCorrelationData {
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

type SortConfig = { key: keyof CryptoCorrelationData | null; direction: "asc" | "desc" };

const MOCK_CORRELATION: CryptoCorrelationData[] = [
  { crypto: "BTC", fiat: "USD", correlation: 0.87, lastUpdated: new Date().toISOString(), fiveDay: 0.88, oneMonth: 0.85, oneYear: 0.82 },
  { crypto: "BTC", fiat: "EUR", correlation: 0.82, lastUpdated: new Date().toISOString(), fiveDay: 0.80, oneMonth: 0.79, oneYear: 0.81 },
  { crypto: "ETH", fiat: "USD", correlation: 0.78, lastUpdated: new Date().toISOString(), fiveDay: 0.75, oneMonth: 0.77, oneYear: 0.73 },
  { crypto: "ETH", fiat: "EUR", correlation: 0.73, lastUpdated: new Date().toISOString(), fiveDay: 0.72, oneMonth: 0.71, oneYear: 0.70 },
  { crypto: "LTC", fiat: "USD", correlation: 0.65, lastUpdated: new Date().toISOString(), fiveDay: 0.64, oneMonth: 0.63, oneYear: 0.62 },
  { crypto: "BNB", fiat: "EUR", correlation: 0.55, lastUpdated: new Date().toISOString(), fiveDay: 0.57, oneMonth: 0.56, oneYear: 0.54 },
];

const CryptoCorrelationGrid: React.FC = () => {
  const [data, setData] = useState<CryptoCorrelationData[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: "desc" });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setData(MOCK_CORRELATION);
  }, []);

  const handleSort = (key: keyof CryptoCorrelationData) => {
    let direction: "asc" | "desc" = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") direction = "asc";
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key!];
      const bVal = b[sortConfig.key!];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const scrollTable = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    const offset = containerRef.current.clientWidth * 0.8;
    containerRef.current.scrollBy({ left: direction === "left" ? -offset : offset, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col w-full font-sans bg-white">
      <div className="flex justify-end space-x-2 mb-2">
        <button onClick={() => scrollTable("left")} className="p-1 bg-gray-200 rounded hover:bg-gray-300">‹</button>
        <button onClick={() => scrollTable("right")} className="p-1 bg-gray-200 rounded hover:bg-gray-300">›</button>
      </div>

      <div ref={containerRef} className="overflow-auto border rounded shadow max-w-full">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[100px_80px_80px_80px_80px_80px] bg-gray-100 font-bold text-gray-700 border-b p-2 sticky top-0 z-10">
            <button onClick={() => handleSort("crypto")}>Crypto</button>
            <button onClick={() => handleSort("fiat")}>Fiat</button>
            <button onClick={() => handleSort("correlation")}>Corr</button>
            <button onClick={() => handleSort("fiveDay")}>5D</button>
            <button onClick={() => handleSort("oneMonth")}>1M</button>
            <button onClick={() => handleSort("oneYear")}>1Y</button>
          </div>

          {sortedData.map((row, index) => (
            <div key={`${row.crypto}-${row.fiat}`} className={`grid grid-cols-[120px_80px_80px_80px_80px_80px] border-b p-2 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
              <span className="font-medium">{row.crypto}</span>
              <span>{row.fiat}</span>
              <span>{row.correlation.toFixed(2)}</span>
              <span>{row.fiveDay?.toFixed(2) ?? "-"}</span>
              <span>{row.oneMonth?.toFixed(2) ?? "-"}</span>
              <span>{row.oneYear?.toFixed(2) ?? "-"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CryptoCorrelationGrid;
