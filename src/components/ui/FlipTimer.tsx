import { useEffect, useState } from "react";

type AttendanceWindowStatus = "idle" | "open" | "expired" | "closed";

type FlipTimerProps = {
  seconds: number;
  status: AttendanceWindowStatus;
  message?: string;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function FlipUnit({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  const [current, setCurrent] = useState(value);
  const [previous, setPrevious] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value === current) return;

    setPrevious(current);
    setCurrent(value);
    setIsFlipping(true);

    const timer = window.setTimeout(() => {
      setIsFlipping(false);
    }, 650);

    return () => window.clearTimeout(timer);
  }, [value, current]);

  return (
    <div className="flip-unit">
      <div className="flip-label">{label}</div>

      <div className="flip-card">
        <div className="flip-static flip-top">{current}</div>
        <div className="flip-static flip-bottom">{current}</div>

        {isFlipping && (
          <>
            <div className="flip-animate flip-top-out">{previous}</div>
            <div className="flip-animate flip-bottom-in">{current}</div>
          </>
        )}
      </div>
    </div>
  );
}

export default function FlipTimer({
  seconds,
  status,
  message,
}: FlipTimerProps) {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;

  const minuteText = pad(minutes);
  const secondText = pad(secs);

  const title =
    status === "open"
      ? "Time Remaining"
      : status === "expired"
      ? "Attendance Window Expired"
      : "Attendance Window";

  const subtitle =
    status === "open"
      ? "Submit attendance before the timer ends."
      : message || "Waiting for teacher/admin to start the attendance window.";

  return (
    <div className="mt-6 rounded-2xl border border-brand-teal/20 bg-brand-teal-light/30 p-4 sm:p-6">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-teal">
          Student Attendance Window
        </p>

        <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">
          {title}
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="mt-5 mx-auto grid max-w-md grid-cols-2 gap-3 sm:gap-5">
        <FlipUnit value={minuteText} label="Minutes" />
        <FlipUnit value={secondText} label="Seconds" />
      </div>

      <div className="mt-4 text-center">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            status === "open"
              ? "bg-emerald-100 text-emerald-700"
              : status === "expired"
              ? "bg-red-100 text-red-700"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {status === "open"
            ? "Window Open"
            : status === "expired"
            ? "Expired"
            : "Not Started"}
        </span>
      </div>
    </div>
  );
}
