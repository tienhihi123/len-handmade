import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export interface AdminBarChartPoint {
  key: string;
  label: string;
  value: number;
  secondaryLabel?: string;
}

interface AdminBarChartProps {
  data: AdminBarChartPoint[];
  height?: number;
  formatValue?: (value: number) => string;
  emptyLabel?: string;
}

const VIEW_W = 800;

export default function AdminBarChart({ data, height = 240, formatValue, emptyLabel = "Chưa có dữ liệu." }: AdminBarChartProps) {
  const gradientId = useId();
  const glowId = useId();
  const [hovered, setHovered] = useState<number | null>(null);

  if (data.length === 0) {
    return <p className="text-xs text-brand-fb/50 italic py-8 text-center">{emptyLabel}</p>;
  }

  const padX = 36;
  const padTop = 16;
  const padBottom = 34;
  const plotW = VIEW_W - padX * 2;
  const plotH = height - padTop - padBottom;
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  const barWidth = Math.min(22, (plotW / data.length) * 0.55);
  const step = plotW / data.length;

  const fmt = formatValue ?? ((v: number) => `${v.toLocaleString("vi-VN")}đ`);
  const active = hovered !== null ? data[hovered] : null;
  const activeX = hovered !== null ? padX + hovered * step + step / 2 : 0;
  const tooltipLeftPct = (activeX / VIEW_W) * 100;

  return (
    <div className="relative">
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full rounded-xl bg-[#412C20] px-3.5 py-2.5 text-left shadow-xl"
            style={{ left: `${tooltipLeftPct}%` }}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#CEAF75]">{active.label}</p>
            <p className="font-mono text-sm font-black text-white leading-tight">{fmt(active.value)}</p>
            {active.secondaryLabel && <p className="text-[10px] text-white/60 mt-0.5">{active.secondaryLabel}</p>}
            <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#412C20]" />
          </motion.div>
        )}
      </AnimatePresence>

      <svg
        viewBox={`0 0 ${VIEW_W} ${height}`}
        className="w-full bg-white/60 rounded-2xl p-4 border border-brand-primary/10"
        style={{ height }}
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#DDBE86" />
            <stop offset="100%" stopColor="#CEAF75" />
          </linearGradient>
          <linearGradient id={`${gradientId}-hover`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5E4E3C" />
            <stop offset="100%" stopColor="#412C20" />
          </linearGradient>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1={padX}
            x2={VIEW_W - padX}
            y1={padTop + plotH * (1 - f)}
            y2={padTop + plotH * (1 - f)}
            stroke="#EAE5DC"
            strokeDasharray="4"
          />
        ))}
        <line x1={padX} x2={VIEW_W - padX} y1={padTop + plotH} y2={padTop + plotH} stroke="#CEAF75" strokeWidth="1.5" />

        {data.map((d, i) => {
          const barH = Math.max(2, (d.value / maxValue) * plotH);
          const x = padX + i * step + (step - barWidth) / 2;
          const y = padTop + plotH - barH;
          const isHovered = hovered === i;
          const showLabel = data.length <= 12 || i % Math.ceil(data.length / 10) === 0;
          return (
            <g
              key={d.key}
              onMouseEnter={() => setHovered(i)}
              className="cursor-pointer"
            >
              <rect x={x - 4} y={padTop} width={barWidth + 8} height={plotH} fill="transparent" />
              <motion.rect
                x={x}
                width={barWidth}
                rx={5}
                fill={isHovered ? `url(#${gradientId}-hover)` : `url(#${gradientId})`}
                filter={isHovered ? `url(#${glowId})` : undefined}
                initial={{ y: padTop + plotH, height: 0 }}
                animate={{ y, height: barH }}
                transition={{ duration: 0.5, delay: i * 0.012, ease: [0.22, 1, 0.36, 1] }}
              />
              {showLabel && (
                <text
                  x={x + barWidth / 2}
                  y={height - 12}
                  textAnchor="middle"
                  fill={isHovered ? "#412C20" : "#8A7A6C"}
                  className={`text-[9px] font-mono select-none ${isHovered ? "font-bold" : ""}`}
                >
                  {d.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
