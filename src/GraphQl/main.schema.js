import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { dashboardField } from "./Fields/index.js";

export const mainSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'MainQuerySchema',
        description: 'Main Query Schema',
        fields: {
            ...dashboardField.Query
        }
    }),
});