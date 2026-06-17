const TOKEN_KEY = "token";

function getBaseURL(): string {
  let url = import.meta.env.VITE_API_BASE || "https://healora-backend-netj.onrender.com/api";
  url = url.replace(/\/$/, "");
  if (!url.endsWith("/api")) {
    url = `${url}/api`;
  }
  return url;
}

export const API_BASE_URL = getBaseURL().replace("/api", "");

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  const isFormData = options.body instanceof FormData;
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${getBaseURL()}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("healora_user");
      window.location.href = "/login";
    }
    const message =
      data.message ||
      data.errors?.[0]?.msg ||
      data.errors?.[0]?.message ||
      "Request failed";
    throw new Error(message);
  }

  return data as T;
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export interface DoctorView {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  reviews: number;
  bio: string;
  image: string;
  consultationFee: number;
  available: string[];
  languages: string[];
}

export interface AppointmentView {
  id: string;
  doctorId: string;
  doctorName: string;
  patientName: string;
  date: string;
  time: string;
  type: "video" | "voice" | "message" | "in-person";
  status: "pending" | "confirmed" | "completed" | "cancelled" | "rescheduled";
  symptoms?: string;
  prescription?: string;
  meetingLink?: string;
}

function resolveImage(pic: unknown): string {
  if (!pic) {
    return "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400";
  }
  const path = String(pic);
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function mapDoctor(raw: Record<string, unknown>): DoctorView {
  const details = (raw.doctorDetails || {}) as Record<string, unknown>;
  return {
    id: String(raw._id),
    name: String(raw.name),
    specialization: String(raw.specialization || "General Practice"),
    experience: Number(raw.experience || 0),
    rating: Number(details.rating || 4.5),
    reviews: Number(details.totalReviews || 0),
    bio: String(details.bio || "Holistic healthcare practitioner."),
    image: resolveImage(raw.profilePicture || details.certificateImage),
    consultationFee: Number(details.consultationFee || 50),
    available: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"],
    languages: (details.languages as string[]) || ["English"],
  };
}

export function mapAppointment(raw: Record<string, unknown>): AppointmentView {
  const doctor = raw.doctor as Record<string, unknown> | undefined;
  const patient = raw.patient as Record<string, unknown> | undefined;
  return {
    id: String(raw._id),
    doctorId: doctor?._id ? String(doctor._id) : String(raw.doctor || ""),
    doctorName: doctor?.name ? String(doctor.name) : "Doctor",
    patientName: patient?.name ? String(patient.name) : "Patient",
    date: raw.date ? new Date(String(raw.date)).toLocaleDateString() : "",
    time: String(raw.time || ""),
    type: (raw.type as AppointmentView["type"]) || "video",
    status: (raw.status as AppointmentView["status"]) || "pending",
    symptoms: Array.isArray(raw.symptoms)
      ? raw.symptoms.join(", ")
      : String(raw.notes || ""),
    prescription: raw.prescription ? String(raw.prescription) : undefined,
    meetingLink: raw.meetingLink ? String(raw.meetingLink) : undefined,
  };
}

export const authAPI = {
  login: (email: string, password: string) =>
    request<{ token: string; user: Record<string, unknown> }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (userData: Record<string, unknown>) =>
    request<{ token: string; user: Record<string, unknown> }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  getProfile: () => request<Record<string, unknown>>("/auth/profile"),

  updateProfile: (data: Record<string, unknown>) =>
    request<Record<string, unknown>>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

export const doctorAPI = {
  list: (params?: { pageNumber?: number; search?: string; specialization?: string }) => {
    const qs = new URLSearchParams();
    if (params?.pageNumber) qs.set("pageNumber", String(params.pageNumber));
    if (params?.search) qs.set("search", params.search);
    if (params?.specialization) qs.set("specialization", params.specialization);
    const query = qs.toString();
    return request<{ doctors: Record<string, unknown>[]; pages: number; total: number }>(
      `/doctor${query ? `?${query}` : ""}`,
    );
  },

  get: (id: string) =>
    request<Record<string, unknown>>(`/doctor/${id}`),

  getSlots: (id: string, date: string) =>
    request<string[]>(`/doctor/${id}/slots?date=${date}`),
};

export const appointmentAPI = {
  list: () =>
    request<{ appointments: Record<string, unknown>[] }>("/appointments"),

  get: (id: string) =>
    request<Record<string, unknown>>(`/appointments/${id}`),

  create: (data: FormData) =>
    request<Record<string, unknown>>("/appointments", {
      method: "POST",
      body: data,
    }),

  update: (id: string, data: Record<string, unknown>) =>
    request<Record<string, unknown>>(`/appointments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  doctorList: (status?: string) => {
    const query = status ? `?status=${status}` : "";
    return request<{ appointments: Record<string, unknown>[] }>(
      `/doctor/appointments${query}`,
    );
  },
};

export const adminAPI = {
  stats: () => request<Record<string, unknown>>("/admin/stats"),
  users: () => request<Record<string, unknown>[]>("/admin/users"),
  appointments: () => request<Record<string, unknown>[]>("/admin/appointments"),
};

export const contactAPI = {
  submit: (data: { name: string; email: string; message: string; subject?: string }) =>
    request<{ message: string }>("/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const aiAPI = {
  chat: (message: string) =>
    request<{ reply?: string; response?: string; message?: string }>("/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),

  analyzeSymptoms: (data: {
    symptoms: string[];
    severity: string;
    duration: string;
  }) =>
    request<Record<string, unknown>>("/ai/analyze-symptoms", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  unifiedPlan: (query: string) =>
    request<Record<string, unknown>>("/ai/unified-plan", {
      method: "POST",
      body: JSON.stringify({ query }),
    }),

  generateDiet: (data: Record<string, unknown>) =>
    request<Record<string, unknown>>("/ai/generate-diet", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const dietAPI = {
  list: () => request<unknown[]>("/diet"),
  generate: (data: Record<string, unknown>) =>
    request<Record<string, unknown>>("/diet/generate", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
