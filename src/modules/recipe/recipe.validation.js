import joi from "joi";
import { objectIdValidation } from "../../utils/customValidation.js";

const fileValidation = joi.object({
    fieldname: joi.string().required(),
    originalname: joi.string().pattern(/\.(jpg|jpeg|png|webp|gif)$/i).required().messages({
        "string.pattern.base": "File extension must be jpg, jpeg, png, webp, or gif",
    }),
    encoding: joi.string().required(),
    mimetype: joi.string().valid("image/jpeg", "image/png", "image/webp", "image/gif").required().messages({
        "any.only": "Only jpeg, png, webp, and gif image formats are allowed",
    }),
    size: joi.number().max(5 * 1024 * 1024).required().messages({
        "number.max": "File size must not exceed 5MB",
    }),
    destination: joi.string().optional(),
    filename: joi.string().optional(),
    path: joi.string().optional(),
    buffer: joi.any().optional(),
}).unknown(true);

const paginationQuery = {
    page: joi.number().integer().min(1).optional(),
    limit: joi.number().integer().min(1).max(50).optional(),
};

export const createRecipeSchema = joi.object({
    body: joi.object({
        title: joi.string().trim().min(3).max(100).required().messages({
            "string.empty": "Title is required",
            "string.min": "Title must be at least 3 characters long",
        }),
        description: joi.string().trim().min(10).required().messages({
            "string.empty": "Description is required",
            "string.min": "Description must be at least 10 characters long",
        }),
        ingredients: joi.array().items(joi.string().trim()).min(1).required().messages({
            "array.min": "At least one ingredient is required",
            "any.required": "Ingredients are required",
        }),
        steps: joi.array().items(joi.string().trim()).min(1).required().messages({
            "array.min": "At least one step is required",
            "any.required": "Steps are required",
        }),
        tags: joi.array().items(joi.string().trim()).optional(),
        category: objectIdValidation.required().messages({
            "any.required": "Category ID is required",
        }),
    }).unknown(false),
    file: fileValidation.optional(),
    params: joi.object().unknown(false),
    query: joi.object().unknown(false),
}).unknown(false);

export const updateRecipeSchema = joi.object({
    params: joi.object({
        id: objectIdValidation.required(),
    }).unknown(false),
    body: joi.object({
        title: joi.string().trim().min(3).max(100).optional(),
        description: joi.string().trim().min(10).optional(),
        ingredients: joi.array().items(joi.string().trim()).min(1).optional(),
        steps: joi.array().items(joi.string().trim()).min(1).optional(),
        tags: joi.array().items(joi.string().trim()).optional(),
        category: objectIdValidation.optional(),
    }).min(1).unknown(false),
    file: fileValidation.optional(),
    query: joi.object().unknown(false),
}).unknown(false);

export const getRecipeSchema = joi.object({
    params: joi.object({
        id: objectIdValidation.required(),
    }).unknown(false),
    body: joi.object().unknown(false),
    query: joi.object().unknown(false),
}).unknown(false);

export const deleteRecipeSchema = joi.object({
    params: joi.object({
        id: objectIdValidation.required(),
    }).unknown(false),
    body: joi.object().unknown(false),
    query: joi.object().unknown(false),
}).unknown(false);

export const getRecipesSchema = joi.object({
    params: joi.object().unknown(false),
    body: joi.object().unknown(false),
    query: joi.object({
        ...paginationQuery,
        category: objectIdValidation.optional(),
        search: joi.string().trim().optional(),
        tags: joi.alternatives().try(
            joi.array().items(joi.string().trim()),
            joi.string().trim()
        ).optional(),
    }).unknown(false),
}).unknown(false);
