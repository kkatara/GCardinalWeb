import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Instagram, Linkedin } from "lucide-react";
import { PageIntro } from "@/components/site/Page";
import { SubmitForm } from "@/components/site/SubmitForm";

const title = "Contact — Green Cardinal KE";
const description =
  "Contact Green Cardinal KE about youth climate action, partnerships, programs and opportunities.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const details = [
    { Icon: Mail, label: "greencardinalke@gmail.com" },
    // { Icon: Phone, label: "Phone to be confirmed" },
    {
      Icon: MapPin,
      label: "Nairobi, Nakuru, Uasin Gishu, Elgeyo Marakwet, Kenya ",
    },
    { Icon: Instagram, label: "greencardinalke" },
    // { Icon: Linkedin, label: "LinkedIn to be confirmed" },
  ];

  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="Get in touch."
        text="Ask a question, explore a partnership or tell us what is happening in your community."
      />

      <section className="section-pad">
        <div className="site-container grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
          <aside>
            <h2 className="text-2xl font-bold">Reach Green Cardinal KE</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Our team will get back to you as soon as possible.
            </p>

            <div className="mt-7 grid gap-3">
              {details.map(({ Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
                >
                  <Icon className="size-5 text-water" />
                  <span className="text-sm">{label}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 grid aspect-video place-items-center rounded-2xl bg-water-soft text-center">
              <MapPin className="size-8 text-primary" />
              <p className="-mt-10 text-sm text-primary">Map location</p>
            </div>
          </aside>

          <SubmitForm type="contact" title="Send an inquiry" />
        </div>
      </section>
    </>
  );
}
