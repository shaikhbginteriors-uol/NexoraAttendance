import { useState } from "react";
import BrandHeader from "@/components/layout/BrandHeader";
import AttendanceForm from "@/components/features/AttendanceForm";
import {
  ShieldCheck,
  Zap,
  HeartHandshake,
} from "lucide-react";

type AttendanceWindowStatus =
  | "idle"
  | "checking"
  | "open"
  | "not_started"
  | "closed"
  | "expired"
  | "not_available";

type AttendanceWindowState = {
  status: AttendanceWindowStatus;
  remainingSeconds: number;
  message: string;
};

export default function Index() {
  const [attendanceWindow, setAttendanceWindow] =
    useState<AttendanceWindowState>({
      status: "idle",
      remainingSeconds: 0,
      message: "",
    });

  return (
    <div className="min-h-screen bg-background">
      <BrandHeader
        attendanceWindowStatus={attendanceWindow.status}
        remainingSeconds={attendanceWindow.remainingSeconds}
        attendanceWindowMessage={attendanceWindow.message}
      />

      <main className="relative -mt-10 sm:-mt-12 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <AttendanceForm
            onWindowStateChange={(state) =>
              setAttendanceWindow(state)
            }
          />

          {/* Trust badges */}
          <section className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Badge
              icon={
                <ShieldCheck className="h-5 w-5" />
              }
              title="Verified Records"
              desc="Every submission is validated against enrollment data."
            />

            <Badge
              icon={<Zap className="h-5 w-5" />}
              title="Instant Feedback"
              desc="Get real-time confirmation of your attendance."
            />

            <Badge
              icon={
                <HeartHandshake className="h-5 w-5" />
              }
              title="Teacher Approved"
              desc="Trusted by the entire NEXORA teaching team."
            />
          </section>

          <footer className="mt-10 text-center text-xs text-muted-foreground">
            <p>
              © {new Date().getFullYear()} NEXORA Montessori
              & Modern Skills Council. All rights reserved.
            </p>

            <p className="mt-1">
              Powered by the NEXORA Attendance Portal.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

function Badge({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 hover:border-brand-teal/40 transition">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-brand-teal-light p-2 text-brand-teal">
          {icon}
        </div>

        <div>
          <p className="text-sm font-bold text-foreground">
            {title}
          </p>

          <p className="text-xs text-muted-foreground mt-0.5">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}
