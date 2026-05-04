import "dotenv/config";
import express from "express";
import { dbConnection } from "./config/dbConnection.js";
import categoryRoutes from "./src/modules/category/category.routes.js";
import recipeRoutes from "./src/modules/recipe/recipe.routes.js";
import favoriteRoutes from "./src/modules/favorite/favorite.routes.js";
import userRoutes from "./src/modules/user/user.routes.js";

const app = express();

app.use(express.json());

app.use("/api/categories", categoryRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/users", userRoutes);

const startServer = async () => {
    await dbConnection();
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
};
startServer();