import joi from "joi";

export const objectIdValidation = joi.string().hex().length(24).messages({
    "string.hex": "Invalid ID format, must be a hexadecimal string",
    "string.length": "Invalid ID format, must be exactly 24 characters long",
    "string.empty": "ID is required",
    "any.required": "ID is required"
});

export const passwordValidation = joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).messages({
    "string.empty": "Password is required",
    "string.pattern.base": "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character"
});
