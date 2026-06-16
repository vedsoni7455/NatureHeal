import { redirect } from "@tanstack/react-router";
import { getToken } from "./api";
import type { Role } from "./mock-data";

export function requireAuth(allowedRoles?: Role[]) {
  return () => {
    if (typeof window === "undefined") return;

    const token = getToken();
    if (!token) {
      throw redirect({ to: "/login" });
    }

    if (allowedRoles?.length) {
      try {
        const raw = localStorage.getItem("healora_user");
        if (raw) {
          const user = JSON.parse(raw) as { role: Role };
          if (!allowedRoles.includes(user.role)) {
            throw redirect({ to: "/" });
          }
        }
      } catch (e) {
        if (e && typeof e === "object" && "to" in e) throw e;
      }
    }
  };
}
