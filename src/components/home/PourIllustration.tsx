/**
 * An espresso machine pulling a double shot. Each 9 s loop a fresh cup slides in, fills, steams and slides out
 * for the next order. Pure SVG + CSS: everything animates with transform or opacity (see `.pour-*` in index.css),
 * and with reduced motion it rests as a still frame mid-pour.
 */
export function PourIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 533" role="img" aria-label="Espresso pouring from the machine into a cup" className={className}>
      <defs>
        <linearGradient id="pi-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1c15" />
          <stop offset="1" stopColor="#120c09" />
        </linearGradient>
        <radialGradient id="pi-glow" cx="0.5" cy="0.78" r="0.55">
          <stop offset="0" stopColor="#e2552d" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#e2552d" stopOpacity="0.14" />
          <stop offset="1" stopColor="#e2552d" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pi-steel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8d8a84" />
          <stop offset="0.28" stopColor="#f1eee8" />
          <stop offset="0.55" stopColor="#a9a59e" />
          <stop offset="0.8" stopColor="#dedad3" />
          <stop offset="1" stopColor="#6f6c67" />
        </linearGradient>
        <linearGradient id="pi-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5a3420" />
          <stop offset="1" stopColor="#24140c" />
        </linearGradient>
        <linearGradient id="pi-counter" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2619" />
          <stop offset="1" stopColor="#140d09" />
        </linearGradient>
        <linearGradient id="pi-ceramic" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#bfb3a3" />
          <stop offset="0.3" stopColor="#fbf7f0" />
          <stop offset="0.62" stopColor="#efe7da" />
          <stop offset="1" stopColor="#a89c8c" />
        </linearGradient>
        <linearGradient id="pi-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e6ddcf" />
        </linearGradient>
        <radialGradient id="pi-crema" cx="0.45" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#e0a463" />
          <stop offset="0.55" stopColor="#b2692f" />
          <stop offset="1" stopColor="#6b3518" />
        </radialGradient>
        <linearGradient id="pi-stream" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b1c0c" />
          <stop offset="0.6" stopColor="#7a3f19" />
          <stop offset="1" stopColor="#c27a3c" />
        </linearGradient>
        <clipPath id="pi-mouth">
          <ellipse cx="200" cy="354" rx="81" ry="14" />
        </clipPath>
        <filter id="pi-soft" x="-30%" y="-100%" width="160%" height="300%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="pi-steam-blur" x="-50%" y="-20%" width="200%" height="140%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>

      {/* back wall, tiles and the kiln glow */}
      <rect width="400" height="533" fill="url(#pi-wall)" />
      <g stroke="#f3ece0" strokeOpacity="0.045" strokeWidth="1.5">
        {Array.from({ length: 12 }, (_, i) => (
          <path key={`h${i}`} d={`M0 ${40 + i * 40}H400`} />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <path key={`v${i}`} d={`M${(i % 2 ? 20 : 0) + Math.floor(i / 2) * 80} 0V488`} strokeDasharray="40 40" strokeDashoffset={i % 2 ? 40 : 0} />
        ))}
      </g>
      <rect width="400" height="533" fill="url(#pi-glow)" className="glow" />

      {/* counter */}
      <rect y="488" width="400" height="45" fill="url(#pi-counter)" />
      <path d="M0 488H400" stroke="#ff8a4c" strokeOpacity="0.35" strokeWidth="1.5" />

      {/* the machine: group head, portafilter, spouts */}
      <rect x="112" y="-14" width="176" height="68" rx="14" fill="url(#pi-steel)" />
      <rect x="128" y="52" width="144" height="14" rx="3" fill="#221c18" />
      <path d="M136 66H264L254 102Q200 114 146 102Z" fill="url(#pi-steel)" />
      <rect x="248" y="76" width="22" height="16" rx="3" fill="url(#pi-steel)" />
      <rect x="264" y="73" width="122" height="22" rx="11" fill="url(#pi-wood)" />
      <path d="M276 78H374" stroke="#c98a5c" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
      <path d="M184 104h14l-3 22h-8zM202 104h14l-3 22h-8z" fill="url(#pi-steel)" />

      {/* twin streams */}
      <g className="pour-stream">
        <rect x="189.5" y="124" width="5" height="234" rx="2.5" fill="url(#pi-stream)" />
        <rect x="205.5" y="124" width="5" height="234" rx="2.5" fill="url(#pi-stream)" />
        <path className="pour-flow" d="M192 126V356M208 126V356" stroke="#ffd9a8" strokeOpacity="0.4" strokeWidth="1.6" strokeDasharray="9 17" strokeLinecap="round" />
      </g>

      {/* the cup, which slides in, fills and slides out */}
      <g className="pour-cup">
        <ellipse cx="200" cy="506" rx="150" ry="13" fill="#000" opacity="0.55" filter="url(#pi-soft)" />
        <ellipse cx="200" cy="482" rx="150" ry="24" fill="url(#pi-ceramic)" />
        <ellipse cx="200" cy="478" rx="140" ry="19" fill="url(#pi-rim)" />
        <ellipse cx="200" cy="476" rx="92" ry="12" fill="#d8ccbb" />

        <path d="M286 372C342 366 344 434 278 438" fill="none" stroke="url(#pi-ceramic)" strokeWidth="17" strokeLinecap="round" />
        <path d="M110 352C112 420 136 470 200 472C264 470 288 420 290 352Z" fill="url(#pi-ceramic)" />
        <ellipse cx="200" cy="352" rx="90" ry="18" fill="url(#pi-rim)" />
        <ellipse cx="200" cy="354" rx="81" ry="14" fill="#2a160c" />

        <g clipPath="url(#pi-mouth)">
          <g className="pour-liquid">
            <ellipse cx="200" cy="356" rx="80" ry="13" fill="url(#pi-crema)" />
            <path d="M168 355c10-5 24-6 34-2s20 4 30-1" fill="none" stroke="#f0c48c" strokeOpacity="0.55" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </g>

        <g className="pour-ripple-wrap">
          <ellipse className="pour-ripple" cx="200" cy="356" rx="14" ry="3.5" fill="none" stroke="#f0c48c" strokeWidth="1.5" />
        </g>

        <g className="pour-steam" fill="none" stroke="#f3ece0" strokeWidth="5" strokeLinecap="round" filter="url(#pi-steam-blur)">
          <path className="pour-wisp" d="M172 326c-10-20 12-30 2-52s8-32 0-48" />
          <path className="pour-wisp" style={{ animationDelay: "-1.1s" }} d="M202 322c-12-22 14-32 2-56s10-34 0-52" />
          <path className="pour-wisp" style={{ animationDelay: "-2.2s" }} d="M230 326c-10-20 12-30 2-50s8-30 0-46" />
        </g>
      </g>
    </svg>
  );
}
