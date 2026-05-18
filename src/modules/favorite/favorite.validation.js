import joi from "joi";
import { objectIdValidation } from "../../utils/customValidation.js";

export const createFavoriteSchema = joi.object({
    body: joi.object({
        user: objectIdValidation.required().messages({
            "any.required": "User ID is required"
        }),
        recipe: objectIdValidation.required().messages({
            "any.required": "Recipe ID is required"
        })
    }).unknown(false),
    params: joi.object().unknown(false),
    query: joi.object().unknown(false)
}).unknown(false);

export const getFavoriteSchema = joi.object({
    params: joi.object({
        id: objectIdValidation.required(),
    }).unknown(false),
    body: joi.object().unknown(false),
    query: joi.object().unknown(false)
}).unknown(false);

export const deleteFavoriteSchema = joi.object({
    params: joi.object({
        id: objectIdValidation.required(),
    }).unknown(false),
    body: joi.object().unknown(false),
    query: joi.object().unknown(false)
}).unknown(false);

export const getFavoritesSchema = joi.object({
    params: joi.object().unknown(false),
    body: joi.object().unknown(false),
    query: joi.object().unknown(false)
}).unknown(false);
