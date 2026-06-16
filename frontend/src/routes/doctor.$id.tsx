import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { doctorAPI, mapDoctor } from "@/lib/api";
import { requireAuth } from "@/lib/route-guards";
import { Button } from "@/components/ui/button";
import { Star, Calendar, MessageSquare, Award, Globe } from "lucide-react";

export const Route = createFileRoute("/doctor/$id")({
  beforeLoad: requireAuth(),
  loader: async ({ params }) => {
    const raw = await doctorAPI.get(params.id);
    if (!raw) throw notFound();
    return { doctor: mapDoctor(raw) };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.doctor.name} — ${loaderData?.doctor.specialization} | Healora` },
      { name: "description", content: loaderData?.doctor.bio ?? "" },
      { property: "og:title", content: loaderData?.doctor.name ?? "Doctor" },
      { property: "og:description", content: loaderData?.doctor.bio ?? "" },
      { property: "og:image", content: loaderData?.doctor.image ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <AppShell>
      <div className="max-w-xl mx-auto text-center py-32">
        <h1 className="font-display text-4xl font-semibold">Doctor not found</h1>
        <Button asChild className="mt-6"><Link to="/doctors">Back to doctors</Link></Button>
      </div>
    </AppShell>
  ),
  errorComponent: ({ error, reset }) => (
    <AppShell>
      <div className="max-w-xl mx-auto text-center py-32">
        <h1 className="font-display text-3xl">Something went wrong</h1>
        <p className="text-muted-foreground mt-2">{error.message}</p>
        <Button onClick={reset} className="mt-6">Try again</Button>
      </div>
    </AppShell>
  ),
  component: DoctorProfile,
});

function DoctorProfile() {
  const { doctor } = Route.useLoaderData();
  return (
    <AppShell>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-10">
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-secondary shadow-soft">
              <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
            </div>
            <div className="mt-5 flex items-center gap-2">
              <Star className="w-5 h-5 fill-accent text-accent" />
              <span className="font-semibold">{doctor.rating}</span>
              <span className="text-muted-foreground text-sm">({doctor.reviews} reviews)</span>
            </div>
            <div className="mt-4 p-4 rounded-xl bg-secondary/40 text-sm">
              <div className="text-muted-foreground">Consultation fee</div>
              <div className="font-display text-2xl font-semibold mt-1">${doctor.consultationFee}</div>
            </div>
          </div>

          <div>
            <h1 className="font-display text-5xl font-semibold tracking-tight">{doctor.name}</h1>
            <p className="text-primary text-lg mt-1">{doctor.specialization}</p>
            <p className="text-muted-foreground mt-1">{doctor.experience} years of experience</p>

            <p className="mt-6 leading-relaxed text-foreground/90">{doctor.bio}</p>

            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <InfoCard icon={Award} label="Specialization" value={doctor.specialization} />
              <InfoCard icon={Globe} label="Languages" value={doctor.languages.join(", ")} />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg">
                <Link to="/appointment" search={{ doctor: doctor.id }}>
                  <Calendar className="w-4 h-4" /> Book appointment
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/chatbot"><MessageSquare className="w-4 h-4" /> Ask AI first</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: typeof Award; label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-card border border-border flex items-start gap-3">
      <Icon className="w-5 h-5 text-primary mt-0.5" />
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-medium mt-0.5">{value}</div>
      </div>
    </div>
  );
}
