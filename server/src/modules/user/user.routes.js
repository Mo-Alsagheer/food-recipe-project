import express from "express";
import { createUser, getUsers, getUserById, updateUser, deleteUser } from "./user.controller.js";
import { getFavorites } from "../favorite/favorite.controller.js";
import { validate } from "../../middleware/validate.js";
import { protect, restrictTo } from "../../middleware/auth.js";
import { createUserSchema, updateUserSchema, getUserSchema, deleteUserSchema, getUsersSchema } from "./user.validation.js";
import { getMyFavoritesSchema } from "../favorite/favorite.validation.js";

const router = express.Router();

router.use(protect);

router.post("/", restrictTo("admin"), validate(createUserSchema), createUser);
router.get("/", restrictTo("admin"), validate(getUsersSchema), getUsers);

// Favourites route (must be before wildcard :id)
router.get("/me/favourites", validate(getMyFavoritesSchema), getFavorites);

router.get("/:id", restrictTo("admin"), validate(getUserSchema), getUserById);
router.put("/:id", restrictTo("admin"), validate(updateUserSchema), updateUser);
router.delete("/:id", restrictTo("admin"), validate(deleteUserSchema), deleteUser);

export default router;
