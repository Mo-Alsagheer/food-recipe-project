import bcrypt from "bcrypt";
import User from "../../models/User.js";
import { AppError } from "../../utils/AppError.js";
import { signToken } from "../../utils/jwt.js";
import { sendOtpEmail } from "../../utils/email.js";

export const signupUser = async (name, email, password) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError("Email already exists", 409);
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({ name, email, password: hashedPassword });
    const token = signToken(newUser._id, newUser.role);

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

    if (user.status === "deactive") {
        throw new AppError("Your account has been deactivated. Please contact support.", 403);
    }

    const token = signToken(user._id, user.role);

    return {
        token,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    };
};

export const forgotPasswordService = async (email) => {
    const user = await User.findOne({ email });
    // Always respond success to prevent email enumeration
    if (!user) return;

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    const hashedOtp = await bcrypt.hash(otp, saltRounds);

    user.otp = {
        code: hashedOtp,
        expiresIn: new Date(Date.now() + 15 * 60 * 1000),
    };
    await user.save();

    await sendOtpEmail(email, otp);
};

export const resetPasswordService = async (email, otp, newPassword) => {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.otp?.code || !user.otp?.expiresIn) {
        throw new AppError("OTP is invalid or expired", 400);
    }

    if (user.otp.expiresIn < new Date()) {
        throw new AppError("OTP has expired", 400);
    }

    const isValid = await bcrypt.compare(otp, user.otp.code);
    if (!isValid) {
        throw new AppError("OTP is invalid or expired", 400);
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    user.password = await bcrypt.hash(newPassword, saltRounds);
    user.otp = { code: undefined, expiresIn: undefined };
    await user.save();
};
