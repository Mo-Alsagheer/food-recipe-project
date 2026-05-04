import Category from "../../../models/Category.js";

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
    return await Category.findByIdAndDelete(id);
};
