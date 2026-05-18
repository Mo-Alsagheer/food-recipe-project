import express from "express";
import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from "./category.controller.js";
import { validate } from "../../middleware/validate.js";
import { createCategorySchema, updateCategorySchema, getCategorySchema, deleteCategorySchema, getCategoriesSchema } from "./category.validation.js";

const router = express.Router();

router.post("/", validate(createCategorySchema), createCategory);
router.get("/", validate(getCategoriesSchema), getCategories);
router.get("/:id", validate(getCategorySchema), getCategoryById);
router.put("/:id", validate(updateCategorySchema), updateCategory);
router.delete("/:id", validate(deleteCategorySchema), deleteCategory);

export default router;
