import logo from "@/assets/nexora-logo.png";
import { GraduationCap, Sparkles, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function BrandHeader() {
  const { theme, toggle } = useTheme();

  return (
    <header className="relative overflow-hidden hero-decor">
      {/* Decorative shapes */}
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-orange/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute top-1/2 left-1/3 h-32 w-32 rounded-full bg-brand-orange/10 blur-2xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 pb-16 sm:pt-8 sm:pb-20">
        {/* Logo row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white p-2 shadow-lg shadow-black/10 ring-1 ring-white/40">
              <img
                src={logo}
                alt="NEXORA Montessori & Modern Skills Council logo"
                className="h-11 w-11 sm:h-14 sm:w-14 object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-white/95 text-lg font-bold leading-tight tracking-tight">NEXORA</p>
              <p className="text-white/70 text-[11px] font-medium uppercase tracking-[0.14em]">
                Montessori & Modern Skills Council
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="group inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20 hover:ring-white/40 active:scale-95"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 transition-transform group-hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 transition-transform group-hover:-rotate-12" />
              )}
            </button>
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/20 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-brand-orange animate-pulse" />
              Attendance Portal
            </div>
          </div>
        </div>

        {/* Hero content */}
        <div className="mt-10 sm:mt-14 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-white ring-1 ring-white/20 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-brand-orange" />
            Official NEXORA Portal
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Student Attendance Form
          </h1>
          <p className="mt-3 text-base sm:text-lg text-white/85 max-w-2xl">
            Please fill in your attendance details carefully. Your teacher will
            verify submission in real time.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2 sm:gap-3">
            <Pill icon={<GraduationCap className="h-3.5 w-3.5" />} label="Trusted by NEXORA teachers" />
            <Pill label="Mobile-friendly" />
            <Pill label="Secure submission" tone="accent" />
          </div>
        </div>
      </div>

      {/* Bottom curve */}
      <svg
        className="absolute bottom-[-1px] left-0 w-full text-background"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M0,32L60,32C120,32,240,32,360,37.3C480,43,600,53,720,50.7C840,48,960,32,1080,26.7C1200,21,1320,27,1380,29.3L1440,32L1440,60L0,60Z"
        />
      </svg>
    </header>
  );
}

function Pill({
  icon,
  label,
  tone = "default",
}: {
  icon?: React.ReactNode;
  label: string;
  tone?: "default" | "accent";
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] sm:text-xs font-medium ring-1 backdrop-blur";
  const styles =
    tone === "accent"
      ? "bg-brand-orange/25 text-white ring-brand-orange/40"
      : "bg-white/10 text-white/90 ring-white/20";
  return (
    <span className={`${base} ${styles}`}>
      {icon}
      {label}
    </span>
  );
}
