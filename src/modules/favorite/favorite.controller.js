import * as favoriteService from "./favorite.service.js";
import * as recipeService from "../recipe/recipe.service.js";
import { catchError } from "../../utils/catchError.js";
import { AppError } from "../../utils/AppError.js";

export const createFavorite = catchError(async (req, res, next) => {
    const recipeId = req.params.id;
    const userId = req.user._id;

    // Check if recipe exists
    const recipeExists = await recipeService.getRecipeByIdService(recipeId);
    if (!recipeExists) {
        return next(new AppError("Recipe not found", 404));
    }

    // Check if already in favorites (FAV-04)
    const existingFavorite = await favoriteService.getFavoriteByUserAndRecipeService(userId, recipeId);
    if (existingFavorite) {
        return next(new AppError("Recipe is already in your favorites", 409));
    }

    const favorite = await favoriteService.createFavoriteService({ user: userId, recipe: recipeId });
    res.status(201).json({
        status: "success",
        data: { favorite }
    });
});

export const getFavorites = catchError(async (req, res, next) => {
    const userId = req.user._id;
    const favorites = await favoriteService.getFavoritesService(userId);
    res.status(200).json({
        status: "success",
        results: favorites.length,
        data: { favorites }
    });
});

export const deleteFavorite = catchError(async (req, res, next) => {
    const recipeId = req.params.id;
    const userId = req.user._id;

    const favorite = await favoriteService.deleteFavoriteByUserAndRecipeService(userId, recipeId);
    if (!favorite) {
        return next(new AppError("Favorite not found", 404));
    }

    res.status(200).json({
        status: "success",
        message: "Favorite deleted successfully"
    });
});
