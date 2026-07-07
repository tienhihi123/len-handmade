import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface YarnFireworksProps {
  trigger: boolean;
  onComplete?: () => void;
}

interface Particle {
  id: number;
  angle: number;
  color: string;
  delay: number;
}

const YARN_COLORS = ["#CEAF75", "#D9A7A7", "#A8B59A", "#DDB8B0", "#F4DFC8"];

export default function YarnFireworks({ trigger, onComplete }: YarnFireworksProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger) {
      // Generate 12 yarn particles in a circle
      const newParticles: Particle[] = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        angle: (i * 30) - 15, // -15 to 345 degrees
        color: YARN_COLORS[i % YARN_COLORS.length],
        delay: i * 0.02, // Stagger slightly
      }));

      setParticles(newParticles);

      // Clear particles after animation
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      <AnimatePresence>
        {particles.map((particle) => {
          // Calculate direction based on angle
          const radians = (particle.angle * Math.PI) / 180;
          const distance = 45; // Distance particles travel
          const x = Math.cos(radians) * distance;
          const y = Math.sin(radians) * distance;

          return (
            <motion.div
              key={particle.id}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{
                x: 0,
                y: 0,
                scale: 0,
                opacity: 1,
                rotate: 0,
              }}
              animate={{
                x,
                y,
                scale: [0, 1.2, 0.8],
                opacity: [1, 1, 0],
                rotate: particle.angle * 2,
              }}
              transition={{
                duration: 0.6,
                delay: particle.delay,
                ease: [0.34, 1.56, 0.64, 1], // Spring-like easing
              }}
            >
              {/* Yarn ball particle */}
              <div className="relative">
                {/* Outer glow */}
                <div
                  className="absolute inset-0 rounded-full blur-sm"
                  style={{
                    backgroundColor: particle.color,
                    width: '8px',
                    height: '8px',
                    opacity: 0.6,
                  }}
                />
                {/* Core yarn ball */}
                <div
                  className="relative rounded-full"
                  style={{
                    backgroundColor: particle.color,
                    width: '6px',
                    height: '6px',
                    boxShadow: `0 0 4px ${particle.color}`,
                  }}
                >
                  {/* Yarn texture lines */}
                  <div className="absolute inset-0 rounded-full opacity-30">
                    <div className="absolute top-1/4 left-0 right-0 h-[1px] bg-white/40" />
                    <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/30 rotate-45" />
                    <div className="absolute bottom-1/4 left-0 right-0 h-[1px] bg-white/40" />
                  </div>
                </div>
                {/* Trailing sparkle */}
                <motion.div
                  className="absolute -left-1 -top-1 w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: particle.color,
                    opacity: 0.4,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{
                    duration: 0.4,
                    delay: particle.delay + 0.1,
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Central burst ring */}
      <AnimatePresence>
        {trigger && (
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
            style={{
              borderColor: YARN_COLORS[0],
            }}
            initial={{
              width: 0,
              height: 0,
              opacity: 1,
            }}
            animate={{
              width: 60,
              height: 60,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
