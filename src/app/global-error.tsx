"use client";

/** Last-resort boundary when the root layout itself fails. Kept dependency-free. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-IN">
      <body style={{ margin: 0, fontFamily: "Georgia, serif", background: "#f8f3ea", color: "#272622", display: "grid", placeItems: "center", minHeight: "100vh" }}>
        <main style={{ padding: 24, maxWidth: 520 }}>
          <h1 style={{ fontWeight: 400, fontSize: 40 }}>Sampann is briefly unavailable.</h1>
          <p>Please try again in a moment, or call +91 99605 90302.</p>
          <button type="button" onClick={reset} style={{ marginTop: 16, padding: "12px 20px", background: "#b96349", color: "#f8f3ea", border: 0, cursor: "pointer" }}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
