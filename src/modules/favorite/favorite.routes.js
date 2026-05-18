import express from "express";
import { createFavorite, getFavorites, getFavoriteById, deleteFavorite } from "./favorite.controller.js";
import { validate } from "../../middleware/validate.js";
import { createFavoriteSchema, getFavoriteSchema, deleteFavoriteSchema, getFavoritesSchema } from "./favorite.validation.js";

const router = express.Router();

router.post("/", validate(createFavoriteSchema), createFavorite);
router.get("/", validate(getFavoritesSchema), getFavorites);
router.get("/:id", validate(getFavoriteSchema), getFavoriteById);
router.delete("/:id", validate(deleteFavoriteSchema), deleteFavorite);

export default router;
