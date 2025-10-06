import Joi from 'joi';

// Middleware genérico para validar con Joi
export const validateSchema = (schema, property = 'body') => {
    return (req, res, next) => {
        const dataToValidate = req[property];
        
        const { error, value } = schema.validate(dataToValidate, {
            abortEarly: false, // Mostrar todos los errores
            stripUnknown: true, // Eliminar campos no definidos en el esquema
            convert: true // Convertir tipos cuando sea posible
        });

        if (error) {
            const errorDetails = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
                value: detail.context?.value
            }));

            return res.status(422).json({
                status: 'error',
                message: 'Error de validación',
                errors: errorDetails
            });
        }

        // Reemplazar los datos con los validados y convertidos
        req[property] = value;
        next();
    };
};

// Middleware para validar parámetros de ruta
export const validateParams = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.params, {
            abortEarly: false,
            stripUnknown: true,
            convert: true
        });

        if (error) {
            const errorDetails = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
                value: detail.context?.value
            }));

            return res.status(400).json({
                status: 'error',
                message: 'Parámetros de ruta inválidos',
                errors: errorDetails
            });
        }

        req.params = value;
        next();
    };
};

// Middleware para manejar errores de manera consistente
export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Error de validación de Joi (ya manejado arriba)
    if (err.isJoi) {
        return res.status(422).json({
            status: 'error',
            message: 'Error de validación',
            errors: err.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
                value: detail.context?.value
            }))
        });
    }

    // Error de producto no encontrado
    if (err.message === 'Producto no encontrado') {
        return res.status(404).json({
            status: 'error',
            message: 'Producto no encontrado'
        });
    }

    // Error de carrito no encontrado
    if (err.message === 'Carrito no encontrado') {
        return res.status(404).json({
            status: 'error',
            message: 'Carrito no encontrado'
        });
    }

    // Error de código duplicado
    if (err.message.includes('Ya existe') && err.message.includes('código')) {
        return res.status(409).json({
            status: 'error',
            message: err.message
        });
    }

    // Error de stock insuficiente
    if (err.message.includes('Stock insuficiente')) {
        return res.status(409).json({
            status: 'error',
            message: err.message
        });
    }

    // Error de producto no encontrado en carrito
    if (err.message.includes('no encontrado en el carrito')) {
        return res.status(404).json({
            status: 'error',
            message: err.message
        });
    }

    // Error de cantidad inválida
    if (err.message.includes('cantidad')) {
        return res.status(400).json({
            status: 'error',
            message: err.message
        });
    }

    // Error genérico del servidor
    res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor'
    });
};