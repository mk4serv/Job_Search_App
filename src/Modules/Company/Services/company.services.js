import cloudinary from "../../../config/cloudinary.config.js";
import { Company } from "../../../DB/models/index.js";



// ✅ Add Company Service
export const addCompanyServices = async (req, res) => {
    try {
        const { _id } = req.loggedInUser;
        const { companyName, description, industry, address, numberOfEmployees, companyEmail, HRs } = req.body;

        // ✅ Check if company already exists
        const isCompanyExist = await Company.findOne({ companyName });
        const isCompanyEmailExist = await Company.findOne({ companyEmail });
        if (isCompanyExist) {
            return res.status(409).json({ message: 'Company already exists' });
        }
        if (isCompanyEmailExist) {
            return res.status(409).json({ message: 'Company email already exists' });
        }

        // ✅ Create a new company
        const company = await Company.create({
            companyName,
            description,
            industry,
            address,
            numberOfEmployees,
            companyEmail,
            HRs,
            createdBy: _id
        });
        res.status(201).json({ message: 'Company created successfully', company });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}
// ✅ Update Company Service
export const updateCompanyServices = async (req, res) => {
    try {
        const { _id } = req.loggedInUser; // User ID from the logged-in user
        const { companyName, description, industry, address, numberOfEmployees, companyEmail, HRs } = req.body;
        const { companyId } = req.params;

        // ✅ Check if the company exists
        const company = await Company.findOne({ _id: companyId });
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Check if the user is the owner, or createdBy matches loggedInUser ID
        if (company.createdBy.toString() === _id) {
            return res.status(403).json({ message: 'Access denied: You do not have permission to update this company.' });
        }

        // ✅ Update the company
        const updatedCompany = await Company.findOneAndUpdate({ _id: companyId }, {
            companyName,
            description,
            industry,
            address,
            numberOfEmployees,
            companyEmail,
            HRs
        }, { new: true });

        res.status(200).json({ message: 'Company updated successfully', company: updatedCompany });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}
// ✅ Soft Delete Company Service
export const deleteCompanyServices = async (req, res) => {
    try {
        const { _id } = req.loggedInUser;
        const companyId = req.params.id;

        // Find the company by ID and ensure it belongs to the user
        const company = await Company.findOne({ _id: companyId, createdBy: _id });
        if (!company) {
            return res.status(404).json({ message: 'Company not found or you do not have permission to delete this company' });
        }

        // Mark the company as deleted
        company.isDeleted = true;
        company.deletedAt = new Date();
        await company.save();

        res.status(200).json({ message: 'Company deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}
// ✅ Search for a company with a name Service
export const searchCompanyServices = async (req, res) => {
    try {
        const { companyName } = req.query;

        // Validate that companyName is a string, not empty, and has a minimum length
        if (typeof companyName !== 'string' || companyName.trim() === '' || companyName.length < 2) {
            return res.status(400).json({ message: 'Invalid company name provided. It must be a string with at least 2 characters.' });
        }

        const companies = await Company.find({ companyName: { $regex: companyName, $options: 'i' } });

        // Check if any companies were found
        if (companies.length === 0) {
            return res.status(404).json({ message: 'No companies found matching the provided name.' });
        }

        res.status(200).json({ message: 'Companies retrieved successfully', companies });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}
// ✅ Upload Company Logo Cloudinary
export const uploadCompanyLogoServices = async (req, res) => {
    try {
        const { _id } = req.loggedInUser;
        const { file } = req;

        if (!file) return res.status(400).json({ message: 'No file uploaded' });

        const { secure_url, public_id } = await cloudinary().uploader.upload(file.path, {
            folder: `${process.env.CLOUDINARY_FOLDER}/Company/Logo`,
        });

        // Find the company associated with the user
        const company = await Company.findOne({ createdBy: _id });
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Update the company with the new logo
        const updatedCompany = await Company.findByIdAndUpdate(company._id, { logo: { secure_url, public_id } }, { new: true });

        res.status(200).json({ message: 'Company logo uploaded successfully', company: { logo: { secure_url, public_id } } });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}
// ✅ Upload Company cover Cloudinary
export const uploadCompanyCoverServices = async (req, res) => {
    try {
        const { _id } = req.loggedInUser;
        const { file } = req;

        if (!file) return res.status(400).json({ message: 'No file uploaded' });

        const { secure_url, public_id } = await cloudinary().uploader.upload(file.path, {
            folder: `${process.env.CLOUDINARY_FOLDER}/Company/Cover`,
        });

        // Find the company associated with the user
        const company = await Company.findOne({ createdBy: _id });
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Update the company with the new logo
        const updatedCompany = await Company.findByIdAndUpdate(company._id, { cover: { secure_url, public_id } }, { new: true });

        res.status(200).json({ message: 'Company cover uploaded successfully', company: { cover: { secure_url, public_id } } });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}
// ✅ Delete Company Logo
export const deleteCompanyLogoServices = async (req, res) => {
    try {
        const { _id } = req.loggedInUser;
        const company = await Company.findOne({ createdBy: _id });
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const logopublicid = company.logo?.public_id; // Safely access the logo property
        if (logopublicid) {
            await cloudinary().uploader.destroy(logopublicid);
        }

        // Update the company to set logo to null
        company.logo = null;
        await company.save();

        res.status(200).json({ message: 'Company logo deleted successfully', company: { logo: null } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}
// ✅ Delete Company cover
export const deleteCompanyCoverServices = async (req, res) => {
    try {
        const { _id } = req.loggedInUser;
        const company = await Company.findOne({ createdBy: _id });
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const coverpublicid = company.cover?.public_id;
        if (coverpublicid) {
            await cloudinary().uploader.destroy(coverpublicid);
        }

        // Update the company to set cover to null
        company.cover = null;
        await company.save();

        res.status(200).json({ message: 'Company cover deleted successfully', company: { cover: null } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}
