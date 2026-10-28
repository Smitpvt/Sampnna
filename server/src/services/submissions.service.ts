import { db } from "../lib/db";
import { restaurantInstant } from "../lib/time";
import type { ContactInput, ReservationInput } from "../lib/validation";

const WINDOW_MS = 60 * 60 * 1000;
/** Per hashed IP, per hour — durable across process restarts. */
const HOURLY_LIMIT = { reservation: 5, contact: 5 };

export async function recentSubmissionCount(kind: "reservation" | "contact", ipHash: string) {
  const since = new Date(Date.now() - WINDOW_MS);
  const where = { ipHash, createdAt: { gte: since } };
  const count = kind === "reservation" ? await db.reservation.count({ where }) : await db.contactEnquiry.count({ where });
  return { count, limited: count >= HOURLY_LIMIT[kind] };
}

/**
 * Stores a reservation REQUEST. Status is always PENDING: nothing here
 * checks table availability, so nothing here may claim a confirmation.
 */
export async function createReservationRequest(input: ReservationInput, ipHash: string) {
  // Same guest, same slot, already pending → don't create a duplicate.
  const existing = await db.reservation.findFirst({
    where: {
      email: input.email,
      date: new Date(`${input.date}T00:00:00Z`),
      time: input.time,
      status: { in: ["PENDING", "CONFIRMED"] },
    },
    select: { id: true, status: true },
  });
  if (existing) return { id: existing.id, status: existing.status, duplicate: true };

  const row = await db.reservation.create({
    data: {
      guestName: input.guestName,
      email: input.email,
      phone: input.phone,
      date: new Date(`${input.date}T00:00:00Z`),
      time: input.time,
      guestCount: input.guestCount,
      specialRequests: input.specialRequests || null,
      status: "PENDING",
      ipHash,
    },
    select: { id: true, status: true },
  });
  return { ...row, duplicate: false, startsAt: restaurantInstant(input.date, input.time).toISOString() };
}

export async function createContactEnquiry(input: ContactInput, ipHash: string) {
  return db.contactEnquiry.create({
    data: { name: input.name, email: input.email, phone: input.phone ?? null, message: input.message, ipHash },
    select: { id: true, status: true },
  });
}

