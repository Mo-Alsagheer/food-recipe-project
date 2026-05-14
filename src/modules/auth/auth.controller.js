import { catchError } from "../../utils/catchError.js";
import { AppError } from "../../utils/AppError.js";
import * as authService from "./auth.service.js";

export const signup = catchError(async (req, res, next) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return next(new AppError("Name, email, and password are required", 400));
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return next(new AppError("Please provide a valid email address", 400));
    }

    if (password.length < 8) {
        return next(new AppError("Password must be at least 8 characters long", 400));
    }

    const { token, user } = await authService.signupUser(name, email, password);
    
    res.status(201).json({
        status: 'success',
        token,
        data: { user }
    });
});

export const signin = catchError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError("Please provide email and password", 400));
    }

    const { token, user } = await authService.signinUser(email, password);

    res.status(200).json({
        status: 'success',
        token,
        data: { user }
    });
});
