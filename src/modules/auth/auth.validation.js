import joi from "joi";

export const signUpSchema = joi.object({
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
});

export const signInSchema = joi.object({
    email: joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email address",
    }),
    password: joi.string().required().messages({
        "string.empty": "Password is required",
    }),
});
