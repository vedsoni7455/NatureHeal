import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { aiAPI } from "@/lib/api";
import { requireAuth } from "@/lib/route-guards";
import { Apple, Sparkles, Activity, Target, Flame, Heart, Info, ChevronRight, Check, Leaf, User } from "lucide-react";

export const Route = createFileRoute("/diet-planner")({
  beforeLoad: requireAuth(),
  head: () => ({ meta: [{ title: "AI Diet Planner — Healora" }] }),
  component: DietPlanner,
});

function DietPlanner() {
  const [activeTab, setActiveTab] = useState<"assess" | "plan" | "recipes">("assess");
  const [userProfile, setUserProfile] = useState({
    age: "",
    gender: "",
    weight: "",
    height: "",
    activity: "",
    goal: "",
    dietary: [] as string[],
    allergies: [] as string[]
  });
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [animatedStats, setAnimatedStats] = useState({ users: 0, plans: 0, satisfaction: 0 });

  useEffect(() => {
    const targetStats = { users: 50000, plans: 150000, satisfaction: 98 };
    const duration = 2000;
    const steps = 60;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setAnimatedStats({
        users: Math.floor(targetStats.users * progress),
        plans: Math.floor(targetStats.plans * progress),
        satisfaction: Math.floor(targetStats.satisfaction * progress)
      });
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, []);

  const toggleArrayItem = (field: "dietary" | "allergies", item: string) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(x => x !== item)
        : [...prev[field], item]
    }));
  };

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const data = await aiAPI.generateDiet({
        goals: [userProfile.goal].filter(Boolean),
        preferences: userProfile.dietary,
        restrictions: userProfile.allergies,
        currentStats: {
          age: userProfile.age,
          height: userProfile.height,
          weight: userProfile.weight,
          activityLevel: userProfile.activity,
        }
      });
      setPlan(data);
      setActiveTab("plan");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const isValid = userProfile.age && userProfile.weight && userProfile.height && userProfile.goal && userProfile.activity;

  return (
    <AppShell>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-soft">
              <Apple className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-semibold tracking-tight">Diet Planner</h1>
              <p className="text-muted-foreground mt-1">Personalized nutrition plans based on your health goals.</p>
            </div>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-foreground">{animatedStats.users.toLocaleString()}+</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Users</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <div className="text-2xl font-bold text-foreground">{animatedStats.plans.toLocaleString()}+</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Plans</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <div className="text-2xl font-bold text-success">{animatedStats.satisfaction}%</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Satisfaction</div>
            </div>
          </div>
        </div>

        <div className="flex space-x-1 p-1 bg-muted/50 rounded-xl mb-8 w-fit mx-auto sm:mx-0">
          {(["assess", "plan", "recipes"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "assess" ? "📋 Assessment" : tab === "plan" ? "📅 My Plan" : "👨‍🍳 Recipes"}
            </button>
          ))}
        </div>

        {activeTab === "assess" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Basic Info */}
              <div className="p-6 rounded-2xl bg-card border border-border space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Basic Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input type="number" placeholder="Years" value={userProfile.age} onChange={e => setUserProfile(p => ({...p, age: e.target.value}))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={userProfile.gender} onChange={e => setUserProfile(p => ({...p, gender: e.target.value}))}>
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Weight (kg)</Label>
                    <Input type="number" placeholder="kg" value={userProfile.weight} onChange={e => setUserProfile(p => ({...p, weight: e.target.value}))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Height (cm)</Label>
                    <Input type="number" placeholder="cm" value={userProfile.height} onChange={e => setUserProfile(p => ({...p, height: e.target.value}))} />
                  </div>
                </div>
              </div>

              {/* Lifestyle */}
              <div className="p-6 rounded-2xl bg-card border border-border space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Lifestyle & Goals</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Activity Level</Label>
                    <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={userProfile.activity} onChange={e => setUserProfile(p => ({...p, activity: e.target.value}))}>
                      <option value="">Select activity level</option>
                      <option value="sedentary">Sedentary (little exercise)</option>
                      <option value="light">Lightly active (1-3 days/wk)</option>
                      <option value="moderate">Moderately active (3-5 days/wk)</option>
                      <option value="active">Very active (6-7 days/wk)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Primary Goal</Label>
                    <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={userProfile.goal} onChange={e => setUserProfile(p => ({...p, goal: e.target.value}))}>
                      <option value="">Select goal</option>
                      <option value="weight_loss">Weight Loss</option>
                      <option value="weight_gain">Weight Gain</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="health">General Health</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Restrictions & Allergies */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Leaf className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Dietary Preferences</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["vegetarian", "vegan", "pescatarian", "keto", "paleo", "mediterranean"].map(r => (
                    <button key={r} onClick={() => toggleArrayItem("dietary", r)} className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${userProfile.dietary.includes(r) ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted border-border'}`}>
                      {r.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Allergies to Avoid</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["nuts", "dairy", "eggs", "soy", "wheat", "fish", "shellfish"].map(a => (
                    <button key={a} onClick={() => toggleArrayItem("allergies", a)} className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${userProfile.allergies.includes(a) ? 'bg-destructive text-destructive-foreground border-destructive' : 'bg-background hover:bg-muted border-border'}`}>
                      {a.charAt(0).toUpperCase() + a.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center pt-4">
              {error && <p className="text-destructive text-sm mb-4">{error}</p>}
              <Button size="lg" variant="hero" className="w-full sm:w-auto min-w-[250px]" onClick={generate} disabled={loading || !isValid}>
                <Sparkles className="w-5 h-5 mr-2" />
                {loading ? "Generating..." : "Generate AI Diet Plan"}
              </Button>
              {!isValid && <p className="text-xs text-muted-foreground mt-3">Please fill out all Basic Info and Lifestyle fields.</p>}
            </div>
          </div>
        )}

        {activeTab === "plan" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {plan ? (
              <div className="space-y-8">
                <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-background to-secondary/20 border border-primary/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Apple className="w-48 h-48" />
                  </div>
                  <div className="relative z-10">
                    <h2 className="text-3xl font-display font-semibold mb-2">{plan.title || plan.plan?.title || "Your Personalized Plan"}</h2>
                    <p className="text-muted-foreground max-w-2xl text-lg">{plan.description || plan.plan?.description || "A holistic approach to your nutrition."}</p>
                    <div className="flex flex-wrap gap-6 mt-6">
                      <div className="flex items-center gap-3 bg-background/80 backdrop-blur px-5 py-3 rounded-2xl border border-border shadow-sm">
                        <Flame className="w-6 h-6 text-orange-500" />
                        <div>
                          <div className="text-2xl font-bold">{plan.dailyCalories || plan.plan?.dailyCalories || "2000"}</div>
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Daily Calories</div>
                        </div>
                      </div>
                      {(plan.bmi || plan.plan?.bmi) && (
                        <div className="flex items-center gap-3 bg-background/80 backdrop-blur px-5 py-3 rounded-2xl border border-border shadow-sm">
                          <Activity className="w-6 h-6 text-blue-500" />
                          <div>
                            <div className="text-2xl font-bold">{plan.bmi || plan.plan?.bmi}</div>
                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">BMI</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Meals */}
                <div>
                  <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2"><Target className="w-6 h-6 text-primary" /> Daily Meal Structure</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { id: "breakfast", label: "Breakfast", icon: "🍳", bg: "bg-orange-500/10", border: "border-orange-500/20" },
                      { id: "lunch", label: "Lunch", icon: "🥗", bg: "bg-green-500/10", border: "border-green-500/20" },
                      { id: "dinner", label: "Dinner", icon: "🍽️", bg: "bg-blue-500/10", border: "border-blue-500/20" },
                      { id: "snacks", label: "Snacks", icon: "🍎", bg: "bg-purple-500/10", border: "border-purple-500/20" }
                    ].map(meal => {
                      const mealItems = (plan.meals?.[meal.id] || plan.plan?.meals?.[meal.id]) || [];
                      return (
                        <div key={meal.id} className={`p-5 rounded-2xl border ${meal.bg} ${meal.border}`}>
                          <h4 className="font-semibold text-lg mb-4 flex items-center gap-2"><span>{meal.icon}</span> {meal.label}</h4>
                          {mealItems.length > 0 ? (
                            <ul className="space-y-3">
                              {mealItems.map((item: string, i: number) => (
                                <li key={i} className="text-sm flex items-start gap-2">
                                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
                                  <span className="text-foreground/80">{item}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">No specific options generated.</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Tips & Considerations */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-card border border-border">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> Holistic Diet Tips</h3>
                    <ul className="space-y-3">
                      {(plan.tips || plan.plan?.tips || []).map((tip: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 rounded-2xl bg-muted/30 border border-border border-dashed">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Info className="w-5 h-5 text-muted-foreground" /> Considerations Applied</h3>
                    <div className="space-y-4 text-sm">
                      <div>
                        <div className="font-medium text-foreground mb-1">Dietary Preferences:</div>
                        <div className="flex flex-wrap gap-2">
                          {(plan.restrictions || plan.plan?.restrictions || userProfile.dietary).length > 0 
                            ? (plan.restrictions || plan.plan?.restrictions || userProfile.dietary).map((r: string) => <span key={r} className="px-2 py-1 bg-background border rounded text-xs">{r}</span>)
                            : <span className="text-muted-foreground italic">None specified</span>}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-foreground mb-1">Allergies Avoided:</div>
                        <div className="flex flex-wrap gap-2">
                          {(plan.allergies || plan.plan?.allergies || userProfile.allergies).length > 0 
                            ? (plan.allergies || plan.plan?.allergies || userProfile.allergies).map((a: string) => <span key={a} className="px-2 py-1 bg-destructive/10 text-destructive border-destructive/20 border rounded text-xs">{a}</span>)
                            : <span className="text-muted-foreground italic">None specified</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 px-4">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Apple className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">No Plan Generated Yet</h3>
                <p className="text-muted-foreground mb-8">Complete your health assessment to receive your holistic 7-day diet.</p>
                <Button onClick={() => setActiveTab("assess")}>Go to Assessment</Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "recipes" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-semibold mb-6">Healthy Holistic Recipes</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { title: "Quinoa Buddha Bowl", desc: "Nutrient-packed bowl with quinoa, roasted veg, and tahini.", time: "30 min", cal: "450 cal", tags: ["Vegan"], icon: "🥗" },
                { title: "Avocado Toast", desc: "Whole grain toast with smashed avocado and microgreens.", time: "15 min", cal: "350 cal", tags: ["Vegan"], icon: "🥑" },
                { title: "Green Smoothie", desc: "Spinach, banana, almond milk, and chia seeds blend.", time: "5 min", cal: "180 cal", tags: ["Vegan"], icon: "🍎" },
                { title: "Chickpea Salad", desc: "Protein-rich salad with cucumber and lemon vinaigrette.", time: "20 min", cal: "320 cal", tags: ["High Protein"], icon: "🥗" }
              ].map((r, i) => (
                <div key={i} className="group rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/40 hover:shadow-soft transition-all">
                  <div className="h-32 bg-muted flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-500">
                    {r.icon}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-lg mb-2">{r.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{r.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {r.tags.map(t => <span key={t} className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 bg-primary/10 text-primary rounded-full">{t}</span>)}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border text-xs text-muted-foreground font-medium">
                      <span>⏱️ {r.time}</span>
                      <span>🔥 {r.cal}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}
