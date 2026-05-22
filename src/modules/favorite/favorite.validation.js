import joi from "joi";
import { objectIdValidation } from "../../utils/customValidation.js";

export const favoriteRecipeSchema = joi.object({
    params: joi.object({
        id: objectIdValidation.required().messages({
            "any.required": "Recipe ID is required"
        })
    }).unknown(false),
    body: joi.object().unknown(false),
    query: joi.object().unknown(false)
}).unknown(false);

export const getMyFavoritesSchema = joi.object({
    params: joi.object().unknown(false),
    body: joi.object().unknown(false),
    query: joi.object().unknown(false)
}).unknown(false);
