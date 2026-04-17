/**
 * =============================================================================
 * PRODUCT UI - Renderizado de productos
 * =============================================================================
 */

import * as productService from './product.service.js';
import { formatCurrency } from '../../utils/formatters.js';
import { ELEMENT_IDS } from '../../config/constants.js';
import { getElement } from '../../utils/helpers.js';

/**
 * Renderiza la grilla de productos para el cajero
 * @param {array} filteredProducts - Productos a mostrar
 */
export function renderProductsGrid(filteredProducts = null) {
    const products = filteredProducts || productService.getAllProducts();
    const grid = getElement(`#${ELEMENT_IDS.PRODUCTS_GRID}`);
    
    if (!grid) return;
    
    grid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.onclick = () => window.cartUI?.addToCartFromUI(product);
        productCard.innerHTML = `
            <div class="product-name">${product.name}</div>
            <div class="product-price">${formatCurrency(product.price)}</div>
            <div class="product-stock">Stock: ${product.stock}</div>
        `;
        grid.appendChild(productCard);
    });
}

/**
 * Renderiza la tabla de productos (gestión)
 */
export function renderProductsTable() {
    const products = productService.getAllProducts();
    const tbody = document.querySelector(ELEMENT_IDS.PRODUCTS_TABLE);
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.barcode}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>${product.stock}</td>
            <td>
                <button class="action-btn btn-edit" onclick="window.productUI?.editProductFromUI(${product.id})">✏️ Editar</button>
                <button class="action-btn btn-delete" onclick="window.productUI?.deleteProductFromUI(${product.id})">🗑️ Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Abre el modal para editar un producto
 */
export function openEditProductModal(productId) {
    const product = productService.getAllProducts().find(p => p.id === productId);
    if (!product) return;

    const modal = getElement('#editProductModal');
    if (!modal) return;

    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductStock').value = product.stock;
    
    modal.classList.add('show');
}

/**
 * Cierra el modal de edición
 */
export function closeEditProductModal() {
    const modal = getElement('#editProductModal');
    if (modal) {
        modal.classList.remove('show');
        const form = getElement('#editProductForm');
        if (form) form.reset();
    }
}

/**
 * Abre el modal para crear un producto
 */
export function openAddProductModal() {
    const modal = getElement('#addProductModal');
    if (modal) modal.classList.add('show');
}

/**
 * Cierra el modal de creación
 */
export function closeAddProductModal() {
    const modal = getElement('#addProductModal');
    if (modal) {
        modal.classList.remove('show');
        const form = getElement('#addProductForm');
        if (form) form.reset();
    }
}

/**
 * Exporta funciones para eventos HTML
 */
export const productUI = {
    editProductFromUI(productId) {
        openEditProductModal(productId);
    },
    deleteProductFromUI(productId) {
        if (productService.deleteExistingProduct(productId)) {
            renderProductsTable();
        }
    }
};

// Exponer en window para eventos HTML
window.productUI = productUI;
