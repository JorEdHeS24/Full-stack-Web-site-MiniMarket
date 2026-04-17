/**
 * =============================================================================
 * CONSTANTS - Constantes globales del proyecto
 * =============================================================================
 * Centraliza todos los valores que se reutilizan en toda la aplicación
 */

export const APP_CONFIG = {
    TAX_RATE: 0.19, // 19% IVA
    CURRENCY_FORMAT: 'es-ES',
    CURRENCY_SYMBOL: '$',
    LOW_STOCK_THRESHOLD: 10,
    DATE_FORMAT: 'es-ES'
};

export const API_MESSAGES = {
    SUCCESS: 'Operación completada exitosamente',
    ERROR: 'Ocurrió un error. Por favor, intenta de nuevo.',
    CONFIRM_DELETE: '¿Estás seguro de que deseas eliminar este elemento?',
    INSUFFICIENT_STOCK: 'Stock insuficiente',
    SAVE_SUCCESS: 'Guardado exitosamente',
    UPDATE_SUCCESS: 'Actualizado exitosamente',
    DELETE_SUCCESS: 'Eliminado exitosamente',
    INVALID_INPUT: 'Por favor, completa todos los campos correctamente.'
};

export const ELEMENT_IDS = {
    // Productos
    PRODUCTS_GRID: 'productsGrid',
    PRODUCT_SEARCH: 'productSearch',
    PRODUCTS_TABLE: '#productos-section .table-content tbody',
    
    // Carrito
    CART_ITEMS: 'cartItems',
    CART_TOTAL: 'cartTotal',
    SUBTOTAL: 'subtotal',
    TAX: 'tax',
    TOTAL: 'total',
    RECEIVED_AMOUNT: 'receivedAmount',
    COMPLETE_BTN: 'completeBtn',
    
    // Dashboard
    TOTAL_PRODUCTS: 'totalProducts',
    TOTAL_SALES: 'totalSales',
    TOTAL_REVENUE: 'totalRevenue',
    LOW_STOCK_PRODUCTS: 'lowStockProducts',
    
    // Clientes
    CLIENTS_TABLE: '#clientes-section .table-content tbody',
    
    // Proveedores
    SUPPLIERS_TABLE: '#proveedor-section .table-content tbody'
};
