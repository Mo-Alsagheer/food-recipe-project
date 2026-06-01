import User from "../../models/User.js";
import bcrypt from "bcrypt";

export const createUserService = async (data) => {
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }
    return await User.create(data);
};

export const getUsersService = async ({ page = 1, limit = 10 } = {}) => {
    const clampedLimit = Math.min(Number(limit), 50);
    const skip = (Number(page) - 1) * clampedLimit;

    const [users, total] = await Promise.all([
        User.find().select("-password").skip(skip).limit(clampedLimit).lean(),
        User.countDocuments(),
    ]);

    return { users, total, page: Number(page), limit: clampedLimit, pages: Math.ceil(total / clampedLimit) };
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

export const toggleUserStatusService = async (id) => {
    const user = await User.findById(id).select("-password");
    if (!user) return null;
    user.status = user.status === "active" ? "deactive" : "active";
    await user.save();
    return user;
};
