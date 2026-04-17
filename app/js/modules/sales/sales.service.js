/**
 * =============================================================================
 * SALES SERVICE - Lógica de procesamiento de ventas
 * =============================================================================
 */

import * as api from '../../services/api.service.js';
import * as cartService from '../cart/cart.service.js';
import * as productService from '../products/product.service.js';
import * as notification from '../../services/notification.service.js';
import { calculateChange } from '../../utils/helpers.js';
import { API_MESSAGES } from '../../config/constants.js';

/**
 * Valida que una venta pueda procesarse
 * @param {object} saleData - Datos de la venta
 * @returns {object} {valid: boolean, message: string}
 */
export function validateSale(saleData) {
    if (cartService.isCartEmpty()) {
        return { valid: false, message: 'El carrito está vacío' };
    }

    if (!saleData.paymentMethod) {
        return { valid: false, message: 'Selecciona un método de pago' };
    }

    if (saleData.paymentMethod === 'efectivo') {
        if (!saleData.receivedAmount || saleData.receivedAmount < saleData.total) {
            return { valid: false, message: 'El monto recibido es insuficiente' };
        }
    }

    return { valid: true };
}

/**
 * Procesa una venta completa
 * @param {object} saleData - Datos de la venta
 * @returns {object|null} Venta registrada o null si hay error
 */
export function processSale(saleData) {
    // Validar
    const validation = validateSale(saleData);
    if (!validation.valid) {
        notification.showError(validation.message);
        return null;
    }

    try {
        // 1. Copiar el carrito actual
        const cartItems = cartService.getCart();
        const cartTotal = cartService.calculateCartTotal();

        // 2. Reducir stock de productos
        cartItems.forEach(item => {
            if (!productService.reduceProductStock(item.id, item.quantity)) {
                throw new Error(`No se pudo reducir el stock del producto: ${item.name}`);
            }
        });

        // 3. Registrar la venta
        const sale = api.recordSale({
            items: cartItems,
            subtotal: cartTotal.subtotal,
            tax: cartTotal.tax,
            total: cartTotal.total,
            paymentMethod: saleData.paymentMethod,
            receivedAmount: saleData.receivedAmount || cartTotal.total,
            change: calculateChange(saleData.receivedAmount || cartTotal.total, cartTotal.total)
        });

        // 4. Limpiar carrito
        cartService.clearCart();

        return sale;
    } catch (error) {
        notification.showError(error.message || API_MESSAGES.ERROR);
        return null;
    }
}

/**
 * Obtiene todas las ventas
 */
export function getAllSales() {
    return api.getAllSales();
}

/**
 * Obtiene estadísticas de ventas
 */
export function getSalesStatistics() {
    return api.getSalesStatistics();
}

/**
 * Obtiene ventas de un día específico
 * @param {string} date - Fecha en formato 'YYYY-MM-DD'
 */
export function getSalesByDate(date) {
    return getAllSales().filter(sale =>
        sale.date.split(',')[0] === date
    );
}

/**
 * Obtiene el producto más vendido
 */
export function getTopSellingProduct() {
    const sales = getAllSales();
    const productSales = {};

    sales.forEach(sale => {
        sale.items.forEach(item => {
            productSales[item.id] = (productSales[item.id] || 0) + item.quantity;
        });
    });

    const topProductId = Object.entries(productSales)
        .sort(([, a], [, b]) => b - a)[0]?.[0];

    if (!topProductId) return null;

    return {
        product: api.getProductById(parseInt(topProductId)),
        quantitySold: productSales[topProductId]
    };
}

/**
 * Obtiene el método de pago más usado
 */
export function getMostUsedPaymentMethod() {
    const sales = getAllSales();
    if (sales.length === 0) return null;

    const paymentMethods = {};
    sales.forEach(sale => {
        paymentMethods[sale.paymentMethod] = (paymentMethods[sale.paymentMethod] || 0) + 1;
    });

    const topMethod = Object.entries(paymentMethods)
        .sort(([, a], [, b]) => b - a)[0]?.[0];

    return topMethod || null;
}

/**
 * Calcula ingresos por período
 * @param {string} period - 'day', 'week', 'month', 'year'
 */
export function getRevenueByPeriod(period = 'day') {
    const sales = getAllSales();
    const revenue = {};

    sales.forEach(sale => {
        const date = new Date(sale.date);
        let key;

        switch (period) {
            case 'day':
                key = date.toLocaleDateString('es-ES');
                break;
            case 'week':
                const week = Math.ceil((date.getDate()) / 7);
                key = `Semana ${week}`;
                break;
            case 'month':
                key = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
                break;
            case 'year':
                key = date.getFullYear();
                break;
        }

        revenue[key] = (revenue[key] || 0) + sale.total;
    });

    return revenue;
}
