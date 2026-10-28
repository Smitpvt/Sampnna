import { Router } from "express";
import { handleCreateReservation } from "../controllers/reservations.controller";
import { sendFail } from "../lib/http";

const router = Router();

router.post("/", handleCreateReservation);
router.all("/", (_req, res) => {
  return sendFail(res, 405, "method_not_allowed", "Use POST to submit a reservation request.", undefined, {
    Allow: "POST",
  });
});

export default router;

