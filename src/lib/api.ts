const DEFAULT_API_BASE = "https://uhhobtdwixfeqmpnbjbu.supabase.co/functions/v1/muhami-api";

export class ApiError extends Error {
  field?: string;

  constructor(message: string, field?: string) {
    super(message);
    this.name = "ApiError";
    this.field = field;
  }
}

export function getApiBase(): string {
  const lawyersUrl =
    import.meta.env.VITE_API_URL ||
    `${DEFAULT_API_BASE}/lawyers`;
  return lawyersUrl.replace(/\/lawyers\/?$/, "").replace(/\/api\/lawyers\/?$/, "");
}

function getSupabaseHeaders(extra: Record<string, string> = {}) {
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extra,
  };

  if (anonKey) {
    headers.apikey = anonKey;
    headers.Authorization = `Bearer ${anonKey}`;
  }

  return headers;
}

export type LawyerApplication = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  nationality: string;
  experience: string;
  created_at: string;
};

export type LawyerFormData = {
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  experience: string;
};

export async function submitLawyerApplication(form: LawyerFormData) {
  const res = await fetch(`${getApiBase()}/lawyers`, {
    method: "POST",
    headers: getSupabaseHeaders(),
    body: JSON.stringify(form),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      data.error || "Something went wrong. Please try again.",
      data.field,
    );
  }

  return data;
}

export async function adminLogin(username: string, password: string) {
  const res = await fetch(`${getApiBase()}/admin/login`, {
    method: "POST",
    headers: getSupabaseHeaders(),
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Login failed.");
  }

  return data as { success: boolean; token: string };
}

export async function fetchApplications(adminKey: string) {
  const res = await fetch(`${getApiBase()}/lawyers`, {
    headers: getSupabaseHeaders({ "x-admin-key": adminKey }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Failed to load applications.");
  }

  return data as { total: number; applications: LawyerApplication[] };
}

export async function deleteApplication(adminKey: string, id: string) {
  const res = await fetch(`${getApiBase()}/lawyers/${id}`, {
    method: "DELETE",
    headers: getSupabaseHeaders({ "x-admin-key": adminKey }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Failed to delete application.");
  }

  return data;
}
