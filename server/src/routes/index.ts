import { Router } from "express";
import contactRoutes from "./contact.routes";
import galleryRoutes from "./gallery.routes";
import menuRoutes from "./menu.routes";
import reservationsRoutes from "./reservations.routes";
import testimonialsRoutes from "./testimonials.routes";

const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({ ok: true, status: "healthy", timestamp: new Date().toISOString() });
});

apiRouter.use("/menu", menuRoutes);
apiRouter.use("/gallery", galleryRoutes);
apiRouter.use("/testimonials", testimonialsRoutes);
apiRouter.use("/reservations", reservationsRoutes);
apiRouter.use("/contact", contactRoutes);

export default apiRouter;

