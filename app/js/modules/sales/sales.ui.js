/**
 * =============================================================================
 * SALES UI - Renderizado de ventas y reportes
 * =============================================================================
 */

import * as salesService from './sales.service.js';
import * as cartService from '../cart/cart.service.js';
import { formatCurrency, formatDate } from '../../utils/formatters.js';
import * as notification from '../../services/notification.service.js';
import { API_MESSAGES } from '../../config/constants.js';

/**
 * Completa una venta desde la UI
 */
export function completeSaleFromUI() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
    const receivedAmount = parseFloat(document.getElementById('receivedAmount').value) || 0;
    const cartTotal = cartService.calculateCartTotal();

    const saleData = {
        paymentMethod,
        receivedAmount,
        total: cartTotal.total
    };

    const sale = salesService.processSale(saleData);
    
    if (sale) {
        const message = `Venta completada exitosamente!\n` +
            `Total: ${formatCurrency(sale.total)}\n` +
            `Método: ${sale.paymentMethod}\n` +
            `Cambio: ${formatCurrency(sale.change)}`;
        notification.showSuccess(message);
        
        // Actualizar UI
        window.cartUI?.renderCart?.();
        window.dashboardUI?.updateStats?.();
    }

    // Limpiar inputs
    document.getElementById('receivedAmount').value = '';
}

/**
 * Renderiza el historial de ventas
 */
export function renderSalesHistory() {
    const sales = salesService.getAllSales();
    const container = document.getElementById('salesHistory');
    
    if (!container) return;

    if (sales.length === 0) {
        container.innerHTML = '<p>No hay ventas registradas</p>';
        return;
    }

    let html = '<div class="sales-list">';
    
    sales.forEach(sale => {
        html += `
            <div class="sale-card">
                <div class="sale-header">
                    <span>Venta #${sale.id}</span>
                    <span>${formatDate(sale.date)}</span>
                </div>
                <div class="sale-details">
                    <p><strong>Total:</strong> ${formatCurrency(sale.total)}</p>
                    <p><strong>Método:</strong> ${sale.paymentMethod}</p>
                    <p><strong>Items:</strong> ${sale.items.length}</p>
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

/**
 * Renderiza un reporte de ventas por día
 */
export function renderDailyReport() {
    const revenue = salesService.getRevenueByPeriod('day');
    const container = document.getElementById('dailyReport');
    
    if (!container) return;

    if (Object.keys(revenue).length === 0) {
        container.innerHTML = '<p>No hay datos disponibles</p>';
        return;
    }

    let html = '<table><tr><th>Fecha</th><th>Ingresos</th></tr>';
    
    Object.entries(revenue).forEach(([date, total]) => {
        html += `<tr><td>${date}</td><td>${formatCurrency(total)}</td></tr>`;
    });

    html += '</table>';
    container.innerHTML = html;
}

/**
 * Exporta funciones para eventos HTML
 */
export const salesUI = {
    completeSale() {
        completeSaleFromUI();
    }
};

// Exponer en window para eventos HTML
window.salesUI = salesUI;
