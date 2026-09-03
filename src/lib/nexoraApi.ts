import type { Option } from "@/types/attendance";

type NexoraApiResponse<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

type ApiOption = {
  id: string;
  name: string;
};

/* ==============================
   TEACHERS
============================== */

export async function fetchTeachersFromApi(
  date: string
): Promise<Option[]> {
  const response = await fetch("/api/nexora", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "teachers",
      payload: {
        date,
      },
    }),
  });

  const result: NexoraApiResponse<ApiOption[]> =
    await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(
      result.error || "Unable to load teachers."
    );
  }

  return (result.data || []).map((teacher) => ({
    id: teacher.id,
    label: teacher.name,
  }));
}

/* ==============================
   CLASSES
============================== */

export async function fetchClassesFromApi(
  date: string,
  teacherId: string
): Promise<Option[]> {
  const response = await fetch("/api/nexora", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "classes",
      payload: {
        date,
        teacherId,
      },
    }),
  });

  const result: NexoraApiResponse<ApiOption[]> =
    await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(
      result.error || "Unable to load classes."
    );
  }

  return (result.data || []).map((item) => ({
    id: item.id,
    label: item.name,
  }));
}

/* ==============================
   BATCHES
============================== */

export async function fetchBatchesFromApi(
  date: string,
  teacherId: string,
  classId: string
): Promise<Option[]> {
  const response = await fetch("/api/nexora", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "batches",
      payload: {
        date,
        teacherId,
        classId,
      },
    }),
  });

  const result: NexoraApiResponse<ApiOption[]> =
    await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(
      result.error || "Unable to load batches."
    );
  }

  return (result.data || []).map((item) => ({
    id: item.id,
    label: item.name,
  }));
}

/* ==============================
    SESSIONS
============================== */

export async function fetchSessionsFromApi(
  date: string,
  teacherId: string,
  classId: string,
  batchId: string
): Promise<Option[]> {
  const response = await fetch("/api/nexora", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "sessions",
      payload: {
        date,
        teacherId,
        classId,
        batchId,
      },
    }),
  });

  const result: NexoraApiResponse<ApiOption[]> =
    await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(
      result.error || "Unable to load sessions."
    );
  }

  return (result.data || []).map((item) => ({
    id: item.id,
    label: item.name,
  }));
}
/* ==============================
    SLOT
============================== */

export async function fetchSlotsFromApi(
  date: string,
  teacherId: string,
  classId: string,
  batchId: string,
  session: string
): Promise<Option[]> {
  const response = await fetch("/api/nexora", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "slots",
      payload: {
        date,
        teacherId,
        classId,
        batchId,
        session,
      },
    }),
  });

  const result: NexoraApiResponse<ApiOption[]> =
    await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(
      result.error || "Unable to load time slots."
    );
  }

  return (result.data || []).map((item) => ({
    id: item.id,
    label: item.name,
  }));
}

/* ==============================
   VALIDATE STUDENT
============================== */

export async function validateStudentFromApi(params: {
  studentId: string;
  date: string;
  day: string;
  teacherId: string;
  classId: string;
  batchId: string;
  session: string;
  slotId: string;
}): Promise<{
  ok: boolean;
  studentName?: string;
  message?: string;
}> {
  try {
    const response = await fetch("/api/nexora", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "verifyEnrollment",
        payload: {
          studentId: params.studentId,
          date: params.date,
          day: params.day,
          teacherId: params.teacherId,
          classId: params.classId,
          batchId: params.batchId,
          session: params.session,
          slotId: params.slotId,
        },
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      return {
        ok: false,
        message:
          result.error || "Unable to verify student.",
      };
    }

    if (result.data?.status === "not_found") {
      return {
        ok: false,
        message: "Student ID not found",
      };
    }

    if (result.data?.status === "not_enrolled") {
      return {
        ok: false,
        message:
          "Student is not assigned to this class.",
      };
    }

    if (result.data?.status === "ok") {
      return {
        ok: true,
        studentName: result.data.studentName,
      };
    }

    return {
      ok: false,
      message: "Student verification failed.",
    };
  } catch (error) {
    console.error("Student verification error:", error);

    return {
      ok: false,
      message:
        "Unable to verify student. Please try again.",
    };
  }
}

/* ==============================
   ATTENDANCE SESSION STATUS
============================== */

export type AttendanceSessionStatus =
  | "open"
  | "not_started"
  | "closed"
  | "expired"
  | "not_available";

export type AttendanceSessionStatusResult = {
  status: AttendanceSessionStatus;
  controlId?: string;
  mappingId?: string;
  startTime?: string;
  endTime?: string;
  remainingSeconds: number;
  message: string;
};

