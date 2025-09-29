<<<<<<< HEAD
# API REST - E-commerce

API REST para la gestión de productos y carritos de compra desarrollada con Node.js y Express.

## Características

- Gestión completa de productos (CRUD)
- Gestión de carritos de compra
- Persistencia de datos en archivos JSON
- IDs autogenerados para productos y carritos

## Requisitos

- Node.js (v14 o superior)
- npm

## Instalación

1. Clonar el repositorio
2. Instalar las dependencias:

```bash
npm install
```

## Uso

### Iniciar el servidor

```bash
npm start
```

El servidor se ejecutará en `http://localhost:8080`

### Modo desarrollo (con auto-reload)

```bash
npm run dev
```

## Endpoints

### Productos (`/api/products`)

#### GET `/api/products`
Lista todos los productos.

**Respuesta:**
```json
{
  "status": "success",
  "payload": [...]
}
```

#### GET `/api/products/:pid`
Obtiene un producto por su ID.

**Respuesta:**
```json
{
  "status": "success",
  "payload": {...}
}
```

#### POST `/api/products`
Crea un nuevo producto.

**Body:**
```json
{
  "title": "Producto de ejemplo",
  "description": "Descripción del producto",
  "code": "PROD001",
  "price": 100,
  "status": true,
  "stock": 50,
  "category": "Categoría",
  "thumbnails": ["url1", "url2"]
}
```

**Campos requeridos:** `title`, `description`, `code`, `price`, `stock`, `category`

**Campos opcionales:** `status` (default: true), `thumbnails` (default: [])

**Respuesta:**
```json
{
  "status": "success",
  "message": "Producto creado exitosamente",
  "payload": {...}
}
```

#### PUT `/api/products/:pid`
Actualiza un producto existente.

**Body:** (campos a actualizar)
```json
{
  "price": 150,
  "stock": 30
}
```

**Nota:** No se puede actualizar el campo `id`.

**Respuesta:**
```json
{
  "status": "success",
  "message": "Producto actualizado exitosamente",
  "payload": {...}
}
```

#### DELETE `/api/products/:pid`
Elimina un producto.

**Respuesta:**
```json
{
  "status": "success",
  "message": "Producto eliminado exitosamente",
  "payload": {...}
}
```

### Carritos (`/api/carts`)

#### POST `/api/carts`
Crea un nuevo carrito vacío.

**Respuesta:**
```json
{
  "status": "success",
  "message": "Carrito creado exitosamente",
  "payload": {
    "id": 1,
    "products": []
  }
}
```

#### GET `/api/carts/:cid`
Obtiene los productos de un carrito.

**Respuesta:**
```json
{
  "status": "success",
  "payload": {
    "id": 1,
    "products": [
      {
        "product": 1,
        "quantity": 2
      }
    ]
  }
}
```

#### POST `/api/carts/:cid/product/:pid`
Agrega un producto al carrito. Si el producto ya existe, incrementa su cantidad.

**Respuesta:**
```json
{
  "status": "success",
  "message": "Producto agregado al carrito exitosamente",
  "payload": {...}
}
```

## Estructura del Proyecto

```
new-proyect/
├── src/
│   ├── managers/
│   │   ├── ProductManager.js
│   │   └── CartManager.js
│   ├── routes/
│   │   ├── products.router.js
│   │   └── carts.router.js
│   └── app.js
├── data/
│   ├── products.json
│   └── carts.json
├── package.json
├── .gitignore
└── README.md
```

## Persistencia de Datos

Los datos se almacenan en archivos JSON en la carpeta `data/`:
- `products.json`: Almacena todos los productos
- `carts.json`: Almacena todos los carritos

Estos archivos se crean automáticamente al iniciar el servidor si no existen.

## Pruebas con Postman

Puedes probar todos los endpoints usando Postman o cualquier cliente HTTP de tu preferencia.

### Ejemplo de flujo:

1. Crear un producto:
   - POST `http://localhost:8080/api/products`
   - Body: JSON con los datos del producto

2. Listar productos:
   - GET `http://localhost:8080/api/products`

3. Crear un carrito:
   - POST `http://localhost:8080/api/carts`

4. Agregar producto al carrito:
   - POST `http://localhost:8080/api/carts/1/product/1`

5. Ver el carrito:
   - GET `http://localhost:8080/api/carts/1`

## Licencia

ISC
=======
# Entrega-1
>>>>>>> 781739ca549ca621637075eeeaf4ca53d270f063
