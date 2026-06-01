import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: false,
        select: false,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    status: {
        type: String,
        enum: ["active", "deactive"],
        default: "active",
    },
    otp: {
        code: { type: String },
        expiresIn: { type: Date },
    },
    provider: {
        type: String,
        enum: ["local", "google", "facebook"],
        default: "local",
    },
    providerId: {
        type: String,
        default: null,
    },
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;