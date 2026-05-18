import express from "express";
import { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe } from "./recipe.controller.js";
import { upload } from "../../utils/upload.js";
import { validate } from "../../middleware/validate.js";
import { createRecipeSchema, updateRecipeSchema, getRecipeSchema, deleteRecipeSchema, getRecipesSchema } from "./recipe.validation.js";

const router = express.Router();

router.post("/", upload.single("image"), validate(createRecipeSchema), createRecipe);
router.get("/", validate(getRecipesSchema), getRecipes);
router.get("/:id", validate(getRecipeSchema), getRecipeById);
router.put("/:id", upload.single("image"), validate(updateRecipeSchema), updateRecipe);
router.delete("/:id", validate(deleteRecipeSchema), deleteRecipe);

export default router;
