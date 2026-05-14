import joi from "joi";
import { objectIdValidation } from "../../utils/customValidation.js";

export const createUserSchema = joi.object({
    name: joi.string().min(2).max(50).required().messages({
        "string.empty": "Name is required",
        "string.min": "Name must be at least 2 characters long",
    }),
    email: joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email address",
    }),
    password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required().messages({
        "string.empty": "Password is required",
        "string.pattern.base": "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
    role: joi.string().valid("admin", "user").optional(),
    status: joi.string().valid("active", "inactive").optional()
});

export const updateUserSchema = joi.object({
    id: objectIdValidation.required(),
    name: joi.string().min(2).max(50).optional().messages({
        "string.min": "Name must be at least 2 characters long",
    }),
    email: joi.string().email().optional().messages({
        "string.email": "Please provide a valid email address",
    }),
    password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).optional().messages({
        "string.pattern.base": "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
    role: joi.string().valid("admin", "user").optional(),
    status: joi.string().valid("active", "inactive").optional()
});

export const getUserSchema = joi.object({
    id: objectIdValidation.required(),
});

export const deleteUserSchema = joi.object({
    id: objectIdValidation.required(),
});
