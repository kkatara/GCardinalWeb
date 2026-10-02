import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageIntro, MovementCta } from "@/components/site/Page";
import { programs } from "@/lib/site-data";
const title = "Programs — Green Cardinal KE",
  description =
    "Youth climate leadership, water action, green schools, innovation and climate education programs in Kenya.";
export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/programs" }],
  }),
  component: Programs,
});
function Programs() {
  return (
    <>
      <PageIntro
        eyebrow="Programs"
        title="Learning that moves. Action that lasts."
        text="Five connected programs help young people build knowledge, test ideas, lead communities and influence sustainable development."
      />
      <section className="section-pad">
        <div className="site-container grid gap-4 lg:grid-cols-2">
          {programs.map(([name, cat, text], i) => (
            <article
              key={name}
              className={
                i === 0
                  ? "rounded-2xl bg-primary p-8 text-primary-foreground lg:col-span-2"
                  : "rounded-2xl border border-border bg-card p-8 shadow-card"
              }
            >
              <p className={i === 0 ? "eyebrow text-highlight" : "eyebrow"}>
                {cat} · 0{i + 1}
              </p>
              <h2 className="mt-4 text-3xl font-bold">{name}</h2>
              <p
                className={
                  i === 0
                    ? "mt-3 max-w-2xl text-primary-foreground/70"
                    : "mt-3 text-muted-foreground"
                }
              >
                {text}
              </p>
              <Link to="/get-involved" className="mt-6 inline-flex items-center gap-2 font-bold">
                Express interest <ArrowRight className="size-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <MovementCta />
    </>
  );
}
