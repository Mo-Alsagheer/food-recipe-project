import mongoose from "mongoose";

export const dbConnection = async () => {
    try {
        if (!process.env.DB_URI) {
            throw new Error("DB_URI is not defined in environment variables");
        }
        await mongoose.connect(process.env.DB_URI);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed", error);
    }
}