"use client";

import React, { useState, useRef } from "react";
import { Expense } from "@/types";

export type CategPieProps = {
  expense: Expense[];
};

const colors = [
  "url(#purple1)",
  "url(#purple2)",
  "url(#purple3)",
  "url(#purple4)",
  "url(#purple5)",
  "url(#purple6)",
  "url(#purple7)",
  "url(#purple8)",
  "url(#purple9)",
  "url(#purple10)",
];

const gradients = (
  <defs>
    <linearGradient id="purple1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#a855f7" />
      <stop offset="100%" stopColor="#8b5cf6" />
    </linearGradient>
    <linearGradient id="purple2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#8b5cf6" />
      <stop offset="100%" stopColor="#7c3aed" />
    </linearGradient>
    <linearGradient id="purple3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#7c3aed" />
      <stop offset="100%" stopColor="#6d28d9" />
    </linearGradient>
    <linearGradient id="purple4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#6d28d9" />
      <stop offset="100%" stopColor="#5b21b6" />
    </linearGradient>
    <linearGradient id="purple5" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#c084fc" />
      <stop offset="100%" stopColor="#a855f7" />
    </linearGradient>
    <linearGradient id="purple6" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#d8b4fe" />
      <stop offset="100%" stopColor="#c084fc" />
    </linearGradient>
    <linearGradient id="purple7" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#e9d5ff" />
      <stop offset="100%" stopColor="#d8b4fe" />
    </linearGradient>
    <linearGradient id="purple8" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#f3e8ff" />
      <stop offset="100%" stopColor="#e9d5ff" />
    </linearGradient>
    <linearGradient id="purple9" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#ddd6fe" />
      <stop offset="100%" stopColor="#c084fc" />
    </linearGradient>
    <linearGradient id="purple10" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#a855f7" />
      <stop offset="100%" stopColor="#c084fc" />
    </linearGradient>
  </defs>
);

function getPieData(expense: Expense[]) {
  const grouped: Record<string, number> = {};
  expense.forEach((exp) => {
    const cat = exp.category || "Uncategorized";
    grouped[cat] = (grouped[cat] || 0) + exp.amount;
  });
  return Object.entries(grouped)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function getPieSegments(data: { name: string; value: number }[]) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulative = 0;
  return data.map((d, i) => {
    const startAngle = (cumulative / total) * 2 * Math.PI;
    const angle = (d.value / total) * 2 * Math.PI;
    cumulative += d.value;
    return {
      ...d,
      startAngle,
      endAngle: startAngle + angle,
      color: colors[i % colors.length],
      percent: total ? (d.value / total) * 100 : 0,
    };
  });
}

function describeArc(cx: number, cy: number, r: number, start: number, end: number) {
  const x1 = cx + r * Math.cos(start);
  const y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(end);
  const y2 = cy + r * Math.sin(end);
  const largeArc = end - start > Math.PI ? 1 : 0;
  return [
    `M ${cx} ${cy}`,
    `L ${x1} ${y1}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
    "Z",
  ].join(" ");
}

const CategPie: React.FC<CategPieProps> = ({ expense }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const pieData = getPieData(expense);
  const segments = getPieSegments(pieData);
  const total = pieData.reduce((sum, d) => sum + d.value, 0);
  const hoveredSeg = segments.find((seg) => seg.name === hovered);

  React.useEffect(() => {
    setMounted(true);
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  // Handlers to prevent flicker
  const handleEnter = (name: string) => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setHovered(name);
  };
  const handleLeave = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => setHovered(null), 100);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4 text-white">Spending by Category</h2>
      <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg p-6 flex flex-col items-center">
        <div className={`relative w-[260px] h-[260px] mb-6 transition-all duration-700 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <svg width={240} height={240} viewBox="0 0 240 240">
            {gradients}
            {segments.map((seg) =>
              seg.value > 0 ? (
                <path
                  key={seg.name}
                  d={describeArc(120, 120, 100, seg.startAngle, seg.endAngle)}
                  fill={seg.color}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth={2}
                  style={{
                    transition: "fill 0.3s, transform 0.3s",
                    transform: hovered === seg.name ? "scale(1.06)" : "scale(1)",
                    filter: hovered === seg.name ? "drop-shadow(0 0 12px #a855f7cc)" : "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => handleEnter(seg.name)}
                  onMouseLeave={handleLeave}
                />
              ) : null
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {hoveredSeg ? (
              <div className="px-6 py-3 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 shadow-lg text-center animate-fade-in transition-all duration-200">
                <div className="text-lg font-bold text-white mb-1">{hoveredSeg.name}</div>
                <div className="text-xl font-extrabold text-purple-200 mb-1">₹{hoveredSeg.value.toLocaleString("en-IN")}</div>
                <div className="text-sm text-white/80">{hoveredSeg.percent.toFixed(1)}% of total</div>
              </div>
            ) : (
              <>
                <div className="text-3xl font-extrabold text-white drop-shadow-lg">
                  ₹{total.toLocaleString("en-IN")}
                </div>
                <div className="text-base text-white/80 font-medium">Total Spent</div>
              </>
            )}
          </div>
        </div>
        <div className="w-full max-w-[320px] space-y-2">
          {segments.map(
            (seg) =>
              seg.value > 0 && (
                <div
                  key={seg.name}
                  className={`flex items-center justify-between px-2 transition-all duration-200 rounded-lg ${hovered === seg.name ? 'bg-white/10 backdrop-blur' : ''}`}
                  onMouseEnter={() => handleEnter(seg.name)}
                  onMouseLeave={handleLeave}
                  style={{ cursor: "pointer" }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-4 h-4 rounded-full border border-white/30"
                      style={{ background: seg.color }}
                    />
                    <span className="text-white font-medium">{seg.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-semibold">
                      ₹{seg.value.toLocaleString("en-IN")}
                    </span>
                    <span className="ml-2 text-xs text-white/60">
                      {seg.percent.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default CategPie;
