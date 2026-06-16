import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { appointmentAPI, mapAppointment } from "@/lib/api";
import { requireAuth } from "@/lib/route-guards";
import { Button } from "@/components/ui/button";
import { Video, Mic, MicOff, VideoOff, PhoneOff } from "lucide-react";

export const Route = createFileRoute("/video-call/$appointmentId")({
  beforeLoad: requireAuth(),
  head: () => ({ meta: [{ title: "Video consultation — Healora" }] }),
  component: VideoCall,
});

function VideoCall() {
  const { appointmentId } = Route.useParams();
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [appointment, setAppointment] = useState<ReturnType<typeof mapAppointment> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentAPI.get(appointmentId)
      .then((raw) => setAppointment(mapAppointment(raw)))
      .catch(() => setAppointment(null))
      .finally(() => setLoading(false));
  }, [appointmentId]);

  const doctorName = appointment?.doctorName || "Doctor";

  return (
    <AppShell noFooter>
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-sm text-muted-foreground mb-3">
          Appointment with {doctorName} · {appointment?.date} {appointment?.time}
        </div>

        {appointment?.meetingLink ? (
          <div className="p-8 rounded-2xl bg-card border border-border text-center">
            <h2 className="font-display text-2xl font-semibold">Join your consultation</h2>
            <p className="text-muted-foreground mt-2">Your secure meeting link is ready.</p>
            <Button asChild variant="hero" size="lg" className="mt-6">
              <a href={appointment.meetingLink} target="_blank" rel="noopener noreferrer">
                <Video className="w-4 h-4" /> Open meeting
              </a>
            </Button>
          </div>
        ) : (
          <div className="aspect-video rounded-2xl bg-gradient-hero relative overflow-hidden shadow-glow">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-primary-foreground">
                <div className="w-24 h-24 rounded-full bg-primary-foreground/20 backdrop-blur mx-auto flex items-center justify-center text-3xl font-display">
                  {doctorName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="mt-4 font-display text-2xl">{doctorName}</div>
                <div className="text-sm opacity-80">
                  {loading ? "Loading…" : "Waiting for meeting link from your doctor"}
                </div>
              </div>
            </div>
            <div className="absolute bottom-4 right-4 w-40 h-28 rounded-xl bg-foreground/40 backdrop-blur border border-primary-foreground/30 flex items-center justify-center text-primary-foreground text-xs">
              {cam ? "Your camera" : "Camera off"}
            </div>
          </div>
        )}

        <div className="flex justify-center gap-3 mt-6">
          <Button variant={mic ? "secondary" : "destructive"} size="lg" onClick={() => setMic(!mic)}>
            {mic ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </Button>
          <Button variant={cam ? "secondary" : "destructive"} size="lg" onClick={() => setCam(!cam)}>
            {cam ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </Button>
          <Button asChild variant="destructive" size="lg">
            <Link to="/dashboard/patient"><PhoneOff className="w-5 h-5" />End</Link>
          </Button>
        </div>
      </section>
    </AppShell>
  );
}
