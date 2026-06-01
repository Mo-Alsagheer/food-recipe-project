import Category from "../../models/Category.js";
import Recipe from "../../models/Recipe.js";
import Favorite from "../../models/Favorite.js";

export const createCategoryService = async (data) => {
    return await Category.create(data);
};

export const getCategoriesService = async () => {
    return await Category.find();
};

export const getCategoryByIdService = async (id) => {
    return await Category.findById(id);
};

export const updateCategoryService = async (id, data) => {
    return await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteCategoryService = async (id) => {
    const recipes = await Recipe.find({ category: id });
    const recipeIds = recipes.map(r => r._id);
    if (recipeIds.length > 0) {
        await Favorite.deleteMany({ recipe: { $in: recipeIds } });
        await Recipe.deleteMany({ category: id });
    }
    return await Category.findByIdAndDelete(id);
};
