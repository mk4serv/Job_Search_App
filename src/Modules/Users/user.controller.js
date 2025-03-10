import {Router} from "express";
import * as UserServices from "./Services/profile.services.js";
import { authenticationMiddleware, authorizationMiddleware } from "../../Middleware/authentication.middleware.js";
import { ImageExtensions, systemRoles } from "../../constants/constants.js";
import { errorHandlerMiddleware } from "../../Middleware/error-handler.middleware.js";
import { MulterCloud } from "../../Middleware/multer.middleware.js";

// ✅ Get User Profile Route
const userController = Router();
const { USER} = systemRoles;

userController.use(authenticationMiddleware());

userController.put("/update-profile", authorizationMiddleware([USER]), errorHandlerMiddleware (UserServices.updateProfileServices));
userController.get("/profile",authorizationMiddleware([USER]), errorHandlerMiddleware (UserServices.profileServices));
userController.get("/profile/:_id",authorizationMiddleware([USER]), errorHandlerMiddleware (UserServices.profileServicesForOtherUsers));
userController.patch("/update-password", authorizationMiddleware([USER]), errorHandlerMiddleware (UserServices.updatePasswordServices));
// userController.patch("/upload-profile-pic", MulterLocal('Users/Profile', ImageExtensions.IMAGE).single('profilePic'), authorizationMiddleware([USER]), errorHandlerMiddleware (UserServices.uploadProfilePicServices));
// userController.patch("/upload-cover-pic", MulterLocal('Users/Cover', ImageExtensions.IMAGE).single('coverPic'), authorizationMiddleware([USER]), errorHandlerMiddleware (UserServices.uploadCoverPicServices));
userController.patch("/upload-profile-pic-cloud", MulterCloud(ImageExtensions.IMAGE).single('profilePic'), authorizationMiddleware([USER]), errorHandlerMiddleware (UserServices.uploadProfilePicServicesCloud));
userController.patch("/upload-cover-pic-cloud", MulterCloud(ImageExtensions.IMAGE).single('coverPic'), authorizationMiddleware([USER]), errorHandlerMiddleware (UserServices.uploadCoverPicServicesCloud));
userController.delete("/delete-profile-pic", authorizationMiddleware([USER]), errorHandlerMiddleware (UserServices.deleteProfilePicServices));
userController.delete("/delete-cover-pic", authorizationMiddleware([USER]), errorHandlerMiddleware (UserServices.deleteCoverPicServices));
userController.delete("/delete-account", authorizationMiddleware([USER]), errorHandlerMiddleware (UserServices.deleteAccountServices));

export default userController;