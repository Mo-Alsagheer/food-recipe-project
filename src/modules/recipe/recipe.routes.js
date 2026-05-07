import express from "express";
import { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe } from "./recipe.controller.js";
import { upload } from "../../utils/upload.js";

const router = express.Router();

router.post("/", upload.single("image"), createRecipe);
router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.put("/:id", upload.single("image"), updateRecipe);
router.delete("/:id", deleteRecipe);

export default router;
