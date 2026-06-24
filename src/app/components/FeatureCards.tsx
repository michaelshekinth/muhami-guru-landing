type FeatureCardsProps = {
  theme?: "dark" | "light";
};

export function FeatureCards({ theme = "dark" }: FeatureCardsProps) {
  const isDark = theme === "dark";
  const headingColor = isDark ? "text-[#F5F0E8]" : "text-[#0A0A0A]";

  return (
    <div className="w-full mt-14 flex flex-col gap-5">
      <p className="text-xs text-[#C9A84C] uppercase tracking-widest font-medium text-center mb-1">
        What We&apos;re Building
      </p>
      <h2
        style={{ fontFamily: "'Playfair Display', serif" }}
        className={`text-2xl md:text-3xl font-bold text-center mb-2 ${headingColor}`}
      >
        Legal help reimagined for the UAE
      </h2>

      <div className="relative w-full rounded-2xl overflow-hidden border border-[rgba(201,168,76,0.18)] h-64 md:h-80 bg-[#1A1710]">
        <img
          src="https://images.unsplash.com/photo-1758518731462-d091b0b4ed0d?w=1200&h=600&fit=crop&auto=format"
          alt="Business professionals signing a legal contract"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/90 via-[#080808]/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-10 max-w-sm">
          <span className="text-[10px] text-[#C9A84C] uppercase tracking-widest font-medium mb-2">
            Verified Lawyers
          </span>
          <h3
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-xl md:text-2xl font-bold text-[#F5F0E8] mb-2 leading-snug"
          >
            Trusted experts, fully verified
          </h3>
          <p className="text-sm text-[#C4BAA8] leading-relaxed">
            Every lawyer on Muhami.guru holds an active UAE Bar licence and passes our
            multi-step identity check. You consult with confidence.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="relative rounded-2xl overflow-hidden border border-[rgba(201,168,76,0.18)] h-56 bg-[#1A1710]">
          <img
            src="https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=800&h=600&fit=crop&auto=format"
            alt="Lady Justice scales"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/95 via-[#080808]/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="text-[10px] text-[#C9A84C] uppercase tracking-widest font-medium mb-1 block">
              Smart Matching
            </span>
            <h3
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-lg font-bold text-[#F5F0E8] mb-1 leading-snug"
            >
              The right lawyer for your case
            </h3>
            <p className="text-xs text-[#C4BAA8] leading-relaxed">
              Describe your issue in plain language. Our system instantly matches you with
              the specialist you need.
            </p>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-[rgba(201,168,76,0.18)] h-56 bg-[#1A1710]">
          <img
            src="https://images.unsplash.com/photo-1770233621425-5d9ee7a0a700?w=800&h=600&fit=crop&auto=format"
            alt="AI brain concept"
            className="w-full h-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/95 via-[#080808]/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="text-[10px] text-[#C9A84C] uppercase tracking-widest font-medium mb-1 block">
              AI Legal Assistant
            </span>
            <h3
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-lg font-bold text-[#F5F0E8] mb-1 leading-snug"
            >
              Understand before you consult
            </h3>
            <p className="text-xs text-[#C4BAA8] leading-relaxed">
              Our AI explains UAE law in plain language — so you arrive at every
              consultation informed and in control.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
