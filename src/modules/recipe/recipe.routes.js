import express from "express";
import { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe } from "./recipe.controller.js";
import { createFavorite, deleteFavorite } from "../favorite/favorite.controller.js";
import { upload } from "../../utils/upload.js";
import { validate } from "../../middleware/validate.js";
import { protect, restrictTo } from "../../middleware/auth.js";
import { createRecipeSchema, updateRecipeSchema, getRecipeSchema, deleteRecipeSchema, getRecipesSchema } from "./recipe.validation.js";
import { favoriteRecipeSchema } from "../favorite/favorite.validation.js";

const router = express.Router();

router.post("/", protect, restrictTo("admin"), upload.single("image"), validate(createRecipeSchema), createRecipe);
router.get("/", validate(getRecipesSchema), getRecipes);
router.get("/:id", validate(getRecipeSchema), getRecipeById);
router.put("/:id", protect, restrictTo("admin"), upload.single("image"), validate(updateRecipeSchema), updateRecipe);
router.delete("/:id", protect, restrictTo("admin"), validate(deleteRecipeSchema), deleteRecipe);

// Favorite endpoints
router.post("/:id/favourite", protect, validate(favoriteRecipeSchema), createFavorite);
router.delete("/:id/favourite", protect, validate(favoriteRecipeSchema), deleteFavorite);

export default router;
