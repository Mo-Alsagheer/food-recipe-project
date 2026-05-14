import express from "express";
import { signup, signin } from "./auth.controller.js";
import { validate } from "../../middleware/validate.js";
import { signUpSchema, signInSchema } from "./auth.validation.js";

const router = express.Router();

router.post("/signup", validate(signUpSchema), signup);
router.post("/signin", validate(signInSchema), signin);

export default router;
