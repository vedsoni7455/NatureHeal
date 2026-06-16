import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { symptomOptions } from "@/lib/mock-data";
import { aiAPI } from "@/lib/api";
import { requireAuth } from "@/lib/route-guards";
import { HeartPulse, AlertTriangle, Info, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/symptom-checker")({
  beforeLoad: requireAuth(),
  head: () => ({ meta: [{ title: "AI Symptom Checker — Healora" }] }),
  component: SymptomChecker,
});

interface Result {
  condition: string;
  urgency: "low" | "medium" | "high";
  explanation: string;
  recommendations: string[];
  warnings: string[];
}

function SymptomChecker() {
  const [selected, setSelected] = useState<string[]>([]);
  const [severity, setSeverity] = useState(5);
  const [duration, setDuration] = useState("less than a day");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggle(id: string) {
    setSelected((s) => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  }

  async function analyze() {
    if (selected.length === 0) return;
    setLoading(true);
    setError("");
    setResult(null);
    const symptomNames = selected.map((id) => symptomOptions.find((s) => s.id === id)?.label || id);
    const severityLabel = severity <= 3 ? "mild" : severity <= 6 ? "moderate" : "severe";
    try {
      const data = await aiAPI.analyzeSymptoms({
        symptoms: symptomNames,
        severity: severityLabel,
        duration,
      });
      setResult({
        condition: String(data.condition || data.diagnosis || "Analysis complete"),
        urgency: (data.urgency as Result["urgency"]) || "low",
        explanation: String(data.explanation || data.analysis || ""),
        recommendations: (data.recommendations as string[]) || [],
        warnings: (data.warnings as string[]) || [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    const colors = {
      low: "bg-primary/10 text-primary border-primary/30",
      medium: "bg-accent/20 text-earth border-accent/40",
      high: "bg-destructive/10 text-destructive border-destructive/40",
    };
    const Icon = result.urgency === "high" ? AlertTriangle : result.urgency === "medium" ? Info : CheckCircle2;
    return (
      <AppShell>
        <section className="max-w-3xl mx-auto px-4 py-12">
          <div className={`p-6 rounded-2xl border-2 ${colors[result.urgency]}`}>
            <div className="flex items-start gap-3">
              <Icon className="w-6 h-6 mt-0.5" />
              <div>
                <div className="text-xs uppercase font-semibold tracking-wider opacity-80">Urgency: {result.urgency}</div>
                <h1 className="font-display text-3xl font-semibold mt-1">{result.condition}</h1>
              </div>
            </div>
            <p className="mt-4 leading-relaxed">{result.explanation}</p>
          </div>

          <div className="mt-6 p-6 rounded-2xl bg-card border border-border">
            <h2 className="font-display text-xl font-semibold mb-3">Recommendations</h2>
            <ul className="space-y-2">
              {result.recommendations.map(r => <li key={r} className="flex gap-2"><span className="text-primary mt-1">✓</span>{r}</li>)}
            </ul>
          </div>

          <div className="mt-4 p-6 rounded-2xl bg-destructive/5 border border-destructive/20">
            <h2 className="font-display text-xl font-semibold mb-3 text-destructive flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Warning signs — seek immediate care</h2>
            <ul className="space-y-2">
              {result.warnings.map(w => <li key={w} className="flex gap-2"><span className="text-destructive mt-1">•</span>{w}</li>)}
            </ul>
          </div>

          <div className="mt-8 flex gap-3">
            <Button variant="hero" onClick={() => setResult(null)}>Check again</Button>
            <Button variant="outline" onClick={() => window.location.href = "/doctors"}>Find a doctor</Button>
          </div>
        </section>
      </AppShell>
    );
  }

  const categories = Array.from(new Set(symptomOptions.map(s => s.category)));

  return (
    <AppShell>
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center shadow-soft">
            <HeartPulse className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-4xl font-semibold tracking-tight">Symptom Checker</h1>
            <p className="text-muted-foreground">Conservative AI triage — not a diagnosis.</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border space-y-6">
          {categories.map(cat => (
            <div key={cat}>
              <h3 className="font-medium text-sm text-muted-foreground mb-2">{cat}</h3>
              <div className="flex flex-wrap gap-2">
                {symptomOptions.filter(s => s.category === cat).map(s => (
                  <button
                    key={s.id}
                    onClick={() => toggle(s.id)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      selected.includes(s.id) ? "bg-primary text-primary-foreground border-primary" : "bg-background border-input hover:bg-muted"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div>
            <label className="text-sm font-medium">Severity: {severity}/10</label>
            <input type="range" min={1} max={10} value={severity} onChange={(e) => setSeverity(+e.target.value)} className="w-full mt-2" />
          </div>

          <div>
            <label className="text-sm font-medium">Duration</label>
            <select value={duration} onChange={e => setDuration(e.target.value)} className="w-full mt-2 h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option>less than a day</option>
              <option>1-3 days</option>
              <option>4-7 days</option>
              <option>more than a week</option>
              <option>chronic (months)</option>
            </select>
          </div>

          <Button onClick={analyze} variant="hero" size="lg" className="w-full" disabled={selected.length === 0 || loading}>
            {loading ? "Analyzing…" : "Analyze my symptoms"}
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </section>
    </AppShell>
  );
}
