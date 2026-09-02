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
  // Step 1: Student ID lookup
  const lookupResponse = await fetch("/api/nexora", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "lookupStudent",
      payload: {
        studentId: params.studentId,
      },
    }),
  });

  const lookupResult = await lookupResponse.json();

  if (!lookupResponse.ok || !lookupResult.ok) {
    return {
      ok: false,
      message: lookupResult.error || "Unable to verify Student ID.",
    };
  }

  if (
    !lookupResult.data ||
    lookupResult.data.status === "not_found"
  ) {
    return {
      ok: false,
      message: "Student ID not found",
    };
  }

  // Step 2: Enrollment verification
  const verifyResponse = await fetch("/api/nexora", {
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

  const verifyResult = await verifyResponse.json();

  if (!verifyResponse.ok || !verifyResult.ok) {
    return {
      ok: false,
      message: verifyResult.error || "Unable to verify enrollment.",
    };
  }

  if (verifyResult.data?.status === "not_enrolled") {
    return {
      ok: false,
      message: "Student is not assigned to this class.",
    };
  }

  if (verifyResult.data?.status !== "ok") {
    return {
      ok: false,
      message: "Student verification failed.",
    };
  }

  return {
    ok: true,
    studentName:
      verifyResult.data.studentName ||
      lookupResult.data.studentName,
  };
}
