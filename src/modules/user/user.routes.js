import express from "express";
import { createUser, getUsers, getUserById, updateUser, deleteUser } from "./user.controller.js";
import { validate } from "../../middleware/validate.js";
import { createUserSchema, updateUserSchema, getUserSchema, deleteUserSchema } from "./user.validation.js";

const router = express.Router();

router.post("/", validate(createUserSchema), createUser);
router.get("/", getUsers); // Assuming query params validation is not strictly required here, or can add if needed
router.get("/:id", validate(getUserSchema), getUserById);
router.put("/:id", validate(updateUserSchema), updateUser);
router.delete("/:id", validate(deleteUserSchema), deleteUser);

export default router;
