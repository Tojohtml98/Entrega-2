# E-commerce API con WebSockets

API REST para la gestión de productos y carritos de compra desarrollada con Node.js, Express, Handlebars y Socket.IO.

## Características

- ✅ Gestión completa de productos (CRUD)
- ✅ Gestión de carritos de compra
- ✅ **Vistas con Handlebars** (home y tiempo real)
- ✅ **WebSockets con Socket.IO** para actualizaciones en tiempo real
- ✅ Persistencia de datos en archivos JSON
- ✅ IDs autogenerados (UUID) para productos y carritos
- ✅ Validación de datos con Joi
- ✅ Manejo de errores consistente con códigos HTTP apropiados
- ✅ Validación de stock y existencia de productos
- ✅ Incremento automático de cantidad si el producto ya está en el carrito

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

## Vistas Disponibles

### 🏠 Vista Home (`/home`)
- Lista todos los productos en una interfaz web
- Diseño responsive con Bootstrap
- Navegación entre vistas

### ⚡ Vista Tiempo Real (`/realtimeproducts`)
- Lista de productos con actualizaciones en tiempo real
- Formulario para agregar nuevos productos
- Eliminación de productos con confirmación
- Indicador de conexión WebSocket
- Actualizaciones automáticas sin recargar la página

### Modo desarrollo (con auto-reload)

```bash
npm run dev
```

## Endpoints

### Vistas Web
- `GET /home` - Vista home con lista de productos
- `GET /realtimeproducts` - Vista en tiempo real con WebSockets

### API REST

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
Crea un nuevo producto con validación completa.

**Body:**
```json
{
  "title": "Producto de ejemplo",
  "description": "Descripción del producto",
  "code": "PROD001",
  "price": 100.50,
  "status": true,
  "stock": 50,
  "category": "Categoría",
  "thumbnails": ["https://example.com/image1.jpg"]
}
```

**Campos requeridos:** `title`, `description`, `code`, `price`, `stock`, `category`

**Campos opcionales:** `status` (default: true), `thumbnails` (default: [])

**Validaciones:**
- `title`: 1-100 caracteres
- `description`: 1-500 caracteres
- `code`: 1-20 caracteres, único
- `price`: número positivo con 2 decimales
- `stock`: entero no negativo
- `category`: 1-50 caracteres
- `thumbnails`: array de URLs válidas

**Respuesta:**
```json
{
  "status": "success",
  "message": "Producto creado exitosamente",
  "payload": {...}
}
```

**Errores:**
- `422`: Error de validación con detalles específicos
- `409`: Código de producto duplicado

#### PUT `/api/products/:pid`
Actualiza un producto existente.

**Body:** (campos a actualizar)
```json
{
  "price": 150.75,
  "stock": 30
}
```

**Validaciones:** Mismas que POST, pero todos los campos son opcionales

**Respuesta:**
```json
{
  "status": "success",
  "message": "Producto actualizado exitosamente",
  "payload": {...}
}
```

**Errores:**
- `404`: Producto no encontrado
- `422`: Error de validación
- `409`: Código duplicado

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

**Errores:**
- `404`: Producto no encontrado

### Carritos (`/api/carts`)

#### POST `/api/carts`
Crea un nuevo carrito vacío.

**Respuesta:**
```json
{
  "status": "success",
  "message": "Carrito creado exitosamente",
  "payload": {
    "id": "uuid-del-carrito",
    "products": []
  }
}
```

#### GET `/api/carts/:cid`
Obtiene los productos de un carrito.

**Validaciones:**
- `cid`: Debe ser un UUID válido

**Respuesta:**
```json
{
  "status": "success",
  "payload": {
    "id": "uuid-del-carrito",
    "products": [
      {
        "productId": "uuid-del-producto",
        "quantity": 2
      }
    ]
  }
}
```

**Errores:**
- `400`: UUID inválido
- `404`: Carrito no encontrado

#### POST `/api/carts/:cid/product/:pid`
Agrega un producto al carrito. Si el producto ya existe, incrementa su cantidad.

**Body:**
```json
{
  "quantity": 2
}
```

**Validaciones:**
- `cid`: UUID válido del carrito
- `pid`: UUID válido del producto
- `quantity`: Entero mayor a 0 (default: 1)

**Funcionalidades:**
- ✅ Valida que el carrito existe
- ✅ Valida que el producto existe
- ✅ Verifica stock disponible
- ✅ Si el producto ya está en el carrito, incrementa la cantidad
- ✅ Si no está, lo agrega como nuevo item
- ✅ Descuenta el stock del producto

