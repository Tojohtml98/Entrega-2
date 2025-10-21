import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

// GET /home - Vista home con lista de productos
router.get('/home', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { 
            title: 'Lista de Productos',
            products: products
        });
    } catch (error) {
        res.status(500).render('error', {
            title: 'Error',
            message: error.message
        });
    }
});

// GET /realtimeproducts - Vista en tiempo real con WebSockets
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { 
            title: 'Productos en Tiempo Real',
            products: products
        });
    } catch (error) {
        res.status(500).render('error', {
            title: 'Error',
            message: error.message
        });
    }
});

export default router;
