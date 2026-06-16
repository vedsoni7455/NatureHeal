import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/lib/auth-store";
import { appointmentAPI, mapAppointment, type AppointmentView } from "@/lib/api";
import { requireAuth } from "@/lib/route-guards";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Star, Activity, Video } from "lucide-react";

export const Route = createFileRoute("/dashboard/doctor")({
  beforeLoad: requireAuth(["doctor"]),
  head: () => ({ meta: [{ title: "Doctor dashboard — Healora" }] }),
  component: DoctorDash,
});

function DoctorDash() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"appointments" | "patients">("appointments");
  const [appointments, setAppointments] = useState<AppointmentView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentAPI.doctorList()
      .then((res) => setAppointments((res.appointments || []).map(mapAppointment)))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, []);

  const patients = [...new Map(
    appointments.map((a) => [a.patientName, { name: a.patientName, lastVisit: a.date, condition: a.symptoms || "—" }]),
  ).values()];

  const todayCount = appointments.filter((a) => a.status === "confirmed" || a.status === "pending").length;

  return (
    <AppShell>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div>
          <p className="text-muted-foreground">Practice overview</p>
          <h1 className="font-display text-4xl font-semibold tracking-tight">{user?.name ?? "Doctor"}</h1>
        </div>

        <div className="grid sm:grid-cols-4 gap-4 mt-8">
          <Stat label="Active" value={todayCount} icon={Calendar} />
          <Stat label="Patients" value={patients.length} icon={Users} />
          <Stat label="Rating" value="4.9" icon={Star} />
          <Stat label="Total" value={appointments.length} icon={Activity} />
        </div>

        <div className="mt-8 flex gap-2 border-b border-border">
          {(["appointments", "patients"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-3 text-sm font-medium capitalize transition-colors ${tab === t ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}>{t}</button>
          ))}
        </div>

        <div className="mt-6">
          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : tab === "appointments" ? (
            <div className="space-y-3">
              {appointments.length === 0 ? (
                <p className="text-muted-foreground">No appointments yet.</p>
              ) : appointments.map((a) => (
                <div key={a.id} className="p-5 rounded-2xl bg-card border border-border flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">{a.patientName}</div>
                    <div className="text-sm text-muted-foreground">{a.date} · {a.time} · {a.symptoms}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      a.status === "confirmed" ? "bg-primary/15 text-primary" :
                      a.status === "completed" ? "bg-secondary text-secondary-foreground" :
                      "bg-accent/20 text-earth"
                    }`}>{a.status}</span>
                    {a.status === "confirmed" && (
                      <Button asChild size="sm" variant="hero">
                        <Link to="/video-call/$appointmentId" params={{ appointmentId: a.id }}>
                          <Video className="w-4 h-4" />Start
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {patients.map((p) => (
                <div key={p.name} className="p-5 rounded-2xl bg-card border border-border">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">Last visit: {p.lastVisit}</div>
                  <div className="text-sm mt-2">{p.condition}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof Calendar }) {
  return (
    <div className="p-5 rounded-2xl bg-card border border-border flex items-center justify-between">
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-display text-3xl font-semibold mt-1">{value}</div>
      </div>
      <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Icon className="w-5 h-5" /></div>
    </div>
  );
}
