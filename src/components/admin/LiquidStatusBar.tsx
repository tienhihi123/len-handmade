import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

interface LiquidStatusBarProps {
  label: string;
  count: number;
  pct: number;
  colorFrom: string;
  colorTo: string;
}

export default function LiquidStatusBar(props: LiquidStatusBarProps) {
  const { label, count, pct, colorFrom, colorTo } = props;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="space-y-1 group cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex justify-between text-[10px] font-sans font-semibold text-brand-fb/70">
        <span className={hovered ? "text-brand-fb" : ""}>{label}</span>
        <span className="font-mono">{count} ({pct}%)</span>
      </div>

      {/* Test-tube shaped liquid bar */}
      <div className="relative h-4 w-full rounded-full bg-brand-primary/8 border border-brand-primary/10 overflow-hidden shadow-inner">
        <motion.div
          className="relative h-full rounded-full overflow-hidden"
          style={{ background: `linear-gradient(90deg, ${colorFrom}, ${colorTo})` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* glossy top highlight, like liquid surface sheen */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-white/25 rounded-t-full" />

          {/* shimmer sweep on hover */}
          {hovered && (
            <div className="absolute inset-y-0 w-1/3 bg-white/40 blur-[3px] animate-liquid-shimmer" />
          )}

          {/* rising bubbles on hover */}
          {hovered && count > 0 && (
            <>
              <span className="absolute bottom-0 left-[20%] w-[3px] h-[3px] rounded-full bg-white/80 animate-bubble-rise" style={{ animationDelay: "0s" }} />
              <span className="absolute bottom-0 left-[55%] w-[2px] h-[2px] rounded-full bg-white/70 animate-bubble-rise" style={{ animationDelay: "0.5s" }} />
              <span className="absolute bottom-0 left-[80%] w-[2.5px] h-[2.5px] rounded-full bg-white/75 animate-bubble-rise" style={{ animationDelay: "1s" }} />
            </>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <p className="text-[9px] text-brand-fb/50 pt-0.5">
              {count} đơn hàng · chiếm {pct}% tổng số đơn
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
