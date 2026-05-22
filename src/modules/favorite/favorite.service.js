import Favorite from "../../models/Favorite.js";

export const createFavoriteService = async (data) => {
    return await Favorite.create(data);
};

export const getFavoritesService = async (userId) => {
    return await Favorite.find({ user: userId }).populate("user", "name email").populate("recipe");
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
