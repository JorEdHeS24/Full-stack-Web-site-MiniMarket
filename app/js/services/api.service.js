/**
 * =============================================================================
 * API SERVICE - Gestiona la base de datos simulada
 * =============================================================================
 * Este servicio centraliza todas las operaciones CRUD
 * En el futuro, puede conectarse fácilmente a una API real (Firebase, etc)
 */

// Base de datos simulada
export let store = {
    products: [
        { id: 1, name: "Coca Cola 350ml", price: 2.50, barcode: "7501234567890", stock: 50 },
        { id: 2, name: "Pan de molde", price: 3.20, barcode: "7502234567891", stock: 25 },
        { id: 3, name: "Leche entera 1L", price: 4.80, barcode: "7503234567892", stock: 30 },
        { id: 4, name: "Arroz 1kg", price: 5.50, barcode: "7504234567893", stock: 40 },
        { id: 5, name: "Aceite girasol 500ml", price: 6.75, barcode: "7505234567894", stock: 20 },
        { id: 6, name: "Huevos docena", price: 4.20, barcode: "7506234567895", stock: 35 },
        { id: 7, name: "Papel higiénico 4 rollos", price: 8.90, barcode: "7507234567896", stock: 15 },
        { id: 8, name: "Jabón de manos", price: 3.45, barcode: "7508234567897", stock: 25 },
        { id: 9, name: "Pasta dental", price: 4.60, barcode: "7509234567898", stock: 18 },
        { id: 10, name: "Shampoo 400ml", price: 7.80, barcode: "7510234567899", stock: 22 },
        { id: 11, name: "Galletas Oreo", price: 3.90, barcode: "7511234567890", stock: 45 },
        { id: 12, name: "Yogurt natural", price: 2.80, barcode: "7512234567891", stock: 28 },
        { id: 13, name: "Café molido 250g", price: 6.20, barcode: "7513234567892", stock: 32 },
        { id: 14, name: "Azúcar 1kg", price: 3.75, barcode: "7514234567893", stock: 38 },
        { id: 15, name: "Sal 500g", price: 1.20, barcode: "7515234567894", stock: 55 },
        { id: 16, name: "Atún enlatado", price: 2.95, barcode: "7516234567895", stock: 42 },
        { id: 17, name: "Detergente líquido", price: 9.50, barcode: "7517234567896", stock: 12 },
        { id: 18, name: "Cerveza 6 pack", price: 12.80, barcode: "7518234567897", stock: 16 },
        { id: 19, name: "Queso fresco 250g", price: 5.40, barcode: "7519234567898", stock: 24 },
        { id: 20, name: "Mantequilla 200g", price: 4.85, barcode: "7520234567899", stock: 29 }
    ],
    clients: [
        { id: 1, name: "Juan Pérez", email: "juanperez@email.com", phone: "987654321", address: "Calle Falsa 123" },
        { id: 2, name: "María Gómez", email: "mariagomez@email.com", phone: "912345678", address: "Avenida Siempre Viva 742" },
        { id: 3, name: "Pedro López", email: "pedrolopez@email.com", phone: "987123456", address: "Calle Verdadera 456" },
        { id: 4, name: "Luisa Martínez", email: "luismartinez@email.com", phone: "963852741", address: "Avenida del Libertador 852" },
        { id: 5, name: "Carlos Sánchez", email: "carlossanchez@email.com", phone: "789456123", address: "Calle de la Paz 159" },
        { id: 6, name: "Ana Torres", email: "anatorres@email.com", phone: "654789321", address: "Avenida de Mayo 753" },
        { id: 7, name: "Jorge Díaz", email: "jorgediaz@email.com", phone: "321654987", address: "Calle de la Libertad 951" },
        { id: 8, name: "Laura Fernández", email: "laurafernandez@email.com", phone: "147258369", address: "Avenida de la República 159" }
    ],
    suppliers: [
        { id: 1, name: "Proveedor 1", contact: "Contacto 1", email: "proveedor1@email.com", phone: "987654321", address: "Calle Proveedor 1", products: "Producto A, Producto B" },
        { id: 2, name: "Proveedor 2", contact: "Contacto 2", email: "proveedor2@email.com", phone: "912345678", address: "Avenida Proveedor 2", products: "Producto C, Producto D" },
        { id: 3, name: "Proveedor 3", contact: "Contacto 3", email: "proveedor3@email.com", phone: "987123456", address: "Calle Proveedor 3", products: "Producto E, Producto F" },
        { id: 4, name: "Proveedor 4", contact: "Contacto 4", email: "proveedor4@email.com", phone: "963852741", address: "Avenida Proveedor 4", products: "Producto G, Producto H" },
        { id: 5, name: "Proveedor 5", contact: "Contacto 5", email: "proveedor5@email.com", phone: "789456123", address: "Calle Proveedor 5", products: "Producto I, Producto J" },
        { id: 6, name: "Proveedor 6", contact: "Contacto 6", email: "proveedor6@email.com", phone: "654789321", address: "Avenida Proveedor 6", products: "Producto K, Producto L" },
        { id: 7, name: "Proveedor 7", contact: "Contacto 7", email: "proveedor7@email.com", phone: "321654987", address: "Calle Proveedor 7", products: "Producto M, Producto N" },
        { id: 8, name: "Proveedor 8", contact: "Contacto 8", email: "proveedor8@email.com", phone: "147258369", address: "Avenida Proveedor 8", products: "Producto O, Producto P" }
    ],
    sales: [],
    saleCounter: 1
};

