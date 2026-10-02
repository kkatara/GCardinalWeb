import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PageIntro({
  eyebrow,
  title,
  text,
  aside,
}: {
  eyebrow: string;
  title: string;
  text: string;
  aside?: ReactNode;
}) {
  return (
    <section className="section-pad border-b border-border bg-surface">
      <div className="site-container grid gap-8 lg:grid-cols-[1fr_.42fr] lg:items-end">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="page-title mt-4">{title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{text}</p>
        </div>
        {aside && <div>{aside}</div>}
      </div>
    </section>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="section-title mt-3">{title}</h2>
      {text && <p className="mt-4 leading-7 text-muted-foreground">{text}</p>}
    </div>
  );
}
export function MovementCta() {
  return (
    <section className="section-pad">
      <div className="site-container">
        <div className="rounded-3xl bg-water-soft p-8 text-center ring-1 ring-water/20 sm:p-14">
          <h2 className="section-title text-primary">
            Your Voice. <em className="font-serif font-normal">Your Ideas.</em> Your Future.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Whether you are a student, innovator, activist, volunteer, organization or potential
            partner, there is a place for you in this movement.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/get-involved">
                Become a Member <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full bg-background/70">
              <Link to="/partners">Partner With Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
export const formatNumber = (value: number) =>
  value >= 1_000_000
    ? `${(value / 1_000_000).toFixed(1)}M`
    : value >= 1000
      ? `${(value / 1000).toFixed(value % 1000 ? 1 : 0)}K`
      : value.toLocaleString();
