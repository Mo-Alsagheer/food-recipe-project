import jwt from "jsonwebtoken";

export const signToken = (id, role) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const expiresIn = role === "admin"
        ? (process.env.JWT_ADMIN_EXPIRES_IN || "1d")
        : (process.env.JWT_EXPIRES_IN || "7d");
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn });
};
