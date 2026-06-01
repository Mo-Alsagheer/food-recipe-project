import express from "express";
import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from "./category.controller.js";
import { validate } from "../../middleware/validate.js";
import { protect, restrictTo } from "../../middleware/auth.js";
import { createCategorySchema, updateCategorySchema, getCategorySchema, deleteCategorySchema, getCategoriesSchema } from "./category.validation.js";

const router = express.Router();

router.post("/", protect, restrictTo("admin"), validate(createCategorySchema), createCategory);
router.get("/", validate(getCategoriesSchema), getCategories);
router.get("/:id", validate(getCategorySchema), getCategoryById);
router.put("/:id", protect, restrictTo("admin"), validate(updateCategorySchema), updateCategory);
router.delete("/:id", protect, restrictTo("admin"), validate(deleteCategorySchema), deleteCategory);

export default router;
