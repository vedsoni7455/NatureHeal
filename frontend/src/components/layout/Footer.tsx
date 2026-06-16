import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-secondary/30 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center">
              <Leaf className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-semibold">Healora</span>
          </Link>
          <p className="text-sm text-muted-foreground mt-3 max-w-xs">
            Holistic healthcare grounded in naturopathy, homeopathy, and AI-guided wellness.
          </p>
        </div>
        <FooterCol title="Platform" links={[
          ["Find Doctors", "/doctors"],
          ["Wellness Hub", "/wellness-hub"],
          ["Symptom Checker", "/symptom-checker"],
          ["Diet Planner", "/diet-planner"],
        ]} />
        <FooterCol title="Company" links={[
          ["About", "/about"],
          ["Contact", "/contact"],
        ]} />
        <FooterCol title="Account" links={[
          ["Sign in", "/login"],
          ["Get started", "/register"],
        ]} />
      </div>
      <div className="border-t border-border/60">
        <div className="max-w-7xl mx-auto px-4 py-5 text-xs text-muted-foreground flex flex-col sm:flex-row gap-2 justify-between">
          <span>© {new Date().getFullYear()} Healora. Healing, naturally.</span>
          <span>Made with care · Not medical advice — consult a doctor for emergencies.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="font-medium text-sm mb-3">{title}</h4>
      <ul className="space-y-2">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link to={href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
