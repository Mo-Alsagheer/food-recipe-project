import joi from "joi";
import { objectIdValidation } from "../../utils/customValidation.js";

export const createCategorySchema = joi.object({
    body: joi.object({
        name: joi.string().trim().min(2).max(50).required().messages({
            "string.empty": "Category name is required",
            "string.min": "Category name must be at least 2 characters long",
        }),
        description: joi.string().trim().min(5).max(500).required().messages({
            "string.empty": "Category description is required",
            "string.min": "Category description must be at least 5 characters long",
        })
    }).unknown(false),
    params: joi.object().unknown(false),
    query: joi.object().unknown(false)
}).unknown(false);

export const updateCategorySchema = joi.object({
    params: joi.object({
        id: objectIdValidation.required(),
    }).unknown(false),
    body: joi.object({
        name: joi.string().trim().min(2).max(50).optional().messages({
            "string.min": "Category name must be at least 2 characters long",
        }),
        description: joi.string().trim().min(5).max(500).optional().messages({
            "string.min": "Category description must be at least 5 characters long",
        })
    }).min(1).unknown(false),
    query: joi.object().unknown(false)
}).unknown(false);

export const getCategorySchema = joi.object({
    params: joi.object({
        id: objectIdValidation.required(),
    }).unknown(false),
    body: joi.object().unknown(false),
    query: joi.object().unknown(false)
}).unknown(false);

export const deleteCategorySchema = joi.object({
    params: joi.object({
        id: objectIdValidation.required(),
    }).unknown(false),
    body: joi.object().unknown(false),
    query: joi.object().unknown(false)
}).unknown(false);

export const getCategoriesSchema = joi.object({
    params: joi.object().unknown(false),
    body: joi.object().unknown(false),
    query: joi.object().unknown(false)
}).unknown(false);
