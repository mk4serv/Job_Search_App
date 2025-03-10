import { Company, User } from "../../../DB/models/index.js";

// ✅ Ban or Unban User Service
export const banOrUnbanUser = async (req, res) => {
    try {
        const { _id } = req.loggedInUser;
        const { userId } = req.params;
        const { banStatus } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.bannedAt = banStatus ? new Date() : null;
        user.updatedBy = _id;
        await user.save();

        res.status(200).json({ message: `User has been ${banStatus ? 'banned' : 'unbanned'} successfully.` });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

// ✅ Ban or Unban Company Service
export const banOrUnbanCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        const { banStatus } = req.body;
        const company = await Company.findById(companyId);
        if (!company) return res.status(404).json({ message: 'Company not found' });

        company.bannedAt = banStatus ? new Date() : null;
        await company.save();

        res.status(200).json({ message: `Company has been ${banStatus ? 'banned' : 'unbanned'} successfully.` });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};
// ✅ Approve Company Service
export const approveCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        const { approved } = req.body;
        const company = await Company.findById(companyId);
        if (!company) return res.status(404).json({ message: 'Company not found' });

        company.approvedByAdmin = approved;
        await company.save();

        res.status(200).json({ message: `Company has been ${approved ? 'approved' : 'unapproved'} successfully.` });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};