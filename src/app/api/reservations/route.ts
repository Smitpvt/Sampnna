import type { NextRequest } from "next/server";
import { fail } from "@/lib/http";
import { handleFormPost } from "@/lib/form-handler";
import { reservationSchema } from "@/lib/validation";
import { createReservationRequest } from "@/services/submissions";

export const dynamic = "force-dynamic";

/** POST /api/reservations — store a reservation request (status: PENDING). */
export async function POST(req: NextRequest) {
  return handleFormPost(req, "reservation", reservationSchema, async (data, ipHash) => {
    const r = await createReservationRequest(data, ipHash);
    return { id: r.id, status: r.status, duplicate: r.duplicate };
  });
}

export function GET() {
  return fail(405, "method_not_allowed", "Use POST to submit a reservation request.", undefined, { Allow: "POST" });
}
