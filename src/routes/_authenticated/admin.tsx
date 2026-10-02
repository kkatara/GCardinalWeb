import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  BarChart3,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Plus,
  Trash2,
  Users,
  Handshake,
  BriefcaseBusiness,
  Pencil,
  Save,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  deleteContent,
  getAdminDashboard,
  saveContent,
  saveImpactStat,
  updateSubmissionStatus,
} from "@/lib/admin.functions";
import type { ContentItem } from "@/lib/site-data";

type Dashboard = Awaited<ReturnType<typeof getAdminDashboard>>;
type View =
  | "overview"
  | "projects"
  | "opportunities"
  | "articles"
  | "resources"
  | "team"
  | "partners"
  | "impact"
  | "applications";
const title = "Administration — Green Cardinal KE",
  description = "Authorized Green Cardinal KE content and applications administration.";
export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminDashboard,
});
const nav: [View, string, typeof LayoutDashboard][] = [
  ["overview", "Overview", LayoutDashboard],
  ["projects", "Projects", BriefcaseBusiness],
  ["opportunities", "Opportunities", BarChart3],
  ["articles", "Articles", Newspaper],
  ["resources", "Resources", FileText],
  ["team", "Team", Users],
  ["partners", "Partners", Handshake],
  ["impact", "Impact", BarChart3],
  ["applications", "Applications", Inbox],
];
const typeFor: Partial<Record<View, ContentItem["content_type"]>> = {
  projects: "project",
  opportunities: "opportunity",
  articles: "article",
  resources: "resource",
  team: "team",
  partners: "partner",
};
function AdminDashboard() {
  const load = useServerFn(getAdminDashboard);
  const remove = useServerFn(deleteContent);
  const saveStat = useServerFn(saveImpactStat);
  const updateStatus = useServerFn(updateSubmissionStatus);
  const navigate = useNavigate();
  const [data, setData] = useState<Dashboard | null>(null);
  const [view, setView] = useState<View>("overview");
  const [loading, setLoading] = useState(true);
  async function refresh() {
    setLoading(true);
    try {
      setData(await load());
    } catch {
      toast.error("Administration data could not be loaded.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void refresh();
  }, []);
  async function signOut() {
    await supabase.auth.signOut();
    await navigate({ to: "/auth" });
  }
  const filtered = useMemo(
    () => data?.content.filter((i) => i.content_type === typeFor[view]) ?? [],
    [data, view],
  );
  async function deleteItem(id: string) {
    if (!window.confirm("Delete this item permanently?")) return;
    try {
      await remove({ data: { id } });
      toast.success("Item deleted");
      await refresh();
    } catch {
      toast.error("Item could not be deleted");
    }
  }
  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="flex h-16 items-center justify-between px-4 lg:px-8">
          <div>
            <p className="font-bold">Green Cardinal KE</p>
            <p className="text-xs text-muted-foreground">Administration</p>
          </div>
          <Button variant="ghost" onClick={signOut}>
            <LogOut /> Sign out
          </Button>
        </div>
      </header>
      <div className="grid lg:grid-cols-[230px_1fr]">
        <aside className="border-b border-border bg-card p-3 lg:min-h-[calc(100vh-4rem)] lg:border-b-0 lg:border-r">
          <nav className="flex gap-1 overflow-x-auto lg:grid" aria-label="Administration sections">
            {nav.map(([id, label, Icon]) => (
              <Button
                key={id}
                variant={view === id ? "default" : "ghost"}
                onClick={() => setView(id)}
                className="shrink-0 justify-start"
              >
                <Icon />
                {label}
              </Button>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 p-4 lg:p-8">
          {loading ? (
            <p>Loading dashboard…</p>
          ) : !data ? (
            <p role="alert">Dashboard unavailable.</p>
          ) : view === "overview" ? (
            <Overview data={data} />
          ) : view === "impact" ? (
            <ImpactEditor stats={data.stats} save={saveStat} refresh={refresh} />
          ) : view === "applications" ? (
            <Applications rows={data.submissions} update={updateStatus} refresh={refresh} />
          ) : (
            <ContentManager
              type={typeFor[view] ?? "project"}
              items={filtered as ContentItem[]}
              save={useServerFn(saveContent)}
              remove={deleteItem}
              refresh={refresh}
            />
          )}
        </main>
      </div>
    </div>
  );
}
function Overview({ data }: { data: Dashboard }) {
  const cards = [
    ["Published content", data.content.filter((i) => i.status === "published").length, Newspaper],
    ["Open applications", data.submissions.filter((i) => i.status === "new").length, Inbox],
    ["Impact measures", data.stats.length, BarChart3],
    ["Subscribers", data.subscribers.filter((i) => i.is_active).length, Users],
  ] as const;
  return (
    <>
      <h1 className="text-3xl font-bold">Dashboard overview</h1>
      <p className="mt-2 text-muted-foreground">
        Manage the movement’s public information and incoming interest.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, Icon]) => (
          <article key={label} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <Icon className="text-water" />
            <p className="mt-5 text-3xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </article>
        ))}
      </div>
    </>
  );
}
function ContentManager({
  type,
  items,
  save,
  remove,
  refresh,
}: {
  type: ContentItem["content_type"];
  items: ContentItem[];
  save: ReturnType<typeof useServerFn<typeof saveContent>>;
  remove: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ContentItem | null>(null);
  function edit(item: ContentItem | null) {
    setEditing(item);
    setOpen(true);
  }
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold capitalize">{type}s</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create, publish, update or archive {type} content.
          </p>
        </div>
        <Button onClick={() => edit(null)}>
          <Plus /> Add new
        </Button>
      </div>
      <div className="mt-7 overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-semibold">{item.title}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <span className="tag">{item.status}</span>
                </TableCell>
                <TableCell>
                  {new Date(item.updated_at ?? item.published_at ?? Date.now()).toLocaleDateString(
                    "en-KE",
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Edit ${item.title}`}
                      onClick={() => edit(item)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Delete ${item.title}`}
                      onClick={() => void remove(item.id)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit" : "Add"} {type}
            </DialogTitle>
          </DialogHeader>
          {open && (
            <ContentForm
              type={type}
              item={editing}
              save={save}
              done={async () => {
                setOpen(false);
                await refresh();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
function ContentForm({
  type,
  item,
  save,
  done,
}: {
  type: ContentItem["content_type"];
  item: ContentItem | null;
  save: ReturnType<typeof useServerFn<typeof saveContent>>;
  done: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const title = String(f.get("title") ?? "").trim();
    const rawDeadline = String(f.get("deadline") ?? "");
    const val = {
      id: item?.id,
      content_type: type,
      title,
      slug: String(
        f.get("slug") ||
          title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, ""),
      ),
      category: String(f.get("category") ?? ""),
      summary: String(f.get("summary") ?? ""),
      body: String(f.get("body") ?? ""),
      location: String(f.get("location") ?? "") || null,
      organization: String(f.get("organization") ?? "") || null,
      image_url: String(f.get("image_url") ?? "") || null,
      external_url: String(f.get("external_url") ?? "") || null,
      deadline: rawDeadline ? new Date(rawDeadline).toISOString() : null,
      featured: f.get("featured") === "on",
      status: String(f.get("status") ?? "draft") as "draft" | "published" | "archived",
      details: {},
    };
    setBusy(true);
    try {
      await save({ data: val });
      toast.success("Content saved");
      await done();
    } catch {
      toast.error("Check the information and try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title">
          <Input name="title" defaultValue={item?.title} required maxLength={180} />
        </Field>
        <Field label="URL slug">
          <Input
            name="slug"
            defaultValue={item?.slug}
            placeholder="generated-from-title"
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
          />
        </Field>
        <Field label="Category">
          <Input name="category" defaultValue={item?.category} />
        </Field>
        <Field label="Location">
          <Input name="location" defaultValue={item?.location ?? ""} />
        </Field>
        <Field label="Organization">
          <Input name="organization" defaultValue={item?.organization ?? ""} />
        </Field>
        <Field label="Deadline">
          <Input
            name="deadline"
            type="datetime-local"
            defaultValue={item?.deadline?.slice(0, 16) ?? ""}
          />
        </Field>
        <Field label="Image URL">
          <Input name="image_url" type="url" defaultValue={item?.image_url ?? ""} />
        </Field>
        <Field label="External URL">
          <Input name="external_url" type="url" defaultValue={item?.external_url ?? ""} />
        </Field>
      </div>
      <Field label="Summary">
        <Textarea name="summary" defaultValue={item?.summary} maxLength={1000} />
      </Field>
      <Field label="Body">
        <Textarea name="body" defaultValue={item?.body} maxLength={30000} className="min-h-36" />
      </Field>
      <div className="flex flex-wrap items-end gap-5">
        <Field label="Status">
          <Select name="status" defaultValue={item?.status ?? "draft"}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <label className="flex items-center gap-2 pb-2 text-sm font-semibold">
          <input type="checkbox" name="featured" defaultChecked={item?.featured} /> Featured
        </label>
        <Button type="submit" disabled={busy} className="ml-auto">
          <Save />
          {busy ? "Saving…" : "Save"}
        </Button>
      </div>
    </form>
  );
}
function ImpactEditor({
  stats,
  save,
  refresh,
}: {
  stats: any[];
  save: ReturnType<typeof useServerFn<typeof saveImpactStat>>;
  refresh: () => Promise<void>;
}) {
  async function update(stat: any, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    try {
      await save({
        data: {
          id: stat.id,
          label: String(f.get("label")),
          value: Number(f.get("value")),
          unit: String(f.get("unit")),
          display_order: Number(f.get("display_order")),
          is_active: f.get("is_active") === "on",
        },
      });
      toast.success("Impact statistic updated");
      await refresh();
    } catch {
      toast.error("Statistic could not be updated");
    }
  }
  return (
    <>
      <h1 className="text-3xl font-bold">Impact statistics</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Only publish figures that Green Cardinal KE has verified.
      </p>
      <div className="mt-7 grid gap-4">
        {stats.map((s) => (
          <form
            key={s.id}
            onSubmit={(e) => void update(s, e)}
            className="grid items-end gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-[2fr_1fr_1fr_1fr_auto_auto]"
          >
            <Field label="Label">
              <Input name="label" defaultValue={s.label} />
            </Field>
            <Field label="Value">
              <Input name="value" type="number" min="0" defaultValue={s.value} />
            </Field>
            <Field label="Unit">
              <Input name="unit" defaultValue={s.unit} />
            </Field>
            <Field label="Order">
              <Input name="display_order" type="number" min="0" defaultValue={s.display_order} />
            </Field>
            <label className="flex items-center gap-2 pb-2 text-sm">
              <input name="is_active" type="checkbox" defaultChecked={s.is_active} /> Active
            </label>
            <Button type="submit" size="icon" aria-label={`Save ${s.label}`}>
              <Save />
            </Button>
          </form>
        ))}
      </div>
    </>
  );
}
function Applications({
  rows,
  update,
  refresh,
}: {
  rows: any[];
  update: ReturnType<typeof useServerFn<typeof updateSubmissionStatus>>;
  refresh: () => Promise<void>;
}) {
  async function change(id: string, status: string) {
    try {
      await update({ data: { id, status: status as "new" | "reviewing" | "accepted" | "closed" } });
      await refresh();
    } catch {
      toast.error("Status could not be changed");
    }
  }
  return (
    <>
      <h1 className="text-3xl font-bold">Incoming applications</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Membership, volunteer, mentor, partner, contact and opportunity submissions.
      </p>
      <div className="mt-7 grid gap-4">
        {rows.map((r) => (
          <article key={r.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <span className="tag">{r.submission_type}</span>
                <h2 className="mt-3 text-lg font-bold">{r.name}</h2>
                <a className="text-sm text-water" href={`mailto:${r.email}`}>
                  {r.email}
                </a>
              </div>
              <Select value={r.status} onValueChange={(v) => void change(r.id, v)}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {r.message}
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              {[r.organization, r.county, r.country].filter(Boolean).join(" · ")} ·{" "}
              {new Date(r.created_at).toLocaleDateString("en-KE")}
            </p>
          </article>
        ))}
      </div>
    </>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold">
      {label}
      {children}
    </label>
  );
}
