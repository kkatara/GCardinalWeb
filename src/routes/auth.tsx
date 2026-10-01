import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brand } from "@/components/site/Brand";

const searchSchema = z.object({ redirect: z.string().optional() });
const title = "Staff Sign In — Green Cardinal KE";
const description = "Secure staff access to the Green Cardinal KE administration dashboard.";

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) throw redirect({ to: "/admin" });
  },
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function safeRedirect(value: string | undefined) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/admin";
}

function AuthPage() {
  const navigate = useNavigate();
  const { redirect: redirectTo } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError(""); setBusy(true);
    const parsed = z.object({ email: z.string().email(), password: z.string().min(8).max(200) }).safeParse({ email, password });
    if (!parsed.success) { setBusy(false); setError("Enter a valid email and password."); return; }
    const { error: authError } = await supabase.auth.signInWithPassword(parsed.data);
    setBusy(false);
    if (authError) { setError("Sign-in failed. Check your details and try again."); return; }
    await navigate({ to: safeRedirect(redirectTo) });
  }
  async function google() {
    setBusy(true); setError("");
    sessionStorage.setItem("green-cardinal-auth-return", safeRedirect(redirectTo));
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (result.error) { setBusy(false); setError("Google sign-in could not start. Please try again."); return; }
    if (!result.redirected) await navigate({ to: safeRedirect(redirectTo) });
  }
  return <section className="grid min-h-[75vh] place-items-center bg-surface px-4 py-14"><div className="w-full max-w-md rounded-2xl border border-border bg-card p-7 shadow-card"><Brand/><span className="mt-8 grid size-11 place-items-center rounded-xl bg-water-soft text-primary"><LockKeyhole/></span><h1 className="mt-5 text-3xl font-bold">Staff sign in</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Authorized Green Cardinal KE staff can manage public content and incoming applications.</p><form onSubmit={submit} className="mt-7 grid gap-4"><label className="grid gap-2 text-sm font-semibold">Email<Input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email"/></label><label className="grid gap-2 text-sm font-semibold">Password<Input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={8} autoComplete="current-password"/></label>{error&&<p role="alert" className="text-sm text-destructive">{error}</p>}<Button type="submit" size="lg" disabled={busy}>{busy?"Signing in…":"Sign in"}</Button></form><div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border"/>or<span className="h-px flex-1 bg-border"/></div><Button type="button" variant="outline" size="lg" className="w-full" onClick={google} disabled={busy}>Continue with Google</Button></div></section>;
}
