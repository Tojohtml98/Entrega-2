import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import ProductManager from './ProductManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cartsPath = path.join(__dirname, '../../data/carts.json');

class CartManager {
    constructor() {
        this.carts = [];
        this.productManager = new ProductManager();
        this.loadCarts();
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(cartsPath, 'utf-8');
            this.carts = JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await this.saveCarts();
            } else {
                console.error('Error loading carts:', error);
            }
        }
    }

    async saveCarts() {
        try {
            await fs.writeFile(cartsPath, JSON.stringify(this.carts, null, 2), 'utf-8');
        } catch (error) {
            console.error('Error saving carts:', error);
            throw new Error('Failed to save carts');
        }
    }

    async createCart() {
        const newCart = {
            id: uuidv4(),
            products: []
        };

        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    }

    async getCartById(cartId) {
        const cart = this.carts.find(c => c.id === cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        return cart;
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        // Validate quantity
        if (!Number.isInteger(quantity) || quantity < 1) {
            throw new Error('La cantidad debe ser un número entero mayor a 0');
        }

        // Check if product exists and has enough stock
        const product = await this.productManager.getProductById(productId);
        if (!product) {
            throw new Error('Producto no encontrado');
        }

        if (!(await this.productManager.hasStock(productId, quantity))) {
            throw new Error('Stock insuficiente para el producto');
        }

        const cart = await this.getCartById(cartId);
        
        // Check if product already exists in cart
        const existingProductIndex = cart.products.findIndex(p => p.productId === productId);
        
        if (existingProductIndex >= 0) {
            // Update quantity if product already in cart
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            // Add new product to cart
            cart.products.push({
                productId,
                quantity
            });
        }

        // Decrease product stock
        await this.productManager.updateStock(productId, quantity, 'decrement');
        
        // Save changes
        await this.saveCarts();
        return cart;
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await this.getCartById(cartId);
        const productIndex = cart.products.findIndex(p => p.productId === productId);
        
        if (productIndex === -1) {
            throw new Error('Producto no encontrado en el carrito');
        }

        // Get quantity to return to stock
        const { quantity } = cart.products[productIndex];
        
        // Remove product from cart
        cart.products.splice(productIndex, 1);
        
        // Return stock
        await this.productManager.updateStock(productId, quantity, 'increment');
        
        // Save changes
        await this.saveCarts();
        return cart;
    }

    async updateProductQuantity(cartId, productId, newQuantity) {
        // Validate quantity
        if (!Number.isInteger(newQuantity) || newQuantity < 1) {
            throw new Error('La cantidad debe ser un número entero mayor a 0');
        }

        const cart = await this.getCartById(cartId);
        const productInCart = cart.products.find(p => p.productId === productId);
        
        if (!productInCart) {
            throw new Error('Producto no encontrado en el carrito');
        }

        const quantityDifference = newQuantity - productInCart.quantity;
        
        if (quantityDifference > 0) {
            // Increasing quantity - check stock
            if (!(await this.productManager.hasStock(productId, quantityDifference))) {
                throw new Error('Stock insuficiente para la cantidad solicitada');
            }
            await this.productManager.updateStock(productId, quantityDifference, 'decrement');
        } else if (quantityDifference < 0) {
            // Decreasing quantity - return stock
            await this.productManager.updateStock(productId, -quantityDifference, 'increment');
        }

        // Update quantity in cart
        productInCart.quantity = newQuantity;
        
        // Save changes
        await this.saveCarts();
        return cart;
    }

    async clearCart(cartId) {
        const cart = await this.getCartById(cartId);
        
        // Return all products to stock
        for (const item of cart.products) {
            try {
                await this.productManager.updateStock(item.productId, item.quantity, 'increment');
            } catch (error) {
                console.error(`Error returning product ${item.productId} to stock:`, error);
            }
        }
        
        // Clear cart
        cart.products = [];
        
        // Save changes
        await this.saveCarts();
        return cart;
    }

    async deleteCart(cartId) {
        const cartIndex = this.carts.findIndex(c => c.id === cartId);
        
        if (cartIndex === -1) {
            throw new Error('Carrito no encontrado');
        }

        // Return all products to stock before deleting
        const cart = this.carts[cartIndex];
        for (const item of cart.products) {
            try {
                await this.productManager.updateStock(item.productId, item.quantity, 'increment');
            } catch (error) {
                console.error(`Error returning product ${item.productId} to stock:`, error);
            }
        }
        
        // Remove cart
        this.carts.splice(cartIndex, 1);
        
        // Save changes
        await this.saveCarts();
    }
}

export default CartManager;
