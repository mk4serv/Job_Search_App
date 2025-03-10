import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLID } from "graphql"

export const ImageType = (name)=>{
    return new GraphQLObjectType({
        name:name||'ImageType',
        description: `Image Type for ${name}`,
        fields: {
            secure_url: { type: GraphQLString, description: 'Secure URL of the image' },
            public_id: { type: GraphQLString, description: 'Public ID of the image' }
        }
    })
}

export const DocumentType = (name)=>{
    return new GraphQLObjectType({
        name:name||'DocumentType',
        description: `Document Type for ${name}`,
        fields: {
            secure_url: { type: GraphQLString, description: 'Secure URL of the document' },
            public_id: { type: GraphQLString, description: 'Public ID of the document' }
        }
    })
}


export const HRsArrayType = new GraphQLObjectType({
    name: 'HRsArray',
    description: 'Array of HR ObjectIds',
    fields: {
        HRs: { type: new GraphQLList(GraphQLID), description: 'List of HR user ObjectIds' }
    }
});