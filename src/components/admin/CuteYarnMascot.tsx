// Original kawaii yarn-ball mascot, drawn in-house for Tiệm Len Nhỏ's brand
// palette — used as a soft decorative watermark, never as primary content.
export default function CuteYarnMascot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <circle cx="100" cy="112" r="62" fill="#CEAF75" />
      <path d="M40 112a60 60 0 0 1 120 0" fill="none" stroke="#B8934F" strokeWidth="3" opacity="0.5" />
      <path d="M45 90 Q100 60 155 90" fill="none" stroke="#B8934F" strokeWidth="3" opacity="0.45" />
      <path d="M45 135 Q100 165 155 135" fill="none" stroke="#B8934F" strokeWidth="3" opacity="0.45" />
      <path d="M60 70 Q100 130 140 70" fill="none" stroke="#B8934F" strokeWidth="3" opacity="0.4" />
      <path d="M60 155 Q100 95 140 155" fill="none" stroke="#B8934F" strokeWidth="3" opacity="0.4" />

      {/* ears */}
      <path d="M62 62 L50 32 L82 54 Z" fill="#D9A7A7" />
      <path d="M138 62 L150 32 L118 54 Z" fill="#D9A7A7" />

      {/* face */}
      <path d="M76 108 q6 10 12 0" fill="none" stroke="#412C20" strokeWidth="4" strokeLinecap="round" />
      <path d="M112 108 q6 10 12 0" fill="none" stroke="#412C20" strokeWidth="4" strokeLinecap="round" />
      <path d="M88 132 q12 10 24 0" fill="none" stroke="#412C20" strokeWidth="4" strokeLinecap="round" />
      <circle cx="70" cy="122" r="7" fill="#D9A7A7" opacity="0.7" />
      <circle cx="130" cy="122" r="7" fill="#D9A7A7" opacity="0.7" />

      {/* crossed knitting needles */}
      <g stroke="#412C20" strokeWidth="4" strokeLinecap="round">
        <line x1="55" y1="180" x2="130" y2="45" />
        <line x1="145" y1="180" x2="70" y2="45" />
      </g>
      <circle cx="130" cy="45" r="5" fill="#412C20" />
      <circle cx="70" cy="45" r="5" fill="#412C20" />
    </svg>
  );
}
