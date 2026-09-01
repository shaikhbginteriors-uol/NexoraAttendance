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
