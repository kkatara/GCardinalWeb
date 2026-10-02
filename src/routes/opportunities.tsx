import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Bookmark } from "lucide-react";
import { PageIntro } from "@/components/site/Page";
import { ContentCard } from "@/components/site/ContentCard";
import { useContent } from "@/lib/content";
import { Input } from "@/components/ui/input";
import { SubmitForm } from "@/components/site/SubmitForm";
const title = "Opportunities Hub — Green Cardinal KE",
  description =
    "Search youth scholarships, fellowships, grants, jobs, internships, conferences, training, volunteering and competitions.";
export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/opportunities" }],
  }),
  component: Opportunities,
});
function Opportunities() {
  const { items } = useContent("opportunity");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const categories = [
    "All",
    "Scholarships",
    "Fellowships",
    "Grants",
    "Jobs",
    "Internships",
    "Conferences",
    "Trainings",
    "Volunteering",
    "Competitions",
  ];
  const shown = useMemo(
    () =>
      items.filter(
        (i) =>
          (cat === "All" || i.category === cat) &&
          `${i.title} ${i.summary} ${i.location}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [items, q, cat],
  );
  return (
    <>
      <PageIntro
        eyebrow="Opportunities hub"
        title="Find your next open door."
        text="Search curated opportunities designed to help young people learn, lead, connect and fund their ideas."
        aside={
          <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
            <Bookmark />
            <p className="mt-3 text-sm">
              Sign in to the administration area to securely manage content. Personal bookmarks are
              enabled for future member accounts.
            </p>
          </div>
        }
      />
      <section className="section-pad">
        <div className="site-container">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
            <label className="relative block">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by title, place or keyword"
                className="h-12 pl-10"
              />
            </label>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={
                    cat === c
                      ? "shrink-0 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
                      : "shrink-0 rounded-full bg-muted px-4 py-2 text-xs font-bold"
                  }
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            {shown.length} opportunity{shown.length === 1 ? "" : "ies"}
          </p>
          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((i) => (
              <ContentCard key={i.id} item={i} action="Apply" />
            ))}
          </div>
          <div className="mt-16 max-w-2xl">
            <SubmitForm type="opportunity" title="Submit an opportunity" />
          </div>
        </div>
      </section>
    </>
  );
}
