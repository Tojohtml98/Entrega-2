import Joi from 'joi';

// Esquema para crear un producto (POST)
export const createProductSchema = Joi.object({
    title: Joi.string()
        .min(1)
        .max(100)
        .required()
        .messages({
            'string.empty': 'El título es requerido',
            'string.min': 'El título debe tener al menos 1 carácter',
            'string.max': 'El título no puede exceder 100 caracteres',
            'any.required': 'El título es requerido'
        }),
    
    description: Joi.string()
        .min(1)
        .max(500)
        .required()
        .messages({
            'string.empty': 'La descripción es requerida',
            'string.min': 'La descripción debe tener al menos 1 carácter',
            'string.max': 'La descripción no puede exceder 500 caracteres',
            'any.required': 'La descripción es requerida'
        }),
    
    code: Joi.string()
        .min(1)
        .max(20)
        .required()
        .messages({
            'string.empty': 'El código es requerido',
            'string.min': 'El código debe tener al menos 1 carácter',
            'string.max': 'El código no puede exceder 20 caracteres',
            'any.required': 'El código es requerido'
        }),
    
    price: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
            'number.base': 'El precio debe ser un número',
            'number.positive': 'El precio debe ser mayor a 0',
            'any.required': 'El precio es requerido'
        }),
    
    status: Joi.boolean()
        .optional()
        .default(true)
        .messages({
            'boolean.base': 'El status debe ser verdadero o falso'
        }),
    
    stock: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            'number.base': 'El stock debe ser un número',
            'number.integer': 'El stock debe ser un número entero',
            'number.min': 'El stock no puede ser negativo',
            'any.required': 'El stock es requerido'
        }),
    
    category: Joi.string()
        .min(1)
        .max(50)
        .required()
        .messages({
            'string.empty': 'La categoría es requerida',
            'string.min': 'La categoría debe tener al menos 1 carácter',
            'string.max': 'La categoría no puede exceder 50 caracteres',
            'any.required': 'La categoría es requerida'
        }),
    
    thumbnails: Joi.array()
        .items(Joi.string().uri())
        .optional()
        .default([])
        .messages({
            'array.base': 'Los thumbnails deben ser un array',
            'string.uri': 'Cada thumbnail debe ser una URL válida'
        })
});

// Esquema para actualizar un producto (PUT) - todos los campos son opcionales
export const updateProductSchema = Joi.object({
    title: Joi.string()
        .min(1)
        .max(100)
        .optional()
        .messages({
            'string.empty': 'El título no puede estar vacío',
            'string.min': 'El título debe tener al menos 1 carácter',
            'string.max': 'El título no puede exceder 100 caracteres'
        }),
    
    description: Joi.string()
        .min(1)
        .max(500)
        .optional()
        .messages({
            'string.empty': 'La descripción no puede estar vacía',
            'string.min': 'La descripción debe tener al menos 1 carácter',
            'string.max': 'La descripción no puede exceder 500 caracteres'
        }),
    
    code: Joi.string()
        .min(1)
        .max(20)
        .optional()
        .messages({
            'string.empty': 'El código no puede estar vacío',
            'string.min': 'El código debe tener al menos 1 carácter',
            'string.max': 'El código no puede exceder 20 caracteres'
        }),
    
    price: Joi.number()
        .positive()
        .precision(2)
        .optional()
        .messages({
            'number.base': 'El precio debe ser un número',
            'number.positive': 'El precio debe ser mayor a 0'
        }),
    
    status: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'El status debe ser verdadero o falso'
        }),
    
    stock: Joi.number()
        .integer()
        .min(0)
        .optional()
        .messages({
            'number.base': 'El stock debe ser un número',
            'number.integer': 'El stock debe ser un número entero',
            'number.min': 'El stock no puede ser negativo'
        }),
    
    category: Joi.string()
        .min(1)
        .max(50)
        .optional()
        .messages({
            'string.empty': 'La categoría no puede estar vacía',
            'string.min': 'La categoría debe tener al menos 1 carácter',
            'string.max': 'La categoría no puede exceder 50 caracteres'
        }),
    
    thumbnails: Joi.array()
        .items(Joi.string().uri())
        .optional()
        .messages({
            'array.base': 'Los thumbnails deben ser un array',
            'string.uri': 'Cada thumbnail debe ser una URL válida'
        })
}).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar'
});
