import Joi from 'joi';

// Esquema para agregar producto al carrito (POST /:cid/product/:pid)
export const addProductToCartSchema = Joi.object({
    quantity: Joi.number()
        .integer()
        .min(1)
        .optional()
        .default(1)
        .messages({
            'number.base': 'La cantidad debe ser un número',
            'number.integer': 'La cantidad debe ser un número entero',
            'number.min': 'La cantidad debe ser mayor a 0'
        })
});

// Esquema para validar parámetros de ruta
export const cartParamsSchema = Joi.object({
    cid: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'El ID del carrito debe ser un UUID válido',
            'any.required': 'El ID del carrito es requerido'
        }),
    
    pid: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'El ID del producto debe ser un UUID válido',
            'any.required': 'El ID del producto es requerido'
        })
});
