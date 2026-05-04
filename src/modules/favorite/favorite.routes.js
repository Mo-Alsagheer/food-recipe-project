import express from "express";
import { createFavorite, getFavorites, getFavoriteById, deleteFavorite } from "./favorite.controller.js";

const router = express.Router();

router.post("/", createFavorite);
router.get("/", getFavorites);
router.get("/:id", getFavoriteById);
router.delete("/:id", deleteFavorite);

export default router;
