import { GraphQLBoolean, GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";
import { DocumentType, HRsArrayType, ImageType } from "./common.types.js";

export const CompanyType = new GraphQLObjectType({
    name: 'Company',
    description: 'Company Type',
    fields: ({
        id: { type: GraphQLID },
        companyName: { type: GraphQLString },
        description: { type: GraphQLString },
        industry: { type: GraphQLString },
        address: { type: GraphQLString },
        numberOfEmployees: { type: GraphQLString }, // Change to Number if needed
        companyEmail: { type: GraphQLString },
        createdBy: { type: GraphQLID }, // Change to ObjectId if needed
        logo: { type: ImageType('Logo') },
        cover: { type: ImageType('Cover') },
        HRs: { type: HRsArrayType }, // Change to array type if needed
        bannedAt: { type: GraphQLString },
        isDeleted: { type: GraphQLBoolean },
        deletedAt: { type: GraphQLString },
        legalAttachment: { type: DocumentType('Legal_Attachment') },
        approvedByAdmin: { type: GraphQLBoolean },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString }
    })
});