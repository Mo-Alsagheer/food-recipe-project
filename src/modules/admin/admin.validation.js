import joi from "joi";
import { objectIdValidation } from "../../utils/customValidation.js";

const paginationQuery = {
    page: joi.number().integer().min(1).optional(),
    limit: joi.number().integer().min(1).max(50).optional(),
};

const fileValidation = joi.object({
    fieldname: joi.string().required(),
    originalname: joi.string().pattern(/\.(jpg|jpeg|png|webp|gif)$/i).required(),
    encoding: joi.string().required(),
    mimetype: joi.string().valid("image/jpeg", "image/png", "image/webp", "image/gif").required(),
    size: joi.number().max(5 * 1024 * 1024).required(),
    destination: joi.string().optional(),
    filename: joi.string().optional(),
    path: joi.string().optional(),
    buffer: joi.any().optional(),
}).unknown(true);

export const adminLoginSchema = joi.object({
    body: joi.object({
        email: joi.string().trim().email().lowercase().required(),
        password: joi.string().required(),
    }).unknown(false),
    params: joi.object().unknown(false),
    query: joi.object().unknown(false),
}).unknown(false);

export const adminRecipesQuerySchema = joi.object({
    params: joi.object().unknown(false),
    body: joi.object().unknown(false),
    query: joi.object({
        ...paginationQuery,
        category: objectIdValidation.optional(),
        search: joi.string().trim().optional(),
        tags: joi.alternatives().try(
            joi.array().items(joi.string().trim()),
            joi.string().trim()
        ).optional(),
    }).unknown(false),
}).unknown(false);

export const adminCreateRecipeSchema = joi.object({
    body: joi.object({
        title: joi.string().trim().min(3).max(100).required(),
        description: joi.string().trim().min(10).required(),
        ingredients: joi.array().items(joi.string().trim()).min(1).required(),
        steps: joi.array().items(joi.string().trim()).min(1).required(),
        tags: joi.array().items(joi.string().trim()).optional(),
        category: objectIdValidation.required(),
    }).unknown(false),
    file: fileValidation.optional(),
    params: joi.object().unknown(false),
    query: joi.object().unknown(false),
}).unknown(false);

export const adminUpdateRecipeSchema = joi.object({
    params: joi.object({ id: objectIdValidation.required() }).unknown(false),
    body: joi.object({
        title: joi.string().trim().min(3).max(100).optional(),
        description: joi.string().trim().min(10).optional(),
        ingredients: joi.array().items(joi.string().trim()).min(1).optional(),
        steps: joi.array().items(joi.string().trim()).min(1).optional(),
        tags: joi.array().items(joi.string().trim()).optional(),
        category: objectIdValidation.optional(),
    }).min(1).unknown(false),
    file: fileValidation.optional(),
    query: joi.object().unknown(false),
}).unknown(false);

export const adminRecipeIdSchema = joi.object({
    params: joi.object({ id: objectIdValidation.required() }).unknown(false),
    body: joi.object().unknown(false),
    query: joi.object().unknown(false),
}).unknown(false);

export const adminUsersQuerySchema = joi.object({
    params: joi.object().unknown(false),
    body: joi.object().unknown(false),
    query: joi.object({ ...paginationQuery }).unknown(false),
}).unknown(false);

export const adminUserStatusSchema = joi.object({
    params: joi.object({ id: objectIdValidation.required() }).unknown(false),
    body: joi.object().unknown(false),
    query: joi.object().unknown(false),
}).unknown(false);

export const adminFavouritesQuerySchema = joi.object({
    params: joi.object().unknown(false),
    body: joi.object().unknown(false),
    query: joi.object({ ...paginationQuery }).unknown(false),
}).unknown(false);
