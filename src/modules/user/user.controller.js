import * as userService from "./user.service.js";
import { catchError } from "../../utils/catchError.js";
import { AppError } from "../../utils/AppError.js";

export const createUser = catchError(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
        return next(new AppError("Name, email, and password are required", 400));
    }
    const user = await userService.createUserService({ name, email, password, role });
    
    const userObj = user.toObject();
    delete userObj.password;
    res.status(201).json(userObj);
});

export const getUsers = catchError(async (req, res, next) => {
    const users = await userService.getUsersService();
    res.status(200).json(users);
});

export const getUserById = catchError(async (req, res, next) => {
    const user = await userService.getUserByIdService(req.params.id);
    if (!user) return next(new AppError("User not found", 404));
    res.status(200).json(user);
});

export const updateUser = catchError(async (req, res, next) => {
    const { name, email } = req.body;
    const user = await userService.updateUserService(req.params.id, { name, email });
    if (!user) return next(new AppError("User not found", 404));
    res.status(200).json(user);
});

export const deleteUser = catchError(async (req, res, next) => {
    const user = await userService.deleteUserService(req.params.id);
    if (!user) return next(new AppError("User not found", 404));
    res.status(200).json({ message: "User deleted successfully" });
});
