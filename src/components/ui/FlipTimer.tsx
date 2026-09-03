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
    <div className="nexora-unit">
      <div className="nexora-flip-shell">
        {/* Main number */}
        <div className="nexora-main-number">
          {current}
        </div>

        {/* Center split */}
        <div className="nexora-center-line" />

        {/* Hinges */}
        <div className="nexora-hinge nexora-hinge-left">
          <span />
        </div>

        <div className="nexora-hinge nexora-hinge-right">
          <span />
        </div>

        {/* Real flip animation */}
        {flipping && (
          <>
            <div className="nexora-flap nexora-flap-top nexora-flip-out">
              <div className="nexora-flap-number nexora-flap-number-top">
                {previous}
              </div>
            </div>

            <div className="nexora-flap nexora-flap-bottom nexora-flip-in">
              <div className="nexora-flap-number nexora-flap-number-bottom">
                {current}
              </div>
            </div>
          </>
        )}
      </div>

      <p className="nexora-flip-label">
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
      ? "Open"
      : status === "checking"
      ? "Checking"
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
      <div className="rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-4 sm:px-5 sm:py-5 shadow-xl shadow-black/10 backdrop-blur-md">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
            Time Remaining
          </p>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[9px] sm:text-[10px] font-semibold text-white ring-1 ring-white/15">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                status === "open"
                  ? "bg-emerald-400 animate-pulse"
                  : status === "checking"
                  ? "bg-amber-300 animate-pulse"
                  : "bg-white/45"
              }`}
            />

            {statusText}
          </span>
        </div>

        {/* Cards */}
        <div className="flex items-start justify-center gap-3 sm:gap-4">
          <FlipUnit
            value={pad(minutes)}
            label="Minutes"
          />

          <FlipUnit
            value={pad(secs)}
            label="Seconds"
          />
        </div>

        {message && status !== "idle" && (
          <p className="mt-3 truncate text-center text-[9px] sm:text-[10px] text-white/55">
            {message}
          </p>
        )}
      </div>

      <style>{`
        .nexora-unit {
          width: min(46%, 155px);
          min-width: 0;
        }

        .nexora-flip-shell {
          --flip-height: 112px;

          position: relative;
          width: 100%;
          height: var(--flip-height);

          overflow: hidden;

          border-radius: 15px;

          background:
            linear-gradient(
              180deg,
              #fafafa 0%,
              #f1f1f2 49.5%,
              #e6e6e8 50%,
              #f7f7f8 100%
            );

          border:
            1px solid rgba(0, 0, 0, 0.08);

          box-shadow:
            0 13px 22px rgba(0, 0, 0, 0.22),
            inset 0 1px 1px rgba(255,255,255,.8);

          perspective: 900px;
        }

        .nexora-main-number {
          position: absolute;
          inset: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          z-index: 2;

          color: #17181b;

          font-size: 4.2rem;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.05em;

          font-variant-numeric:
            tabular-nums;
        }

        .nexora-center-line {
          position: absolute;

          left: 0;
          right: 0;
          top: 50%;

          height: 1px;

          z-index: 20;

          background:
            rgba(0, 0, 0, 0.25);

          box-shadow:
            0 1px 0 rgba(255,255,255,.65);
        }

        .nexora-hinge {
          position: absolute;

          top: 50%;

          z-index: 25;

          width: 14px;
          height: 19px;

          transform:
            translateY(-50%);

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 2px;

          background:
            linear-gradient(
              90deg,
              #c7c7c9,
              #efeff0,
              #a9a9ac
            );

          border:
            1px solid rgba(0,0,0,.16);

          box-shadow:
            0 1px 2px rgba(0,0,0,.22);
        }

        .nexora-hinge span {
          width: 100%;
          height: 2px;

          background:
            rgba(0,0,0,.35);
        }

        .nexora-hinge-left {
          left: -5px;
        }

        .nexora-hinge-right {
          right: -5px;
        }

        .nexora-flip-label {
          margin-top: 10px;

          text-align: center;

          font-size: 11px;
          font-weight: 800;

          text-transform: uppercase;

          letter-spacing: .12em;

          color:
            rgba(255,255,255,.75);
        }

        /* =========================
           FLIP ANIMATION
        ========================= */

        .nexora-flap {
          position: absolute;

          left: 0;
          right: 0;

          height: 50%;

          overflow: hidden;

          z-index: 15;

          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .nexora-flap-top {
          top: 0;

          transform-origin:
            bottom;

          background:
            linear-gradient(
              180deg,
              #fafafa 0%,
              #eeeeef 100%
            );
        }

        .nexora-flap-bottom {
          bottom: 0;

          transform-origin:
            top;

          background:
            linear-gradient(
              180deg,
              #e6e6e8 0%,
              #f7f7f8 100%
            );
        }

        .nexora-flap-number {
          position: absolute;

          left: 0;

          width: 100%;
          height: var(--flip-height);

          display: flex;
          align-items: center;
          justify-content: center;

          color: #17181b;

          font-size: 4.2rem;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.05em;

          font-variant-numeric:
            tabular-nums;
        }

        .nexora-flap-number-top {
          top: 0;
        }

        .nexora-flap-number-bottom {
          bottom: 0;
        }

        .nexora-flip-out {
          animation:
            nexoraTopFlip
            .55s ease-in forwards;
        }

        .nexora-flip-in {
          transform:
            rotateX(90deg);

          animation:
            nexoraBottomFlip
            .55s ease-out forwards;
        }

        @keyframes nexoraTopFlip {
          0% {
            transform:
              rotateX(0deg);
          }

          100% {
            transform:
              rotateX(-90deg);
          }
        }

        @keyframes nexoraBottomFlip {
          0% {
            transform:
              rotateX(90deg);
          }

          100% {
            transform:
              rotateX(0deg);
          }
        }

        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 640px) {
          .nexora-unit {
            width: calc(50% - 6px);
          }

          .nexora-flip-shell {
            --flip-height: 94px;

            border-radius: 13px;
          }

          .nexora-main-number,
          .nexora-flap-number {
            font-size: 3.45rem;
          }

          .nexora-flip-label {
            margin-top: 8px;

            font-size: 9px;
          }

          .nexora-hinge {
            width: 12px;
            height: 16px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .nexora-flip-out,
          .nexora-flip-in {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
