import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { catchError } from "../utils/catchError.js";
import User from "../models/User.js";

export const protect = catchError(async (req, res, next) => {
    // Get token from header
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(
            new AppError("You are not logged in! Please log in to get access.", 401)
        );
    }

    // Verify token
    if (!process.env.JWT_SECRET) {
        return next(new AppError("JWT_SECRET is not defined", 500));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new AppError(
                "The user belonging to this token does no longer exist.",
                401
            )
        );
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
});

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        // req.user should be set by the protect middleware
        if (!req.user || !roles.includes(req.user.role)) {
            return next(
                new AppError("You do not have permission to perform this action", 403)
            );
        }
        next();
    };
};
