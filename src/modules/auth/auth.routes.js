import express from "express";
import { signup, signin, forgotPassword, resetPassword } from "./auth.controller.js";
import { validate } from "../../middleware/validate.js";
import { signUpSchema, signInSchema, forgotPasswordSchema, resetPasswordSchema } from "./auth.validation.js";

const router = express.Router();

router.post("/signup", validate(signUpSchema), signup);
router.post("/signin", validate(signInSchema), signin);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;
