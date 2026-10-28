import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/brand/sampann-logo.png";

/** The supplied Sampann logo, used as-is (no redraw, no recolour). */
export function Logo({ className = "h-9 w-auto", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Link href="/" aria-label="Sampann Resort & Restaurant — home" className="inline-flex shrink-0">
      <Image src={logo} alt="Sampann Resort & Restaurant" className={className} priority={priority} unoptimized />
    </Link>
  );
}
