import { Link, useRouter } from "@tanstack/react-router";
import { Leaf, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";

const publicLinks = [
  { to: "/", label: "Home" },
  { to: "/doctors", label: "Doctors" },
  { to: "/wellness-hub", label: "Wellness Hub" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const dashHref =
    user?.role === "doctor"
      ? "/dashboard/doctor"
      : user?.role === "admin"
      ? "/dashboard/admin"
      : "/dashboard/patient";

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-gradient-hero flex items-center justify-center shadow-soft group-hover:shadow-glow transition-shadow">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">Healora</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {publicLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-md"
              activeProps={{ className: "px-3 py-2 text-sm font-medium text-primary rounded-md" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" onClick={() => router.navigate({ to: dashHref })}>
                Dashboard
              </Button>
              <Button variant="outline" onClick={logout}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => router.navigate({ to: "/login" })}>
                Sign in
              </Button>
              <Button variant="hero" onClick={() => router.navigate({ to: "/register" })}>
                Get started
              </Button>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl">
          <div className="px-4 py-3 flex flex-col gap-1">
            {publicLinks.map((l) => (
              <Link key={l.to} to={l.to} className="px-3 py-2 rounded-md hover:bg-muted" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <div className="border-t border-border/60 my-2" />
            {user ? (
              <>
                <Link to={dashHref} className="px-3 py-2 rounded-md hover:bg-muted" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={() => { logout(); setOpen(false); }} className="text-left px-3 py-2 rounded-md hover:bg-muted">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 rounded-md hover:bg-muted" onClick={() => setOpen(false)}>Sign in</Link>
                <Link to="/register" className="px-3 py-2 rounded-md hover:bg-muted text-primary font-medium" onClick={() => setOpen(false)}>Get started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
