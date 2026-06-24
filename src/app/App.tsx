import { useEffect, useRef, useState } from "react";
import { Moon, Sun, Linkedin, Twitter, ArrowDown } from "lucide-react";
import logoDark from "@/imports/image.png";
import { Logo } from "@/app/components/Logo";
import { ComingSoonTitle } from "@/app/components/ComingSoonTitle";
import { FeatureCards } from "@/app/components/FeatureCards";
import { LawyerForm } from "@/app/components/LawyerForm";

type Theme = "dark" | "light";

export default function App() {
  const [theme, setTheme] = useState<Theme>("dark");
  const lawyerFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const isDark = theme === "dark";

  function scrollToLawyerForm() {
    lawyerFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start py-10 md:py-16 px-4 transition-colors duration-300 bg-background text-foreground"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[140px] ${
            isDark ? "bg-[#C9A84C]/6" : "bg-[#C9A84C]/10"
          }`}
        />
        <div
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] ${
            isDark ? "bg-[#C9A84C]/4" : "bg-[#C9A84C]/8"
          }`}
        />
      </div>

      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center">
        {/* Header: Logo + Theme Toggle */}
        <header className="w-full flex items-center justify-between mb-6 md:mb-8">
          <div className="w-44 md:w-56">
            {isDark ? (
              <img
                src={logoDark}
                alt="MUHAMI.guru"
                className="w-full object-contain"
              />
            ) : (
              <Logo theme="light" />
            )}
          </div>

          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            className={`p-2.5 rounded-full border transition-all duration-200 ${
              isDark
                ? "border-[rgba(201,168,76,0.25)] text-[#C9A84C] hover:bg-[#C9A84C]/10"
                : "border-gray-200 text-[#C9A84C] hover:bg-gray-100"
            }`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        {/* Coming Soon Hero */}
        <div className="text-center w-full">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/8 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
            <span className="text-xs font-medium text-[#C9A84C] tracking-widest uppercase">
              UAE Legal Platform
            </span>
          </div>

          <ComingSoonTitle theme={theme} />

          <p
            className={`text-base leading-relaxed max-w-md mx-auto mb-6 ${
              isDark ? "text-[#8A8070]" : "text-[#5C574F]"
            }`}
          >
            We are building the UAE&apos;s premier platform connecting clients with
            verified legal experts. Be the first to know when we launch.
          </p>

          {/* Lawyer CTA */}
          <button
            type="button"
            onClick={scrollToLawyerForm}
            className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-8 py-3.5 sm:py-4 rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 text-[#C9A84C] text-sm sm:text-base md:text-lg font-semibold hover:bg-[#C9A84C]/20 hover:border-[#C9A84C]/60 transition-all duration-200 mb-8 text-center max-w-full"
          >
            I&apos;m a Lawyer — Connect With Us
            <ArrowDown
              size={20}
              className="transition-transform duration-200 group-hover:translate-y-0.5"
            />
          </button>
        </div>

        {/* Feature Cards */}
        <FeatureCards theme={theme} />

        {/* Divider */}
        <div className="flex items-center gap-3 my-10 w-full">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#C9A84C]/25" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]/50" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#C9A84C]/25" />
        </div>

        {/* Lawyer Application Form */}
        <div id="lawyer-form" ref={lawyerFormRef} className="w-full scroll-mt-8">
          <LawyerForm theme={theme} />
        </div>

        {/* Social + Footer */}
        <div className="mt-10 flex flex-col items-center gap-5">
          <div className="flex items-center gap-4">
            {[
              { icon: Twitter, label: "Twitter" },
              { icon: Linkedin, label: "LinkedIn" },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                  isDark
                    ? "border-[rgba(201,168,76,0.2)] text-[#8A8070] hover:text-[#C9A84C] hover:border-[#C9A84C]/40"
                    : "border-gray-200 text-[#5C574F] hover:text-[#C9A84C] hover:border-[#C9A84C]/40"
                }`}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs">
            {["Contact", "Privacy policy", "Terms of service"].map((link) => (
              <a
                key={link}
                href="#"
                className={`underline underline-offset-2 transition-colors ${
                  isDark
                    ? "text-[#8A8070]/70 hover:text-[#C9A84C]"
                    : "text-[#5C574F] hover:text-[#C9A84C]"
                }`}
              >
                {link}
              </a>
            ))}
          </div>

          <p className={`text-xs ${isDark ? "text-[#8A8070]/60" : "text-[#5C574F]/70"}`}>
            © {new Date().getFullYear()} Muhami.guru · Dubai, UAE
          </p>
        </div>
      </div>
    </div>
  );
}
