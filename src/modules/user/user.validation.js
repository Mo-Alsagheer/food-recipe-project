import joi from "joi";
import { objectIdValidation, passwordValidation } from "../../utils/customValidation.js";

export const createUserSchema = joi.object({
    body: joi.object({
        name: joi.string().trim().min(2).max(50).required().messages({
            "string.empty": "Name is required",
            "string.min": "Name must be at least 2 characters long",
        }),
        email: joi.string().trim().email().lowercase().required().messages({
            "string.empty": "Email is required",
            "string.email": "Please provide a valid email address",
        }),
        password: passwordValidation.required(),
        role: joi.string().valid("admin", "user").optional(),
        status: joi.string().valid("active", "inactive").optional()
    }).unknown(false),
    params: joi.object().unknown(false),
    query: joi.object().unknown(false)
}).unknown(false);

export const updateUserSchema = joi.object({
    params: joi.object({
        id: objectIdValidation.required(),
    }).unknown(false),
    body: joi.object({
        name: joi.string().trim().min(2).max(50).optional().messages({
            "string.min": "Name must be at least 2 characters long",
        }),
        email: joi.string().trim().email().lowercase().optional().messages({
            "string.email": "Please provide a valid email address",
        }),
        password: passwordValidation.optional(),
        // Note: Sensitive fields; ensure authorization middleware is used before allowing updates
        role: joi.string().valid("admin", "user").optional(),
        status: joi.string().valid("active", "inactive").optional()
    }).min(1).unknown(false),
    query: joi.object().unknown(false)
}).unknown(false);

export const getUserSchema = joi.object({
    params: joi.object({
        id: objectIdValidation.required(),
    }).unknown(false),
    body: joi.object().unknown(false),
    query: joi.object().unknown(false)
}).unknown(false);

export const deleteUserSchema = joi.object({
    params: joi.object({
        id: objectIdValidation.required(),
    }).unknown(false),
    body: joi.object().unknown(false),
    query: joi.object().unknown(false)
}).unknown(false);

export const getUsersSchema = joi.object({
    params: joi.object().unknown(false),
    body: joi.object().unknown(false),
    query: joi.object().unknown(false) // Add query validations here later if pagination/filtering is implemented
}).unknown(false);
