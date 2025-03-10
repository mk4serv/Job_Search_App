import { GraphQLList } from "graphql";
import { ListAllCompaniesResolver, ListAllJobsResolver, ListAllUsersResolver } from "../Resolvers/user.resolver.js";
import { UserType, CompanyType } from "../Types/index.js";
import { JobType } from "../Types/job.types.js";

export const dashboardField = {
    Query:{
        listUsers: {
            type: new GraphQLList(UserType),
            description: 'List of users',
            resolve: ListAllUsersResolver
        },
        listCompanies: {  
            type: new GraphQLList(CompanyType),
            description: 'List of companies',
            resolve: ListAllCompaniesResolver
        },
        listJobs: {
            type: new GraphQLList(JobType),
            description: 'List of jobs',
            resolve: ListAllJobsResolver
        }
    }
}