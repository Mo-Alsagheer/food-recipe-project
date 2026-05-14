import joi from "joi";

export const objectIdValidation = joi.string().hex().length(24).messages({
    "string.hex": "Invalid ID format, must be a hexadecimal string",
    "string.length": "Invalid ID format, must be exactly 24 characters long",
    "string.empty": "ID is required"
});
