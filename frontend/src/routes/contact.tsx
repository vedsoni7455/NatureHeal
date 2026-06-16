import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { contactAPI } from "@/lib/api";
import { Mail, MapPin, Phone, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Healora" },
      { name: "description", content: "Reach the Healora team — we typically reply within one business day." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const message = form.subject
        ? `Subject: ${form.subject}\n\n${form.message}`
        : form.message;
      await contactAPI.submit({ name: form.name, email: form.email, message });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12">
        <div>
          <h1 className="font-display text-5xl font-semibold tracking-tight">Get in touch</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Questions, partnerships, or feedback — we'd love to hear from you.
          </p>
          <div className="mt-10 space-y-5">
            <ContactRow icon={<Mail className="w-5 h-5" />} label="Email" value="hello@healora.app" />
            <ContactRow icon={<Phone className="w-5 h-5" />} label="Phone" value="+1 (555) 123-4567" />
            <ContactRow icon={<MapPin className="w-5 h-5" />} label="Visit" value="221 Wellness Way, Boulder, CO" />
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-card border border-border shadow-soft">
          {sent ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 mx-auto rounded-full bg-gradient-hero flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-2xl mt-5">Message received</h3>
              <p className="mt-2 text-muted-foreground">We'll be in touch within one business day.</p>
              <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>Send another</Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Name">
                  <Input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </Field>
                <Field label="Email">
                  <Input required type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </Field>
              </div>
              <Field label="Subject">
                <Input required placeholder="What's this about?" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              </Field>
              <Field label="Message">
                <Textarea required rows={5} placeholder="Tell us more..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </Field>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                {loading ? "Sending…" : "Send message"}
              </Button>
            </form>
          )}
        </div>
      </section>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function ContactRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/40">
      <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">{icon}</div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}
