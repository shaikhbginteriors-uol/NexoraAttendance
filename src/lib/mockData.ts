import type { Option, StudentRecord } from "@/types/attendance";

/**
 * MOCK DATA — will later be replaced with Google Apps Script calls
 * against the Google Sheets (Teachers, Classes, Batches, Sessions, Slots, 04_Student Database).
 *
 * These helpers simulate the cascading filter logic:
 *  Date/Day -> Teacher -> Class -> Batch -> Session -> Time Slot
 */

const teachers = [
  { id: "T001", label: "Ms. Ayesha Rahman", days: ["Monday", "Wednesday", "Friday"] },
  { id: "T002", label: "Mr. Bilal Ahmed", days: ["Tuesday", "Thursday", "Saturday"] },
  { id: "T003", label: "Ms. Sana Malik", days: ["Monday", "Tuesday", "Thursday"] },
  { id: "T004", label: "Mr. Zain Ali", days: ["Wednesday", "Friday", "Saturday"] },
  { id: "T005", label: "Ms. Hira Iqbal", days: ["Monday", "Thursday", "Sunday"] },
];

const classesByTeacher: Record<string, Option[]> = {
  T001: [{ id: "C01", label: "Montessori Level 1" }, { id: "C02", label: "Montessori Level 2" }],
  T002: [{ id: "C03", label: "Robotics Fundamentals" }, { id: "C04", label: "Coding Kids" }],
  T003: [{ id: "C05", label: "English Language" }, { id: "C06", label: "Public Speaking" }],
  T004: [{ id: "C07", label: "Math Skills" }, { id: "C08", label: "Advanced Math" }],
  T005: [{ id: "C09", label: "Art & Craft" }, { id: "C10", label: "Creative Writing" }],
};

const batchesByClass: Record<string, Option[]> = {
  C01: [{ id: "B01", label: "Batch A" }, { id: "B02", label: "Batch B" }],
  C02: [{ id: "B03", label: "Batch A" }],
  C03: [{ id: "B04", label: "Batch A" }, { id: "B05", label: "Batch B" }],
  C04: [{ id: "B06", label: "Batch A" }],
  C05: [{ id: "B07", label: "Beginners" }, { id: "B08", label: "Intermediate" }],
  C06: [{ id: "B09", label: "Batch A" }],
  C07: [{ id: "B10", label: "Batch A" }, { id: "B11", label: "Batch B" }],
  C08: [{ id: "B12", label: "Batch A" }],
  C09: [{ id: "B13", label: "Batch A" }],
  C10: [{ id: "B14", label: "Batch A" }, { id: "B15", label: "Batch B" }],
};

const sessionsByBatch: Record<string, string[]> = {
  B01: ["Morning", "Evening"],
  B02: ["Morning"],
  B03: ["Evening"],
  B04: ["Morning", "Afternoon"],
  B05: ["Evening"],
  B06: ["Morning"],
  B07: ["Morning", "Evening"],
  B08: ["Evening"],
  B09: ["Afternoon"],
  B10: ["Morning"],
  B11: ["Evening"],
  B12: ["Morning"],
  B13: ["Afternoon"],
  B14: ["Morning"],
  B15: ["Evening"],
};

const slotsBySession: Record<string, Option[]> = {
  Morning: [
    { id: "S01", label: "08:00 AM – 09:00 AM" },
    { id: "S02", label: "09:15 AM – 10:15 AM" },
    { id: "S03", label: "10:30 AM – 11:30 AM" },
  ],
  Afternoon: [
    { id: "S04", label: "01:00 PM – 02:00 PM" },
    { id: "S05", label: "02:15 PM – 03:15 PM" },
  ],
  Evening: [
    { id: "S06", label: "04:00 PM – 05:00 PM" },
    { id: "S07", label: "05:15 PM – 06:15 PM" },
    { id: "S08", label: "06:30 PM – 07:30 PM" },
  ],
};

