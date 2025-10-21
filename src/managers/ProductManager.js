import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsPath = path.join(__dirname, '../../data/products.json');

class ProductManager {
    constructor() {
        this.products = [];
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(productsPath, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await this.saveProducts();
            } else {
                console.error('Error loading products:', error);
            }
        }
    }

    async saveProducts() {
        try {
            await fs.writeFile(productsPath, JSON.stringify(this.products, null, 2), 'utf-8');
        } catch (error) {
            console.error('Error saving products:', error);
            throw new Error('Failed to save products');
        }
    }

    async getProducts(limit) {
        if (limit) {
            return this.products.slice(0, limit);
        }
        return this.products;
    }

    async getProductById(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        return product;
    }

    async productExists(code) {
        return this.products.some(p => p.code === code);
    }

    async addProduct(productData) {
        // Generate code if not provided
        if (!productData.code) {
            productData.code = `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
        
        if (await this.productExists(productData.code)) {
            throw new Error('Ya existe un producto con el mismo código');
        }

        const newProduct = {
            id: uuidv4(),
            ...productData,
            status: productData.status !== undefined ? productData.status : true
        };

        this.products.push(newProduct);
        await this.saveProducts();
        return newProduct;
    }

    async updateProduct(id, updateData) {
        const productIndex = this.products.findIndex(p => p.id === id);
        
        if (productIndex === -1) {
            throw new Error('Producto no encontrado');
        }

        if (updateData.code && updateData.code !== this.products[productIndex].code) {
            if (await this.productExists(updateData.code)) {
                throw new Error('Ya existe otro producto con el mismo código');
            }
        }

        this.products[productIndex] = {
            ...this.products[productIndex],
            ...updateData,
            id // Ensure ID remains the same
        };

        await this.saveProducts();
        return this.products[productIndex];
    }

    async deleteProduct(id) {
        const productIndex = this.products.findIndex(p => p.id === id);
        
        if (productIndex === -1) {
            throw new Error('Producto no encontrado');
        }

        const [deletedProduct] = this.products.splice(productIndex, 1);
        await this.saveProducts();
        return deletedProduct;
    }

    async hasStock(productId, quantity = 1) {
        const product = await this.getProductById(productId);
        return product.stock >= quantity;
    }

    async updateStock(productId, quantity, action = 'decrement') {
        const productIndex = this.products.findIndex(p => p.id === productId);
        
        if (productIndex === -1) {
            throw new Error('Producto no encontrado');
        }

        if (action === 'decrement') {
            if (this.products[productIndex].stock < quantity) {
                throw new Error('Stock insuficiente');
            }
            this.products[productIndex].stock -= quantity;
        } else if (action === 'increment') {
            this.products[productIndex].stock += quantity;
        } else {
            throw new Error('Acción no válida para actualizar el stock');
        }

        await this.saveProducts();
        return this.products[productIndex];
    }
}

export default ProductManager;
