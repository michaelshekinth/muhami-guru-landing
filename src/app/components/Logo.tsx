type LogoProps = {
  theme?: "dark" | "light";
  className?: string;
};

function ShieldIcon({ primary, gold }: { primary: string; gold: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-12 h-12 shrink-0" aria-hidden="true">
      <path
        d="M8 12 L40 4 L72 12 L72 48 C72 58 56 68 40 72 C24 68 8 58 8 48 Z"
        stroke={gold}
        strokeWidth="2"
        fill="none"
      />
      <path d="M14 14 L22 22 M22 22 L18 28 M22 22 L26 28" stroke={gold} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M66 14 L58 22 M58 22 L54 28 M58 22 L62 28" stroke={gold} strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M22 58 L22 38 L32 50 L42 38 L42 58"
        stroke={primary}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="32" cy="32" r="5" fill={gold} />
      <rect x="29" y="56" width="6" height="6" rx="1" fill={primary} />
    </svg>
  );
}

export function Logo({ theme = "light", className = "" }: LogoProps) {
  const isDark = theme === "dark";
  const primary = isDark ? "#FFFFFF" : "#000B26";
  const gold = "#C9A84C";

  return (
    <div className={`flex items-center gap-3 ${className}`} aria-label="MUHAMI.guru">
      <ShieldIcon primary={primary} gold={gold} />
      <div className="flex items-baseline gap-0 font-sans leading-none">
        <span
          className="text-2xl md:text-3xl font-bold tracking-wide"
          style={{ color: primary, fontFamily: "'Inter', sans-serif" }}
        >
          MUHAMI
        </span>
        <span
          className="text-2xl md:text-3xl font-normal"
          style={{ color: gold, fontFamily: "'Inter', sans-serif" }}
        >
          .guru
        </span>
      </div>
    </div>
  );
}
