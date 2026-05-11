import * as recipeService from "./recipe.service.js";
import fs from "fs";

export const createRecipe = async (req, res) => {
    try {
        const { title, description, category, author } = req.body;
        
        if (!title || !description || !category || !author) {
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error("Failed to delete orphaned image:", err);
                });
            }
            return res.status(400).json({ error: "All fields are required" });
        }

        // Handle file upload
        const image = req.file ? req.file.path.replaceAll('\\', '/') : null;
        
        const recipe = await recipeService.createRecipeService({ title, description, image, category, author });
        res.status(201).json(recipe);
    } catch (error) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Failed to delete orphaned image:", err);
            });
        }
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
        const { title, description, category } = req.body;
        const updateData = {};
        
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (category) updateData.category = category;

        let oldImage = null;
        if (req.file) {
            updateData.image = req.file.path.replaceAll('\\', '/');
            const existingRecipe = await recipeService.getRecipeByIdService(req.params.id);
            if (existingRecipe && existingRecipe.image) {
                oldImage = existingRecipe.image;
            }
        }

        const recipe = await recipeService.updateRecipeService(req.params.id, updateData);
        if (!recipe) {
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error("Failed to delete uploaded image on 404:", err);
                });
            }
            return res.status(404).json({ error: "Recipe not found" });
        }

        if (oldImage) {
            fs.unlink(oldImage, (err) => {
                if (err) console.error("Failed to delete old image:", err);
            });
        }

        res.status(200).json(recipe);
    } catch (error) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Failed to delete uploaded image on error:", err);
            });
        }
        res.status(500).json({ error: error.message });
    }
};

export const deleteRecipe = async (req, res) => {
    try {
        const recipe = await recipeService.deleteRecipeService(req.params.id);
        if (!recipe) return res.status(404).json({ error: "Recipe not found" });

        if (recipe.image) {
            fs.unlink(recipe.image, (err) => {
                if (err) console.error("Failed to delete image:", err);
            });
        }

        res.status(200).json({ message: "Recipe deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
