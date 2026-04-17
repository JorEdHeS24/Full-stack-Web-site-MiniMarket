/**
 * =============================================================================
 * CART SERVICE - Lógica del carrito de compras
 * =============================================================================
 */

import * as productService from '../products/product.service.js';
import * as notification from '../../services/notification.service.js';
import { validateQuantity } from '../../utils/validators.js';
import { calculateTaxedTotal } from '../../utils/helpers.js';
import { APP_CONFIG, API_MESSAGES } from '../../config/constants.js';

// Estado del carrito
export let cart = [];

/**
 * Obtiene el carrito actual
 */
export function getCart() {
    return [...cart]; // Retorna una copia para evitar modificaciones directas
}

/**
 * Verifica si el carrito está vacío
 */
export function isCartEmpty() {
    return cart.length === 0;
}

/**
 * Añade un producto al carrito
 * @param {object} product - Producto a añadir
 * @param {number} quantity - Cantidad (opcional, default 1)
 * @returns {boolean}
 */
export function addProductToCart(product, quantity = 1) {
    if (!product) {
        notification.showError('Producto no válido');
        return false;
    }

    if (!validateQuantity(quantity, product.stock)) {
        notification.showError(API_MESSAGES.INSUFFICIENT_STOCK);
        return false;
    }

    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (!validateQuantity(newQuantity, product.stock)) {
            notification.showError(API_MESSAGES.INSUFFICIENT_STOCK);
            return false;
        }
        existingItem.quantity = newQuantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }

    return true;
}

/**
 * Actualiza la cantidad de un producto en el carrito
 * @param {number} productId - ID del producto
 * @param {number} newQuantity - Nueva cantidad
 * @returns {boolean}
 */
export function updateCartItemQuantity(productId, newQuantity) {
    const cartItem = cart.find(item => item.id === productId);

    if (!cartItem) {
        notification.showError('Producto no encontrado en el carrito');
        return false;
    }

    if (newQuantity <= 0) {
        return removeFromCart(productId);
    }

    if (!validateQuantity(newQuantity, cartItem.stock)) {
        notification.showError(API_MESSAGES.INSUFFICIENT_STOCK);
        return false;
    }

    cartItem.quantity = newQuantity;
    return true;
}

/**
 * Incrementa la cantidad de un producto
 * @param {number} productId - ID del producto
 * @returns {boolean}
 */
export function incrementCartItem(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem) return false;

    return updateCartItemQuantity(productId, cartItem.quantity + 1);
}

/**
 * Decrementa la cantidad de un producto
 * @param {number} productId - ID del producto
 * @returns {boolean}
 */
export function decrementCartItem(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem) return false;

    return updateCartItemQuantity(productId, cartItem.quantity - 1);
}

/**
 * Elimina un producto del carrito
 * @param {number} productId - ID del producto
 * @returns {boolean}
 */
export function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index === -1) return false;

    cart.splice(index, 1);
    return true;
}

/**
 * Calcula el total del carrito
 * @returns {object} {subtotal, tax, total}
 */
export function calculateCartTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const { tax, total } = calculateTaxedTotal(subtotal, APP_CONFIG.TAX_RATE);

    return {
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(total.toFixed(2))
    };
}

/**
 * Obtiene el número de items en el carrito
 */
export function getCartItemCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

/**
 * Obtiene el peso total del carrito (si existe peso en productos)
 */
export function getCartWeight() {
    return cart.reduce((weight, item) => weight + ((item.weight || 0) * item.quantity), 0);
}

/**
 * Vacía el carrito
 * @returns {boolean}
 */
export function clearCart() {
    const hadItems = cart.length > 0;
    cart = [];
    return hadItems;
}

/**
 * Aplica un descuento manual al total
 * @param {number} discountPercent - Porcentaje de descuento
 * @returns {object} Totales con descuento aplicado
 */
export function applyDiscount(discountPercent) {
    const totals = calculateCartTotal();
    const discountAmount = totals.subtotal * (discountPercent / 100);
    const newSubtotal = totals.subtotal - discountAmount;
    const { tax, total } = calculateTaxedTotal(newSubtotal, APP_CONFIG.TAX_RATE);

    return {
        subtotal: parseFloat(newSubtotal.toFixed(2)),
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        discountPercent: discountPercent,
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(total.toFixed(2))
    };
}
