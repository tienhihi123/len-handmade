import { useId, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { motion } from "motion/react";

export interface CryptoLineChartPoint {
  key: string;
  label: string;
  value: number;
  secondaryLabel?: string;
}

interface CryptoLineChartProps {
  data: CryptoLineChartPoint[];
  height?: number;
  formatValue?: (value: number) => string;
  emptyLabel?: string;
}

const VIEW_W = 800;

/** Catmull-Rom -> cubic Bézier smoothing, the same technique trading-chart libs use for a fluid (not jagged) line. */
function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export default function CryptoLineChart({ data, height = 280, formatValue, emptyLabel = "Chưa có dữ liệu." }: CryptoLineChartProps) {
  const gradientId = useId();
  const glowId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const fmt = formatValue ?? ((v: number) => `${v.toLocaleString("vi-VN")}đ`);

  const padX = 44;
  const padRight = 96; // extra room so the right-edge price tag never overflows the card
  const padTop = 26;
  const padBottom = 34;
  const plotW = VIEW_W - padX - padRight;
  const plotH = height - padTop - padBottom;
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const minValue = Math.min(...data.map((d) => d.value), 0);
  const range = Math.max(maxValue - minValue, 1);

  const points = useMemo(
    () =>
      data.map((d, i) => ({
        x: padX + (data.length === 1 ? plotW / 2 : (i / (data.length - 1)) * plotW),
        y: padTop + plotH - ((d.value - minValue) / range) * plotH
      })),
    [data, plotW, plotH, minValue, range]
  );

  if (data.length === 0) {
    return <p className="text-xs text-brand-fb/50 italic py-8 text-center">{emptyLabel}</p>;
  }

  const linePath = buildSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padTop + plotH} L ${points[0].x} ${padTop + plotH} Z`;

  const last = data[data.length - 1];
  const prev = data[data.length - 2] ?? last;
  const isUp = last.value >= prev.value;
  const trendColor = isUp ? "#A8B59A" : "#BA1A1A";
  const lastPoint = points[points.length - 1];

  const hovered = hoverIndex !== null ? data[hoverIndex] : null;
  const hoveredPoint = hoverIndex !== null ? points[hoverIndex] : null;
  const prevHoveredPoint = hoverIndex !== null && hoverIndex > 0 ? points[hoverIndex - 1] : null;

  const handleMove = (e: ReactMouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * VIEW_W;
    let closest = 0;
    let closestDist = Infinity;
    points.forEach((p, i) => {
      const dist = Math.abs(p.x - relX);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    setHoverIndex(closest);
  };

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${height}`}
        className="w-full bg-white/60 rounded-2xl p-4 border border-brand-primary/10"
        style={{ height }}
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={trendColor} stopOpacity="0.32" />
            <stop offset="100%" stopColor={trendColor} stopOpacity="0" />
          </linearGradient>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* gridlines */}
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1={padX} x2={VIEW_W - padRight} y1={padTop + plotH * (1 - f)} y2={padTop + plotH * (1 - f)} stroke="#EAE5DC" strokeDasharray="4" />
        ))}
        <line x1={padX} x2={VIEW_W - padRight} y1={padTop + plotH} y2={padTop + plotH} stroke="#E8DDD1" strokeWidth="1" />

        {/* previous-close reference line while hovering */}
        {prevHoveredPoint && (
          <line x1={padX} x2={VIEW_W - padRight} y1={prevHoveredPoint.y} y2={prevHoveredPoint.y} stroke="#CEAF75" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
        )}

        {/* area fill */}
        <motion.path
          d={areaPath}
          fill={`url(#${gradientId})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        />

        {/* draw-on line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke={trendColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${glowId})`}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* crosshair while hovering */}
        {hoveredPoint && (
          <>
            <line x1={hoveredPoint.x} x2={hoveredPoint.x} y1={padTop} y2={padTop + plotH} stroke="#412C20" strokeWidth="1" strokeDasharray="3 3" opacity="0.35" />
            <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="5" fill="white" stroke={trendColor} strokeWidth="2.5" />
          </>
        )}

        {/* live pulse on the latest point */}
        <circle cx={lastPoint.x} cy={lastPoint.y} r="9" fill={trendColor} opacity="0.18">
          <animate attributeName="r" values="5;11;5" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.35;0;0.35" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle cx={lastPoint.x} cy={lastPoint.y} r="4" fill={trendColor} stroke="white" strokeWidth="1.5" />

        {/* x-axis labels */}
        {data.map((d, i) => {
          const showLabel = data.length <= 12 || i % Math.ceil(data.length / 10) === 0;
          if (!showLabel) return null;
          return (
            <text key={d.key} x={points[i].x} y={height - 12} textAnchor="middle" fill="#8A7A6C" className="text-[9px] font-mono select-none">
              {d.label}
            </text>
          );
        })}
      </svg>

      {/* current price tag, pinned to the right edge at the line's height — like a trading chart's last-price axis label */}
      <div
        className="pointer-events-none absolute -translate-y-1/2 rounded-md px-1.5 py-0.5 shadow-sm"
        style={{
          left: `${((lastPoint.x + 6) / VIEW_W) * 100}%`,
          top: `${(lastPoint.y / height) * 100}%`,
          backgroundColor: trendColor
        }}
      >
        <span className="text-[9px] font-mono font-black text-white whitespace-nowrap">{isUp ? "▲" : "▼"} {fmt(last.value)}</span>
      </div>

      {/* hover tooltip */}
      {hovered && hoveredPoint && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.12 }}
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-xl bg-[#412C20] px-3.5 py-2.5 shadow-xl"
          style={{ left: `${(hoveredPoint.x / VIEW_W) * 100}%`, top: `${(hoveredPoint.y / height) * 100}%`, marginTop: -12 }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#CEAF75]">{hovered.label}</p>
          <p className="font-mono text-sm font-black text-white leading-tight">{fmt(hovered.value)}</p>
          {hovered.secondaryLabel && <p className="text-[10px] text-white/60 mt-0.5">{hovered.secondaryLabel}</p>}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#412C20]" />
        </motion.div>
      )}

      {/* current value badge (always visible, top-right) */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow-sm" style={{ backgroundColor: trendColor }}>
        <span className="text-[9px] font-bold uppercase tracking-wider text-white/80">Hiện tại</span>
        <span className="font-mono text-xs font-black text-white">{fmt(last.value)}</span>
        <span className="text-white text-xs">{isUp ? "▲" : "▼"}</span>
      </div>
    </div>
  );
}
