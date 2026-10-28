import { Router } from "express";
import { handleGetTestimonials } from "../controllers/testimonials.controller";

const router = Router();

router.get("/", handleGetTestimonials);

export default router;

