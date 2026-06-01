import joi from "joi";
import { passwordValidation } from "../../utils/customValidation.js";

export const signUpSchema = joi.object({
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
    }).unknown(false),
    params: joi.object().unknown(false),
    query: joi.object().unknown(false)
}).unknown(false);

export const signInSchema = joi.object({
    body: joi.object({
        email: joi.string().trim().email().lowercase().required().messages({
            "string.empty": "Email is required",
            "string.email": "Please provide a valid email address",
        }),
        password: joi.string().required().messages({
            "string.empty": "Password is required",
        }),
    }).unknown(false),
    params: joi.object().unknown(false),
    query: joi.object().unknown(false)
}).unknown(false);

export const forgotPasswordSchema = joi.object({
    body: joi.object({
        email: joi.string().trim().email().lowercase().required().messages({
            "string.empty": "Email is required",
            "string.email": "Please provide a valid email address",
        }),
    }).unknown(false),
    params: joi.object().unknown(false),
    query: joi.object().unknown(false),
}).unknown(false);

export const resetPasswordSchema = joi.object({
    body: joi.object({
        email: joi.string().trim().email().lowercase().required(),
        otp: joi.string().length(6).pattern(/^\d+$/).required().messages({
            "string.length": "OTP must be 6 digits",
            "string.pattern.base": "OTP must be numeric",
        }),
        password: passwordValidation.required(),
    }).unknown(false),
    params: joi.object().unknown(false),
    query: joi.object().unknown(false),
}).unknown(false);
