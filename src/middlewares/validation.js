import Joi from 'joi';
import { createValidator } from 'express-joi-validation';

const validator = createValidator({ passError: true });

// Product schema for creation
const productSchema = Joi.object({
    title: Joi.string().required().min(3).max(100),
    description: Joi.string().required().min(10).max(500),
    code: Joi.string().required().min(3).max(20),
    price: Joi.number().required().min(0).precision(2),
    status: Joi.boolean().default(true),
    stock: Joi.number().integer().required().min(0),
    category: Joi.string().required().min(3).max(50),
    thumbnails: Joi.array().items(Joi.string().uri()).default([])
});

// Product schema for updates (all fields optional)
const productUpdateSchema = Joi.object({
    title: Joi.string().min(3).max(100),
    description: Joi.string().min(10).max(500),
    code: Joi.string().min(3).max(20),
    price: Joi.number().min(0).precision(2),
    status: Joi.boolean(),
    stock: Joi.number().integer().min(0),
    category: Joi.string().min(3).max(50),
    thumbnails: Joi.array().items(Joi.string().uri())
}).min(1);

// Cart item schema
const cartItemSchema = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().integer().min(1).default(1)
});

// Error handling middleware
const validationErrorHandler = (err, req, res, next) => {
    if (err && err.error && err.error.isJoi) {
        const errors = err.error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message.replace(/['"]/g, '')
        }));

        return res.status(422).json({
            status: 'error',
            message: 'Validation error',
            errors
        });
    }
    next(err);
};

export {
    validator,
    productSchema,
    productUpdateSchema,
    cartItemSchema,
    validationErrorHandler
};
