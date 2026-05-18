import express from "express";
import { createUser, getUsers, getUserById, updateUser, deleteUser } from "./user.controller.js";
import { validate } from "../../middleware/validate.js";
import { createUserSchema, updateUserSchema, getUserSchema, deleteUserSchema, getUsersSchema } from "./user.validation.js";

const router = express.Router();

router.post("/", validate(createUserSchema), createUser);
router.get("/", validate(getUsersSchema), getUsers);
router.get("/:id", validate(getUserSchema), getUserById);
router.put("/:id", validate(updateUserSchema), updateUser);
router.delete("/:id", validate(deleteUserSchema), deleteUser);

export default router;
