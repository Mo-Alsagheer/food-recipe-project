import Favorite from "../../models/Favorite.js";

export const createFavoriteService = async (data) => {
    return await Favorite.create(data);
};

export const getFavoritesService = async (userId, { page = 1, limit = 10 } = {}) => {
    const clampedLimit = Math.min(Number(limit), 50);
    const skip = (Number(page) - 1) * clampedLimit;

    const [favorites, total] = await Promise.all([
        Favorite.find({ user: userId })
            .populate("recipe")
            .skip(skip)
            .limit(clampedLimit)
            .lean(),
        Favorite.countDocuments({ user: userId }),
    ]);

    return { favorites, total, page: Number(page), limit: clampedLimit, pages: Math.ceil(total / clampedLimit) };
};

export const getAllFavoritesService = async ({ page = 1, limit = 10 } = {}) => {
    const clampedLimit = Math.min(Number(limit), 50);
    const skip = (Number(page) - 1) * clampedLimit;

    const [favorites, total] = await Promise.all([
        Favorite.find()
            .populate("user", "name email")
            .populate("recipe", "title")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(clampedLimit)
            .lean(),
        Favorite.countDocuments(),
    ]);

    return { favorites, total, page: Number(page), limit: clampedLimit, pages: Math.ceil(total / clampedLimit) };
};

export const getFavoriteByIdService = async (id) => {
    return await Favorite.findById(id).populate("user", "name email").populate("recipe");
};

export const deleteFavoriteService = async (id) => {
    return await Favorite.findByIdAndDelete(id);
};

export const getFavoriteByUserAndRecipeService = async (userId, recipeId) => {
    return await Favorite.findOne({ user: userId, recipe: recipeId });
};

export const deleteFavoriteByUserAndRecipeService = async (userId, recipeId) => {
    return await Favorite.findOneAndDelete({ user: userId, recipe: recipeId });
};
