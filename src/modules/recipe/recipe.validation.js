import joi from "joi";
import { objectIdValidation } from "../../utils/customValidation.js";

const fileValidation = joi.object({
    fieldname: joi.string().required(),
    originalname: joi.string().required(),
    encoding: joi.string().required(),
    mimetype: joi.string().valid("image/jpeg", "image/png", "image/webp", "image/gif").required().messages({
        "any.only": "Only jpeg, png, webp, and gif image formats are allowed"
    }),
    size: joi.number().max(5 * 1024 * 1024).required().messages({
        "number.max": "File size must not exceed 5MB"
    }),
    destination: joi.string().optional(),
    filename: joi.string().optional(),
    path: joi.string().optional(),
    buffer: joi.any().optional()
}).unknown(true); // Allow other fields multer might add

export const createRecipeSchema = joi.object({
    title: joi.string().min(3).max(100).required().messages({
        "string.empty": "Title is required",
        "string.min": "Title must be at least 3 characters long",
    }),
    description: joi.string().min(10).required().messages({
        "string.empty": "Description is required",
        "string.min": "Description must be at least 10 characters long",
    }),
    category: objectIdValidation.required().messages({
        "any.required": "Category ID is required"
    }),
    author: objectIdValidation.required().messages({
        "any.required": "Author ID is required"
    }),
    file: fileValidation.optional() // Image is optional in the Mongoose schema, but you can make it required here if needed
});

export const updateRecipeSchema = joi.object({
    id: objectIdValidation.required(),
    title: joi.string().min(3).max(100).optional().messages({
        "string.min": "Title must be at least 3 characters long",
    }),
    description: joi.string().min(10).optional().messages({
        "string.min": "Description must be at least 10 characters long",
    }),
    category: objectIdValidation.optional(),
    author: objectIdValidation.optional(),
    file: fileValidation.optional()
});

export const getRecipeSchema = joi.object({
    id: objectIdValidation.required(),
});

export const deleteRecipeSchema = joi.object({
    id: objectIdValidation.required(),
});
