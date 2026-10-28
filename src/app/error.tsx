"use client";

import Link from "next/link";
import { site } from "@/config/site";

export default function ErrorBoundary({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="flex min-h-[80svh] items-center bg-ivory pt-24">
      <div className="shell">
        <p className="eyebrow text-terracotta">Something went wrong</p>
        <h1 className="mt-5 max-w-3xl text-headline">We dropped a plate.</h1>
        <p className="mt-6 max-w-md text-lg text-ink-soft">
          This page couldn&apos;t load just now. Please try again — or call us on{" "}
          <a href={`tel:${site.phone.tel}`} className="link-line whitespace-nowrap">
            {site.phone.display}
          </a>
          .
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="btn btn-primary">
            Try again
          </button>
          <Link href="/" className="btn btn-dark">
            Back home
          </Link>
        </div>
      </div>
    </section>
  );
}
