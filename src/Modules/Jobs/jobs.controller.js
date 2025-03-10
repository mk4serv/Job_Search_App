import { Router } from "express";
import * as JobServices from "./Services/jobs.services.js";
import { authenticationMiddleware, authorizationMiddleware } from "../../Middleware/authentication.middleware.js";
import { DocumentExtensions } from "../../constants/constants.js";
import { systemRoles } from "../../constants/constants.js";
import { MulterCloud } from "../../Middleware/multer.middleware.js";

const jobsController = Router();
const { USER } = systemRoles;

jobsController.use(authenticationMiddleware());

// ✅ Add Job
jobsController.post('/add-job/:companyId', authorizationMiddleware([USER]), JobServices.addJob);

// ✅ Update Job
jobsController.put('/update-job/:id', authorizationMiddleware([USER]), JobServices.updateJob);

// ✅ Delete Job
jobsController.delete('/delete-job/:id', authorizationMiddleware([USER]), JobServices.deleteJob);

// ✅ Get All Jobs or a Specific One for a Specific Company
jobsController.get('/all-jobs', authorizationMiddleware([USER]), JobServices.getAllJobs);

// ✅ Get Jobs with Filters
jobsController.get('/all-jobs-filter', authorizationMiddleware([USER]), JobServices.getJobsWithFilters);

// ✅ Get All Applications for a Specific Job
jobsController.get('/:id/applications', authorizationMiddleware([USER]), JobServices.getJobApplications);

// ✅ Apply to Job
jobsController.post('/apply-job/:id', MulterCloud(DocumentExtensions.PDF).single('userCV'), authorizationMiddleware([USER]), JobServices.applyToJob);

// ✅ Accept or Reject an Applicant
jobsController.patch('/applications/:applicationId/status', authorizationMiddleware([USER]), JobServices.acceptRejectApplicant);

export default jobsController;