import * as recipeService from "./recipe.service.js";
import fs from "fs";
import { catchError } from "../../utils/catchError.js";
import { AppError } from "../../utils/AppError.js";

export const createRecipe = catchError(async (req, res, next) => {
    const { title, description, category, author } = req.body;
    
    if (!title || !description || !category || !author) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Failed to delete orphaned image:", err);
            });
        }
        return next(new AppError("All fields are required", 400));
    }

    const image = req.file ? req.file.path.replaceAll('\\', '/') : null;
    
    const recipe = await recipeService.createRecipeService({ title, description, image, category, author });
    res.status(201).json(recipe);
});

export const getRecipes = catchError(async (req, res, next) => {
    const recipes = await recipeService.getRecipesService();
    res.status(200).json(recipes);
});

export const getRecipeById = catchError(async (req, res, next) => {
    const recipe = await recipeService.getRecipeByIdService(req.params.id);
    if (!recipe) return next(new AppError("Recipe not found", 404));
    res.status(200).json(recipe);
});

export const updateRecipe = catchError(async (req, res, next) => {
    const { title, description, category } = req.body;
    const updateData = {};
    
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;

    let oldImage = null;
    if (req.file) {
        updateData.image = req.file.path.replaceAll('\\', '/');
        const existingRecipe = await recipeService.getRecipeByIdService(req.params.id);
        if (existingRecipe && existingRecipe.image) {
            oldImage = existingRecipe.image;
        }
    }

    const recipe = await recipeService.updateRecipeService(req.params.id, updateData);
    if (!recipe) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Failed to delete uploaded image on 404:", err);
            });
        }
        return next(new AppError("Recipe not found", 404));
    }

    if (oldImage) {
        fs.unlink(oldImage, (err) => {
            if (err) console.error("Failed to delete old image:", err);
        });
    }

    res.status(200).json(recipe);
});

export const deleteRecipe = catchError(async (req, res, next) => {
    const recipe = await recipeService.deleteRecipeService(req.params.id);
    if (!recipe) return next(new AppError("Recipe not found", 404));

    if (recipe.image) {
        fs.unlink(recipe.image, (err) => {
            if (err) console.error("Failed to delete image:", err);
        });
    }

    res.status(200).json({ message: "Recipe deleted successfully" });
});
