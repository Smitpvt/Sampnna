"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Field, Honeypot } from "@/components/forms/Field";
import { reservationRules as rules, site } from "@/config/site";
import { postJson } from "@/lib/submit";
import { addDays, formatSlot, reservationSlots, restaurantNow } from "@/lib/time";
import { fieldErrors, reservationSchema, type FieldErrors } from "@/lib/validation";

const SLOTS = reservationSlots();
const GUESTS = Array.from({ length: rules.maxGuests }, (_, i) => i + 1);

const empty = { guestName: "", email: "", phone: "", date: "", time: "", guestCount: "2", specialRequests: "" };
type Values = typeof empty;

type Status = { kind: "idle" } | { kind: "submitting" } | { kind: "error"; message: string } | { kind: "success"; ref: string; duplicate: boolean };

/**
 * Reservation REQUEST form. Validates on the client with the same schema the
 * server uses, then the server re-validates and stores it as PENDING.
 */
export function ReservationForm() {
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [honeypot, setHoneypot] = useState("");
  const [bounds, setBounds] = useState<{ min: string; max: string; today: string; nowMinutes: number } | null>(null);
  const startedAt = useRef(0);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
    const now = restaurantNow();
    // Date bounds depend on the visitor's clock, so they're set after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBounds({ min: now.date, max: addDays(now.date, rules.maxDaysAhead), today: now.date, nowMinutes: now.minutes });
  }, []);

  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors(({ [key]: _, ...rest }) => rest);
  };

  const slotUnavailable = (slot: string) => {
    if (!bounds || values.date !== bounds.today) return false;
    const [h, m] = slot.split(":").map(Number);
    return h * 60 + m < bounds.nowMinutes + rules.minLeadMinutes;
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "submitting") return;
    const payload = { ...values, website: honeypot, startedAt: startedAt.current };

    const parsed = reservationSchema.safeParse(payload);
    if (!parsed.success) {
      const errs = fieldErrors(parsed.error);
      setErrors(errs);
      const first = Object.keys(errs)[0];
      document.getElementById(`res-${first}`)?.focus();
      return;
    }

    setStatus({ kind: "submitting" });
    const res = await postJson<{ id: string; status: string; duplicate?: boolean }>("/api/reservations", payload);
    if (res.ok) {
      setStatus({ kind: "success", ref: res.data.id.slice(-6).toUpperCase(), duplicate: Boolean(res.data.duplicate) });
      setValues(empty);
      setErrors({});
    } else {
      setErrors(res.fields ?? {});
      setStatus({ kind: "error", message: res.message });
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  if (status.kind === "success") {
    return (
      <motion.div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[420px] flex-col justify-center outline-none"
      >
        <p className="eyebrow opacity-80">Request received · Ref {status.ref}</p>
        <h3 className="mt-5 font-serif text-4xl leading-tight">Thank you — your request is with us.</h3>
        <p className="mt-5 max-w-md leading-relaxed opacity-85">
          {status.duplicate
            ? "We already have a request from you for this date and time, so we haven't created another."
            : "This is a request, not yet a confirmation."}{" "}
          Our team will call or email you to confirm your table. If your plans are urgent, call us on{" "}
          <a href={`tel:${site.phone.tel}`} className="link-line whitespace-nowrap">
            {site.phone.display}
          </a>
          .
        </p>
        <button type="button" onClick={() => setStatus({ kind: "idle" })} className="btn btn-light mt-10 self-start">
          Make another request
        </button>
      </motion.div>
    );
  }

  const submitting = status.kind === "submitting";

  return (
    <form noValidate onSubmit={onSubmit} aria-describedby="res-note" className="on-dark relative grid gap-x-8 gap-y-7 sm:grid-cols-2">
      <Honeypot value={honeypot} onChange={setHoneypot} />

      <Field id="res-guestName" label="Name" error={errors.guestName} className="sm:col-span-2">
        {(a) => <input {...a} name="guestName" className="field" autoComplete="name" value={values.guestName} onChange={set("guestName")} required />}
      </Field>
      <Field id="res-email" label="Email" error={errors.email}>
        {(a) => <input {...a} name="email" type="email" inputMode="email" className="field" autoComplete="email" value={values.email} onChange={set("email")} required />}
      </Field>
      <Field id="res-phone" label="Phone" error={errors.phone}>
        {(a) => <input {...a} name="phone" type="tel" inputMode="tel" className="field" autoComplete="tel" value={values.phone} onChange={set("phone")} required />}
      </Field>
      <Field id="res-date" label="Date" error={errors.date}>
        {(a) => (
          <input
            {...a}
            name="date"
            type="date"
            className="field [color-scheme:dark]"
            min={bounds?.min}
            max={bounds?.max}
            value={values.date}
            onChange={set("date")}
            required
          />
        )}
      </Field>
      <Field id="res-time" label="Time" error={errors.time}>
        {(a) => (
          <select {...a} name="time" className="field" value={values.time} onChange={set("time")} required>
            <option value="">Choose a time</option>
            {SLOTS.map((s) => (
              <option key={s} value={s} disabled={slotUnavailable(s)}>
                {formatSlot(s)}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Field id="res-guestCount" label="Guests" error={errors.guestCount} hint={`For more than ${rules.maxGuests}, please call us.`} className="sm:col-span-2">
        {(a) => (
          <select {...a} name="guestCount" className="field" value={values.guestCount} onChange={set("guestCount")} required>
            {GUESTS.map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Field id="res-specialRequests" label="Special requests" optional error={errors.specialRequests} className="sm:col-span-2">
        {(a) => (
          <textarea
            {...a}
            name="specialRequests"
            rows={3}
            maxLength={1000}
            className="field resize-y"
            placeholder="Occasion, seating preference, dietary needs…"
            value={values.specialRequests}
            onChange={set("specialRequests")}
          />
        )}
      </Field>

      <div className="flex flex-col gap-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p id="res-note" className="max-w-sm text-sm opacity-75">
          Requests are pending until our team confirms them with you by phone or email.
        </p>
        <button type="submit" disabled={submitting} aria-busy={submitting} className="btn bg-ivory text-charcoal hover:bg-sand disabled:opacity-70">
          {submitting ? (
            <>
              <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-charcoal/30 border-t-charcoal" />
              Sending…
            </>
          ) : (
            "Request a Table"
          )}
        </button>
      </div>

      <div ref={statusRef} tabIndex={-1} aria-live="assertive" className="outline-none sm:col-span-2">
        <AnimatePresence>
          {status.kind === "error" && (
            <motion.p
              role="alert"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border-l-2 border-[#ffb4a2] pl-4 text-sm"
            >
              {status.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
