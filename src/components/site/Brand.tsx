import { Link } from "@tanstack/react-router";
import { Bird } from "lucide-react";

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label="Green Cardinal KE home">
      <span
        className={
          inverse
            ? "grid size-10 place-items-center rounded-xl bg-primary-foreground text-primary"
            : "grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground"
        }
      >
        <Bird aria-hidden="true" />
      </span>
      <span className="leading-none">
        <strong className="block text-base font-bold">Green Cardinal</strong>
        <span
          className={
            inverse
              ? "mt-1 block font-mono text-[9px] uppercase text-primary-foreground/65"
              : "mt-1 block font-mono text-[9px] uppercase text-muted-foreground"
          }
        >
          Youth action · Kenya
        </span>
      </span>
    </Link>
  );
}
