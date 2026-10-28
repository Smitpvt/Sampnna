import { z } from "zod";
import { reservationRules as rules } from "../config/site";
import { addDays, reservationSlots, restaurantInstant, restaurantNow } from "./time";

/** Trim, drop control characters and collapse runs of whitespace. */
export const clean = (value: string, { multiline = false } = {}) => {
  const stripped = value.replace(multiline ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, "");
  return (multiline ? stripped.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n") : stripped.replace(/\s+/g, " ")).trim();
};

const text = (min: number, max: number, label: string) =>
  z
    .string({ error: `Please enter your ${label}.` })
    .transform((v) => clean(v))
    .pipe(
      z
        .string()
        .min(1, `Please enter your ${label}.`)
        .min(min, `${label[0].toUpperCase()}${label.slice(1)} is too short.`)
        .max(max, `Please keep this under ${max} characters.`),
    );

const email = z
  .string({ error: "Please enter your email address." })
  .transform((v) => clean(v).toLowerCase())
  .pipe(z.string().min(1, "Please enter your email address.").pipe(z.email("Please enter a valid email address.").max(254)));

/** Indian or international numbers: digits with optional +, spaces, dashes, brackets. */
const phone = z
  .string({ error: "Please enter a phone number." })
  .transform((v) => clean(v))
  .pipe(
    z
      .string()
      .min(1, "Please enter a phone number.")
      .regex(/^\+?[\d\s\-()]{7,20}$/, "Please enter a valid phone number.")
      .refine((v) => v.replace(/\D/g, "").length >= 10, "Please include the full number (at least 10 digits)."),
  );

/** Anti-spam fields every public form carries. */
const antiSpam = {
  /** Honeypot: hidden from people, often filled by bots. Must be empty. */
  website: z.string().max(0).optional().or(z.literal("")),
  /** Epoch ms when the form was rendered. */
  startedAt: z.coerce.number().int().positive(),
};

const SLOTS = new Set(reservationSlots());

export const reservationSchema = z
  .object({
    guestName: text(2, 120, "name"),
    email,
    phone,
    date: z.string({ error: "Please choose a date." }).regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a date."),
    time: z.string({ error: "Please choose a time." }).refine((v) => SLOTS.has(v), "Please choose a time."),
    guestCount: z.coerce
      .number({ error: "Please choose the number of guests." })
      .int()
      .min(rules.minGuests, "Please choose the number of guests.")
      .max(rules.maxGuests, `For more than ${rules.maxGuests} guests, please call us.`),
    specialRequests: z
      .string()
      .optional()
      .transform((v) => (v ? clean(v, { multiline: true }) : undefined))
      .pipe(z.string().max(1000, "Please keep requests under 1000 characters.").optional()),
    ...antiSpam,
  })
  .superRefine((v, ctx) => {
    const today = restaurantNow().date;
    if (Number.isNaN(Date.parse(`${v.date}T00:00:00Z`))) {
      ctx.addIssue({ code: "custom", path: ["date"], message: "Please choose a valid date." });
      return;
    }
    if (v.date < today) {
      ctx.addIssue({ code: "custom", path: ["date"], message: "That date has already passed." });
      return;
    }
    if (v.date > addDays(today, rules.maxDaysAhead)) {
      ctx.addIssue({ code: "custom", path: ["date"], message: `We take requests up to ${rules.maxDaysAhead} days ahead.` });
      return;
    }
    if (SLOTS.has(v.time)) {
      const earliest = Date.now() + rules.minLeadMinutes * 60_000;
      if (restaurantInstant(v.date, v.time).getTime() < earliest) {
        ctx.addIssue({ code: "custom", path: ["time"], message: "Please choose a time at least an hour from now." });
      }
    }
  });

export const contactSchema = z.object({
  name: text(2, 120, "name"),
  email,
  phone: z
    .string()
    .optional()
    .transform((v) => (v ? clean(v) : undefined))
    .pipe(z.union([z.undefined(), z.literal(""), z.string().regex(/^\+?[\d\s\-()]{7,20}$/, "Please enter a valid phone number.")]))
    .transform((v) => v || undefined),
  message: z
    .string({ error: "Please write a message." })
    .transform((v) => clean(v, { multiline: true }))
    .pipe(z.string().min(10, "Please write a little more (at least 10 characters).").max(2000, "Please keep this under 2000 characters.")),
  ...antiSpam,
});

export type ReservationInput = z.infer<typeof reservationSchema>;
export type ContactInput = z.infer<typeof contactSchema>;

export type FieldErrors = Record<string, string>;

export function fieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}

