/**
 * =============================================================================
 * DASHBOARD UI - Renderizado del dashboard
 * =============================================================================
 */

import * as dashboardService from './dashboard.service.js';
import { formatCurrency } from '../../utils/formatters.js';
import { ELEMENT_IDS } from '../../config/constants.js';
import { getElement } from '../../utils/helpers.js';

/**
 * Actualiza las estadísticas del dashboard
 */
export function updateDashboardStats() {
    const stats = dashboardService.getDashboardStats();

    const elements = {
        totalProducts: getElement(`#${ELEMENT_IDS.TOTAL_PRODUCTS}`),
        totalSales: getElement(`#${ELEMENT_IDS.TOTAL_SALES}`),
        totalRevenue: getElement(`#${ELEMENT_IDS.TOTAL_REVENUE}`),
        lowStockProducts: getElement(`#${ELEMENT_IDS.LOW_STOCK_PRODUCTS}`)
    };

    if (elements.totalProducts) elements.totalProducts.textContent = stats.totalProducts;
    if (elements.totalSales) elements.totalSales.textContent = stats.totalSales;
    if (elements.totalRevenue) elements.totalRevenue.textContent = formatCurrency(stats.totalRevenue);
    if (elements.lowStockProducts) elements.lowStockProducts.textContent = stats.lowStockProducts;
}

/**
 * Renderiza las alertas del dashboard
 */
export function renderDashboardAlerts() {
    const alerts = dashboardService.getAlerts();
    const container = getElement('#dashboardAlerts');

    if (!container) return;

    if (alerts.length === 0) {
        container.innerHTML = '<p class="alert-success">✅ Todo está en orden</p>';
        return;
    }

    let html = '';
    alerts.forEach(alert => {
        const alertClass = `alert-${alert.type}`;
        html += `<div class="${alertClass}">${alert.message}</div>`;
    });

    container.innerHTML = html;
}

/**
 * Renderiza productos con bajo stock
 */
export function renderLowStockProducts() {
    const inventory = dashboardService.getInventorySummary();
    const container = getElement('#lowStockList');

    if (!container) return;

    if (inventory.lowStockProducts.length === 0) {
        container.innerHTML = '<p>No hay productos con bajo stock</p>';
        return;
    }

    let html = '<ul>';
    inventory.lowStockProducts.forEach(product => {
        html += `<li>${product.name} - Stock: ${product.stock}</li>`;
    });
    html += '</ul>';

    container.innerHTML = html;
}

/**
 * Renderiza top de productos más vendidos
 */
export function renderTopSellingProducts() {
    const topProducts = dashboardService.getTopSellingProducts(5);
    const container = getElement('#topSellingProducts');

    if (!container) return;

    if (topProducts.length === 0) {
        container.innerHTML = '<p>No hay datos disponibles</p>';
        return;
    }

    let html = '<table><tr><th>Producto</th><th>Vendidos</th><th>Ingresos</th></tr>';
    
    topProducts.forEach(item => {
        html += `
            <tr>
                <td>${item.product.name}</td>
                <td>${item.quantitySold}</td>
                <td>${formatCurrency(item.revenue)}</td>
            </tr>
        `;
    });

    html += '</table>';
    container.innerHTML = html;
}

/**
 * Exporta funciones para la aplicación
 */
export const dashboardUI = {
    updateStats: updateDashboardStats,
    refreshAlerts: renderDashboardAlerts,
    refreshLowStock: renderLowStockProducts,
    refreshTopProducts: renderTopSellingProducts
};

// Exponer en window
window.dashboardUI = dashboardUI;
