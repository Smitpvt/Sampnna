import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center bg-ivory pt-24">
      <div className="shell">
        <p className="eyebrow text-terracotta">404</p>
        <h1 className="mt-5 max-w-3xl text-headline">This table isn&apos;t set.</h1>
        <p className="mt-6 max-w-md text-lg text-ink-soft">The page you were looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn btn-dark">
            Back home
          </Link>
          <Link href="/menu" className="btn btn-primary">
            Explore Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
