"use client";

import { useEffect, useRef, useState } from "react";
import { Field, Honeypot } from "@/components/forms/Field";
import { postJson } from "@/lib/submit";
import { contactSchema, fieldErrors, type FieldErrors } from "@/lib/validation";

const empty = { name: "", email: "", phone: "", message: "" };
type Values = typeof empty;

/** General enquiries (events, banquets, questions). Stored for the team; not a reservation. */
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
      <div ref={statusRef} tabIndex={-1} role="status" className="py-10 outline-none">
        <p className="font-serif text-3xl">Thank you — your message has reached us.</p>
        <p className="mt-3 text-ink-soft">Our team will reply by email or phone.</p>
        <button type="button" onClick={() => setState("idle")} className="btn btn-dark mt-8">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="relative grid gap-x-8 gap-y-7 sm:grid-cols-2">
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <Field id="contact-name" label="Name" error={errors.name}>
        {(a) => <input {...a} name="name" className="field" autoComplete="name" value={values.name} onChange={set("name")} required />}
      </Field>
      <Field id="contact-email" label="Email" error={errors.email}>
        {(a) => <input {...a} name="email" type="email" className="field" autoComplete="email" value={values.email} onChange={set("email")} required />}
      </Field>
      <Field id="contact-phone" label="Phone" optional error={errors.phone} className="sm:col-span-2">
        {(a) => <input {...a} name="phone" type="tel" className="field" autoComplete="tel" value={values.phone} onChange={set("phone")} />}
      </Field>
      <Field id="contact-message" label="Message" error={errors.message} className="sm:col-span-2">
        {(a) => (
          <textarea
            {...a}
            name="message"
            rows={5}
            maxLength={2000}
            className="field resize-y"
            placeholder="Events, banquets, large groups or any question…"
            value={values.message}
            onChange={set("message")}
            required
          />
        )}
      </Field>
      <div className="sm:col-span-2">
        <button type="submit" disabled={state === "submitting"} aria-busy={state === "submitting"} className="btn btn-turquoise disabled:opacity-70">
          {state === "submitting" ? "Sending…" : "Send Message"}
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
  );
}
