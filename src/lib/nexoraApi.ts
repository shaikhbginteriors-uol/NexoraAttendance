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
