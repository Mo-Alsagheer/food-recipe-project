import Recipe from "../../models/Recipe.js";
import Favorite from "../../models/Favorite.js";

export const createRecipeService = async (data) => {
    return await Recipe.create(data);
};

export const getRecipesService = async () => {
    return await Recipe.find().populate("category").populate("author", "name email");
};

export const getRecipeByIdService = async (id) => {
    return await Recipe.findById(id).populate("category").populate("author", "name email");
};

export const updateRecipeService = async (id, data) => {
    return await Recipe.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteRecipeService = async (id) => {
    await Favorite.deleteMany({ recipe: id });
    return await Recipe.findByIdAndDelete(id);
};
