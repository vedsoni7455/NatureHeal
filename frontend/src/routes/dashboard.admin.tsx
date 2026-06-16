import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { adminAPI } from "@/lib/api";
import { requireAuth } from "@/lib/route-guards";
import { Users, Calendar, MessageCircle, DollarSign } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";

export const Route = createFileRoute("/dashboard/admin")({
  beforeLoad: requireAuth(["admin"]),
  head: () => ({ meta: [{ title: "Admin dashboard — Healora" }] }),
  component: AdminDash,
});

function AdminDash() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.stats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const users = stats?.users as Record<string, number> | undefined;
  const appointments = stats?.appointments as Record<string, number> | undefined;
  const ai = stats?.ai as Record<string, number> | undefined;
  const revenue = stats?.revenue as Record<string, number> | undefined;
  const monthly = (stats?.monthlyStats as { month: string; users: number; appointments: number }[]) || [];

  return (
    <AppShell>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Platform overview</h1>

        {loading ? (
          <p className="mt-8 text-muted-foreground">Loading stats…</p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <Stat label="Total users" value={users?.total ?? 0} icon={Users} />
              <Stat label="Appointments" value={appointments?.total ?? 0} icon={Calendar} />
              <Stat label="AI queries" value={ai?.totalQueries ?? 0} icon={MessageCircle} />
              <Stat label="Revenue" value={`$${revenue?.total ?? 0}`} icon={DollarSign} />
            </div>

            {monthly.length > 0 && (
              <div className="grid lg:grid-cols-2 gap-5 mt-8">
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <h2 className="font-display text-xl font-semibold mb-4">Monthly activity</h2>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={monthly}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="oklch(0.48 0.03 140)" fontSize={12} />
                      <YAxis stroke="oklch(0.48 0.03 140)" fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="users" stroke="oklch(0.42 0.09 155)" strokeWidth={2} />
                      <Line type="monotone" dataKey="appointments" stroke="oklch(0.78 0.13 75)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <h2 className="font-display text-xl font-semibold mb-4">Monthly revenue</h2>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={monthly}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="oklch(0.42 0.09 155)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </AppShell>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof Users }) {
  return (
    <div className="p-5 rounded-2xl bg-card border border-border flex items-center justify-between">
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-display text-3xl font-semibold mt-1">{value}</div>
      </div>
      <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}
