import { Router } from "express";
import { handleCreateContact } from "../controllers/contact.controller";
import { sendFail } from "../lib/http";

const router = Router();

router.post("/", handleCreateContact);
router.all("/", (_req, res) => {
  return sendFail(res, 405, "method_not_allowed", "Use POST to send an enquiry.", undefined, {
    Allow: "POST",
  });
});

export default router;

