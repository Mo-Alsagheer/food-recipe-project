import fs from "fs";
import { catchError } from "../../utils/catchError.js";
import { AppError } from "../../utils/AppError.js";
import * as userService from "../user/user.service.js";
import * as recipeService from "../recipe/recipe.service.js";
import * as favoriteService from "../favorite/favorite.service.js";
import * as authService from "../auth/auth.service.js";
import Recipe from "../../models/Recipe.js";

export const adminLogin = catchError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(new AppError("Email and password are required", 400));

    const { token, user } = await authService.signinUser(email, password);

    if (user.role !== "admin") {
        return next(new AppError("Access denied. Admin accounts only.", 403));
    }

    res.status(200).json({ status: "success", token, data: { user } });
});

export const getDashboard = catchError(async (req, res, next) => {
    const recipesPerCategory = await Recipe.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "category" } },
        { $unwind: { path: "$category", preserveNullAndEmpty: true } },
        { $project: { _id: 0, category: { $ifNull: ["$category.name", "Uncategorized"] }, count: 1 } },
        { $sort: { count: -1 } },
    ]);

    res.status(200).json({ status: "success", data: { recipesPerCategory } });
});

export const getAdminFavorites = catchError(async (req, res, next) => {
    const { page, limit } = req.query;
    const result = await favoriteService.getAllFavoritesService({ page, limit });
    res.status(200).json({ status: "success", ...result });
});

// Recipe management
export const adminGetRecipes = catchError(async (req, res, next) => {
    const { page, limit, category, search, tags } = req.query;
    const result = await recipeService.getRecipesService({ page, limit, category, search, tags });
    res.status(200).json({ status: "success", ...result });
});

export const adminCreateRecipe = catchError(async (req, res, next) => {
    const { title, description, category, ingredients, steps, tags } = req.body;

    if (!title || !description || !category || !ingredients || !steps) {
        if (req.file) fs.unlink(req.file.path, () => {});
        return next(new AppError("title, description, category, ingredients, and steps are required", 400));
    }

    const image = req.file ? req.file.path.replaceAll("\\", "/") : null;

    const recipe = await recipeService.createRecipeService({
        title, description, category, ingredients, steps, tags, image,
        createdBy: req.user._id,
    });
    res.status(201).json({ status: "success", data: { recipe } });
});

export const adminUpdateRecipe = catchError(async (req, res, next) => {
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

export const adminDeleteRecipe = catchError(async (req, res, next) => {
    const recipe = await recipeService.deleteRecipeService(req.params.id);
    if (!recipe) return next(new AppError("Recipe not found", 404));
    if (recipe.image) fs.unlink(recipe.image, () => {});
    res.status(200).json({ status: "success", message: "Recipe deleted successfully" });
});

// User management
export const adminGetUsers = catchError(async (req, res, next) => {
    const { page, limit } = req.query;
    const result = await userService.getUsersService({ page, limit });
    res.status(200).json({ status: "success", ...result });
});

export const toggleUserStatus = catchError(async (req, res, next) => {
    const user = await userService.toggleUserStatusService(req.params.id);
    if (!user) return next(new AppError("User not found", 404));
    res.status(200).json({ status: "success", data: { user } });
});
