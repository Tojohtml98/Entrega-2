import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductManager {
    constructor() {
        this.path = path.join(__dirname, '../../data/products.json');
        this.products = [];
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
            await this.loadProducts();
        } catch (error) {
            console.error('Error al inicializar ProductManager:', error);
        }
    }

    // Cargar productos desde el archivo
    async loadProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            this.products = [];
        }
    }

    // Guardar productos en el archivo
    async saveProducts() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error('Error al guardar productos:', error);
            throw error;
        }
    }

    // Generar un ID único
    generateId() {
        if (this.products.length === 0) {
            return 1;
        }
        const maxId = Math.max(...this.products.map(p => parseInt(p.id) || 0));
        return maxId + 1;
    }

    // Obtener todos los productos
    async getProducts() {
        await this.loadProducts();
        return this.products;
    }

    // Obtener un producto por ID
    async getProductById(id) {
        await this.loadProducts();
        const product = this.products.find(p => p.id == id);
        return product || null;
    }

    // Agregar un nuevo producto
    async addProduct(productData) {
        await this.loadProducts();

        // Validar campos requeridos
        const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
        for (const field of requiredFields) {
            if (!productData[field]) {
                throw new Error(`El campo ${field} es requerido`);
            }
        }

        // Verificar que el código no esté repetido
        const codeExists = this.products.some(p => p.code === productData.code);
        if (codeExists) {
            throw new Error('El código del producto ya existe');
        }

        // Crear el nuevo producto
        const newProduct = {
            id: this.generateId(),
            title: productData.title,
            description: productData.description,
            code: productData.code,
            price: parseFloat(productData.price),
            status: productData.status !== undefined ? productData.status : true,
            stock: parseInt(productData.stock),
            category: productData.category,
            thumbnails: productData.thumbnails || []
        };

        this.products.push(newProduct);
        await this.saveProducts();
        return newProduct;
    }

    // Actualizar un producto
    async updateProduct(id, updateData) {
        await this.loadProducts();

        const index = this.products.findIndex(p => p.id == id);
        if (index === -1) {
            throw new Error('Producto no encontrado');
        }

        // No permitir actualizar el ID
        if (updateData.id) {
            delete updateData.id;
        }

        // Si se actualiza el código, verificar que no esté repetido
        if (updateData.code) {
            const codeExists = this.products.some(p => p.code === updateData.code && p.id != id);
            if (codeExists) {
                throw new Error('El código del producto ya existe');
            }
        }

        // Actualizar solo los campos proporcionados
        this.products[index] = {
            ...this.products[index],
            ...updateData,
            id: this.products[index].id // Asegurar que el ID no cambie
        };

        await this.saveProducts();
        return this.products[index];
    }

    // Eliminar un producto
    async deleteProduct(id) {
        await this.loadProducts();

        const index = this.products.findIndex(p => p.id == id);
        if (index === -1) {
            throw new Error('Producto no encontrado');
        }

        const deletedProduct = this.products.splice(index, 1)[0];
        await this.saveProducts();
        return deletedProduct;
    }
}

export default ProductManager;
