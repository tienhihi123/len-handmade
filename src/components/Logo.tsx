import React from "react";
import { motion } from "motion/react";

interface LogoProps {
  className?: string;
  size?: number | string;
  animate?: boolean;
}

export default function Logo({ className = "", size = 120, animate = true }: LogoProps) {
  // Determine interactive animations
  const logoVariants = animate ? {
    hover: { 
      scale: 1.03,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    tap: { scale: 0.97 }
  } : {};

  const brushVariants = animate ? {
    hover: {
      rotate: [0, 2, -2, 1, -1, 0],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
    }
  } : {};

  const needleVariants = animate ? {
    hover: {
      x: [0, -2, 1, -1, 2, 0],
      y: [0, 1, -1, 1, -1, 0],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
  } : {};

  return (
    <motion.div
      variants={logoVariants}
      whileHover={animate ? "hover" : undefined}
      whileTap={animate ? "tap" : undefined}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full object-contain max-w-none max-h-none scale-100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft Pink Brush Circles Wrapper */}
        <motion.g variants={brushVariants}>
          {/* Main Watercolor Pink Circle */}
          <path
            d="M 100 15 C 146.94 15 185 53.06 185 100 C 185 146.94 146.94 185 100 185 C 53.06 185 15 146.94 15 100 C 15 67.8 32.8 39.7 59.2 25"
            stroke="#FCE3E3"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />
          {/* Secondary Layered Artistic Paint Smudge */}
          <path
            d="M 100 19 C 144.73 19 181 55.27 181 100 C 181 144.73 144.73 181 100 181 C 55.27 181 19 144.73 19 100 C 19 79.4 26.6 60.5 39.2 46"
            stroke="#FCD6D6"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.65"
            strokeDasharray="180 15 60 10"
          />
          {/* Outer Whispering Halo Circle */}
          <circle
            cx="100"
            cy="100"
            r="89"
            stroke="#FDEBEB"
            strokeWidth="0.8"
            opacity="0.4"
            strokeDasharray="4 6"
          />
        </motion.g>

        {/* Center line-art hands dệt/crocheting (Light Golden Brown #BFAA88 and Coffee #412C20) */}
        <g className="yarn-glow">
          {/* The Loop of Wool / Yarn string */}
          <path
            d="M 78 86 C 85 73 103 76 106 78 C 112 80 104 94 100 106 C 96 118 94 135 93 142"
            stroke="#CEAF75"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Left Hand Holding the Thread */}
          <path
            d="M 68 116 C 68 126 77 132 82 144 M 68 126 C 63 124 55 125 48 127 M 68 126 L 81 123"
            stroke="#543D32"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.95"
          />
          {/* Left Hand Fingers */}
          <path
            d="M 61 113 C 62 101 68 90 81 90 C 85 90 89 92 87 101 C 85 110 77 118 73 127"
            stroke="#543D32"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 70 98 C 70 91 75 84 78 82 C 81 80 84 82 82 87 C 79 96 74 105 72 114"
            stroke="#543D32"
            strokeWidth="1.0"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 75 105 C 76 101 81 95 84 95 C 87 95 86 100 81 109 M 78 112 Q 77 116 76 120"
            stroke="#543D32"
            strokeWidth="1.0"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Right Hand Grasping the needle */}
          <motion.g variants={needleVariants}>
            {/* Wrist Line */}
            <path
              d="M 136 124 Q 138 119 140 114 M 140 114 C 137 112 133 112 129 116"
              stroke="#543D32"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.95"
            />
            {/* Right Hand Fingers */}
            <path
              d="M 132 114 C 123 105 119 96 120 87 C 120 83 124 81 126 86 C 129 93 133 102 138 111"
              stroke="#543D32"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 139 111 C 134 104 129 97 131 92 C 132 87 135 87 137 92 C 139 99 143 106 146 111"
              stroke="#543D32"
              strokeWidth="1.0"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Elegant Crochet Needle / Hook */}
            <path
              d="M 148 112 L 105 81"
              stroke="#CEAF75"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Tiny crochet hooked tip */}
            <path
              d="M 105 81 C 103 79 104 77 106 78 C 107 79 106 81 104 81"
              stroke="#CEAF75"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.g>
        </g>

        {/* Heading - Playfair Display monogram "TLN" (Tiệm Len Nhỏ) */}
        <text
          x="100"
          y="62"
          textAnchor="middle"
          fill="#412C20"
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: "27px",
            fontWeight: "700",
            letterSpacing: "0.18em"
          }}
        >
          TLN
        </text>

        {/* EB Garamond italic tagline */}
        <text
          x="100"
          y="160"
          textAnchor="middle"
          fill="#543D32"
          style={{
            fontFamily: '"EB Garamond", "Playfair Display", serif',
            fontSize: "20px",
            fontStyle: "italic",
            fontWeight: "500",
            letterSpacing: "0.02em"
          }}
        >
          len thủ công
        </text>
      </svg>
    </motion.div>
  );
}
