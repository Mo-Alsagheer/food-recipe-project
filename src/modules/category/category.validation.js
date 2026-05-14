import joi from "joi";
import { objectIdValidation } from "../../utils/customValidation.js";

export const createCategorySchema = joi.object({
    name: joi.string().min(2).max(50).required().messages({
        "string.empty": "Category name is required",
        "string.min": "Category name must be at least 2 characters long",
    }),
    description: joi.string().min(5).max(500).required().messages({
        "string.empty": "Category description is required",
        "string.min": "Category description must be at least 5 characters long",
    })
});

export const updateCategorySchema = joi.object({
    id: objectIdValidation.required(),
    name: joi.string().min(2).max(50).optional().messages({
        "string.min": "Category name must be at least 2 characters long",
    }),
    description: joi.string().min(5).max(500).optional().messages({
        "string.min": "Category description must be at least 5 characters long",
    })
});

export const getCategorySchema = joi.object({
    id: objectIdValidation.required(),
});

export const deleteCategorySchema = joi.object({
    id: objectIdValidation.required(),
});
