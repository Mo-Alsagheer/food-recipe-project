import express from "express";
import { getRecipes, getRecipeById } from "./recipe.controller.js";
import { createFavorite, deleteFavorite } from "../favorite/favorite.controller.js";
import { validate } from "../../middleware/validate.js";
import { protect } from "../../middleware/auth.js";
import { getRecipeSchema, getRecipesSchema } from "./recipe.validation.js";
import { favoriteRecipeSchema } from "../favorite/favorite.validation.js";

const router = express.Router();

router.get("/", validate(getRecipesSchema), getRecipes);
router.get("/:id", validate(getRecipeSchema), getRecipeById);

router.post("/:id/favourite", protect, validate(favoriteRecipeSchema), createFavorite);
router.delete("/:id/favourite", protect, validate(favoriteRecipeSchema), deleteFavorite);

export default router;
