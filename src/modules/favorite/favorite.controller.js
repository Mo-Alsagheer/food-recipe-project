import * as favoriteService from "./favorite.service.js";

export const createFavorite = async (req, res) => {
    try {
        const { user, recipe } = req.body;
        if (!user || !recipe) {
            return res.status(400).json({ error: "User and recipe are required" });
        }
        const favorite = await favoriteService.createFavoriteService({ user, recipe });
        res.status(201).json(favorite);
    } catch (error) {
        if (error.code === 11000) {
             return res.status(400).json({ error: "This recipe is already in your favorites" });
        }
        res.status(500).json({ error: error.message });
    }
};

export const getFavorites = async (req, res) => {
    try {
        const favorites = await favoriteService.getFavoritesService();
        res.status(200).json(favorites);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getFavoriteById = async (req, res) => {
    try {
        const favorite = await favoriteService.getFavoriteByIdService(req.params.id);
        if (!favorite) return res.status(404).json({ error: "Favorite not found" });
        res.status(200).json(favorite);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteFavorite = async (req, res) => {
    try {
        const favorite = await favoriteService.deleteFavoriteService(req.params.id);
        if (!favorite) return res.status(404).json({ error: "Favorite not found" });
        res.status(200).json({ message: "Favorite deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
