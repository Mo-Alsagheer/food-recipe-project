import joi from "joi";
import { objectIdValidation } from "../../utils/customValidation.js";

export const createFavoriteSchema = joi.object({
    user: objectIdValidation.required().messages({
        "any.required": "User ID is required"
    }),
    recipe: objectIdValidation.required().messages({
        "any.required": "Recipe ID is required"
    })
});

export const getFavoriteSchema = joi.object({
    id: objectIdValidation.required(),
});

export const deleteFavoriteSchema = joi.object({
    id: objectIdValidation.required(),
});
