import { CheckCircle2, Download, RotateCcw } from "lucide-react";

interface StatusCardProps {
  data: {
    studentName: string;
    teacherName: string;
    className: string;
    batchName: string;
    session: string;
    slotName: string;
    date: string;
    day: string;
  };
  onReset: () => void;
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-4 border-b border-dashed border-border/60 py-2.5 last:border-b-0">
    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {label}
    </span>
    <span className="text-right text-sm font-semibold text-foreground">{value}</span>
  </div>
);

export default function StatusCard({ data, onReset }: StatusCardProps) {
  return (
    <div className="animate-pop rounded-2xl border border-emerald-100 dark:border-emerald-500/20 bg-card card-shadow overflow-hidden">
      {/* Success banner */}
      <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 px-6 py-6 text-white">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-white/20 p-2 ring-2 ring-white/30">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Attendance recorded successfully</h3>
            <p className="text-sm text-emerald-50">Your submission has been saved.</p>
          </div>
        </div>
        <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-white/10" />
        <div className="absolute right-10 -top-4 h-14 w-14 rounded-full bg-white/10" />
      </div>

      {/* Content */}
      <div className="px-6 py-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-foreground">Submission Summary</h4>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-200 dark:ring-emerald-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Status: Present
          </span>
        </div>

        <div className="rounded-xl bg-muted/40 px-4 py-2">
          <Row label="Student Name" value={data.studentName} />
          <Row label="Teacher" value={data.teacherName} />
          <Row label="Class" value={data.className} />
          <Row label="Batch" value={data.batchName} />
          <Row label="Session" value={data.session} />
          <Row label="Time Slot" value={data.slotName} />
          <Row label="Date" value={`${data.date} · ${data.day}`} />
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={onReset}
            className="print-hide inline-flex items-center justify-center gap-2 rounded-xl bg-brand-teal px-4 py-3 text-sm font-semibold text-white hover:bg-brand-teal-dark active:scale-[0.98] transition min-h-[48px]"
          >
            <RotateCcw className="h-4 w-4" />
            Submit Another
          </button>
        
          <button
            onClick={() => window.print()}
            className="print-hide inline-flex items-center justify-center gap-2 rounded-xl border border-brand-teal/20 bg-brand-teal-light px-4 py-3 text-sm font-semibold text-brand-teal hover:bg-brand-teal-light/80 active:scale-[0.98] transition min-h-[48px]"
          >
            <Download className="h-4 w-4" />
            Save Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
