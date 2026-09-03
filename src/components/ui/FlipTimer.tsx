import { useEffect, useState } from "react";

export type FlipTimerStatus =
  | "idle"
  | "checking"
  | "open"
  | "not_started"
  | "closed"
  | "expired"
  | "not_available";

type FlipTimerProps = {
  seconds: number;
  status: FlipTimerStatus;
  message?: string;
};

function pad(value: number) {
  return String(Math.max(0, value)).padStart(2, "0");
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
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (value === current) return;

    setPrevious(current);
    setCurrent(value);
    setFlipping(true);

    const timer = window.setTimeout(() => {
      setFlipping(false);
    }, 550);

    return () => {
      window.clearTimeout(timer);
    };
  }, [value, current]);

  return (
    <div className="min-w-0 flex-1">
      <div className="nexora-flip-card">
        {/* Static top */}
        <div className="nexora-flip-half nexora-flip-top">
          {current}
        </div>

        {/* Static bottom */}
        <div className="nexora-flip-half nexora-flip-bottom">
          {current}
        </div>

        {/* Animation */}
        {flipping && (
          <>
            <div className="nexora-flip-half nexora-flip-top nexora-flip-top-animate">
              {previous}
            </div>

            <div className="nexora-flip-half nexora-flip-bottom nexora-flip-bottom-animate">
              {current}
            </div>
          </>
        )}

        {/* Middle divider */}
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 z-20 h-px bg-black/20" />
      </div>

      <p className="mt-2 text-center text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em] text-white/65">
        {label}
      </p>
    </div>
  );
}

export default function FlipTimer({
  seconds,
  status,
  message,
}: FlipTimerProps) {
  const safeSeconds =
    status === "open"
      ? Math.max(0, Math.floor(seconds))
      : 0;

  const minutes = Math.floor(
    safeSeconds / 60
  );

  const secs =
    safeSeconds % 60;

  const statusText =
    status === "open"
      ? "Window Open"
      : status === "checking"
      ? "Checking..."
      : status === "not_started"
      ? "Not Started"
      : status === "closed"
      ? "Closed"
      : status === "expired"
      ? "Expired"
      : status === "not_available"
      ? "Unavailable"
      : "Waiting";

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-white/15 bg-white/[0.08] p-3 sm:p-4 shadow-xl shadow-black/10 backdrop-blur-md">
        {/* Top */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">
            Time Remaining
          </p>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[9px] sm:text-[10px] font-semibold text-white ring-1 ring-white/15">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                status === "open"
                  ? "bg-emerald-400 animate-pulse"
                  : status === "checking"
                  ? "bg-amber-300 animate-pulse"
                  : "bg-white/40"
              }`}
            />

            {statusText}
          </span>
        </div>

        {/* Flip units */}
        <div className="flex items-start gap-2.5 sm:gap-3">
          <FlipUnit
            value={pad(minutes)}
            label="Minutes"
          />

          <div className="pt-6 text-xl sm:text-2xl font-black text-white/45">
            :
          </div>

          <FlipUnit
            value={pad(secs)}
            label="Seconds"
          />
        </div>

        {/* Small status message */}
        {message && status !== "idle" && (
          <p className="mt-2.5 truncate text-center text-[9px] sm:text-[10px] text-white/55">
            {message}
          </p>
        )}
      </div>

      <style>{`
        .nexora-flip-card {
          position: relative;
          width: 100%;
          height: 82px;
          perspective: 900px;
        }

        .nexora-flip-half {
          position: absolute;
          left: 0;
          width: 100%;
          height: 50%;
          overflow: hidden;

          display: flex;
          justify-content: center;

          font-size: 2.45rem;
          font-weight: 900;
          line-height: 1;

          color: #171b1f;

          border: 1px solid rgba(0, 0, 0, 0.08);

          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .nexora-flip-top {
          top: 0;
          align-items: flex-end;
          padding-bottom: 0.05em;

          border-radius: 12px 12px 3px 3px;

          background: linear-gradient(
            180deg,
            #ffffff 0%,
            #eef0f2 100%
          );

          transform-origin: bottom;

          box-shadow:
            0 4px 10px rgba(0, 0, 0, 0.12);
        }

        .nexora-flip-bottom {
          bottom: 0;
          align-items: flex-start;
          padding-top: 0.05em;

          border-radius: 3px 3px 12px 12px;

          background: linear-gradient(
            180deg,
            #e9ecef 0%,
            #ffffff 100%
          );

          transform-origin: top;

          box-shadow:
            0 8px 18px rgba(0, 0, 0, 0.15);
        }

        .nexora-flip-top-animate {
          z-index: 12;

          animation:
            nexoraFlipTop
            0.55s ease-in forwards;
        }

        .nexora-flip-bottom-animate {
          z-index: 11;

          transform: rotateX(90deg);

          animation:
            nexoraFlipBottom
            0.55s ease-out forwards;
        }

        @keyframes nexoraFlipTop {
          from {
            transform: rotateX(0deg);
          }

          to {
            transform: rotateX(-90deg);
          }
        }

        @keyframes nexoraFlipBottom {
          from {
            transform: rotateX(90deg);
          }

          to {
            transform: rotateX(0deg);
          }
        }

        @media (min-width: 640px) {
          .nexora-flip-card {
            height: 96px;
          }

          .nexora-flip-half {
            font-size: 3rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .nexora-flip-top-animate,
          .nexora-flip-bottom-animate {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
