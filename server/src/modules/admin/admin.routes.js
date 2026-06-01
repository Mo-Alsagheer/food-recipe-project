import express from "express";
import {
    adminLogin, getDashboard, getAdminFavorites,
    adminGetRecipes, adminCreateRecipe, adminUpdateRecipe, adminDeleteRecipe,
    adminGetUsers, toggleUserStatus,
} from "./admin.controller.js";
import { validate } from "../../middleware/validate.js";
import { protect, restrictTo } from "../../middleware/auth.js";
import { upload } from "../../utils/upload.js";
import {
    adminLoginSchema, adminRecipesQuerySchema, adminCreateRecipeSchema,
    adminUpdateRecipeSchema, adminRecipeIdSchema,
    adminUsersQuerySchema, adminUserStatusSchema, adminFavouritesQuerySchema,
} from "./admin.validation.js";

const router = express.Router();

// Public
router.post("/login", validate(adminLoginSchema), adminLogin);

// All routes below require admin JWT
router.use(protect, restrictTo("admin"));

router.get("/dashboard", getDashboard);
router.get("/favourites", validate(adminFavouritesQuerySchema), getAdminFavorites);

// Recipe management
router.get("/recipes", validate(adminRecipesQuerySchema), adminGetRecipes);
router.post("/recipes", upload.single("image"), validate(adminCreateRecipeSchema), adminCreateRecipe);
router.put("/recipes/:id", upload.single("image"), validate(adminUpdateRecipeSchema), adminUpdateRecipe);
router.delete("/recipes/:id", validate(adminRecipeIdSchema), adminDeleteRecipe);

// User management
router.get("/users", validate(adminUsersQuerySchema), adminGetUsers);
router.patch("/users/:id/status", validate(adminUserStatusSchema), toggleUserStatus);

export default router;
