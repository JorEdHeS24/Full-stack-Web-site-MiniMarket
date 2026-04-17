# 🏪 MiniMarket - Arquitectura Modular

## 📋 Estructura del Proyecto

```
app/
├── index.html                 # Página principal
├── styles.css                 # Estilos globales
│
└── js/                       # Lógica de la aplicación (ES6 Modules)
    ├── app.js                # Punto de entrada principal
    ├── config/               # Configuración
    │   └── constants.js      # Constantes globales
    │
    ├── services/             # Servicios generales
    │   ├── api.service.js    # CRUD para base de datos simulada
    │   └── notification.service.js  # Notificaciones al usuario
    │
    ├── modules/              # Módulos de negocio (Feature)
    │   ├── products/
    │   │   ├── product.service.js   # Lógica de productos
    │   │   └── product.ui.js        # UI de productos
    │   │
    │   ├── clients/
    │   │   ├── client.service.js
    │   │   └── client.ui.js
    │   │
    │   ├── suppliers/
    │   │   ├── supplier.service.js
    │   │   └── supplier.ui.js
    │   │
    │   ├── cart/
    │   │   ├── cart.service.js      # Lógica del carrito
    │   │   └── cart.ui.js           # Renderizado del carrito
    │   │
    │   ├── sales/
    │   │   ├── sales.service.js     # Procesar ventas
    │   │   └── sales.ui.js          # Reportes de ventas
    │   │
    │   └── dashboard/
    │       ├── dashboard.service.js # Estadísticas
    │       └── dashboard.ui.js      # Renderizado dashboard
    │
    └── utils/               # Utilidades reutilizables
        ├── validators.js    # Validaciones
        ├── formatters.js    # Formateo de datos
        └── helpers.js       # Funciones auxiliares
```

## 🏗️ Arquitectura

### Capas de la Aplicación

| Capa | Responsabilidad | Ejemplos |
|------|-----------------|----------|
| **app.js** | Orquestación y flujo | Inicialización, eventos, navegación |
| **Service** (lógica) | Lógica de negocio pura | Calcular totales, validar stock, procesar ventas |
| **UI** (presentación) | Renderizado del DOM | Dibujar tablas, actualizar carrito |
| **Servicios Generales** | Operaciones transversales | API (CRUD), notificaciones |
| **Utilidades** | Funciones reutilizables | Validar emails, formatear moneda |

### Separación de Responsabilidades

```
┌─────────────────────────────────────────┐
│           app.js (Orquestador)          │
└─────────────┬───────────────────────────┘
              │
    ┌─────────┼─────────┐
    │         │         │
┌───▼─────┐  │      ┌──▼──────┐
│ Services│  │      │UI Layers│
│(Negocio)│  │      │(Render) │
└─────────┘  │      └─────────┘
             │
   ┌─────────▼──────────┐
   │  General Services  │
   │  (API, Notif)      │
   └────────────────────┘
```

## 🚀 Cómo Usar

### 1. Agregar Productos al Carrito

```javascript
// En product.ui.js o directamente
import * as cartService from '../cart/cart.service.js';

// Agregar 1 unidad
cartService.addProductToCart(product);

// O agregar cantidad específica
cartService.addProductToCart(product, 5);
```

### 2. Procesar una Venta

```javascript
import * as salesService from  '../sales/sales.service.js';

const sale = salesService.processSale({
    paymentMethod: 'efectivo',
    receivedAmount: 100,
    total: 89.50
});
```

### 3. Obtener Estadísticas

```javascript
import * as dashboardService from '../dashboard/dashboard.service.js';

const stats = dashboardService.getDashboardStats();
console.log(stats);
// {
//   totalProducts: 20,
//   totalSales: 5,
//   totalRevenue: 450.75,
//   lowStockProducts: 2,
//   ...
// }
```

## 📝 Convenciones

### Nombres de Archivos
- `*.service.js` - Contiene lógica de negocio
- `*.ui.js` - Contiene renderizado y DOM

### Nombres de Funciones
- `getAllXxx()` - Obtener todos los elementos
- `getXxxById(id)` - Obtener un elemento específico
- `createXxx(data)` - Crear un nuevo elemento
- `updateXxx(id, data)` - Actualizar elemento
- `deleteXxx(id)` - Eliminar elemento
- `renderXxx()` - Renderizar en DOM

### Estructura de Módulos

Cada módulo (product, client, cart, etc) tiene:
```
module/
├── module.service.js   # Lógica pura (sin DOM)
└── module.ui.js        # Renderizado HTML
```

## 🔄 Flujo de Datos

```
Usuario hace click
        ↓
   HTML event
        ↓
    UI Layer (xxx.ui.js)
        ↓
 Valida y prepara datos
        ↓
Service Layer (xxx.service.js)
        ↓
  Lógica de negocio
        ↓
API Service (CRUD)
        ↓
 Base de datos simulada
        ↓
 Retorna datos al Service
        ↓
UI actualiza con nuevos datos
```

## ✅ Ventajas de esta Arquitectura

✨ **Modular**: Cada módulo es independiente
🔧 **Mantenible**: Código organizado y fácil de encontrar
🧪 **Testeable**: Lógica separada de UI
♻️ **Reutilizable**: Servicios compartibles
📈 **Escalable**: Fácil agregar nuevas funciones
🔌 **Desacoplado**: Cambios locales, no globales

## 🛠️ Migración a API Real

Para conectar con un servidor real (Firebase, Node.js, etc), solo necesitas actualizar `api.service.js`:

```javascript
// Cambiar de simulado a real
export async function getAllProducts() {
    const response = await fetch('https://api.ejemplo.com/products');
    return response.json();
}
```

Todos los módulos seguirán funcionando sin cambios.

## 📚 Ejemplos Prácticos

### Buscar productos
```javascript
import * as productService from '../modules/products/product.service.js';

const results = productService.searchProducts('coca');
```

### Calcular descuento
```javascript
import * as cartService from '../modules/cart/cart.service.js';

const totales = cartService.applyDiscount(10); // 10% descuento
```

### Obtener alertas
```javascript
import * as dashboardService from '../modules/dashboard/dashboard.service.js';

const alerts = dashboardService.getAlerts();
```

## 🐛 Debugging

En la consola del navegador:
```javascript
// Ver estadísticas
window.app.stats()

// Ver carrito actual
window.app.cart()

// Ver todas las ventas
window.app.sales()

// Cambiar sección
window.app.showSection('products')

// Recargar aplicación
window.app.reload()
```

---

**Creado**: Marzo 2026  
**Proyecto**: MiniMarket - Ingeniería de Software  
**Arquitectura**: Modular con ES6 Modules
