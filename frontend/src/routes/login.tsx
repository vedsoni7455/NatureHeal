import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/lib/auth-store";
import { Leaf } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Healora" }] }),
  component: Login,
});

function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const u = await loginUser(email, password);
      router.navigate({
        to:
          u.role === "doctor"
            ? "/dashboard/doctor"
            : u.role === "admin"
              ? "/dashboard/admin"
              : "/dashboard/patient",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
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
            <h1 className="font-display text-3xl font-semibold">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to continue your healing journey.</p>
            <form onSubmit={submit} className="mt-6 space-y-4">
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
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </form>
            <p className="text-sm text-center mt-6 text-muted-foreground">
              New here?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