export async function fetchAttendanceSessionStatus(
  params: {
    date: string;
    teacherId: string;
    classId: string;
    batchId: string;
    session: string;
    slotId: string;
  }
): Promise<AttendanceSessionStatusResult> {
  try {
    const response = await fetch("/api/nexora", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "attendanceSessionStatus",
        payload: {
          date: params.date,
          teacherId: params.teacherId,
          classId: params.classId,
          batchId: params.batchId,
          session: params.session,
          slotId: params.slotId,
        },
      }),
    });

    const result: NexoraApiResponse<AttendanceSessionStatusResult> =
      await response.json();

    if (!response.ok || !result.ok || !result.data) {
      return {
        status: "not_available",
        remainingSeconds: 0,
        message:
          result.error ||
          "Unable to check attendance window.",
      };
    }

    return {
      status: result.data.status,
      controlId: result.data.controlId,
      mappingId: result.data.mappingId,
      startTime: result.data.startTime,
      endTime: result.data.endTime,
      remainingSeconds: Number(
        result.data.remainingSeconds || 0
      ),
      message:
        result.data.message ||
        "Attendance status loaded.",
    };
  } catch (error) {
    console.error(
      "Attendance session status error:",
      error
    );

    return {
      status: "not_available",
      remainingSeconds: 0,
      message:
        "Unable to check attendance window. Please try again.",
    };
  }
}

/* ==============================
   TEACHER ATTENDANCE SESSION STATUS
============================== */

export type TeacherAttendanceSessionStatusResult = {
  status:
    | "open"
    | "not_started"
    | "closed"
    | "expired"
    | "not_available";

  controlId?: string;
  mappingId?: string;

  teacherId?: string;
  teacherName?: string;

  classId?: string;
  className?: string;

  batchId?: string;
  batchName?: string;

  slotId?: string;
  timeSlot?: string;

  session?: string;

  startTime?: string;
  endTime?: string;

  remainingSeconds: number;
  message: string;
};

export async function fetchTeacherAttendanceSessionStatus(
  params: {
    date: string;
    teacherId: string;
  }
): Promise<TeacherAttendanceSessionStatusResult> {
  try {
    const response = await fetch("/api/nexora", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "teacherAttendanceSessionStatus",
        payload: {
          date: params.date,
          teacherId: params.teacherId,
        },
      }),
    });

    const result: NexoraApiResponse<TeacherAttendanceSessionStatusResult> =
      await response.json();

    if (!response.ok || !result.ok || !result.data) {
      return {
        status: "not_available",
        remainingSeconds: 0,
        message:
          result.error ||
          "Unable to check teacher attendance session.",
      };
    }

    return {
      ...result.data,
      remainingSeconds: Number(
        result.data.remainingSeconds || 0
      ),
      message:
        result.data.message ||
        "Attendance status loaded.",
    };
  } catch (error) {
    console.error(
      "Teacher attendance session status error:",
      error
    );

    return {
      status: "not_available",
      remainingSeconds: 0,
      message:
        "Unable to check attendance session. Please try again.",
    };
  }
}


/* ==============================
    SUBMIT BUTTON
============================== */

export async function submitAttendanceToApi(params: {
  date: string;
  teacherId: string;
  classId: string;
  batchId: string;
  session: string;
  slotId: string;
  studentId: string;
}): Promise<{
  ok: boolean;
  duplicate?: boolean;
  message?: string;
  data?: {
    status: string;
    studentName: string;
    teacher: string;
    className: string;
    batch: string;
    session: string;
    timeSlot: string;
    date: string;
    day: string;
  };
}> {
  try {
    const response = await fetch("/api/nexora", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "submitAttendance",
        payload: {
          date: params.date,
          teacherId: params.teacherId,
          classId: params.classId,
          batchId: params.batchId,
          session: params.session,
          slotId: params.slotId,
          studentId: params.studentId,
        },
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      return {
        ok: false,
        message:
          result.error ||
          "Unable to submit attendance.",
      };
    }

    if (result.data?.status === "duplicate") {
      return {
        ok: false,
        duplicate: true,
        message:
          result.data.message ||
          "Attendance already submitted",
      };
    }

    if (result.data?.status !== "success") {
      return {
        ok: false,
        message:
          result.data?.message ||
          "Attendance submission failed.",
      };
    }

    return {
      ok: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Attendance submit error:", error);

    return {
      ok: false,
      message:
        "Unable to submit attendance. Please try again.",
    };
  }
}
