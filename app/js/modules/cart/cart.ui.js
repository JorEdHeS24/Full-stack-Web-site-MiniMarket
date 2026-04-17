/**
 * =============================================================================
 * CART UI - Renderizado del carrito
 * =============================================================================
 */

import * as cartService from './cart.service.js';
import { formatCurrency } from '../../utils/formatters.js';
import { ELEMENT_IDS } from '../../config/constants.js';
import { getElement } from '../../utils/helpers.js';

/**
 * Renderiza el contenido del carrito
 */
export function renderCart() {
    const cartItems = getElement(`#${ELEMENT_IDS.CART_ITEMS}`);
    const cartTotal = getElement(`#${ELEMENT_IDS.CART_TOTAL}`);
    const completeBtn = getElement(`#${ELEMENT_IDS.COMPLETE_BTN}`);

    if (!cartItems || !cartTotal || !completeBtn) return;

    const cartData = cartService.getCart();

    if (cartData.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>No hay productos en el carrito</p>
                <p style="font-size: 14px; margin-top: 8px;">Busca y agrega productos para comenzar</p>
            </div>
        `;
        cartTotal.style.display = 'none';
        completeBtn.disabled = true;
        return;
    }

    cartItems.innerHTML = '';

    cartData.forEach(item => {
        const itemTotal = item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatCurrency(item.price)} c/u</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="window.cartUI?.decrementItem(${item.id})">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="window.cartUI?.incrementItem(${item.id})">+</button>
            </div>
            <div style="font-weight: 600;">${formatCurrency(itemTotal)}</div>
        `;
        cartItems.appendChild(cartItem);
    });

    // Actualizar totales
    const totals = cartService.calculateCartTotal();
    getElement(`#${ELEMENT_IDS.SUBTOTAL}`).textContent = formatCurrency(totals.subtotal);
    getElement(`#${ELEMENT_IDS.TAX}`).textContent = formatCurrency(totals.tax);
    getElement(`#${ELEMENT_IDS.TOTAL}`).textContent = formatCurrency(totals.total);

    cartTotal.style.display = 'block';
    completeBtn.disabled = false;
}

/**
 * Exporta funciones para eventos HTML
 */
export const cartUI = {
    addToCartFromUI(product) {
        if (cartService.addProductToCart(product)) {
            renderCart();
        }
    },
    
    incrementItem(productId) {
        if (cartService.incrementCartItem(productId)) {
            renderCart();
        }
    },
    
    decrementItem(productId) {
        if (cartService.decrementCartItem(productId)) {
            renderCart();
        }
    }
};

// Exponer en window para eventos HTML
window.cartUI = cartUI;
