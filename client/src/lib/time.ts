import { reservationRules as rules } from "@/config/site";

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const pad = (n: number) => String(n).padStart(2, "0");

/** All bookable "HH:MM" slots within the configured window. */
export function reservationSlots(): string[] {
  const out: string[] = [];
  for (let t = toMinutes(rules.firstSlot); t <= toMinutes(rules.lastSlot); t += rules.slotMinutes) {
    out.push(`${pad(Math.floor(t / 60))}:${pad(t % 60)}`);
  }
  return out;
}

/** Wall-clock "now" in the restaurant's time zone (IST has no DST). */
export function restaurantNow(now = new Date()) {
  const local = new Date(now.getTime() + rules.utcOffsetMinutes * 60_000);
  return {
    date: local.toISOString().slice(0, 10),
    minutes: local.getUTCHours() * 60 + local.getUTCMinutes(),
  };
}

/** UTC instant for a restaurant-local date ("YYYY-MM-DD") and time ("HH:MM"). */
export function restaurantInstant(date: string, time: string): Date {
  const [y, mo, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, mo - 1, d) + (toMinutes(time) - rules.utcOffsetMinutes) * 60_000);
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function formatSlot(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  return `${((h + 11) % 12) + 1}:${pad(m)} ${suffix}`;
}
