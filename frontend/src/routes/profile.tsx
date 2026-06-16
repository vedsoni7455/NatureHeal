import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth, setUser } from "@/lib/auth-store";
import { authAPI } from "@/lib/api";
import { requireAuth } from "@/lib/route-guards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export const Route = createFileRoute("/profile")({
  beforeLoad: requireAuth(),
  head: () => ({ meta: [{ title: "Your profile — Healora" }] }),
  component: Profile,
});

function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    age: user?.age?.toString() || "",
    height: user?.height?.toString() || "",
    weight: user?.weight?.toString() || "",
    phone: "",
    address: "",
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto py-24 text-center">
          <h1 className="font-display text-3xl font-semibold">Please sign in</h1>
          <Button asChild className="mt-6"><Link to="/login">Sign in</Link></Button>
        </div>
      </AppShell>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const updated = await authAPI.updateProfile({
        name: form.name,
        age: form.age ? Number(form.age) : undefined,
        height: form.height ? Number(form.height) : undefined,
        weight: form.weight ? Number(form.weight) : undefined,
        phone: form.phone,
        address: form.address,
      });
      setUser({
        ...user,
        name: String(updated.name || form.name),
        age: updated.age as number | undefined,
        height: updated.height as number | undefined,
        weight: updated.weight as number | undefined,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <section className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Your profile</h1>
        <p className="text-muted-foreground mt-2">Keep your information current to get the most personalized care.</p>

        <form onSubmit={handleSubmit} className="mt-8 p-6 rounded-2xl bg-card border border-border space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} disabled />
            <Field label="Age" type="number" value={form.age} onChange={(v) => setForm({ ...form, age: v })} />
            <Field label="Height (cm)" type="number" value={form.height} onChange={(v) => setForm({ ...form, height: v })} />
            <Field label="Weight (kg)" type="number" value={form.weight} onChange={(v) => setForm({ ...form, weight: v })} />
            <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+1 555 000 0000" />
          </div>
          <div className="space-y-1.5">
            <Label>Address</Label>
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button variant="hero" type="submit" disabled={loading}>
            {loading ? "Saving…" : saved ? "Saved ✓" : "Save changes"}
          </Button>
        </form>
      </section>
    </AppShell>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}
