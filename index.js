import "dotenv/config";
import express from "express";
import { dbConnection } from "./src/config/dbConnection.js";
import categoryRoutes from "./src/modules/category/category.routes.js";
import recipeRoutes from "./src/modules/recipe/recipe.routes.js";
import favoriteRoutes from "./src/modules/favorite/favorite.routes.js";
import userRoutes from "./src/modules/user/user.routes.js";
import authRoutes from "./src/modules/auth/auth.routes.js";
import { globalErrorHandler } from "./src/middleware/globalErrorHandler.js";
import { AppError } from "./src/utils/AppError.js";

// Handle uncaught exceptions synchronously
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

let server;
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    if (server) {
        server.close(() => process.exit(1));
    } else {
        process.exit(1);
    }
});

const app = express();

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/users", userRoutes);

// Handle unhandled routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler Middleware
app.use(globalErrorHandler);

const startServer = async () => {
    await dbConnection();
    server = app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
};

startServer();