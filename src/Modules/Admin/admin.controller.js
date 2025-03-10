import {Router} from "express";
import * as AdminServices from "./Services/admin.services.js";
import { authenticationMiddleware, authorizationMiddleware } from "../../Middleware/authentication.middleware.js";
import { systemRoles } from "../../constants/constants.js";
import { errorHandlerMiddleware } from "../../Middleware/error-handler.middleware.js";

// ✅ Get User Profile Route
const adminController = Router();
const { ADMIN, SUPER_ADMIN } = systemRoles;

adminController.use(authenticationMiddleware());

// ✅ Ban or Unban User Route
adminController.patch("/ban-or-unban-user/:userId", authorizationMiddleware([ADMIN, SUPER_ADMIN]),  (AdminServices.banOrUnbanUser));

// ✅ Ban or Unban Company Route
adminController.patch("/ban-or-unban-company/:companyId", authorizationMiddleware([ADMIN, SUPER_ADMIN]), errorHandlerMiddleware (AdminServices.banOrUnbanCompany));

// ✅ Approve Company Route
adminController.patch("/approve-company/:companyId", authorizationMiddleware([ADMIN, SUPER_ADMIN]), errorHandlerMiddleware (AdminServices.approveCompany));

export default adminController;