import { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLBoolean } from "graphql";

export const JobType = new GraphQLObjectType({
    name: 'Job',
    description: 'Job Type',
    fields: () => ({
        id: { type: GraphQLID },
        jobTitle: { type: GraphQLString },
        jobLocation: { type: GraphQLString },
        workingTime: { type: GraphQLString },
        seniorityLevel: { type: GraphQLString },
        jobDescription: { type: GraphQLString },
        technicalSkills: { type: new GraphQLList(GraphQLString) },
        softSkills: { type: new GraphQLList(GraphQLString) },
        addedBy: { type: GraphQLID },
        updatedBy: { type: GraphQLID },
        companyId: { type: GraphQLID },
        closed: { type: GraphQLBoolean },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString }
    })
});