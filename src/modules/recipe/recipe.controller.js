import * as recipeService from "./recipe.service.js";
import fs from "fs";
import { catchError } from "../../utils/catchError.js";
import { AppError } from "../../utils/AppError.js";

export const createRecipe = catchError(async (req, res, next) => {
    const { title, description, category, ingredients, steps, tags } = req.body;

    if (!title || !description || !category || !ingredients || !steps) {
        if (req.file) fs.unlink(req.file.path, () => {});
        return next(new AppError("title, description, category, ingredients, and steps are required", 400));
    }

    const image = req.file ? req.file.path.replaceAll("\\", "/") : null;

    const recipe = await recipeService.createRecipeService({
        title,
        description,
        category,
        ingredients,
        steps,
        tags,
        image,
        createdBy: req.user._id,
    });
    res.status(201).json({ status: "success", data: { recipe } });
});

export const getRecipes = catchError(async (req, res, next) => {
    const { page, limit, category, search, tags } = req.query;
    const result = await recipeService.getRecipesService({ page, limit, category, search, tags });
    res.status(200).json({ status: "success", ...result });
});

export const getRecipeById = catchError(async (req, res, next) => {
    const recipe = await recipeService.getRecipeByIdService(req.params.id);
    if (!recipe) return next(new AppError("Recipe not found", 404));
    res.status(200).json({ status: "success", data: { recipe } });
});

export const updateRecipe = catchError(async (req, res, next) => {
    const { title, description, category, ingredients, steps, tags } = req.body;
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (ingredients !== undefined) updateData.ingredients = ingredients;
    if (steps !== undefined) updateData.steps = steps;
    if (tags !== undefined) updateData.tags = tags;

    let oldImage = null;
    if (req.file) {
        updateData.image = req.file.path.replaceAll("\\", "/");
        const existing = await recipeService.getRecipeByIdService(req.params.id);
        if (existing?.image) oldImage = existing.image;
    }

    const recipe = await recipeService.updateRecipeService(req.params.id, updateData);
    if (!recipe) {
        if (req.file) fs.unlink(req.file.path, () => {});
        return next(new AppError("Recipe not found", 404));
    }

    if (oldImage) fs.unlink(oldImage, () => {});
    res.status(200).json({ status: "success", data: { recipe } });
});

export const deleteRecipe = catchError(async (req, res, next) => {
    const recipe = await recipeService.deleteRecipeService(req.params.id);
    if (!recipe) return next(new AppError("Recipe not found", 404));
    if (recipe.image) fs.unlink(recipe.image, () => {});
    res.status(200).json({ status: "success", message: "Recipe deleted successfully" });
});
