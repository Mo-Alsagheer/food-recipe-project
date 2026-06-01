import * as categoryService from "./category.service.js";
import { catchError } from "../../utils/catchError.js";
import { AppError } from "../../utils/AppError.js";

export const createCategory = catchError(async (req, res, next) => {
    const { name, description } = req.body;
    if (!name || !description) {
        return next(new AppError("Name and description are required", 400));
    }
    const category = await categoryService.createCategoryService({ name, description });
    res.status(201).json(category);
});

export const getCategories = catchError(async (req, res, next) => {
    const categories = await categoryService.getCategoriesService();
    res.status(200).json(categories);
});

export const getCategoryById = catchError(async (req, res, next) => {
    const category = await categoryService.getCategoryByIdService(req.params.id);
    if (!category) return next(new AppError("Category not found", 404));
    res.status(200).json(category);
});

export const updateCategory = catchError(async (req, res, next) => {
    const { name, description } = req.body;
    const category = await categoryService.updateCategoryService(req.params.id, { name, description });
    if (!category) return next(new AppError("Category not found", 404));
    res.status(200).json(category);
});

export const deleteCategory = catchError(async (req, res, next) => {
    const category = await categoryService.deleteCategoryService(req.params.id);
    if (!category) return next(new AppError("Category not found", 404));
    res.status(200).json({ message: "Category deleted successfully" });
});
