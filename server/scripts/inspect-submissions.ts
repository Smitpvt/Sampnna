// Quick look at stored submissions (no admin UI yet): npx tsx --env-file=.env scripts/inspect-submissions.ts
import { PrismaClient } from "@prisma/client";

async function main() {
  const db = new PrismaClient();
  const [reservations, enquiries] = await Promise.all([
    db.reservation.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    db.contactEnquiry.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
  ]);
  console.table(
    reservations.map((r) => ({
      id: r.id.slice(-6),
      name: r.guestName,
      email: r.email,
      date: r.date.toISOString().slice(0, 10),
      time: r.time,
      guests: r.guestCount,
      status: r.status,
      requests: r.specialRequests,
    })),
  );
  console.table(enquiries.map((e) => ({ id: e.id.slice(-6), name: e.name, email: e.email, status: e.status, message: e.message.slice(0, 40) })));
  await db.$disconnect();
}

main();
