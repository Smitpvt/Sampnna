import type { NextRequest } from "next/server";
import { fail } from "@/lib/http";
import { handleFormPost } from "@/lib/form-handler";
import { contactSchema } from "@/lib/validation";
import { createContactEnquiry } from "@/services/submissions";

export const dynamic = "force-dynamic";

/** POST /api/contact — store a contact enquiry. */
export async function POST(req: NextRequest) {
  return handleFormPost(req, "contact", contactSchema, createContactEnquiry);
}

export function GET() {
  return fail(405, "method_not_allowed", "Use POST to send an enquiry.", undefined, { Allow: "POST" });
}
