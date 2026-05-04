import Favorite from "../../../models/Favorite.js";

export const createFavoriteService = async (data) => {
    return await Favorite.create(data);
};

export const getFavoritesService = async () => {
    return await Favorite.find().populate("user", "name email").populate("recipe");
};

export const getFavoriteByIdService = async (id) => {
    return await Favorite.findById(id).populate("user", "name email").populate("recipe");
};

export const deleteFavoriteService = async (id) => {
    return await Favorite.findByIdAndDelete(id);
};
