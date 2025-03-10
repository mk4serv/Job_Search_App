import { GraphQLBoolean, GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";
import { ImageType } from "./common.types.js";

export const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'User Type',
    fields: ({
        id: { type: GraphQLID },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        role: { type: GraphQLString },
        provider: { type: GraphQLString },
        gender: { type: GraphQLString },
        DOB: { type: GraphQLString },
        phone: { type: GraphQLString },
        profilePic: { type: ImageType('Profile_Pic') },
        coverPic: { type: ImageType('Cover_Pic') },
        isConfirmed: { type: GraphQLBoolean },
        isDeleted: { type: GraphQLBoolean },
        deletedAt: { type: GraphQLString },
        changeCredentialTime: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString }
    })
});