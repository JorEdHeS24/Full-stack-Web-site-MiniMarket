/**
 * =============================================================================
 * PRODUCT SERVICE - Lógica de negocio para productos
 * =============================================================================
 */

import * as api from '../../services/api.service.js';
import * as notification from '../../services/notification.service.js';
import { validateRequired, validatePrice, validateStock } from '../../utils/validators.js';
import { getNextId } from '../../utils/helpers.js';
import { API_MESSAGES } from '../../config/constants.js';

/**
 * Obtiene todos los productos
 */
export function getAllProducts() {
    return api.getAllProducts();
}

/**
 * Busca productos por nombre
 * @param {string} searchTerm - Término de búsqueda
 * @returns {array} Productos filtrados
 */
export function searchProducts(searchTerm) {
    const term = String(searchTerm).toLowerCase();
    return getAllProducts().filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.barcode.includes(term)
    );
}

/**
 * Obtiene productos con bajo stock
 * @param {number} threshold - Umbral de stock bajo
 * @returns {array}
 */
export function getLowStockProducts(threshold = 10) {
    return getAllProducts().filter(product => product.stock <= threshold);
}

/**
 * Obtiene estadísticas de productos
 */
export function getProductsStatistics() {
    const products = getAllProducts();
    return {
        total: products.length,
        lowStock: getLowStockProducts().length,
        totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0)
    };
}

/**
 * Crea un nuevo producto con validación
 * @param {object} productData - Datos del producto
 * @returns {object|null}
 */
export function createNewProduct(productData) {
    // Validar datos requeridos
    if (!validateRequired(productData.name)) {
        notification.showError('El nombre del producto es requerido');
        return null;
    }

    if (!validatePrice(productData.price)) {
        notification.showError('El precio debe ser mayor a 0');
        return null;
    }

    if (!validateStock(productData.stock)) {
        notification.showError('El stock debe ser un número válido');
        return null;
    }

    const newProduct = api.createProduct(productData);
    notification.showSuccess(API_MESSAGES.SAVE_SUCCESS);
    return newProduct;
}

/**
 * Actualiza un producto existente
 * @param {number} id - ID del producto
 * @param {object} productData - Nuevos datos
 * @returns {object|null}
 */
export function updateExistingProduct(id, productData) {
    // Validaciones
    if (!validatePrice(productData.price)) {
        notification.showError('El precio debe ser mayor a 0');
        return null;
    }

    if (!validateStock(productData.stock)) {
        notification.showError('El stock debe ser un número válido');
        return null;
    }

    const updated = api.updateProduct(id, productData);
    if (!updated) {
        notification.showError('Producto no encontrado');
        return null;
    }

    notification.showSuccess(API_MESSAGES.UPDATE_SUCCESS);
    return updated;
}

/**
 * Elimina un producto
 * @param {number} id - ID del producto
 * @returns {boolean}
 */
export function deleteExistingProduct(id) {
    if (!notification.showConfirm(API_MESSAGES.CONFIRM_DELETE)) {
        return false;
    }

    const deleted = api.deleteProduct(id);
    if (!deleted) {
        notification.showError('Producto no encontrado');
        return false;
    }

    notification.showSuccess(API_MESSAGES.DELETE_SUCCESS);
    return true;
}

/**
 * Reduce el stock de un producto
 * @param {number} productId - ID del producto
 * @param {number} quantity - Cantidad a restar
 * @returns {boolean}
 */
export function reduceProductStock(productId, quantity) {
    const product = api.getProductById(productId);
    if (!product) return false;

    const newStock = product.stock - quantity;
    if (newStock < 0) return false;

    return api.updateProduct(productId, { stock: newStock }) !== null;
}

/**
 * Incrementa el stock de un producto
 * @param {number} productId - ID del producto
 * @param {number} quantity - Cantidad a añadir
 * @returns {boolean}
 */
export function increaseProductStock(productId, quantity) {
    const product = api.getProductById(productId);
    if (!product) return false;

    return api.updateProduct(productId, { stock: product.stock + quantity }) !== null;
}
