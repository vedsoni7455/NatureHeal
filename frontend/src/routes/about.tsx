import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Leaf, Sparkles, Heart, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Healora — Our mission for holistic care" },
      { name: "description", content: "Healora bridges ancient holistic traditions with modern AI to make personalized natural healthcare accessible." },
      { property: "og:title", content: "About Healora" },
      { property: "og:description", content: "Bridging ancient holistic traditions with modern AI." },
    ],
  }),
  component: About,
});

const values = [
  { icon: Leaf, title: "Nature-first", desc: "We prioritize remedies and routines drawn from time-tested holistic traditions." },
  { icon: Sparkles, title: "Personalized", desc: "Your plan adapts to your body, conditions, and goals — never one-size-fits-all." },
  { icon: Heart, title: "Whole-person", desc: "We treat mind, body, and lifestyle as one system, not isolated symptoms." },
  { icon: ShieldCheck, title: "Conservative AI", desc: "Our AI errs on caution. When something looks serious, we tell you to see a doctor." },
];

function About() {
  return (
    <AppShell>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="font-display text-5xl sm:text-6xl font-semibold tracking-tight">
          We believe healing should feel <span className="text-gradient">human</span>.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          Healora was built for people who want care that listens — care rooted in naturopathy,
          homeopathy, Ayurveda, and the everyday practices of yoga, breathwork, and nourishing food.
          We pair this wisdom with carefully tuned AI to help you find the right doctor, understand
          your symptoms, and build daily routines that actually fit your life.
        </p>

        <div className="mt-14 grid sm:grid-cols-2 gap-5">
          {values.map((v) => (
            <div key={v.title} className="p-6 rounded-2xl bg-card border border-border">
              <div className="w-11 h-11 rounded-xl bg-gradient-hero flex items-center justify-center shadow-soft mb-4">
                <v.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 p-8 rounded-2xl bg-secondary/60 border border-border">
          <h2 className="font-display text-2xl font-semibold">Our mission</h2>
          <p className="mt-3 text-muted-foreground">
            To make holistic, personalized healthcare accessible to anyone with a curiosity about
            natural healing — and to give doctors trained in these traditions a calm, modern home
            for their practice.
          </p>
        </div>
      </section>
    </AppShell>
  );
}
