import {Router} from "express";
import * as CompanyServices from "./Services/company.services.js";
import { authenticationMiddleware, authorizationMiddleware } from "../../Middleware/authentication.middleware.js";
import { errorHandlerMiddleware } from "../../Middleware/error-handler.middleware.js";
import { systemRoles } from "../../constants/constants.js";
import { MulterCloud } from "../../Middleware/multer.middleware.js";
import { ImageExtensions } from "../../constants/constants.js";

// ✅ Company Controller
const companyController = Router();
const { USER } = systemRoles;

companyController.use(authenticationMiddleware());


// ✅ Add Company Route
companyController.post('/add-company',authorizationMiddleware([USER]), errorHandlerMiddleware (CompanyServices.addCompanyServices));

// ✅ Update Company Route
companyController.put('/update-company/:companyId',authorizationMiddleware([USER]), errorHandlerMiddleware (CompanyServices.updateCompanyServices));

// ✅ Delete Company Route
companyController.delete('/delete-company/:id',authorizationMiddleware([USER]), errorHandlerMiddleware (CompanyServices.deleteCompanyServices));

// ✅ Search for a company with a name Route
companyController.get('/search-company',authorizationMiddleware([USER]), errorHandlerMiddleware (CompanyServices.searchCompanyServices));

// ✅ Upload Company Logo Cloudinary
companyController.patch("/upload-logo-cloud", MulterCloud(ImageExtensions.IMAGE).single('logo'), errorHandlerMiddleware (CompanyServices.uploadCompanyLogoServices));

// ✅ Upload Company cover Cloudinary
companyController.patch("/upload-cover-cloud", MulterCloud(ImageExtensions.IMAGE).single('cover'), errorHandlerMiddleware (CompanyServices.uploadCompanyCoverServices));

// ✅ Delete Company Logo
companyController.delete("/delete-logo", authorizationMiddleware([USER]), errorHandlerMiddleware (CompanyServices.deleteCompanyLogoServices));

// ✅ Delete Company cover
companyController.delete("/delete-cover", authorizationMiddleware([USER]), errorHandlerMiddleware (CompanyServices.deleteCompanyCoverServices));

export default companyController;