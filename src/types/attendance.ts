export type Option = { id: string; label: string };

export interface AttendanceFormValues {
  date: string;
  day: string;
  teacherId: string;
  teacherName: string;
  classId: string;
  className: string;
  batchId: string;
  batchName: string;
  session: string;
  slotId: string;
  slotName: string;
  studentId: string;
  studentName: string;
}

export interface StudentRecord {
  studentId: string;
  studentName: string;
  teacherIds: string[];
  classIds: string[];
  batchIds: string[];
  slotIds: string[];
  days: string[];
}