**Respuesta:**
```json
{
  "status": "success",
  "message": "Producto agregado al carrito exitosamente",
  "payload": {...}
}
```

**Errores:**
- `400`: Parámetros inválidos o cantidad inválida
- `404`: Carrito o producto no encontrado
- `409`: Stock insuficiente (con detalles del stock disponible)

## Manejo de Errores

La API utiliza códigos de estado HTTP apropiados y mensajes de error consistentes:

### Códigos de Estado

- `200`: Operación exitosa
- `201`: Recurso creado exitosamente
- `400`: Error en los parámetros de la petición
- `404`: Recurso no encontrado
- `409`: Conflicto (código duplicado, stock insuficiente)
- `422`: Error de validación de datos
- `500`: Error interno del servidor

### Formato de Errores

```json
{
  "status": "error",
  "message": "Descripción del error",
  "errors": [
    {
      "field": "campo",
      "message": "Mensaje específico del error",
      "value": "valor proporcionado"
    }
  ]
}
```

## Estructura del Proyecto

```
src/
├── managers/
│   ├── ProductManager.js      # Lógica de negocio para productos
│   └── CartManager.js         # Lógica de negocio para carritos
├── routes/
│   ├── products.router.js     # Rutas de productos
│   ├── carts.router.js        # Rutas de carritos
│   └── views.router.js        # Rutas de vistas web
├── schemas/
│   ├── productSchemas.js      # Esquemas de validación para productos
│   └── cartSchemas.js         # Esquemas de validación para carritos
├── middlewares/
│   └── validation.js          # Middlewares de validación y manejo de errores
├── views/                     # Plantillas Handlebars
│   ├── home.handlebars        # Vista home
│   └── realTimeProducts.handlebars  # Vista tiempo real
└── app.js                     # Configuración principal con Socket.IO
```

## WebSockets

El proyecto incluye integración completa con Socket.IO para actualizaciones en tiempo real:

### Eventos del Servidor
- `productAdded`: Se emite cuando se agrega un nuevo producto
- `productDeleted`: Se emite cuando se elimina un producto
- `productsUpdated`: Se emite cuando se actualiza la lista de productos

### Eventos del Cliente
- `addProduct`: Envía datos de un nuevo producto al servidor
- `deleteProduct`: Solicita la eliminación de un producto

### Características WebSocket
- ✅ Conexión automática al cargar la vista tiempo real
- ✅ Indicador visual de estado de conexión
- ✅ Actualizaciones en tiempo real sin recargar página
- ✅ Sincronización entre múltiples clientes
- ✅ Manejo de errores de conexión

## Persistencia de Datos

Los datos se almacenan en archivos JSON en la carpeta `data/`:
- `products.json`: Almacena todos los productos
- `carts.json`: Almacena todos los carritos

Estos archivos se crean automáticamente al iniciar el servidor si no existen.

## Mejoras Implementadas

Basado en el feedback recibido, se implementaron las siguientes mejoras:

### ✅ Validación con Esquemas (Joi)
- Esquemas completos para POST/PUT de productos
- Validación de parámetros de ruta (UUIDs)
- Validación de body para agregar productos al carrito

### ✅ Manejo de Errores Mejorado
- Códigos HTTP apropiados (400, 404, 409, 422)
- Formato consistente de errores
- Mensajes claros y específicos

### ✅ Validación de Stock y Existencia
- Verificación real de existencia de productos
- Validación de stock disponible antes de agregar al carrito
- Mensajes de error claros cuando no hay stock suficiente

### ✅ Lógica de Carrito Mejorada
- Si el producto ya está en el carrito, se incrementa la cantidad
- No se duplican items en el carrito
- Gestión automática del stock

## Pruebas con Postman

Puedes probar todos los endpoints usando Postman o cualquier cliente HTTP.

### Ejemplo de flujo:

1. **Crear un producto:**
   ```
   POST http://localhost:8080/api/products
   Content-Type: application/json
   
   {
     "title": "Laptop Gaming",
     "description": "Laptop para gaming de alta gama",
     "code": "LAP001",
     "price": 1500.00,
     "stock": 10,
     "category": "Electrónicos"
   }
   ```

2. **Listar productos:**
   ```
   GET http://localhost:8080/api/products
   ```

3. **Crear un carrito:**
   ```
   POST http://localhost:8080/api/carts
   ```

4. **Agregar producto al carrito:**
   ```
   POST http://localhost:8080/api/carts/{cartId}/product/{productId}
   Content-Type: application/json
   
   {
     "quantity": 2
   }
   ```

5. **Ver el carrito:**
   ```
   GET http://localhost:8080/api/carts/{cartId}
   ```

## Licencia

ISC