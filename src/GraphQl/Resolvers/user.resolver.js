import { Company, JobOpportunity, User } from "../../DB/models/index.js";

export const ListAllUsersResolver =async () => {
    const users = await User.find();
    return users;
}

export const ListAllCompaniesResolver =async () => {
    const companies = await Company.find();
    return companies;
}

export const ListAllJobsResolver =async () => {
    const jobs = await JobOpportunity.find();
    return jobs;
}