import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/input";
import { specializations } from "@/lib/mock-data";
import { doctorAPI, mapDoctor, type DoctorView } from "@/lib/api";
import { requireAuth } from "@/lib/route-guards";
import { Star, Search, MapPin } from "lucide-react";

export const Route = createFileRoute("/doctors")({
  beforeLoad: requireAuth(),
  head: () => ({
    meta: [
      { title: "Find a holistic doctor — Healora" },
      { name: "description", content: "Browse verified naturopaths, homeopaths, Ayurvedic practitioners and more." },
    ],
  }),
  component: Doctors,
});

function Doctors() {
  const [q, setQ] = useState("");
  const [spec, setSpec] = useState("All");
  const [doctors, setDoctors] = useState<DoctorView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await doctorAPI.list({
          search: q || undefined,
          specialization: spec !== "All" ? spec : undefined,
        });
        if (!cancelled) {
          setDoctors((res.doctors || []).map(mapDoctor));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load doctors");
          setDoctors([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    const timer = setTimeout(load, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [q, spec]);

  return (
    <AppShell>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl">
          <h1 className="font-display text-5xl font-semibold tracking-tight">Find your doctor</h1>
          <p className="mt-3 text-muted-foreground text-lg">Verified holistic practitioners — naturopathy, homeopathy, Ayurveda, and more.</p>
        </div>

        <div className="mt-8 flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or specialty..." className="pl-9 h-11" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {specializations.map((s) => (
              <button
                key={s}
                onClick={() => setSpec(s)}
                className={`px-4 h-11 rounded-md text-sm font-medium whitespace-nowrap transition-colors border ${
                  spec === s ? "bg-primary text-primary-foreground border-primary" : "bg-background border-input hover:bg-muted"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading && <div className="text-center py-20 text-muted-foreground">Loading doctors…</div>}
        {error && <div className="text-center py-10 text-destructive">{error}</div>}

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {doctors.map((d) => (
            <Link
              key={d.id}
              to="/doctor/$id"
              params={{ id: d.id }}
              className="group block rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-soft transition-all overflow-hidden"
            >
              <div className="aspect-[4/3] overflow-hidden bg-secondary">
                <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg font-semibold">{d.name}</h3>
                    <p className="text-sm text-primary">{d.specialization}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="font-medium">{d.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{d.bio}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {d.experience} yrs exp
                  </div>
                  <div className="text-sm font-semibold">${d.consultationFee}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {!loading && !error && doctors.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">No doctors match your filters.</div>
        )}
      </section>
    </AppShell>
  );
}
