import { Router } from 'express';
import CartManager from '../managers/CartManager.js';
import { addProductToCartSchema, cartParamsSchema } from '../schemas/cartSchemas.js';
import { validateSchema, validateParams } from '../middlewares/validation.js';

const router = Router();
const cartManager = new CartManager();

// POST / - Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({
            status: 'success',
            message: 'Carrito creado exitosamente',
            payload: newCart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// GET /:cid - Obtener los productos de un carrito
router.get('/:cid', async (req, res, next) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid);
        
        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado'
            });
        }

        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        next(error);
    }
});

// POST /:cid/product/:pid - Agregar un producto al carrito
router.post('/:cid/product/:pid', 
    validateSchema(addProductToCartSchema), 
    async (req, res, next) => {
    try {
        const { cid, pid } = req.params;
        const { quantity = 1 } = req.body;
        
        const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);
        
        res.json({
            status: 'success',
            message: 'Producto agregado al carrito exitosamente',
            payload: updatedCart
        });
    } catch (error) {
        next(error);
    }
});

export default router;
