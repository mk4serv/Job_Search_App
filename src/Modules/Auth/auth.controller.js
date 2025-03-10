import { Router } from "express";
import * as authServices from "./Services/authentication.services.js";
import { validationMiddleware } from "../../Middleware/validation.middleware.js";
import { SignUpSchema } from "../../validators/auth.schema.js";

// ✅ Signup Route
const authController = Router();

// ✅ Signup Route
authController.post("/signup", validationMiddleware(SignUpSchema), authServices.SignUpservices);

// ✅ Login Route
authController.post("/login", authServices.LoginServices);

// ✅ Google Login Route
authController.post("/gmail-login", authServices.GoogleLoginServices);

// ✅ Google Signup Route
authController.post("/gmail-signup", authServices.GoogleSignUpServices);

// ✅ Verify Email Route
authController.get("/verify/:token", authServices.VerifyEmailServices);

// ✅ Refresh Token Route
authController.post("/refresh-token", authServices.RefreshTokenServices);

// ✅ Logout Route
authController.post("/logout", authServices.LogoutServices);

// ✅ Forget Password Route
authController.patch("/forget-password", authServices.ForgetPasswordServices);

// ✅ Reset Password Route
authController.put("/reset-password", authServices.resetPasswordServices);

export default authController;