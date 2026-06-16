import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/lib/auth-store";
import { Leaf } from "lucide-react";
import type { Role } from "@/lib/mock-data";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — Healora" }] }),
  component: Register,
});

function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("patient");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const u = await registerUser({ name, email, password, role });
      router.navigate({
        to: u.role === "doctor" ? "/dashboard/doctor" : "/dashboard/patient",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell noFooter>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 justify-center mb-8">
            <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center shadow-soft">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-semibold">Healora</span>
          </Link>
          <div className="p-8 rounded-2xl bg-card border border-border shadow-soft">
            <h1 className="font-display text-3xl font-semibold">Begin your journey</h1>
            <p className="text-sm text-muted-foreground mt-1">Create an account to access doctors and AI wellness tools.</p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label>Full name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Maya Patel"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  minLength={6}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>I am a</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["patient", "doctor"] as Role[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`px-3 py-2 text-sm rounded-md border capitalize transition-colors ${
                        role === r ? "bg-primary text-primary-foreground border-primary" : "bg-background border-input hover:bg-muted"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                {loading ? "Creating account…" : "Create account"}
              </Button>
            </form>
            <p className="text-sm text-center mt-6 text-muted-foreground">
              Already have one?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