// Student database (mock of 04_Student Database)
const students: StudentRecord[] = [
  {
    studentId: "ST00001",
    studentName: "Ahmed Khan",
    teacherIds: ["T001"],
    classIds: ["C01"],
    batchIds: ["B01"],
    slotIds: ["S01", "S02"],
    days: ["Monday", "Wednesday", "Friday"],
  },
  {
    studentId: "ST00002",
    studentName: "Fatima Noor",
    teacherIds: ["T002"],
    classIds: ["C03"],
    batchIds: ["B04"],
    slotIds: ["S02", "S03"],
    days: ["Tuesday", "Thursday"],
  },
  {
    studentId: "ST00003",
    studentName: "Hassan Ali",
    teacherIds: ["T003"],
    classIds: ["C05"],
    batchIds: ["B07"],
    slotIds: ["S01", "S06"],
    days: ["Monday", "Thursday"],
  },
  {
    studentId: "ST00004",
    studentName: "Zara Sheikh",
    teacherIds: ["T001", "T005"],
    classIds: ["C02", "C09"],
    batchIds: ["B03", "B13"],
    slotIds: ["S06", "S04"],
    days: ["Monday", "Thursday"],
  },
  {
    studentId: "ST00005",
    studentName: "Ali Raza",
    teacherIds: ["T004"],
    classIds: ["C07"],
    batchIds: ["B10"],
    slotIds: ["S01"],
    days: ["Wednesday", "Friday"],
  },
];

// In-memory duplicate tracking (mocks the Google Sheet attendance log)
const submittedKeys = new Set<string>();

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function getDayFromDate(dateString: string): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { weekday: "long" });
}

export async function fetchTeachersForDay(day: string): Promise<Option[]> {
  await wait(500);
  if (!day) return [];
  return teachers
    .filter((t) => t.days.includes(day))
    .map((t) => ({ id: t.id, label: t.label }));
}

export async function fetchClassesForTeacher(teacherId: string): Promise<Option[]> {
  await wait(450);
  return classesByTeacher[teacherId] ?? [];
}

export async function fetchBatchesForClass(classId: string): Promise<Option[]> {
  await wait(400);
  return batchesByClass[classId] ?? [];
}

export async function fetchSessionsForBatch(batchId: string): Promise<Option[]> {
  await wait(350);
  return (sessionsByBatch[batchId] ?? []).map((s) => ({ id: s, label: s }));
}

export async function fetchSlotsForSession(session: string): Promise<Option[]> {
  await wait(350);
  return slotsBySession[session] ?? [];
}

export interface ValidateStudentInput {
  studentId: string;
  teacherId: string;
  classId: string;
  batchId: string;
  slotId: string;
  day: string;
}

export interface ValidateStudentResult {
  ok: boolean;
  studentName?: string;
  error?: "NOT_FOUND" | "MISMATCH";
  message?: string;
}

export async function validateStudent(
  input: ValidateStudentInput,
): Promise<ValidateStudentResult> {
  await wait(700);
  const student = students.find((s) => s.studentId.toUpperCase() === input.studentId.toUpperCase());
  if (!student) return { ok: false, error: "NOT_FOUND", message: "Student ID not found" };

  const { teacherId, classId, batchId, slotId, day } = input;
  const contextProvided = teacherId && classId && batchId && slotId && day;
  if (contextProvided) {
    const belongs =
      student.teacherIds.includes(teacherId) &&
      student.classIds.includes(classId) &&
      student.batchIds.includes(batchId) &&
      student.slotIds.includes(slotId) &&
      student.days.includes(day);
    if (!belongs) {
      return {
        ok: false,
        studentName: student.studentName,
        error: "MISMATCH",
        message:
          "This student is not enrolled in the selected Teacher / Class / Batch / Day / Time Slot.",
      };
    }
  }

  return { ok: true, studentName: student.studentName };
}

export async function lookupStudentName(studentId: string): Promise<ValidateStudentResult> {
  await wait(600);
  const student = students.find((s) => s.studentId.toUpperCase() === studentId.toUpperCase());
  if (!student) return { ok: false, error: "NOT_FOUND", message: "Student ID not found" };
  return { ok: true, studentName: student.studentName };
}

export async function submitAttendance(payload: {
  date: string;
  studentId: string;
  teacherId: string;
  classId: string;
  batchId: string;
  slotId: string;
}): Promise<{ ok: boolean; duplicate?: boolean; message?: string }> {
  await wait(900);
  const key = [payload.date, payload.studentId, payload.teacherId, payload.classId, payload.batchId, payload.slotId].join("|");
  if (submittedKeys.has(key)) {
    return { ok: false, duplicate: true, message: "Attendance already submitted" };
  }
  submittedKeys.add(key);
  return { ok: true, message: "Attendance recorded successfully" };
}
