import Joi from "joi";

export const UpdateUserSchema = {
    body: Joi.object({
        firstName: Joi.string().min(2).max(50),
        lastName: Joi.string().min(2).max(50),
        email: Joi.string().email({
            tlds: {
                allow: ['com', 'net', 'org']
            },
            maxDomainSegments: 2
        }).regex(/^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/),
        phone: Joi.string(),
        age: Joi.number(),
        gender: Joi.string(),
        DOB: Joi.date()
    })
}

export const GetUserSchema = {
    params: Joi.object({
        id: Joi.string().required()
    })
}

export const GetUserListSchema = {
    query: Joi.object({
        page: Joi.number().default(1),
        limit: Joi.number().default(10),
        search: Joi.string().allow(''),
        sort: Joi.string().allow(''),
        order: Joi.string().allow('')
    })
}

export const DeleteUserSchema = {
    params: Joi.object({
        id: Joi.string().required()
    })
}