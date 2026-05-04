import * as categoryService from "./category.service.js";

export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ error: "Name and description are required" });
        }
        const category = await categoryService.createCategoryService({ name, description });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await categoryService.getCategoriesService();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const category = await categoryService.getCategoryByIdService(req.params.id);
        if (!category) return res.status(404).json({ error: "Category not found" });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const category = await categoryService.updateCategoryService(req.params.id, req.body);
        if (!category) return res.status(404).json({ error: "Category not found" });
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const category = await categoryService.deleteCategoryService(req.params.id);
        if (!category) return res.status(404).json({ error: "Category not found" });
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
