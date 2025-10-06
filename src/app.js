import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { errorHandler } from './middlewares/validation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        message: 'API de E-commerce',
        endpoints: {
            products: '/api/products',
            carts: '/api/carts'
        }
    });
});

// Importar y usar rutas
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta para manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Ruta no encontrada',
        path: req.path
    });
});

// Manejador de errores global
app.use(errorHandler);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
