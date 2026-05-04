import * as recipeService from "./recipe.service.js";

export const createRecipe = async (req, res) => {
    try {
        const { title, description, image, category, author } = req.body;
        if (!title || !description || !image || !category || !author) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const recipe = await recipeService.createRecipeService({ title, description, image, category, author });
        res.status(201).json(recipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getRecipes = async (req, res) => {
    try {
        const recipes = await recipeService.getRecipesService();
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getRecipeById = async (req, res) => {
    try {
        const recipe = await recipeService.getRecipeByIdService(req.params.id);
        if (!recipe) return res.status(404).json({ error: "Recipe not found" });
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateRecipe = async (req, res) => {
    try {
        const recipe = await recipeService.updateRecipeService(req.params.id, req.body);
        if (!recipe) return res.status(404).json({ error: "Recipe not found" });
        res.status(200).json(recipe);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteRecipe = async (req, res) => {
    try {
        const recipe = await recipeService.deleteRecipeService(req.params.id);
        if (!recipe) return res.status(404).json({ error: "Recipe not found" });
        res.status(200).json({ message: "Recipe deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
