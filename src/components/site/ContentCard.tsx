import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import type { ContentItem } from "@/lib/site-data";
import waterImage from "@/assets/green-cardinal-water-project.jpg";
import schoolImage from "@/assets/green-cardinal-school-project.jpg";

export function ContentCard({ item, action = "Explore" }: { item: ContentItem; action?: string }) {
  const image = item.category === "Water" ? waterImage : schoolImage;
  return <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-transform hover:-translate-y-1">
    {(item.content_type === "project" || item.content_type === "article") && <img src={item.image_url || image} alt="" loading="lazy" width={1200} height={800} className="aspect-[16/10] w-full object-cover"/>}
    <div className="p-5"><div className="flex items-center justify-between gap-3"><span className="tag">{item.category}</span>{item.deadline && <span className="flex items-center gap-1 text-xs text-muted-foreground"><CalendarDays className="size-3.5"/> {new Date(item.deadline).toLocaleDateString("en-KE",{day:"numeric",month:"short"})}</span>}</div><h3 className="mt-4 text-xl font-bold leading-tight">{item.title}</h3>{item.organization && <p className="mt-1 text-xs font-semibold text-water">{item.organization}</p>}<p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{item.summary}</p>{item.location && <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="size-3.5"/>{item.location}</p>}<span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-primary">{action}<ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/></span></div>
  </article>;
}
