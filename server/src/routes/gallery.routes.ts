import { Router } from "express";
import { handleGetGallery } from "../controllers/gallery.controller";

const router = Router();

router.get("/", handleGetGallery);

export default router;

