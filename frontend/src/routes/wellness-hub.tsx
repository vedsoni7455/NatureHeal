import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { aiAPI } from "@/lib/api";
import { requireAuth } from "@/lib/route-guards";
import { Sparkles, Leaf, Sun, Flower2, Apple, Wind, Hand } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/wellness-hub")({
  beforeLoad: requireAuth(),
  head: () => ({
    meta: [
      { title: "Wellness Hub — AI holistic plan | Healora" },
      { name: "description", content: "Describe a concern, get a personalized plan: remedies, yoga, mudras, diet, and lifestyle." },
    ],
  }),
  component: WellnessHub,
});

const samplePlan = {
  analysis: "Insomnia paired with stress often signals an overactive nervous system and elevated evening cortisol. The good news: it responds beautifully to a consistent wind-down routine that calms the vagus nerve.",
  remedies: [
    { name: "Chamomile + Tulsi tea", ingredients: "1 tsp dried chamomile, 1 tsp tulsi leaves, 1 cup hot water", instructions: "Steep 8 minutes. Sip 45 minutes before bed." },
    { name: "Warm milk with nutmeg", ingredients: "1 cup warm milk (or oat milk), pinch of nutmeg, 1/4 tsp ghee", instructions: "Stir together, drink slowly." },
  ],
  yoga: [
    { name: "Legs-up-the-wall (Viparita Karani)", instructions: "Lie on your back, hips against the wall, legs straight up. Hold 5 minutes." },
    { name: "Child's pose (Balasana)", instructions: "Kneel, fold forward, arms extended or resting alongside body. 2 minutes." },
    { name: "Anulom Vilom pranayama", instructions: "Alternate nostril breathing, 5 minutes before bed." },
  ],
  mudras: [
    { name: "Gyan Mudra", instructions: "Tip of thumb touches tip of index finger. Hold during meditation for 10 minutes." },
    { name: "Shuni Mudra", instructions: "Thumb meets middle finger. Calms the mind." },
  ],
  diet: [
    "Avoid caffeine after 2pm",
    "Heavy meal 3 hours before bed; warm and easily digestible",
    "Magnesium-rich foods: pumpkin seeds, spinach, dark chocolate",
    "Tart cherry juice 1 hour before bed",
  ],
  lifestyle: [
    "Screens off 60 minutes before bed",
    "Same sleep/wake times daily (within 30 min)",
    "10-minute morning sunlight exposure",
    "Brief journaling: 3 things from your day before sleep",
  ],
};

function WellnessHub() {
  const [concern, setConcern] = useState("");
  const [plan, setPlan] = useState<typeof samplePlan | null>(null);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!concern.trim()) return;
    setLoading(true);
    setError("");
    setPlan(null);
    try {
      const data = await aiAPI.unifiedPlan(concern);
      setPlan({
        analysis: String(data.analysis || data.summary || ""),
        remedies: (data.remedies as typeof samplePlan.remedies) || [],
        yoga: (data.yoga as typeof samplePlan.yoga) || [],
        mudras: (data.mudras as typeof samplePlan.mudras) || [],
        diet: (data.diet as string[]) || (data.dietRecommendations as string[]) || [],
        lifestyle: (data.lifestyle as string[]) || (data.lifestyleHabits as string[]) || [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            AI Wellness Hub
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-semibold tracking-tight mt-4">
            Your <span className="text-gradient">whole-being</span> plan
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Tell us what you're working through. We'll build a holistic plan — herbs, yoga, mudras, diet, and habits — personalized to you.
          </p>
        </div>

        <form onSubmit={generate} className="mt-10 p-7 rounded-2xl bg-card border border-border shadow-soft">
          <Textarea
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            rows={3}
            placeholder="e.g. I've been struggling with insomnia and stress for the past 3 weeks..."
            className="text-base"
          />
          <div className="flex flex-wrap gap-2 mt-4">
            {["Insomnia and stress", "Low energy", "Back pain", "Anxiety", "Digestive issues"].map((s) => (
              <button key={s} type="button" onClick={() => setConcern(s)} className="px-3 py-1.5 text-xs rounded-full bg-secondary border border-border hover:bg-muted">{s}</button>
            ))}
          </div>
          <Button type="submit" variant="hero" size="lg" className="mt-5" disabled={loading || !concern.trim()}>
            <Sparkles className="w-4 h-4" />
            {loading ? "Crafting your plan..." : "Generate my plan"}
          </Button>
          {error && <p className="text-sm text-destructive mt-3">{error}</p>}
        </form>

        {plan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 space-y-5"
          >
            <PlanSection icon={Sun} title="Analysis">
              <p className="text-muted-foreground leading-relaxed">{plan.analysis}</p>
            </PlanSection>

            <PlanSection icon={Leaf} title="Natural remedies">
              <div className="grid sm:grid-cols-2 gap-4">
                {plan.remedies.map((r) => (
                  <div key={r.name} className="p-4 rounded-xl bg-secondary/40">
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">Ingredients: {r.ingredients}</div>
                    <div className="text-sm mt-2">{r.instructions}</div>
                  </div>
                ))}
              </div>
            </PlanSection>

            <PlanSection icon={Flower2} title="Yoga & pranayama">
              <ul className="space-y-3">
                {plan.yoga.map((y) => (
                  <li key={y.name}>
                    <div className="font-semibold">{y.name}</div>
                    <div className="text-sm text-muted-foreground">{y.instructions}</div>
                  </li>
                ))}
              </ul>
            </PlanSection>

            <PlanSection icon={Hand} title="Healing mudras">
              <ul className="space-y-3">
                {plan.mudras.map((m) => (
                  <li key={m.name}>
                    <div className="font-semibold">{m.name}</div>
                    <div className="text-sm text-muted-foreground">{m.instructions}</div>
                  </li>
                ))}
              </ul>
            </PlanSection>

            <PlanSection icon={Apple} title="Diet recommendations">
              <ul className="space-y-2">
                {plan.diet.map((d) => <li key={d} className="flex gap-2"><span className="text-primary">•</span>{d}</li>)}
              </ul>
            </PlanSection>

            <PlanSection icon={Wind} title="Lifestyle habits">
              <ul className="space-y-2">
                {plan.lifestyle.map((l) => <li key={l} className="flex gap-2"><span className="text-primary">•</span>{l}</li>)}
              </ul>
            </PlanSection>
          </motion.div>
        )}
      </section>
    </AppShell>
  );
}

function PlanSection({ icon: Icon, title, children }: { icon: typeof Sun; title: string; children: React.ReactNode }) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-soft">
          <Icon className="w-5 h-5 text-primary-foreground" />
        </div>
        <h2 className="font-display text-2xl font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}
