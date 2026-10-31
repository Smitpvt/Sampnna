"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "@/components/ui/Icons";
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
        className="flex min-h-[300px] flex-col justify-center outline-none"
      >
        <p className="eyebrow text-turquoise-deep">Request received · Ref {status.ref}</p>
        <h3 className="mt-4 font-[family-name:var(--font-cormorant)] text-[2.2rem] leading-tight">Thank you — your request is with us.</h3>
        <p className="mt-4 max-w-md leading-relaxed text-ink-soft">
          {status.duplicate
            ? "We already have a request from you for this date and time, so we haven't created another."
            : "This is a request, not yet a confirmation."}{" "}
          Our team will call or email you to confirm your table. If your plans are urgent, call us on{" "}
          <a href={`tel:${site.phone.tel}`} className="link-line whitespace-nowrap">
            {site.phone.display}
          </a>
          .
        </p>
        <button type="button" onClick={() => setStatus({ kind: "idle" })} className="btn btn-dark mt-8 self-start">
          Make another request
        </button>
      </motion.div>
    );
  }

  const submitting = status.kind === "submitting";

  return (
    // Rows of two (name · phone, email · date, time · guests), special requests across the full width, then the note and the button.
    <form noValidate onSubmit={onSubmit} aria-describedby="res-note" className="relative grid gap-x-7 gap-y-5 text-charcoal sm:grid-cols-2 lg:gap-y-[clamp(0.75rem,1.6svh,1rem)]">
      <Honeypot value={honeypot} onChange={setHoneypot} />

      <Field id="res-guestName" label="Your name" error={errors.guestName}>
        {(a) => (
          <WithIcon icon="user">
            <input {...a} name="guestName" className={fieldCls} placeholder="Enter your full name" autoComplete="name" value={values.guestName} onChange={set("guestName")} required />
          </WithIcon>
        )}
      </Field>
      <Field id="res-phone" label="Phone number" error={errors.phone}>
        {(a) => (
          <WithIcon icon="phone">
            <input {...a} name="phone" type="tel" inputMode="tel" className={fieldCls} placeholder="Your contact number" autoComplete="tel" value={values.phone} onChange={set("phone")} required />
          </WithIcon>
        )}
      </Field>
      <Field id="res-email" label="Email address" error={errors.email}>
        {(a) => (
          <WithIcon icon="mail">
            <input {...a} name="email" type="email" inputMode="email" className={fieldCls} placeholder="you@example.com" autoComplete="email" value={values.email} onChange={set("email")} required />
          </WithIcon>
        )}
      </Field>
      <Field id="res-date" label="Your visit date" error={errors.date}>
        {(a) => (
          <WithIcon icon="calendar">
            <input
              {...a}
              name="date"
              type="date"
              className={clsx(fieldCls, "[color-scheme:light]")}
              min={bounds?.min}
              max={bounds?.max}
              value={values.date}
              onChange={set("date")}
              required
            />
          </WithIcon>
        )}
      </Field>
      <Field id="res-time" label="Preferred time" error={errors.time}>
        {(a) => (
          <WithIcon icon="clock">
          <select {...a} name="time" className={fieldCls} value={values.time} onChange={set("time")} required>
            <option value="">Choose a time</option>
            {SLOTS.map((s) => (
              <option key={s} value={s} disabled={slotUnavailable(s)}>
                {formatSlot(s)}
              </option>
            ))}
          </select>
          </WithIcon>
        )}
      </Field>
      <Field id="res-guestCount" label="Number of guests" error={errors.guestCount}>
        {(a) => (
          <WithIcon icon="users">
            <select {...a} name="guestCount" className={fieldCls} value={values.guestCount} onChange={set("guestCount")} required>
              {GUESTS.map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "guest" : "guests"}
                </option>
              ))}
            </select>
          </WithIcon>
        )}
      </Field>
      <Field id="res-specialRequests" label="Any special requests?" optional error={errors.specialRequests} className="sm:col-span-2">
        {(a) => (
          <WithIcon icon="note">
            <textarea
              {...a}
              name="specialRequests"
              rows={1}
              maxLength={1000}
              // Grows with its text (no inner scrollbar); one line when empty.
              className={clsx(fieldCls, "resize-none overflow-hidden [field-sizing:content]")}
              placeholder="Celebration, seating preference or anything we should know…"
              value={values.specialRequests}
              onChange={set("specialRequests")}
            />
          </WithIcon>
        )}
      </Field>

      {/* Last row: the note on the left, the button on the right. */}
      <div className="mt-1 flex flex-col-reverse gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p id="res-note" className="text-xs leading-relaxed text-ink-soft">
          Planning for a larger gathering? Give us a call.{" "}
          <a href={`tel:${site.phone.tel}`} className="link-line whitespace-nowrap text-charcoal">
            {site.phone.display}
          </a>
        </p>
        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="btn shrink-0 rounded-[3px] bg-terracotta px-8 text-ivory hover:bg-terracotta-deep disabled:opacity-70"
        >
          {submitting ? (
            <>
              <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-ivory/40 border-t-ivory" />
              Sending…
            </>
          ) : (
            <>
              Reserve your table <ArrowRight />
            </>
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
              className="border-l-2 border-[#b3311d] pl-4 text-sm text-[#b3311d]"
            >
              {status.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

/** Underlined field on the ivory card: room on the left for the icon, a terracotta line on focus. */
const fieldCls =
  "field min-h-[2.6rem] py-2 pl-7 placeholder:text-ink-soft/60 border-b-charcoal/25 focus:border-b-terracotta focus:shadow-[0_1px_0_0_var(--color-terracotta)]";

type IconName = "user" | "mail" | "phone" | "calendar" | "clock" | "users" | "note";

/** Small turquoise line icons, one per field. */
const ICONS: Record<IconName, React.ReactNode> = {
  user: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0" />,
  mail: <path d="M3.5 6.5h17v11h-17zM4 7l8 6 8-6" />,
  phone: <path d="M6.5 3.5h3l1.5 4-2 1.3a10 10 0 0 0 5.2 5.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />,
  calendar: <path d="M4 6.5h16v13H4zM4 10.5h16M8.5 4v4M15.5 4v4" />,
  clock: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13.5V12l3 2" />,
  users: <path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 9a6 6 0 0 1 12 0m1.5-9a3 3 0 1 0-1-5.8M21 20a5.5 5.5 0 0 0-4-5.3" />,
  note: <path d="M5 4.5h14v15H5zM8.5 9h7M8.5 12.5h7M8.5 16h4" />,
};

function WithIcon({ icon, children }: { icon: IconName; children: React.ReactNode }) {
  return (
    <div className="relative">
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="pointer-events-none absolute left-0 top-[0.8rem] size-4 text-turquoise-deep"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {ICONS[icon]}
      </svg>
      {children}
    </div>
  );
}
