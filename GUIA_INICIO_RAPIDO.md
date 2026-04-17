# ⚡ Guía de Inicio Rápido

## 🚀 Primeros Pasos

### 1. Abre la aplicación
```
Abre: app/index.html en tu navegador
```

### 2. Prueba las funciones principales

#### Cajero (Punto de Venta)
1. Haz click en **"Cajero"** en el menú
2. Busca productos por nombre
3. Click en un producto para agregar al carrito
4. Usa +/- para cambiar cantidad
5. Selecciona método de pago
6. Click en **"Completar Venta"**

#### Gestión de Productos
1. Ve a **"Productos"**
2. Click en **"Nuevo Producto"** para agregar
3. O click en ✏️ para editar existente
4. O click en 🗑️ para eliminar

#### Clientes y Proveedores
1. Accede a **"Clientes"** o **"Proveedores"**
2. Gestiona igual que productos

---

## 🆕 Entender la Nueva Estructura

### Antes (MONOLÍTICO)
```
app/
├── script.js (600+ líneas)
├── index.html
└── styles.css
```

### Ahora (MODULAR)
```
app/
├── js/
│   ├── app.js (main)
│   ├── config/
│   ├── services/
│   ├── modules/ (productos, carrito, ventas, etc)
│   └── utils/
├── index.html
└── styles.css
```

---

## 📝 Cómo Agregar una Nueva Funcionalidad

### Ejemplo: Agregar "Reportes de Stock"

#### Paso 1: Crear la carpeta
```
app/js/modules/
└── stock-reports/
    ├── stock-reports.service.js
    └── stock-reports.ui.js
```

#### Paso 2: Crear el servicio (lógica)
```javascript
// stock-reports.service.js
import * as api from '../../services/api.service.js';

export function getStockAnalysis() {
    const products = api.getAllProducts();
    return {
        totalItems: products.reduce((s,p) => s + p.stock, 0),
        byCategory: groupByCategory(products)
    };
}
```

#### Paso 3: Crear la UI (renderizado)
```javascript
// stock-reports.ui.js
import * as reportService from './stock-reports.service.js';

export function renderStockReport() {
    const data = reportService.getStockAnalysis();
    // Renderizar HTML...
}
```

#### Paso 4: Agregar a app.js
```javascript
import * as stockReportsUI from './modules/stock-reports/stock-reports.ui.js';

function initializeApp() {
    // ... código existente
    stockReportsUI.renderStockReport();
}
```

---

## 🔧 Cambios Comunes

### Cambiar el IVA
```javascript
// Abre: app/js/config/constants.js
export const APP_CONFIG = {
    TAX_RATE: 0.16,  // ← Cambiar aquí
    // ...
};
```

### Cambiar mensajes
```javascript
// Abre: app/js/config/constants.js
export const API_MESSAGES = {
    SUCCESS: 'Tu mensaje personalizado',
    // ...
};
```

### Agregar validación personalizada
```javascript
// Abre: app/js/utils/validators.js
export function validateCustom(value) {
    return value.length > 5;
}

// Úsalo en servicios:
import { validateCustom } from '../utils/validators.js';
```

---

## 🐛 Debugging

Abre la consola del navegador (F12) y usa:

```javascript
// Ver todas las estadísticas
window.app.stats()

// Ver carrito actual
window.app.cart()

// Ver todas las ventas
window.app.sales()

// Cambiar a otra sección
window.app.showSection('products')

// Recargar la app
window.app.reload()
```

---

## 📚 Archivos Importantes para Estudiar

### Recomendación de lectura (en orden)

1. **ARQUITECTURA.md** (visión global)
2. **app.js** (punto de entrada)
3. **product.service.js** (lógica +  validación)
4. **product.ui.js** (renderizado)
5. **api.service.js** (control de datos)

---

## ❓ Preguntas Frecuentes

### P: ¿Dónde agrego datos nuevos?
R: En `api.service.js` dentro de `store = { products: [...], ...}`

### P: ¿Cómo cambio la apariencia?
R: En `styles.css` (sin cambios en JS)

### P: ¿Cómo conecto a una BD real?
R: Modifica `api.service.js` para llamar a tu servidor

### P: ¿Puedo usar el carrito en otro módulo?
R: Sí, importa: `import * as cartService from '../cart/cart.service.js'`

### P: ¿Por qué hay dos archivos por módulo?
R: `.service.js` tiene lógica pura (sin DOM), `.ui.js` renderiza HTML

---

## 🎯 Próximos Desafíos

### Fácil
- [ ] Cambiar colores del dashboard
- [ ] Agregar más productos iniciales
- [ ] Cambiar mensajes de error

### Intermedio
- [ ] Agregar categorías a productos
- [ ] Generar reportes en PDF
- [ ] Guardar datos en localStorage

### Avanzado
- [ ] Conectar a Firebase
- [ ] Autenticación de usuarios
- [ ] Sincronización en tiempo real

---

## 📂 Resumen de Carpetas

| Carpeta | Qué va aquí | Ejemplo |
|---------|------------|---------|
| `config/` | Valores globales | IVA, mensajes, IDs HTML |
| `services/` | Funciones compartidas | CRUD, notificaciones |
| `modules/` | Features completas | productos, carrito, ventas |
| `utils/` | Funciones pequeñas reutilizables | formatear moneda, validar |

---

## 🎓 Conceptos de Programación

### Que aprendiste con esta refactorización:

✅ **Modularización** - Dividir código en piezas
✅ **Separación de responsabilidades** - Cada función tiene 1 propósito
✅ **Reutilización** - Código que se usa en varios lugares
✅ **Escalabilidad** - Fácil agregar sin romper lo existente
✅ **Mantenibilidad** - Otros pueden entender rápido
✅ **Testabilidad** - Código que puedes probar fácilmente

---

## 🆘 Necesitas Ayuda?

1. Lee los comentarios en los archivos `.js`
2. Consulta `ARQUITECTURA.md`
3. Busca funciones similares en otros módulos
4. Usa `window.app` en consola para debugging

---

**¡Felicidades!** 🎉  
Tu proyecto ahora es profesional y mantenible.  
Este es el nivel que buscan las empresas.
