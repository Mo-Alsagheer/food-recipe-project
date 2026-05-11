import User from "../../models/User.js";
import bcrypt from "bcrypt";

export const createUserService = async (data) => {
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }
    return await User.create(data);
};

export const getUsersService = async () => {
    return await User.find().select("-password");
};

export const getUserByIdService = async (id) => {
    return await User.findById(id).select("-password");
};

export const updateUserService = async (id, data) => {
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }
    return await User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select("-password");
};

export const deleteUserService = async (id) => {
    return await User.findByIdAndDelete(id);
};
