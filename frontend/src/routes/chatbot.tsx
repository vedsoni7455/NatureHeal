import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { aiAPI } from "@/lib/api";
import { requireAuth } from "@/lib/route-guards";
import { Send, Sparkles, Bot, User } from "lucide-react";

export const Route = createFileRoute("/chatbot")({
  beforeLoad: requireAuth(),
  head: () => ({ meta: [{ title: "AI Health Chatbot — Healora" }] }),
  component: Chatbot,
});

interface Msg { role: "user" | "bot"; text: string; }

const suggestions = ["Help me sleep better", "I feel anxious", "Foods for inflammation", "Yoga for back pain"];

function Chatbot() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", text: "Hello! I'm your Healora wellness companion. Ask me anything about holistic health — sleep, stress, nutrition, yoga, herbs, or daily routines." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  async function send(text?: string) {
    const t = (text ?? input).trim();
    if (!t || loading) return;
    setMsgs((m) => [...m, { role: "user", text: t }]);
    setInput("");
    setLoading(true);
    try {
      const res = await aiAPI.chat(t);
      const reply = res.reply || res.response || res.message || "I'm here to help with your wellness journey.";
      setMsgs((m) => [...m, { role: "bot", text: reply }]);
    } catch (err) {
      setMsgs((m) => [...m, { role: "bot", text: err instanceof Error ? err.message : "Sorry, I couldn't respond right now." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell noFooter>
      <section className="max-w-3xl mx-auto px-4 py-6 h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center shadow-soft">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold">Wellness Chatbot</h1>
            <p className="text-xs text-muted-foreground">24/7 holistic guidance · not a substitute for medical care</p>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto py-6 space-y-4">
          {msgs.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "bot" && (
                <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-card border border-border rounded-tl-sm"
              }`}>
                {m.text}
              </div>
              {m.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          {loading && <p className="text-sm text-muted-foreground">Thinking…</p>}
        </div>

        {msgs.length <= 1 && (
          <div className="flex flex-wrap gap-2 pb-3">
            {suggestions.map((s) => (
              <button key={s} onClick={() => send(s)} className="px-3 py-1.5 text-xs rounded-full bg-secondary border border-border hover:bg-muted">{s}</button>
            ))}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2 pt-3 border-t border-border">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything about your wellbeing..." className="h-11" disabled={loading} />
          <Button type="submit" variant="hero" size="lg" disabled={loading}><Send className="w-4 h-4" /></Button>
        </form>
      </section>
    </AppShell>
  );
}
