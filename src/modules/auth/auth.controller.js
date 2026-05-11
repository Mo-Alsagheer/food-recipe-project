import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../../models/User.js";
import { catchError } from "../../utils/catchError.js";
import { AppError } from "../../utils/AppError.js";

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "default_secret", {
        expiresIn: process.env.JWT_EXPIRES_IN || "90d"
    });
};

export const signup = catchError(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
        return next(new AppError("Name, email, and password are required", 400));
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError("Email already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role
    });

    const token = signToken(newUser._id);
    
    const userObj = newUser.toObject();
    delete userObj.password;

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: userObj
        }
    });
});

export const signin = catchError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new AppError("Incorrect email or password", 401));
    }

    const token = signToken(user._id);

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
        status: 'success',
        token,
        data: {
            user: userObj
        }
    });
});
