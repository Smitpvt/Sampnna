"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Honeypot } from "@/components/forms/Field";
import { postJson } from "@/lib/submit";
import { contactSchema, fieldErrors, type FieldErrors } from "@/lib/validation";

const empty = { name: "", email: "", phone: "", message: "" };
type Values = typeof empty;

/** Architectural Triple-Arched Window & Coastal Palm Motif from reference */
function TripleArchMotif({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 160 80" className="w-40 sm:w-48 h-auto overflow-visible" fill="none">
        {/* Palm tree and flying birds on right */}
        <g stroke="#c25e42" strokeWidth="0.85" opacity="0.9">
          {/* Distant coastal birds */}
          <path d="M 132 18 Q 135 15 138 18 Q 141 15 144 18" fill="none" strokeWidth="0.75" />
          <path d="M 142 24 Q 144 22 146 24 Q 148 22 150 24" fill="none" strokeWidth="0.65" />
          {/* Main palm trunk */}
          <path d="M 138 48 Q 137 36 142 28" fill="none" strokeWidth="1.1" strokeLinecap="round" />
          {/* Main palm fronds */}
          <path d="M 142 28 Q 134 24 130 26 M 142 28 Q 138 20 134 18 M 142 28 Q 144 18 147 18 M 142 28 Q 150 22 154 26 M 142 28 Q 148 32 151 36" fill="none" strokeWidth="0.85" />
          {/* Secondary smaller palm */}
          <path d="M 132 48 Q 130 40 133 34" fill="none" strokeWidth="0.95" />
          <path d="M 133 34 Q 127 30 124 32 M 133 34 Q 130 26 128 24 M 133 34 Q 137 26 140 28 M 133 34 Q 138 34 139 38" fill="none" strokeWidth="0.75" />
          {/* Shoreline base */}
          <path d="M 120 48 Q 135 46 156 48" fill="none" strokeWidth="1" />
        </g>

        {/* Wavy accent line connecting to border */}
        <path d="M 104 46 Q 112 43 120 48" stroke="#c25e42" strokeWidth="1.1" fill="none" />

        {/* Triple Arched Windows echoing Sampann's architecture */}
        {/* Left Arch */}
        <g stroke="#c25e42" strokeWidth="1.2">
          <path d="M 18 50 V 28 A 12 12 0 0 1 42 28 V 50 Z" fill="#FAF5EE" />
          <path d="M 21 50 V 29 A 9 9 0 0 1 39 29 V 50" fill="none" strokeWidth="0.8" />
          {/* Geometric stained glass tracery */}
          <path d="M 30 20 V 50 M 21 34 H 39 M 21 42 H 39" stroke="#245f5c" strokeWidth="0.75" opacity="0.8" />
          <circle cx="30" cy="27" r="3" stroke="#245f5c" strokeWidth="0.75" fill="#245f5c" fillOpacity="0.2" />
        </g>

        {/* Center Arch (Taller) */}
        <g stroke="#c25e42" strokeWidth="1.25">
          <path d="M 44 50 V 22 A 16 16 0 0 1 76 22 V 50 Z" fill="#FAF5EE" />
          <path d="M 47 50 V 23 A 13 13 0 0 1 73 23 V 50" fill="none" strokeWidth="0.85" />
          {/* Center stained glass tracery */}
          <path d="M 60 12 V 50 M 47 30 H 73 M 47 40 H 73" stroke="#245f5c" strokeWidth="0.75" opacity="0.8" />
          <circle cx="60" cy="21" r="4.5" stroke="#245f5c" strokeWidth="0.75" fill="#245f5c" fillOpacity="0.25" />
          <path d="M 52 30 L 60 21 L 68 30 L 60 40 Z" stroke="#c25e42" strokeWidth="0.75" fill="#c25e42" fillOpacity="0.15" />
        </g>

        {/* Right Arch */}
        <g stroke="#c25e42" strokeWidth="1.2">
          <path d="M 78 50 V 28 A 12 12 0 0 1 102 28 V 50 Z" fill="#FAF5EE" />
          <path d="M 81 50 V 29 A 9 9 0 0 1 99 29 V 50" fill="none" strokeWidth="0.8" />
          {/* Stained glass tracery */}
          <path d="M 90 20 V 50 M 81 34 H 99 M 81 42 H 99" stroke="#245f5c" strokeWidth="0.75" opacity="0.8" />
          <circle cx="90" cy="27" r="3" stroke="#245f5c" strokeWidth="0.75" fill="#245f5c" fillOpacity="0.2" />
        </g>

        {/* Architectural Plinth / Baseline */}
        <path d="M 14 50 H 106" stroke="#c25e42" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

/** General enquiries (events, banquets, questions). Replicated from approved reference design. */
export function ContactForm() {
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<"idle" | "submitting" | "sent" | { error: string }>("idle");
  const [honeypot, setHoneypot] = useState("");
  const startedAt = useRef(0);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors(({ [key]: _, ...rest }) => rest);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "submitting") return;
    const payload = { ...values, website: honeypot, startedAt: startedAt.current };
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const errs = fieldErrors(parsed.error);
      setErrors(errs);
      document.getElementById(`contact-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setState("submitting");
    const res = await postJson<{ id: string }>("/api/contact", payload);
    if (res.ok) {
      setState("sent");
      setValues(empty);
    } else {
      setErrors(res.fields ?? {});
      setState({ error: res.message });
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  if (state === "sent") {
    return (
      <div className="relative rounded-3xl border border-[#c68c6a]/70 bg-[#FAF6EF] p-8 sm:p-12 shadow-sm text-charcoal">
        <div ref={statusRef} tabIndex={-1} role="status" className="py-8 outline-none">
          <p className="font-serif text-3xl text-turquoise-deep">Thank you — your message has reached us.</p>
          <p className="mt-3 text-charcoal/80">Our team will reply to you promptly by phone or email.</p>
          <button
            type="button"
            onClick={() => setState("idle")}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-turquoise-deep hover:bg-[#1b4b48] px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-ivory transition-colors"
          >
            <span>Send another message</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pt-8 sm:pt-10">
      {/* Top-Right Decorative Triple-Arch & Coastal Motif from reference */}
      <div className="absolute top-0 right-4 sm:right-8 z-10 pointer-events-none">
        <TripleArchMotif />
      </div>

      {/* Main Form Card with Notched Architectural Corners & Warm Cream Background */}
      <div className="relative rounded-3xl border border-[#c68c6a]/60 bg-[#FAF6EF] p-6 sm:p-10 lg:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Subtle decorative inner corner notches */}
        <div aria-hidden className="pointer-events-none absolute top-3 left-3 size-3.5 border-t border-l border-terracotta/60" />
        <div aria-hidden className="pointer-events-none absolute top-3 right-3 size-3.5 border-t border-r border-terracotta/60" />
        <div aria-hidden className="pointer-events-none absolute bottom-3 left-3 size-3.5 border-b border-l border-terracotta/60" />
        <div aria-hidden className="pointer-events-none absolute bottom-3 right-3 size-3.5 border-b border-r border-terracotta/60" />

        <form noValidate onSubmit={onSubmit} className="relative z-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
          <Honeypot value={honeypot} onChange={setHoneypot} />

          {/* NAME */}
          <div>
            <label htmlFor="contact-name" className="block text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-charcoal/90">
              NAME
            </label>
            <input
              id="contact-name"
              name="name"
              autoComplete="name"
              value={values.name}
              onChange={set("name")}
              required
              className="mt-2 w-full bg-transparent border-0 border-b border-terracotta/40 py-2 text-sm text-charcoal outline-none transition-colors focus:border-turquoise-deep"
            />
            {errors.name && <p className="mt-1 text-xs text-[#b3311d]">{errors.name}</p>}
          </div>

          {/* EMAIL */}
          <div>
            <label htmlFor="contact-email" className="block text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-charcoal/90">
              EMAIL
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={set("email")}
              required
              className="mt-2 w-full bg-transparent border-0 border-b border-terracotta/40 py-2 text-sm text-charcoal outline-none transition-colors focus:border-turquoise-deep"
            />
            {errors.email && <p className="mt-1 text-xs text-[#b3311d]">{errors.email}</p>}
          </div>

          {/* PHONE (optional) */}
          <div className="sm:col-span-2">
            <label htmlFor="contact-phone" className="block text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-charcoal/90">
              PHONE <span className="text-charcoal/50 lowercase font-normal">(optional)</span>
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={set("phone")}
              className="mt-2 w-full bg-transparent border-0 border-b border-terracotta/40 py-2 text-sm text-charcoal outline-none transition-colors focus:border-turquoise-deep"
            />
            {errors.phone && <p className="mt-1 text-xs text-[#b3311d]">{errors.phone}</p>}
          </div>

          {/* MESSAGE */}
          <div className="sm:col-span-2">
            <label htmlFor="contact-message" className="block text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-charcoal/90">
              MESSAGE
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={3}
              maxLength={2000}
              placeholder="Events, banquets, large groups or any question…"
              value={values.message}
              onChange={set("message")}
              required
              className="mt-2 w-full bg-transparent border-0 border-b border-terracotta/40 py-2 text-sm text-charcoal placeholder:text-charcoal/45 outline-none transition-colors focus:border-turquoise-deep resize-none"
            />
            {errors.message && <p className="mt-1 text-xs text-[#b3311d]">{errors.message}</p>}
          </div>

          {/* Action Button */}
          <div className="sm:col-span-2 pt-2 flex items-center justify-between">
            <button
              type="submit"
              disabled={state === "submitting"}
              aria-busy={state === "submitting"}
              className="inline-flex items-center gap-2.5 rounded-full bg-turquoise-deep hover:bg-[#1b4b48] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-ivory shadow-md transition-all disabled:opacity-70"
            >
              <span>{state === "submitting" ? "SENDING…" : "SEND MESSAGE"}</span>
              <span aria-hidden>→</span>
            </button>
          </div>

          <div ref={statusRef} tabIndex={-1} aria-live="assertive" className="outline-none sm:col-span-2">
            {typeof state === "object" && (
              <p role="alert" className="border-l-2 border-[#b3311d] pl-4 text-sm text-[#b3311d]">
                {state.error}
              </p>
            )}
          </div>
        </form>

        {/* Bottom-Right Sampann Architectural Sketch Illustration (sampann-sketch.webp) */}
        <div
          className="pointer-events-none absolute bottom-0 right-0 w-[240px] sm:w-[290px] lg:w-[340px] overflow-hidden select-none rounded-br-3xl"
          style={{
            maskImage: "radial-gradient(135% 125% at 100% 100%, black 40%, transparent 92%)",
            WebkitMaskImage: "radial-gradient(135% 125% at 100% 100%, black 40%, transparent 92%)",
          }}
        >
          <Image
            src="/images/other/sampann-sketch.webp"
            alt="Sampann architectural sketch"
            width={640}
            height={420}
            priority
            className="w-full h-auto object-cover object-bottom mix-blend-multiply opacity-85"
          />
        </div>
      </div>
    </div>
  );
}
