import express from "express";
import passport from "../../config/passport.js";
import { signup, signin, forgotPassword, resetPassword, googleCallback } from "./auth.controller.js";
import { validate } from "../../middleware/validate.js";
import { signUpSchema, signInSchema, forgotPasswordSchema, resetPasswordSchema } from "./auth.validation.js";

const router = express.Router();

router.post("/signup", validate(signUpSchema), signup);
router.post("/signin", validate(signInSchema), signin);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

// Google OAuth — only available when credentials are configured
const googleNotConfigured = (req, res) =>
    res.status(501).json({ status: "error", message: "Google OAuth is not configured on this server." });

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
    router.get(
        "/google/callback",
        passport.authenticate("google", { failureRedirect: "/api/auth/google/failure", session: false }),
        googleCallback
    );
} else {
    router.get("/google", googleNotConfigured);
    router.get("/google/callback", googleNotConfigured);
}

router.get("/google/failure", (req, res) => {
    res.status(401).json({ status: "error", message: "Google authentication failed" });
});

export default router;
