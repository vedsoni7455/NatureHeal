import { useEffect, useState } from "react";
import type { Role } from "./mock-data";
import { authAPI, setToken, getToken } from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  age?: number;
  height?: number;
  weight?: number;
  conditions?: string[];
  specialization?: string;
}

const KEY = "healora_user";
const listeners = new Set<() => void>();

function mapBackendUser(raw: Record<string, unknown>): User {
  return {
    id: String(raw._id ?? raw.id),
    name: String(raw.name ?? ""),
    email: String(raw.email ?? ""),
    role: raw.role as Role,
    age: raw.age as number | undefined,
    height: raw.height as number | undefined,
    weight: raw.weight as number | undefined,
    specialization: raw.specialization as string | undefined,
  };
}

function read(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function emit() {
  listeners.forEach((l) => l());
}

export function setUser(u: User | null) {
  if (typeof window === "undefined") return;
  if (u) localStorage.setItem(KEY, JSON.stringify(u));
  else localStorage.removeItem(KEY);
  emit();
}

export function useAuth() {
  const [user, setStateUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setStateUser(read());
    setReady(true);
    const cb = () => setStateUser(read());
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  }, []);

  return {
    user,
    ready,
    isAuthenticated: !!user,
    logout: () => {
      setToken(null);
      setUser(null);
    },
  };
}

export async function loginUser(email: string, password: string): Promise<User> {
  const { token, user: raw } = await authAPI.login(email, password);
  setToken(token);
  const user = mapBackendUser(raw);
  setUser(user);
  return user;
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: Role;
  specialization?: string;
  experience?: number;
}): Promise<User> {
  const payload: Record<string, unknown> = {
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role,
  };
  if (data.role === "doctor") {
    payload.specialization = data.specialization || "General Practice";
    payload.experience = data.experience ?? 1;
  }
  const { token, user: raw } = await authAPI.register(payload);
  setToken(token);
  const user = mapBackendUser(raw);
  setUser(user);
  return user;
}

/** Demo login when backend is unavailable */
/** @deprecated Demo only — use loginUser/registerUser */
export function mockLogin(email: string, role: Role = "patient"): User {
  const u: User = {
    id: "u_" + Math.random().toString(36).slice(2, 9),
    name:
      role === "doctor"
        ? "Dr. " + email.split("@")[0].replace(/\b\w/g, (c) => c.toUpperCase())
        : email.split("@")[0].replace(/\b\w/g, (c) => c.toUpperCase()),
    email,
    role,
    age: 32,
    height: 170,
    weight: 68,
    conditions: ["Mild insomnia"],
    specialization: role === "doctor" ? "Naturopathy" : undefined,
  };
  setUser(u);
  return u;
}

export async function restoreSession(): Promise<User | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const raw = await authAPI.getProfile();
    const user = mapBackendUser(raw);
    setUser(user);
    return user;
  } catch {
    setToken(null);
    setUser(null);
    return null;
  }
}
