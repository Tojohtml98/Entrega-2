import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import { errorHandler } from './middlewares/validation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT = 8080;

// Configurar Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Hacer io disponible globalmente
app.set('io', io);

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        message: 'API de E-commerce',
        endpoints: {
            products: '/api/products',
            carts: '/api/carts',
            home: '/home',
            realtime: '/realtimeproducts'
        }
    });
});

// Importar y usar rutas
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

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

// Configurar Socket.IO
io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);
    
    // Manejar agregar producto desde el cliente
    socket.on('addProduct', async (productData) => {
        try {
            const ProductManager = (await import('./managers/ProductManager.js')).default;
            const productManager = new ProductManager();
            const newProduct = await productManager.addProduct(productData);
            
            // Emitir a todos los clientes conectados
            io.emit('productAdded', newProduct);
        } catch (error) {
            socket.emit('error', { message: error.message });
        }
    });
    
    // Manejar eliminar producto desde el cliente
    socket.on('deleteProduct', async (productId) => {
        try {
            const ProductManager = (await import('./managers/ProductManager.js')).default;
            const productManager = new ProductManager();
            await productManager.deleteProduct(productId);
            
            // Emitir a todos los clientes conectados
            io.emit('productDeleted', productId);
        } catch (error) {
            socket.emit('error', { message: error.message });
        }
    });
    
    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