// ============== PRODUCTOS ==============

/**
 * Obtiene todos los productos
 */
export function getAllProducts() {
    return store.products;
}

/**
 * Obtiene un producto por ID
 */
export function getProductById(id) {
    return store.products.find(p => p.id === id);
}

/**
 * Crea un nuevo producto
 */
export function createProduct(productData) {
    const newProduct = {
        id: store.products.length ? Math.max(...store.products.map(p => p.id)) + 1 : 1,
        ...productData
    };
    store.products.push(newProduct);
    return newProduct;
}

/**
 * Actualiza un producto
 */
export function updateProduct(id, productData) {
    const product = getProductById(id);
    if (!product) return null;
    Object.assign(product, productData);
    return product;
}

/**
 * Elimina un producto
 */
export function deleteProduct(id) {
    const index = store.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    store.products.splice(index, 1);
    return true;
}

// ============== CLIENTES ==============

/**
 * Obtiene todos los clientes
 */
export function getAllClients() {
    return store.clients;
}

/**
 * Obtiene un cliente por ID
 */
export function getClientById(id) {
    return store.clients.find(c => c.id === id);
}

/**
 * Crea un nuevo cliente
 */
export function createClient(clientData) {
    const newClient = {
        id: store.clients.length ? Math.max(...store.clients.map(c => c.id)) + 1 : 1,
        ...clientData
    };
    store.clients.push(newClient);
    return newClient;
}

/**
 * Actualiza un cliente
 */
export function updateClient(id, clientData) {
    const client = getClientById(id);
    if (!client) return null;
    Object.assign(client, clientData);
    return client;
}

/**
 * Elimina un cliente
 */
export function deleteClient(id) {
    const index = store.clients.findIndex(c => c.id === id);
    if (index === -1) return false;
    store.clients.splice(index, 1);
    return true;
}

// ============== PROVEEDORES ==============

/**
 * Obtiene todos los proveedores
 */
export function getAllSuppliers() {
    return store.suppliers;
}

/**
 * Obtiene un proveedor por ID
 */
export function getSupplierById(id) {
    return store.suppliers.find(s => s.id === id);
}

/**
 * Crea un nuevo proveedor
 */
export function createSupplier(supplierData) {
    const newSupplier = {
        id: store.suppliers.length ? Math.max(...store.suppliers.map(s => s.id)) + 1 : 1,
        ...supplierData
    };
    store.suppliers.push(newSupplier);
    return newSupplier;
}

/**
 * Actualiza un proveedor
 */
export function updateSupplier(id, supplierData) {
    const supplier = getSupplierById(id);
    if (!supplier) return null;
    Object.assign(supplier, supplierData);
    return supplier;
}

/**
 * Elimina un proveedor
 */
export function deleteSupplier(id) {
    const index = store.suppliers.findIndex(s => s.id === id);
    if (index === -1) return false;
    store.suppliers.splice(index, 1);
    return true;
}

// ============== VENTAS ==============

/**
 * Obtiene todas las ventas
 */
export function getAllSales() {
    return store.sales;
}

/**
 * Registra una nueva venta
 */
export function recordSale(saleData) {
    const newSale = {
        id: store.saleCounter++,
        ...saleData,
        date: new Date().toLocaleString('es-ES')
    };
    store.sales.push(newSale);
    return newSale;
}

/**
 * Obtiene estadísticas de ventas
 */
export function getSalesStatistics() {
    return {
        totalSales: store.sales.length,
        totalRevenue: store.sales.reduce((sum, sale) => sum + sale.total, 0),
        averageSale: store.sales.length ? store.sales.reduce((sum, sale) => sum + sale.total, 0) / store.sales.length : 0
    };
}
