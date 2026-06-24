type ComingSoonTitleProps = {
  theme?: "dark" | "light";
};

export function ComingSoonTitle({ theme = "dark" }: ComingSoonTitleProps) {
  const isDark = theme === "dark";
  const fill = isDark ? "#F5F0E8" : "#0A0A0A";
  const shadow = isDark ? "rgba(245,240,232,0.4)" : "rgba(10,10,10,0.2)";

  return (
    <div className="relative select-none my-8 md:my-10" aria-label="coming soon">
      {/* Offset outline layer */}
      <h1
        className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tight leading-none px-2"
        style={{
          fontFamily: "'Inter', sans-serif",
          color: "transparent",
          WebkitTextStroke: `1.5px ${shadow}`,
          transform: "translate(5px, 5px)",
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-hidden="true"
      >
        coming soon
      </h1>

      {/* Main text layer */}
      <h1
        className="relative text-4xl sm:text-6xl md:text-8xl font-black lowercase tracking-tight leading-none text-center px-2"
        style={{
          fontFamily: "'Inter', sans-serif",
          color: fill,
        }}
      >
        coming soon
      </h1>
    </div>
  );
}
