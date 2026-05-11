import * as favoriteService from "./favorite.service.js";
import * as recipeService from "../recipe/recipe.service.js";
import { catchError } from "../../utils/catchError.js";
import { AppError } from "../../utils/AppError.js";

export const createFavorite = catchError(async (req, res, next) => {
    const { user, recipe } = req.body;
    if (!user || !recipe) {
        return next(new AppError("User and recipe are required", 400));
    }
    const recipeExists = await recipeService.getRecipeByIdService(recipe);
    if (!recipeExists) {
        return next(new AppError("Recipe not found", 404));
    }
    const favorite = await favoriteService.createFavoriteService({ user, recipe });
    res.status(201).json(favorite);
});

export const getFavorites = catchError(async (req, res, next) => {
    const userId = req.user?.id || req.query.userId;
    if (!userId) {
        return next(new AppError("User ID is required to fetch favorites", 401));
    }
    const favorites = await favoriteService.getFavoritesService(userId);
    res.status(200).json(favorites);
});

export const getFavoriteById = catchError(async (req, res, next) => {
    const favorite = await favoriteService.getFavoriteByIdService(req.params.id);
    if (!favorite) return next(new AppError("Favorite not found", 404));
    res.status(200).json(favorite);
});

export const deleteFavorite = catchError(async (req, res, next) => {
    const favorite = await favoriteService.deleteFavoriteService(req.params.id);
    if (!favorite) return next(new AppError("Favorite not found", 404));
    res.status(200).json({ message: "Favorite deleted successfully" });
});
