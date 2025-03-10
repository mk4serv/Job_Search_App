import { JobOpportunity, Application, Company } from "../../../DB/models/index.js";
import { emitter } from "../../../Services/send-email.services.js";
import cloudinary from "../../../config/cloudinary.config.js";

// ✅ Add Job
export const addJob = async (req, res) => {
    try {
        const { _id } = req.loggedInUser;
        const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body;
        const { companyId } = req.params;

        // ✅ Check if the company belongs to the user or if the user is an HR
        const company = await Company.findOne({ _id: companyId, createdBy: _id });
        if (!company) {
            return res.status(404).json({ message: 'Company not found or does not belong to you' });
        }

        // Check if the user is the owner or in the HRs array
        if (company.createdBy.toString() === _id && !company.HRs.includes(_id)) {
            return res.status(403).json({ message: 'Access denied: You do not have permission to add a job.' });
        }

        // ✅ Create a new job
        const job = await JobOpportunity.create({
            jobTitle,
            jobLocation,
            workingTime,
            seniorityLevel,
            jobDescription,
            technicalSkills,
            softSkills,
            companyId: company._id,
            addedBy: _id
        });
        res.status(201).json({ message: 'Job created successfully', job });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
};

// ✅ Update Job
export const updateJob = async (req, res) => {
    try {
        const { _id } = req.loggedInUser;
        const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body;

        // ✅ Find the job by ID
        const job = await JobOpportunity.findOne({ _id: req.params.id });
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // ✅ Check if the user is the owner of the job
        if (!job.addedBy.equals(_id)) {
            return res.status(403).json({ message: 'Access denied: You do not have permission to update this job.' });
        }

        // ✅ Update the job
        const updatedJob = await JobOpportunity.findOneAndUpdate({ _id: req.params.id }, {
            jobTitle,
            jobLocation,
            workingTime,
            seniorityLevel,
            jobDescription,
            technicalSkills,
            softSkills,
            updatedBy: _id
        }, { new: true });

        res.status(200).json({ message: 'Job updated successfully', job: updatedJob });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
};
// ✅ Delete Job
export const deleteJob = async (req, res) => {
    try {
        const { _id } = req.loggedInUser;

        // ✅ Check if the company belongs to the user
        const company = await Company.findOne({ createdBy: _id });
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // ✅ Find the job by ID and ensure it belongs to the user
        const job = await JobOpportunity.findOne({ _id: req.params.id, companyId: company._id });
        if (!job) {
            return res.status(404).json({ message: 'Job not found or you do not have permission to delete this job' });
        }

        // ✅ Delete the job
        await job.deleteOne();

        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
};

// ✅ Get All Jobs or a Specific One for a Specific Company
export const getAllJobs = async (req, res) => {
    try {
        const { companyId, companyName } = req.query;
        const { page = 1, limit = 10, sort = 'createdAt' } = req.query;

        const filter = {};

        // Add filters based on query parameters
        if (companyId) {
            filter.companyId = companyId;
        }

        if (companyName) {
            try {
                const company = await Company.findOne({ companyName: { $regex: new RegExp(companyName) } });
                if (company) {
                    filter.companyId = company._id;
                } else {
                    return res.status(404).json({ message: 'Company not found' });
                }
            } catch (error) {
                console.error("Error searching for company:", error);
                return res.status(500).json({ message: 'Error searching for company', error });
            }
        }

        // Pagination
        const options = {
            skip: (page - 1) * limit,
            limit: parseInt(limit),
            sort: { [sort]: 1 } // Sort by specified field
        };

        const jobs = await JobOpportunity.find(filter, null, options).populate('companyId');
        const totalCount = await JobOpportunity.countDocuments(filter); // Count total jobs matching the filter

        res.status(200).json({ message: 'Jobs retrieved successfully', jobs, totalCount });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
};

// ✅ Get Jobs with Filters
export const getJobsWithFilters = async (req, res) => {
    try {
        const { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills, page = 1, limit = 10, sort = 'createdAt' } = req.query;
        const filter = {};

        // Add filters based on query parameters
        if (workingTime) filter.workingTime = workingTime;
        if (jobLocation) filter.jobLocation = jobLocation;
        if (seniorityLevel) filter.seniorityLevel = seniorityLevel;
        if (jobTitle) filter.jobTitle = { $regex: jobTitle, $options: 'i' };
        if (technicalSkills) filter.technicalSkills = { $in: technicalSkills.split(',') };

        // Pagination options
        const options = {
            skip: (page - 1) * limit,
            limit: parseInt(limit),
            sort: { [sort]: 1 }
        };

        const jobs = await JobOpportunity.find(filter, null, options);
        const totalCount = await JobOpportunity.countDocuments(filter);

        res.status(200).json({ message: 'Jobs retrieved successfully', jobs, totalCount });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
};

// ✅ Get All Applications for a Specific Job
export const getJobApplications = async (req, res) => {
    try {
        const jobId = req.params.id;
        const _id = req.loggedInUser._id;

        const job = await JobOpportunity.findById(jobId).populate('companyId');

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.addedBy.equals(_id) || (job.companyId.HRs && job.companyId.HRs.includes(_id))) {

        } else {
            return res.status(403).json({ message: 'Access denied: You do not have permission to view the applications.' });
        }


        const { page = 1, limit = 10, sort = 'createdAt' } = req.query;

        // Pagination options
        const options = {
            skip: (page - 1) * limit,
            limit: parseInt(limit),
            sort: { [sort]: 1 }
        };

        // Fetch applications and populate user details
        const applications = await Application.find({ jobId })
            .populate('userId')
            .skip(options.skip)
            .limit(options.limit)
            .sort(options.sort);

        const totalCount = await Application.countDocuments({ jobId });

        res.status(200).json({ message: 'Applications retrieved successfully', applications, totalCount });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
};

// ✅ Apply to Job
export const applyToJob = async (req, res) => {
    try {
        const { _id } = req.loggedInUser;
        const { file } = req;
        const { id } = req.params;

        // Find the job associated with the provided jobId
        const job = await JobOpportunity.findOne({ _id: id });
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if the CV file is provided
        if (!file) {
            return res.status(400).json({ message: 'CV file is required' });
        }

        // Upload the CV to Cloudinary
        const { secure_url, public_id } = await cloudinary().uploader.upload(file.path, {
            folder: `${process.env.CLOUDINARY_FOLDER}/User/CV`,
        });

        // Create a new application
        const application = await Application.create({
            userId: _id,
            jobId: id,
            userCV: { secure_url, public_id },
        });

        // Emit a socket event to notify HRs of the new application
        emitter.emit('newApplication', { jobId: id, applicationId: application._id });

        res.status(201).json({ message: 'Application submitted successfully', application });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
};

// ✅ Accept or Reject an Applicant
export const acceptRejectApplicant = async (req, res) => {
    try {
        const { applicationId, status } = req.body;

        // Check if the application exists
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if the job exists
        const job = await JobOpportunity.findById(application.jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Update the application status
        application.status = status;
        await application.save();

        // Send email notification
        const candidateEmail = application.userId.email;

        // Emit email event
        emitter.emit('sendEmail', [candidateEmail, `Job Application ${status.charAt(0).toUpperCase() + status.slice(1)}`, { text: `Your application has been ${status} by the HR team.`}]);

        res.status(200).json({ message: 'Application status updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
};