import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Instagram, Linkedin, Youtube, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Brand } from "./Brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const links = [["About Us","/about"],["Our Work","/work"],["Programs","/programs"],["Opportunities","/opportunities"],["Impact","/impact"],["Resources","/resources"],["Get Involved","/get-involved"],["Partners","/partners"],["Contact","/contact"]] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: s => s.location.pathname });
  return <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
    <div className="site-container flex h-18 items-center justify-between gap-4"><Brand />
      <nav className="hidden xl:flex items-center gap-5" aria-label="Main navigation">{links.map(([label,to]) => <Link key={to} to={to} className={path === to ? "nav-link text-primary" : "nav-link"}>{label}</Link>)}</nav>
      <div className="flex items-center gap-2"><Button asChild className="hidden sm:inline-flex rounded-full"><Link to="/get-involved">Join the Movement <ArrowRight /></Link></Button><Button variant="ghost" size="icon" className="xl:hidden" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(v => !v)}>{open ? <X /> : <Menu />}</Button></div>
    </div>
    {open && <nav className="border-t border-border bg-background px-5 py-5 xl:hidden" aria-label="Mobile navigation"><div className="grid gap-1">{links.map(([label,to]) => <Link key={to} to={to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm font-semibold hover:bg-muted">{label}</Link>)}<Button asChild className="mt-3 rounded-full"><Link to="/get-involved">Join the Movement</Link></Button></div></nav>}
  </header>;
}

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  async function subscribe(e: React.FormEvent) {
    e.preventDefault(); if (!email.trim()) return; setBusy(true);
    const { error } = await supabase.from("newsletter_subscribers").upsert({ email: email.trim().toLowerCase(), is_active: true }, { onConflict: "email" });
    setBusy(false); if (error) toast.error("We couldn't add you just now."); else { toast.success("You're on the list."); setEmail(""); }
  }
  return <footer className="bg-primary text-primary-foreground"><div className="site-container grid gap-12 py-14 lg:grid-cols-[1.2fr_.8fr_1fr]">
    <div><Brand inverse /><p className="mt-5 max-w-sm text-sm leading-6 text-primary-foreground/70">Connecting, equipping and amplifying young people to lead sustainable solutions for people and planet.</p><div className="mt-5 flex gap-2"><Social icon={Instagram} label="Instagram"/><Social icon={Linkedin} label="LinkedIn"/><Social icon={Youtube} label="YouTube"/></div></div>
    <div><h2 className="font-mono text-xs uppercase text-highlight">Explore</h2><div className="mt-4 grid grid-cols-2 gap-3 text-sm">{links.slice(0,8).map(([label,to]) => <Link key={to} to={to} className="text-primary-foreground/70 hover:text-primary-foreground">{label}</Link>)}</div></div>
    <div><p className="font-mono text-xs uppercase text-highlight">Stay Connected</p><h2 className="mt-3 text-xl font-bold">Ideas, action and opportunities.</h2><p className="mt-2 text-sm text-primary-foreground/70">Get youth opportunities, climate stories, events and project updates delivered to your inbox.</p><form onSubmit={subscribe} className="mt-4 flex gap-2"><Input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50"/><Button type="submit" variant="highlight" disabled={busy}>{busy ? "Joining…" : "Join"}</Button></form></div>
  </div><div className="border-t border-primary-foreground/10"><div className="site-container flex flex-col gap-3 py-5 text-xs text-primary-foreground/55 sm:flex-row sm:items-center sm:justify-between"><p>© 2026 Green Cardinal KE. Placeholder organizational details.</p><div className="flex gap-5"><span>Privacy Policy</span><span>Terms of Use</span><Link to="/auth">Admin</Link></div></div></div></footer>;
}
function Social({ icon: Icon, label }: { icon: typeof Instagram; label: string }) { return <a href="#" aria-label={`${label} link placeholder`} className="grid size-9 place-items-center rounded-full border border-primary-foreground/20 text-primary-foreground/70 hover:bg-primary-foreground/10"><Icon className="size-4"/></a>; }
