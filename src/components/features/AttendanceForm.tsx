
import { useEffect, useMemo, useState, useCallback } from "react"; // Added useCallback
import {
  Calendar,
  User2,
  BookOpen, // This icon is imported but not used. Keeping for minimal change.
  Users, // This icon is imported but not used. Keeping for minimal change.
  Clock, // This icon is imported but not used. Keeping for minimal change.
  Sun, // This icon is imported but not used. Keeping for minimal change.
  IdCard,
  AlertCircle,
  Loader2,
  Send,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import FormField from "./FormField";
import SelectField from "./SelectField";
import StatusCard from "./StatusCard";
import {
  fetchBatchesForClass,
  fetchClassesForTeacher,
  fetchSessionsForBatch,
  fetchSlotsForSession,
  fetchTeachersForDay,
  getDayFromDate,
  submitAttendance,
  validateStudent,
} from "@/lib/mockData";
import type { Option } from "@/types/attendance";

type StudentStatus =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "valid"; name: string }
  | { state: "invalid"; message: string };

const emptyForm = {
  date: "",
  teacherId: "",
  classId: "",
  batchId: "",
  session: "",
  slotId: "",
  studentId: "",
};

const todayISO = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const isFutureDate = (dateStr: string): boolean => {
  if (!dateStr) return false;
  return dateStr > todayISO();
};

