import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
const title = "Access Restricted — Green Cardinal KE",
  description = "This Green Cardinal KE area is restricted to authorized staff.";
export const Route = createFileRoute("/unauthorized")({
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
  component: Unauthorized,
});
function Unauthorized() {
  return (
    <section className="grid min-h-[70vh] place-items-center px-4">
      <div className="max-w-md text-center">
        <ShieldX className="mx-auto size-12 text-water" />
        <h1 className="mt-5 text-3xl font-bold">Access restricted</h1>
        <p className="mt-3 text-muted-foreground">
          Your account is signed in but does not have an administrator role. Ask an existing
          administrator to grant access.
        </p>
        <Button asChild className="mt-7">
          <Link to="/">Return home</Link>
        </Button>
      </div>
    </section>
  );
}
