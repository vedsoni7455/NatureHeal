import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/lib/auth-store";
import { appointmentAPI, mapAppointment, type AppointmentView } from "@/lib/api";
import { requireAuth } from "@/lib/route-guards";
import { Button } from "@/components/ui/button";
import { Calendar, Sparkles, MessageCircle, HeartPulse, Apple, ArrowRight, Activity } from "lucide-react";

export const Route = createFileRoute("/dashboard/patient")({
  beforeLoad: requireAuth(["patient"]),
  head: () => ({ meta: [{ title: "Patient dashboard — Healora" }] }),
  component: PatientDash,
});

function PatientDash() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentAPI.list()
      .then((res) => setAppointments((res.appointments || []).map(mapAppointment)))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, []);

  const upcoming = appointments.filter((a) => a.status !== "completed" && a.status !== "cancelled");
  const completed = appointments.filter((a) => a.status === "completed");

  return (
    <AppShell>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-muted-foreground">Welcome back</p>
            <h1 className="font-display text-4xl font-semibold tracking-tight">{user?.name ?? "Friend"}</h1>
          </div>
          <Button asChild variant="hero"><Link to="/appointment"><Calendar className="w-4 h-4" />Book appointment</Link></Button>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          <Stat label="Upcoming" value={upcoming.length} icon={Calendar} />
          <Stat label="Completed" value={completed.length} icon={Activity} />
          <Stat label="Wellness score" value="82" icon={HeartPulse} suffix="/100" />
        </div>

        <div className="grid lg:grid-cols-3 gap-5 mt-8">
          <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border">
            <h2 className="font-display text-xl font-semibold mb-4">Upcoming appointments</h2>
            {loading ? (
              <p className="text-muted-foreground text-sm">Loading…</p>
            ) : upcoming.length === 0 ? (
              <p className="text-muted-foreground text-sm">No upcoming appointments. <Link to="/doctors" className="text-primary underline">Browse doctors</Link></p>
            ) : (
              <div className="space-y-3">
                {upcoming.map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/40">
                    <div>
                      <div className="font-medium">{a.doctorName}</div>
                      <div className="text-sm text-muted-foreground">{a.date} · {a.time} · {a.type}</div>
                    </div>
                    <div className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      a.status === "confirmed" ? "bg-primary/15 text-primary" : "bg-accent/20 text-earth"
                    }`}>{a.status}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-gradient-hero text-primary-foreground shadow-soft">
            <Sparkles className="w-6 h-6" />
            <h3 className="font-display text-xl font-semibold mt-3">Today's wellness</h3>
            <p className="text-sm text-primary-foreground/85 mt-2">5-minute Anulom Vilom · 20-min walk · Chamomile tea before bed</p>
            <Button asChild variant="warm" size="sm" className="mt-4"><Link to="/wellness-hub">Open Wellness Hub</Link></Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <QuickLink icon={MessageCircle} title="AI Chatbot" to="/chatbot" />
          <QuickLink icon={HeartPulse} title="Symptom Checker" to="/symptom-checker" />
          <QuickLink icon={Apple} title="Diet Planner" to="/diet-planner" />
          <QuickLink icon={Sparkles} title="Wellness Hub" to="/wellness-hub" />
        </div>
      </section>
    </AppShell>
  );
}

function Stat({ label, value, icon: Icon, suffix }: { label: string; value: string | number; icon: typeof Calendar; suffix?: string }) {
  return (
    <div className="p-5 rounded-2xl bg-card border border-border flex items-center justify-between">
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-display text-3xl font-semibold mt-1">{value}{suffix}</div>
      </div>
      <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Icon className="w-5 h-5" /></div>
    </div>
  );
}

function QuickLink({ icon: Icon, title, to }: { icon: typeof Calendar; title: string; to: string }) {
  return (
    <Link to={to} className="group p-5 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-soft transition-all flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-primary" />
        <span className="font-medium">{title}</span>
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </Link>
  );
}
