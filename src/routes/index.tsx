import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentCard } from "@/components/site/ContentCard";
import { MovementCta, SectionHeading, formatNumber } from "@/components/site/Page";
import { focusAreas } from "@/lib/site-data";
import { useContent, useImpactStats } from "@/lib/content";
import heroImage from "@/assets/index-image.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Green Cardinal KE — Young People. Bold Ideas. Sustainable Action." },
      {
        name: "description",
        content:
          "A Kenyan youth-led movement advancing practical climate, water, environmental, education and innovation solutions.",
      },
      { property: "og:title", content: "Green Cardinal KE — Youth-led sustainable action" },
      {
        property: "og:description",
        content:
          "Connecting young people to knowledge, opportunities and community action for people and planet.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});
function Home() {
  const { items: projects } = useContent("project");
  const { items: opportunities } = useContent("opportunity");
  const { items: voices } = useContent("voice");
  const { items: stories } = useContent("article");
  const stats = useImpactStats();
  return (
    <>
      <section className="site-container py-10 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="reveal lg:col-span-7">
            <span className="tag">
              <Sparkles className="mr-1.5 size-3" /> Youth-led · Community powered
            </span>
            <h1 className="page-title mt-6">
              Young People. <em className="font-serif font-normal text-water">Bold Ideas.</em>
              <br />
              Sustainable Action.
            </h1>
            <p className="mt-6 max-w-2xl font-serif text-xl italic leading-8 text-muted-foreground">
              Empowering young people to translate, share climate knowledge, innovate digital
              solutions and collective action into solutions for climate, water and environmental
              challenges.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/get-involved">
                  Join the Movement <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full bg-background/70">
                <Link to="/work">Explore Our Work</Link>
              </Button>
            </div>
          </div>
          <div className="relative lg:col-span-5">
            <div className="overflow-hidden rounded-3xl border-4 border-card bg-card shadow-card">
              <img
                src={heroImage}
                alt="Kenyan young people planting indigenous trees together"
                width={1600}
                height={1200}
                fetchPriority="high"
                className="aspect-square w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-4 rounded-2xl border border-border bg-background/90 px-5 py-4 shadow-card backdrop-blur-xl sm:-left-5">
              <p className="eyebrow">Action in motion</p>
              <p className="mt-1 text-lg font-bold">Youth leading from the ground up</p>
            </div>
          </div>
        </div>
      </section>
      <section className="border-y border-border bg-primary py-7 text-primary-foreground">
        <div className="site-container grid grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {stats.slice(0, 6).map((s) => (
            <div key={s.id} className="border-primary-foreground/10 px-3 text-center lg:border-r">
              <p className="text-3xl font-bold">
                {formatNumber(s.value)}
                {s.unit}
              </p>
              <p className="mt-1 text-[11px] text-primary-foreground/65">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="site-container mt-5 text-center text-[10px] text-primary-foreground/45">
          Green Cardinal KE’s impact data.
        </p>
      </section>
      <section className="section-pad">
        <div className="site-container">
          <SectionHeading
            eyebrow="What drives us"
            title="Three paths. One shared future."
            text="We connect learning, leadership and practical action so young people can shape the systems affecting their lives."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {focusAreas.map(({ title, description, icon: Icon }, i) => (
              <article
                key={title}
                className="group rounded-2xl border border-border bg-card p-6 shadow-card"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-water-soft text-primary">
                  <Icon />
                </span>
                <p className="eyebrow mt-6">0{i + 1}</p>
                <h3 className="mt-2 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
                <Link
                  to="/programs"
                  className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-water"
                >
                  Explore <ChevronRight className="size-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section-pad bg-surface">
        <div className="site-container">
          <SectionHeading
            eyebrow="From ideas to action"
            title="Featured projects"
            text="Practical, locally rooted work designed with young people and communities."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {projects.slice(0, 3).map((p) => (
              <ContentCard key={p.id} item={p} action="View project" />
            ))}
          </div>
        </div>
      </section>
      <section className="section-pad">
        <div className="site-container grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
          <SectionHeading
            eyebrow="Open doors"
            title="Your next opportunity is waiting."
            text="Explore fellowships, grants, scholarships, training, volunteering and events selected for young changemakers."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {opportunities.slice(0, 2).map((o) => (
              <ContentCard key={o.id} item={o} action="View opportunity" />
            ))}
          </div>
        </div>
      </section>
      {voices[0] && (
        <section className="bg-primary text-primary-foreground">
          <div className="site-container grid items-center gap-10 py-16 md:grid-cols-2">
            <div>
              <p className="eyebrow text-highlight">Youth voice</p>
              <blockquote className="mt-5 font-serif text-3xl italic leading-tight">
                “{voices[0].summary}”
              </blockquote>
              <p className="mt-5 text-sm text-primary-foreground/65">
                {String(voices[0].details["name"] ?? "Young leader")} ·{" "}
                {String(voices[0].details["role"] ?? voices[0].location ?? "")}
              </p>
            </div>
            <div className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/10 p-8">
              <p className="font-mono text-xs uppercase text-highlight">Why it matters</p>
              <p className="mt-4 text-xl font-semibold leading-8">
                Young people are not waiting for change. They are building it — in schools,
                communities, policy spaces and innovation labs.
              </p>
            </div>
          </div>
        </section>
      )}
      <section className="section-pad">
        <div className="site-container">
          <div className="flex items-end justify-between gap-5">
            <SectionHeading eyebrow="Field notes" title="Latest stories" />
            <Button asChild variant="ghost">
              <Link to="/resources">
                View all <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {stories.slice(0, 2).map((s) => (
              <ContentCard key={s.id} item={s} action="Read story" />
            ))}
          </div>
        </div>
      </section>
      <MovementCta />
    </>
  );
}
