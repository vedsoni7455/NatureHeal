import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { appointmentAPI, doctorAPI, mapDoctor, type DoctorView } from "@/lib/api";
import { requireAuth } from "@/lib/route-guards";
import { Video, Phone, MessageSquare, MapPin, CheckCircle2, Calendar } from "lucide-react";

const search = z.object({ doctor: z.string().optional() });

export const Route = createFileRoute("/appointment")({
  beforeLoad: requireAuth(),
  validateSearch: (s) => search.parse(s),
  head: () => ({ meta: [{ title: "Book an appointment — Healora" }] }),
  component: BookAppointment,
});

const types = [
  { id: "video", icon: Video, label: "Video call" },
  { id: "voice", icon: Phone, label: "Voice call" },
  { id: "message", icon: MessageSquare, label: "Message" },
  { id: "in-person", icon: MapPin, label: "In person" },
] as const;

function BookAppointment() {
  const { doctor: doctorId } = Route.useSearch();
  const [doctors, setDoctors] = useState<DoctorView[]>([]);
  const [selectedDoc, setSelectedDoc] = useState(doctorId || "");
  const [slots, setSlots] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState<(typeof types)[number]["id"]>("video");
  const [symptoms, setSymptoms] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const doctor = doctors.find((d) => d.id === selectedDoc);

  useEffect(() => {
    doctorAPI.list().then((res) => {
      const mapped = (res.doctors || []).map(mapDoctor);
      setDoctors(mapped);
      if (doctorId && mapped.some((d) => d.id === doctorId)) {
        setSelectedDoc(doctorId);
      } else if (mapped[0]) {
        setSelectedDoc((prev) => prev || mapped[0].id);
      }
    }).catch(() => setError("Failed to load doctors"));
  }, [doctorId]);

  useEffect(() => {
    if (selectedDoc && date) {
      doctorAPI.getSlots(selectedDoc, date)
        .then(setSlots)
        .catch(() => setSlots([]));
    } else {
      setSlots([]);
    }
  }, [selectedDoc, date]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDoc || !date || !time) return;
    setLoading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("doctor", selectedDoc);
      data.append("date", date);
      data.append("time", time);
      data.append("type", type);
      data.append("notes", symptoms);
      await appointmentAPI.create(data);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  }

  if (done && doctor) {
    return (
      <AppShell>
        <section className="max-w-xl mx-auto px-4 py-24 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-hero flex items-center justify-center shadow-glow">
            <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-4xl font-semibold mt-6">Request sent</h1>
          <p className="mt-3 text-muted-foreground">
            We've sent your appointment request to {doctor.name}. You'll get an email once it's confirmed.
          </p>
          <div className="mt-8 p-5 rounded-xl bg-card border border-border text-left">
            <div className="text-sm text-muted-foreground">When</div>
            <div className="font-medium">{date} at {time}</div>
            <div className="text-sm text-muted-foreground mt-3">With</div>
            <div className="font-medium">{doctor.name}</div>
            <div className="text-sm text-muted-foreground mt-3">Type</div>
            <div className="font-medium capitalize">{type.replace("-", " ")}</div>
          </div>
          <div className="mt-8 flex gap-3 justify-center">
            <Button asChild variant="hero"><Link to="/dashboard/patient">Go to dashboard</Link></Button>
            <Button asChild variant="outline"><Link to="/doctors">Find more doctors</Link></Button>
          </div>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-5xl font-semibold tracking-tight">Book an appointment</h1>
        <p className="mt-3 text-muted-foreground">Pick a doctor, time, and tell them how you're feeling.</p>

        <form onSubmit={submit} className="mt-10 grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-7 p-7 rounded-2xl bg-card border border-border">
            <div className="space-y-2">
              <Label>Doctor</Label>
              <select
                value={selectedDoc}
                onChange={(e) => setSelectedDoc(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                required
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>
                ))}
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <select required value={time} onChange={(e) => setTime(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                  <option value="">Select a time</option>
                  {slots.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Consultation type</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {types.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-md border text-sm transition-colors ${
                      type === t.id ? "bg-primary text-primary-foreground border-primary" : "bg-background border-input hover:bg-muted"
                    }`}
                  >
                    <t.icon className="w-4 h-4" />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>What's going on?</Label>
              <Textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} rows={4} placeholder="Describe your symptoms or what you'd like to discuss..." />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              <Calendar className="w-4 h-4" /> {loading ? "Booking…" : "Request appointment"}
            </Button>
          </div>

          {doctor && (
            <aside className="p-6 rounded-2xl bg-secondary/40 border border-border h-fit sticky top-20">
              <img src={doctor.image} alt={doctor.name} className="w-20 h-20 rounded-full object-cover shadow-soft" />
              <h3 className="font-display text-lg font-semibold mt-3">{doctor.name}</h3>
              <p className="text-sm text-primary">{doctor.specialization}</p>
              <p className="text-sm text-muted-foreground mt-3">{doctor.bio}</p>
              <div className="mt-5 pt-5 border-t border-border flex justify-between text-sm">
                <span className="text-muted-foreground">Consultation</span>
                <span className="font-semibold">${doctor.consultationFee}</span>
              </div>
            </aside>
          )}
        </form>
      </section>
    </AppShell>
  );
}
