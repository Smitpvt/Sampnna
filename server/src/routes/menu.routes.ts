import { Router } from "express";
import {
  handleGetCategoryBySlug,
  handleGetFeaturedDishes,
  handleGetMenu,
  handleListCategories,
  handleSearchDishes,
} from "../controllers/menu.controller";

const router = Router();

router.get("/", handleGetMenu);
router.get("/categories", handleListCategories);
router.get("/categories/:slug", handleGetCategoryBySlug);
router.get("/featured", handleGetFeaturedDishes);
router.get("/search", handleSearchDishes);

export default router;

