import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  country: z.string().trim().max(100).optional(),
  county: z.string().trim().max(100).optional(),
  organization: z.string().trim().max(180).optional(),
  message: z.string().trim().min(10).max(5000),
});
export function SubmitForm({
  type,
  title,
  compact = false,
}: {
  type: "member" | "volunteer" | "mentor" | "partner" | "contact" | "opportunity";
  title?: string;
  compact?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: form.get("name"),
      email: form.get("email"),
      country: form.get("country") || undefined,
      county: form.get("county") || undefined,
      organization: form.get("organization") || undefined,
      message: form.get("message"),
    });
    if (!parsed.success) {
      toast.error("Please check the highlighted information.");
      return;
    }
    setBusy(true);
    const { error } = await supabase
      .from("submissions")
      .insert({
        submission_type: type,
        name: parsed.data.name,
        email: parsed.data.email,
        message: parsed.data.message,
        country: parsed.data.country ?? null,
        county: parsed.data.county ?? null,
        organization: parsed.data.organization ?? null,
      });
    setBusy(false);
    if (error) toast.error("Your form could not be sent. Please try again.");
    else {
      setDone(true);
      toast.success("Thanks — your details have been received.");
    }
  }
  if (done)
    return (
      <div className="rounded-2xl bg-water-soft p-6 text-primary">
        <h3 className="text-xl font-bold">Thank you for stepping forward.</h3>
        <p className="mt-2 text-sm">Green Cardinal KE has received your details.</p>
      </div>
    );
  return (
    <form
      onSubmit={submit}
      className="grid gap-4 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-7"
    >
      <h2 className="text-2xl font-bold">{title ?? "Send your details"}</h2>
      <div className={compact ? "grid gap-4" : "grid gap-4 sm:grid-cols-2"}>
        <Field label="Name">
          <Input name="name" required minLength={2} maxLength={120} />
        </Field>
        <Field label="Email">
          <Input name="email" type="email" required maxLength={255} />
        </Field>
        {!compact && (
          <>
            <Field label="Country">
              <Input name="country" placeholder="Kenya" maxLength={100} />
            </Field>
            <Field label="County">
              <Input name="county" maxLength={100} />
            </Field>
            <Field label="School or organization">
              <Input name="organization" maxLength={180} />
            </Field>
          </>
        )}
      </div>
      <Field
        label={
          type === "contact" ? "How can we help?" : "Tell us what you hope to contribute or gain"
        }
      >
        <Textarea name="message" required minLength={10} maxLength={5000} className="min-h-28" />
      </Field>
      <Button type="submit" className="w-fit rounded-full" disabled={busy}>
        {busy ? "Sending…" : "Submit"}
      </Button>
    </form>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      {children}
    </label>
  );
}
