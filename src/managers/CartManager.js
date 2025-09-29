import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CartManager {
    constructor() {
        this.path = path.join(__dirname, '../../data/carts.json');
        this.carts = [];
        this.init();
    }

    // Inicializar el archivo si no existe
    async init() {
        try {
            const dir = path.dirname(this.path);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            if (!fs.existsSync(this.path)) {
                await fs.promises.writeFile(this.path, JSON.stringify([], null, 2));
            }
            await this.loadCarts();
        } catch (error) {
            console.error('Error al inicializar CartManager:', error);
        }
    }

    // Cargar carritos desde el archivo
    async loadCarts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data);
        } catch (error) {
            console.error('Error al cargar carritos:', error);
            this.carts = [];
        }
    }

    // Guardar carritos en el archivo
    async saveCarts() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.error('Error al guardar carritos:', error);
            throw error;
        }
    }

    // Generar un ID único
    generateId() {
        if (this.carts.length === 0) {
            return 1;
        }
        const maxId = Math.max(...this.carts.map(c => parseInt(c.id) || 0));
        return maxId + 1;
    }

    // Crear un nuevo carrito
    async createCart() {
        await this.loadCarts();

        const newCart = {
            id: this.generateId(),
            products: []
        };

        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    }

    // Obtener un carrito por ID
    async getCartById(id) {
        await this.loadCarts();
        const cart = this.carts.find(c => c.id == id);
        return cart || null;
    }

    // Agregar un producto al carrito
    async addProductToCart(cartId, productId) {
        await this.loadCarts();

        const cartIndex = this.carts.findIndex(c => c.id == cartId);
        if (cartIndex === -1) {
            throw new Error('Carrito no encontrado');
        }

        const cart = this.carts[cartIndex];
        
        // Buscar si el producto ya existe en el carrito
        const productIndex = cart.products.findIndex(p => p.product == productId);

        if (productIndex !== -1) {
            // Si el producto ya existe, incrementar la cantidad
            cart.products[productIndex].quantity += 1;
        } else {
            // Si el producto no existe, agregarlo con cantidad 1
            cart.products.push({
                product: productId,
                quantity: 1
            });
        }

        this.carts[cartIndex] = cart;
        await this.saveCarts();
        return cart;
    }

    // Obtener todos los carritos (opcional, para debugging)
    async getCarts() {
        await this.loadCarts();
        return this.carts;
    }
}

export default CartManager;
