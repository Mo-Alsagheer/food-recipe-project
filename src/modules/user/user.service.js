import User from "../../../models/User.js";

export const createUserService = async (data) => {
    return await User.create(data);
};

export const getUsersService = async () => {
    return await User.find();
};

export const getUserByIdService = async (id) => {
    return await User.findById(id);
};

export const updateUserService = async (id, data) => {
    return await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteUserService = async (id) => {
    return await User.findByIdAndDelete(id);
};