export default function AttendanceForm() {
  const [form, setForm] = useState({ ...emptyForm, date: todayISO() });
  const [teachers, setTeachers] = useState<Option[]>([]);
  const [classes, setClasses] = useState<Option[]>([]);
  const [batches, setBatches] = useState<Option[]>([]);
  const [sessions, setSessions] = useState<Option[]>([]);
  const [slots, setSlots] = useState<Option[]>([]);

  const [loading, setLoading] = useState({
    teachers: false,
    classes: false,
    batches: false,
    sessions: false,
    slots: false,
  });

  const [studentStatus, setStudentStatus] = useState<StudentStatus>({ state: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<null | {
    studentName: string;
    teacherName: string;
    className: string;
    batchName: string;
    session: string;
    slotName: string;
    date: string;
    day: string;
  }>(null);

  const day = useMemo(() => {
    if (!form.date || isFutureDate(form.date)) return "";
    return getDayFromDate(form.date);
  }, [form.date]);

  // Wrap setForm in useCallback to provide a stable reference for useEffect dependencies
  const setFormCallback = useCallback((newForm: typeof emptyForm | ((prevForm: typeof emptyForm) => typeof emptyForm)) => {
    // If newForm is a function, call setForm with it, otherwise set it directly.
    // This allows for both direct updates and functional updates.
    if (typeof newForm === 'function') {
      setForm(prevForm => {
        const updatedForm = newForm(prevForm);
        return { ...prevForm, ...updatedForm }; // Ensure all fields are covered if `newForm` doesn't provide all
      });
    } else {
      setForm(newForm);
    }
  }, []);

  // Define setField using useCallback as it is used in onChange handlers and affects state.
  const setField = useCallback((k: keyof typeof form, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
    setGlobalError(null);
  }, []);

  const handleDateChange = useCallback((value: string) => {
    if (value && isFutureDate(value)) {
      setForm((f) => ({
        ...f,
        date: value,
        teacherId: "",
        classId: "",
        batchId: "",
        session: "",
        slotId: "",
        studentId: "",
      }));
      setStudentStatus({ state: "idle" });
      setErrors({ date: "Future attendance cannot be marked." });
      setGlobalError(null);
      toast.warning("Future attendance cannot be marked.");
    } else {
      setField("date", value);
    }
  }, [setField]);


  /* ---------------- cascading fetch effects ---------------- */
  useEffect(() => {
    let active = true;
    setTeachers([]);
    setForm((f) => ({ ...f, teacherId: "", classId: "", batchId: "", session: "", slotId: "" }));
    if (!day) return;
    setLoading((l) => ({ ...l, teachers: true }));
    fetchTeachersForDay(day).then((res) => {
      if (!active) return;
      setTeachers(res);
      setLoading((l) => ({ ...l, teachers: false }));
    });
    return () => {
      active = false;
    };
  }, [day, setForm]); 

  useEffect(() => {
    let active = true;
    setClasses([]);
    setForm((f) => ({ ...f, classId: "", batchId: "", session: "", slotId: "" }));
    if (!form.teacherId) return;
    setLoading((l) => ({ ...l, classes: true }));
    fetchClassesForTeacher(form.teacherId).then((res) => {
      if (!active) return;
      setClasses(res);
      setLoading((l) => ({ ...l, classes: false }));
    });
    return () => {
      active = false;
    };
  }, [form.teacherId, setForm]); 

  useEffect(() => {
    let active = true;
    setBatches([]);
    setForm((f) => ({ ...f, batchId: "", session: "", slotId: "" }));
    if (!form.classId) return;
    setLoading((l) => ({ ...l, batches: true }));
    fetchBatchesForClass(form.classId).then((res) => {
      if (!active) return;
      setBatches(res);
      setLoading((l) => ({ ...l, batches: false }));
    });
    return () => {
      active = false;
    };
  }, [form.classId, setForm]); 

  useEffect(() => {
    let active = true;
    setSessions([]);
    setForm((f) => ({ ...f, session: "", slotId: "" }));
    if (!form.batchId) return;
    setLoading((l) => ({ ...l, sessions: true }));
    fetchSessionsForBatch(form.batchId).then((res) => {
      if (!active) return;
      setSessions(res);
      setLoading((l) => ({ ...l, sessions: false }));
    });
    return () => {
      active = false;
    };
  }, [form.batchId, setForm]); 

  useEffect(() => {
    let active = true;
    setSlots([]);
    setForm((f) => ({ ...f, slotId: "" }));
    if (!form.session) return;
    setLoading((l) => ({ ...l, slots: true }));
    fetchSlotsForSession(form.session).then((res) => {
      if (!active) return;
      setSlots(res);
      setLoading((l) => ({ ...l, slots: false }));
    });
    return () => {
      active = false;
    };
  }, [form.session, setForm]); 

  /* ---------------- student ID validation (debounced) ---------------- */
  useEffect(() => {
    const id = form.studentId.trim();
    if (!id) {
      setStudentStatus({ state: "idle" });
      return;
    }
    const contextComplete =
      form.teacherId && form.classId && form.batchId && form.slotId && day;
    if (!contextComplete) {
      // Just soft-idle; user must complete previous fields.
      setStudentStatus({ state: "idle" });
      return;
    }

    setStudentStatus({ state: "loading" });
    const handle = setTimeout(() => {
      validateStudent({
        studentId: id,
        teacherId: form.teacherId,
        classId: form.classId,
        batchId: form.batchId,
        slotId: form.slotId,
        day,
      }).then((res) => {
        if (res.ok && res.studentName) {
          setStudentStatus({ state: "valid", name: res.studentName });
        } else {
          setStudentStatus({
            state: "invalid",
            message: res.message || "Student ID not found",
          });
        }
      });
    }, 500);

    return () => clearTimeout(handle);
  }, [form.studentId, form.teacherId, form.classId, form.batchId, form.slotId, day]);

  /* ---------------- helpers ---------------- */
  // setField was defined here. Moved up and wrapped in useCallback.

  const teacherName = teachers.find((t) => t.id === form.teacherId)?.label ?? "";
  const className = classes.find((c) => c.id === form.classId)?.label ?? "";
  const batchName = batches.find((b) => b.id === form.batchId)?.label ?? "";
  const slotName = slots.find((s) => s.id === form.slotId)?.label ?? "";

  const canSubmit =
    !!form.date &&
    !isFutureDate(form.date) &&
    !!form.teacherId &&
    !!form.classId &&
    !!form.batchId &&
    !!form.session &&
    !!form.slotId &&
    studentStatus.state === "valid" &&
    !submitting;

  const handleReset = useCallback(() => {
    setForm({ ...emptyForm, date: todayISO() });
    setStudentStatus({ state: "idle" });
    setErrors({});
    setGlobalError(null);
    setSubmitted(null);
    toast.info("Form reset");
  }, [setForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFutureDate(form.date)) {
      setErrors({ date: "Future attendance cannot be marked." });
      setGlobalError("Future attendance cannot be marked.");
      toast.error("Future attendance cannot be marked.");
      return;
    }
    const nextErrors: Record<string, string> = {};
    if (!form.date) nextErrors.date = "Please select a date";
    if (!form.teacherId) nextErrors.teacherId = "Please select a teacher";
    if (!form.classId) nextErrors.classId = "Please select a class";
    if (!form.batchId) nextErrors.batchId = "Please select a batch";
    if (!form.session) nextErrors.session = "Please select a session";
    if (!form.slotId) nextErrors.slotId = "Please select a time slot";
    if (!form.studentId) nextErrors.studentId = "Please enter Student ID";
    if (studentStatus.state !== "valid") {
      nextErrors.studentId = "Please enter a valid Student ID";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setGlobalError("Please correct the highlighted fields.");
      return;
    }

    setSubmitting(true);
    setGlobalError(null);
    const res = await submitAttendance({
      date: form.date,
      studentId: form.studentId,
      teacherId: form.teacherId,
      classId: form.classId,
      batchId: form.batchId,
      slotId: form.slotId,
    });
    setSubmitting(false);

    if (res.ok) {
      toast.success("Attendance recorded successfully");
      setSubmitted({
        studentName: studentStatus.state === "valid" ? studentStatus.name : "",
        teacherName,
        className,
        batchName,
        session: form.session,
        slotName,
        date: form.date,
        day,
      });
    } else if (res.duplicate) {
      setGlobalError("Attendance already submitted");
      toast.warning("Attendance already submitted");
    } else {
      setGlobalError(res.message || "Something went wrong. Please try again.");
      toast.error(res.message || "Submission failed");
    }
  };

  if (submitted) {
    return <StatusCard data={submitted} onReset={handleReset} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-card card-shadow border border-border/60 overflow-hidden"
    >
      {/* Card header */}
      <div className="border-b border-border/60 bg-gradient-to-b from-brand-teal-light/50 to-card px-6 py-5 sm:px-8 sm:py-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-teal">
              Attendance Form
            </p>
            <h2 className="mt-1 text-xl sm:text-2xl font-bold text-foreground">
              Fill in your session details
            </h2>
          </div>
          <span className="hidden sm:inline-flex items-center gap-2 rounded-full bg-brand-orange/10 px-3 py-1.5 text-xs font-semibold text-brand-orange ring-1 ring-brand-orange/30">
            Fields marked <span className="text-brand-orange">*</span> are required
          </span>
        </div>
      </div>

      {/* Fields */}
      <div className="px-6 py-6 sm:px-8 sm:py-8 space-y-6">
        {/* Section: Session */}
        <SectionTitle icon={<Calendar className="h-4 w-4" />} title="Session Details" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <FormField
            label="Date"
            htmlFor="date"
            required
            hint={day ? day : "Day auto-detected"}
            error={errors.date}
          >
            <div className="relative">
              <input
                id="date"
                type="date"
                value={form.date}
                max={todayISO()}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full appearance-none rounded-xl border border-input bg-card px-4 py-3 pr-10 text-base sm:text-sm text-foreground field-focus min-h-[48px] hover:border-brand-teal/50 dark:[color-scheme:dark]"
              />
              <Calendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-teal" />
            </div>
          </FormField>

          <FormField label="Teacher Name" htmlFor="teacher" required error={errors.teacherId}>
            <SelectField
              id="teacher"
              value={form.teacherId}
              onChange={(v) => setField("teacherId", v)}
              options={teachers}
              placeholder="Select teacher"
              disabled={!day}
              loading={loading.teachers}
              invalid={!!errors.teacherId}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <FormField label="Class" htmlFor="class" required error={errors.classId}>
            <SelectField
              id="class"
              value={form.classId}
              onChange={(v) => setField("classId", v)}
              options={classes}
              placeholder="Select class"
              disabled={!form.teacherId}
              loading={loading.classes}
              invalid={!!errors.classId}
            />
          </FormField>

          <FormField label="Batch" htmlFor="batch" required error={errors.batchId}>
            <SelectField
              id="batch"
              value={form.batchId}
              onChange={(v) => setField("batchId", v)}
              options={batches}
              placeholder="Select batch"
              disabled={!form.classId}
              loading={loading.batches}
              invalid={!!errors.batchId}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <FormField label="Session" htmlFor="session" required error={errors.session}>
            <SelectField
              id="session"
              value={form.session}
              onChange={(v) => setField("session", v)}
              options={sessions}
              placeholder="Select session"
              disabled={!form.batchId}
              loading={loading.sessions}
              invalid={!!errors.session}
            />
          </FormField>

          <FormField label="Time Slot" htmlFor="slot" required error={errors.slotId}>
            <SelectField
              id="slot"
              value={form.slotId}
              onChange={(v) => setField("slotId", v)}
              options={slots}
              placeholder="Select time slot"
              disabled={!form.session}
              loading={loading.slots}
              invalid={!!errors.slotId}
            />
          </FormField>
        </div>

        {/* Divider */}
        <div className="pt-2">
          <SectionTitle icon={<User2 className="h-4 w-4" />} title="Student Information" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <FormField
            label="Student ID"
            htmlFor="studentId"
            required
            hint="Format: ST00001"
            error={errors.studentId}
          >
            <div className="relative">
              <input
                id="studentId"
                value={form.studentId}
                onChange={(e) => setField("studentId", e.target.value.toUpperCase())}
                placeholder="ST00001"
                autoComplete="off"
                className="w-full rounded-xl border border-input bg-card px-4 py-3 pr-10 text-base sm:text-sm text-foreground field-focus min-h-[48px] uppercase tracking-wider font-semibold placeholder:font-normal placeholder:text-muted-foreground/60 hover:border-brand-teal/50"
              />
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                {studentStatus.state === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin text-brand-teal" />
                ) : studentStatus.state === "valid" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : studentStatus.state === "invalid" ? (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                ) : (
                  <IdCard className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
            {studentStatus.state === "invalid" && (
              <p className="text-xs font-medium text-destructive mt-1 animate-fade-up">
                {studentStatus.message}
              </p>
            )}
            {studentStatus.state === "idle" &&
              form.studentId &&
              !(form.teacherId && form.classId && form.batchId && form.slotId) && (
                <p className="text-xs font-medium text-muted-foreground mt-1">
                  Complete the session fields above to validate this ID.
                </p>
              )}
          </FormField>

          <FormField label="Student Name" htmlFor="studentName" hint="Auto-filled">
            <div
              id="studentName"
              className="w-full rounded-xl border border-dashed border-input bg-muted/50 px-4 py-3 text-base sm:text-sm min-h-[48px] flex items-center"
            >
              {studentStatus.state === "valid" ? (
                <span className="font-semibold text-foreground">{studentStatus.name}</span>
              ) : studentStatus.state === "loading" ? (
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Verifying student…
                </span>
              ) : (
                <span className="text-muted-foreground">Ahmed Khan</span>
              )}
            </div>
          </FormField>
        </div>

        {/* Global error */}
        {globalError && (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 animate-fade-up">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-destructive mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-destructive">Submission blocked</p>
              <p className="text-sm text-destructive/80">{globalError}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer with actions */}
      <div className="border-t border-border/60 bg-muted/30 px-6 py-5 sm:px-8">
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            By submitting, you confirm the attendance details are accurate.
          </p>
          <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-input bg-card px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted active:scale-[0.98] transition min-h-[48px] whitespace-nowrap"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Form
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-teal px-6 py-3 text-sm font-bold text-white hover:bg-brand-teal-dark active:scale-[0.98] disabled:bg-brand-teal/40 disabled:cursor-not-allowed transition min-h-[48px] shadow-lg shadow-brand-teal/20 whitespace-nowrap"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Attendance
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-teal-light text-brand-teal">
        {icon}
      </span>
      <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/80">{title}</h3>
      <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent ml-2" />
    </div>
  );
}
