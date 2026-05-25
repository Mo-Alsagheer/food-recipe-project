import Recipe from "../../models/Recipe.js";
import Favorite from "../../models/Favorite.js";

export const createRecipeService = async (data) => {
    return await Recipe.create(data);
};

export const getRecipesService = async ({ page = 1, limit = 10, category, search, tags } = {}) => {
    const clampedLimit = Math.min(Number(limit), 50);
    const skip = (Number(page) - 1) * clampedLimit;

    const filter = {};
    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };
    if (tags) {
        const tagArray = Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim());
        filter.tags = { $in: tagArray };
    }

    const [recipes, total] = await Promise.all([
        Recipe.find(filter)
            .populate("category")
            .populate("createdBy", "name email")
            .skip(skip)
            .limit(clampedLimit)
            .lean(),
        Recipe.countDocuments(filter),
    ]);

    return { recipes, total, page: Number(page), limit: clampedLimit, pages: Math.ceil(total / clampedLimit) };
};

export const getRecipeByIdService = async (id) => {
    return await Recipe.findById(id).populate("category").populate("createdBy", "name email");
};

export const updateRecipeService = async (id, data) => {
    return await Recipe.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteRecipeService = async (id) => {
    await Favorite.deleteMany({ recipe: id });
    return await Recipe.findByIdAndDelete(id);
};
