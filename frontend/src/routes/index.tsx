import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Stethoscope, Leaf, Brain, Apple, HeartPulse, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { HealingScene } from "@/components/three/HealingScene";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Healora — Holistic Healthcare, AI-Guided" },
      { name: "description", content: "Naturopathy, homeopathy, and AI-powered wellness — book doctors, get personalized healing plans, and check symptoms in one calm place." },
      { property: "og:title", content: "Healora — Holistic Healthcare, AI-Guided" },
      { property: "og:description", content: "Naturopathy, homeopathy, and AI-powered wellness in one calm place." },
    ],
  }),
  component: Home,
});

const features = [
  { icon: Stethoscope, title: "Find a doctor", desc: "Browse verified naturopaths and homeopaths.", to: "/doctors" },
  { icon: Sparkles, title: "Wellness Hub", desc: "AI builds your holistic plan — herbs, yoga, mudras, diet.", to: "/wellness-hub" },
  { icon: Brain, title: "AI Chatbot", desc: "24/7 conversational guidance for everyday wellness.", to: "/chatbot" },
  { icon: HeartPulse, title: "Symptom Checker", desc: "Triage symptoms with calm, conservative AI.", to: "/symptom-checker" },
  { icon: Apple, title: "Diet Planner", desc: "Personalized 7-day plans built from your goals.", to: "/diet-planner" },
  { icon: ShieldCheck, title: "Secure consults", desc: "Time-gated video calls and private records.", to: "/doctors" },
];

function Home() {
  return (
    <AppShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-20 lg:pb-32 grid lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-xs font-medium text-secondary-foreground mb-6">
              <Leaf className="w-3.5 h-3.5 text-primary" />
              Healing, naturally — guided by AI
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight">
              Your body knows.{" "}
              <span className="text-gradient">We help it remember.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              Healora is a holistic healthcare platform that blends naturopathy, homeopathy,
              and modern AI — so you can find the right doctor, get a personalized wellness
              plan, and check symptoms with calm, conservative guidance.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" variant="hero" asChild>
                <Link to="/register">
                  Start your journey <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/wellness-hub">Try the Wellness Hub</Link>
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div><span className="font-semibold text-foreground">120+</span> verified doctors</div>
              <div className="w-px h-4 bg-border" />
              <div><span className="font-semibold text-foreground">24/7</span> AI guidance</div>
              <div className="w-px h-4 bg-border" />
              <div><span className="font-semibold text-foreground">10k+</span> happy patients</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[400px] sm:h-[500px] lg:h-[600px]"
          >
            <div className="absolute inset-0 bg-gradient-hero opacity-10 rounded-3xl blur-3xl" />
            <HealingScene className="absolute inset-0" />
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-display text-4xl sm:text-5xl font-semibold">
            Everything for whole-person health
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            From booking a doctor to building daily routines — Healora is the calm operating system for your wellbeing.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Link
                to={f.to}
                className="group block p-7 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-soft transition-all h-full"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center shadow-soft mb-5 group-hover:scale-110 transition-transform">
                  <f.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl bg-gradient-hero p-10 sm:p-16 text-primary-foreground relative overflow-hidden shadow-glow">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl font-semibold leading-tight">
                Ancient wisdom. Modern intelligence.
              </h2>
              <p className="mt-5 text-primary-foreground/85 text-lg">
                Naturopathy, homeopathy, yoga, pranayama, mudras and herbal medicine —
                interpreted for you by AI trained on holistic traditions, not just symptoms.
              </p>
              <Button asChild size="lg" variant="warm" className="mt-7">
                <Link to="/wellness-hub">Build my plan</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {["Naturopathy", "Homeopathy", "Yoga & Pranayama", "Healing Mudras", "Herbal Medicine", "Ayurvedic Diet"].map((p) => (
                <div key={p} className="px-4 py-3 rounded-xl bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 text-sm font-medium">
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
