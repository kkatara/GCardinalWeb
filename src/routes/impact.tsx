import { createFileRoute } from "@tanstack/react-router";
import { Download, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageIntro, SectionHeading, formatNumber } from "@/components/site/Page";
import { useImpactStats } from "@/lib/content";
const title = "Impact — Green Cardinal KE",
  description =
    "Explore Green Cardinal KE's demonstration impact dashboard, geographic reach and annual reporting framework.";
export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/impact" }],
  }),
  component: Impact,
});
function Impact() {
  const stats = useImpactStats();
  const points = [
    { n: "Nairobi", x: 52, y: 52 },
    { n: "Kiambu", x: 51, y: 42 },
    { n: "Machakos", x: 59, y: 60 },
    { n: "Kisumu", x: 29, y: 48 },
  ];
  return (
    <>
      <PageIntro
        eyebrow="Impact"
        title="Proof lives in people and places."
        text="A clear view of reach, learning and environmental outcomes — designed to be updated as Green Cardinal KE’s work grows."
      />
      <section className="section-pad">
        <div className="site-container">
          <p className="rounded-xl bg-highlight/20 px-4 py-3 text-sm text-foreground">
            The figures and locations shown are demonstration content, not verified organizational
            claims.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((s) => (
              <article
                key={s.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-card"
              >
                <p className="text-3xl font-bold text-primary">
                  {formatNumber(s.value)}
                  {s.unit}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-water"
                    style={{ width: `${Math.min(88, 28 + (s.value % 60))}%` }}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section-pad bg-surface">
        <div className="site-container grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Geographic reach"
              title="Action across Kenya"
              text="Select a location to see demonstration project activity. The map is structured to expand across Africa without changing the experience."
            />
            <div className="mt-8 flex flex-wrap gap-2">
              {points.map((p) => (
                <span key={p.n} className="tag">
                  <MapPin className="mr-1 size-3" />
                  {p.n}
                </span>
              ))}
            </div>
          </div>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl border border-border bg-water-soft">
            <div className="absolute inset-[12%] [clip-path:polygon(48%_0,68%_9%,81%_28%,91%_53%,70%_78%,54%_100%,30%_86%,15%_61%,3%_35%,24%_15%)] bg-primary/15" />
            <div className="absolute inset-[13%] [clip-path:polygon(48%_0,68%_9%,81%_28%,91%_53%,70%_78%,54%_100%,30%_86%,15%_61%,3%_35%,24%_15%)] bg-primary/20" />
            {points.map((p) => (
              <button
                key={p.n}
                aria-label={`${p.n} project location`}
                title={p.n}
                className="absolute grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-highlight text-highlight-foreground shadow-card transition-transform hover:scale-110"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              >
                <MapPin className="size-4" />
              </button>
            ))}
            <span className="absolute bottom-5 left-5 font-mono text-xs text-muted-foreground">
              Interactive demonstration map
            </span>
          </div>
        </div>
      </section>
      <section className="section-pad">
        <div className="site-container flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <SectionHeading
            eyebrow="Accountability"
            title="Annual impact reports"
            text="Download a demonstration snapshot. Verified annual reports can replace it from the administration area."
          />
          <Button asChild size="lg" className="rounded-full">
            <a href="/reports/green-cardinal-ke-impact-snapshot-2026.pdf" download>
              <Download /> Download 2026 snapshot
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}
