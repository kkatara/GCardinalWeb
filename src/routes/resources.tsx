import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Download, FileText, PlayCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/site/Page";
import { useContent } from "@/lib/content";
const title = "Resources — Green Cardinal KE",
  description =
    "Search guides, research, reports, toolkits, policy briefs, videos and climate education resources.";
export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/resources" }],
  }),
  component: Resources,
});
function Resources() {
  const { items } = useContent();
  const [q, setQ] = useState("");
  const resources = useMemo(
    () =>
      items.filter(
        (i) =>
          ["resource", "report", "article"].includes(i.content_type) &&
          `${i.title} ${i.summary} ${i.category}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [items, q],
  );
  return (
    <>
      <PageIntro
        eyebrow="Resource library"
        title="Knowledge belongs in motion."
        text="Use practical guides, research, reports and learning materials to turn curiosity into informed action."
      />
      <section className="section-pad">
        <div className="site-container">
          <label className="relative block max-w-2xl">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search resources, topics or formats"
              className="h-13 rounded-full pl-11"
            />
          </label>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {resources.map((r) => (
              <article
                key={r.id}
                className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-card"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-water-soft text-primary">
                  {r.details["format"] === "Video" ? <PlayCircle /> : <FileText />}
                </span>
                <div className="min-w-0">
                  <p className="eyebrow">{r.category ?? r.content_type}</p>
                  <h2 className="mt-2 text-lg font-bold">{r.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{r.summary}</p>
                  {r.external_url ? (
                    <Button asChild variant="link" className="mt-3 h-auto p-0">
                      <a href={r.external_url} target="_blank" rel="noreferrer">
                        <Download /> Open resource
                      </a>
                    </Button>
                  ) : (
                    <p className="mt-3 text-xs text-muted-foreground">
                      File to be uploaded by Green Cardinal KE.
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
