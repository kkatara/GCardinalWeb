import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.jpg";
export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label="Green Cardinal KE home">
      <span
        className={
          inverse
            ? "grid size-10 place-items-center overflow-hidden rounded-xl bg-primary-foreground text-primary"
            : "grid size-10 place-items-center overflow-hidden rounded-xl bg-primary text-primary-foreground"
        }
      >
        <img src={logo} alt="" className="size-full object-cover" />
      </span>
      <span className="leading-none">
        <strong className="block text-base font-bold">Green Cardinal KE</strong>
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
