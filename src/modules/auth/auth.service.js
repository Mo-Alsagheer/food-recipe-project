import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import { AppError } from "../../utils/AppError.js";

const signToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d"
    });
};

export const signupUser = async (name, email, password) => {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError("Email already exists", 409);
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword
    });

    const token = signToken(newUser._id);

    return {
        token,
        user: { _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
    };
};

export const signinUser = async (email, password) => {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new AppError("Incorrect email or password", 401);
    }

    const token = signToken(user._id);

    return {
        token,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    };
};
