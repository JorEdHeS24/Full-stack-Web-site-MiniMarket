/**
 * =============================================================================
 * DASHBOARD SERVICE - Lógica de estadísticas y reportes
 * =============================================================================
 */

import * as productService from '../products/product.service.js';
import * as salesService from '../sales/sales.service.js';
import * as api from '../../services/api.service.js';

/**
 * Obtiene estadísticas generales del dashboard
 */
export function getDashboardStats() {
    const products = api.getAllProducts();
    const sales = salesService.getAllSales();

    return {
        totalProducts: products.length,
        totalSales: sales.length,
        totalRevenue: sales.reduce((sum, sale) => sum + sale.total, 0),
        lowStockProducts: productService.getLowStockProducts().length,
        totalClients: api.getAllClients().length,
        totalSuppliers: api.getAllSuppliers().length,
        averageOrderValue: sales.length ? sales.reduce((sum, sale) => sum + sale.total, 0) / sales.length : 0
    };
}

/**
 * Obtiene resumen de inventario
 */
export function getInventorySummary() {
    const products = api.getAllProducts();
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const totalItems = products.reduce((sum, p) => sum + p.stock, 0);
    const lowStock = productService.getLowStockProducts();

    return {
        totalProducts: products.length,
        totalItems,
        totalValue,
        lowStockCount: lowStock.length,
        lowStockProducts: lowStock
    };
}

/**
 * Obtiene resumen de ventas
 */
export function getSalesSummary() {
    const stats = salesService.getSalesStatistics();
    const allSales = salesService.getAllSales();

    return {
        totalSales: stats.totalSales,
        totalRevenue: stats.totalRevenue,
        averageSale: stats.averageSale,
        topProduct: salesService.getTopSellingProduct(),
        mostUsedPayment: salesService.getMostUsedPaymentMethod(),
        revenueByDay: salesService.getRevenueByPeriod('day')
    };
}

/**
 * Obtiene datos para gráfico de ventas por categoría
 */
export function getCategoryChartData() {
    return {
        labels: ['Bebidas', 'Alimentos', 'Higiene', 'Otros'],
        data: [2500, 3200, 1800, 2100]
    };
}

/**
 * Obtiene datos para gráfico de métodos de pago
 */
export function getPaymentMethodChartData() {
    const sales = salesService.getAllSales();
    const methods = {};

    sales.forEach(sale => {
        methods[sale.paymentMethod] = (methods[sale.paymentMethod] || 0) + 1;
    });

    return {
        labels: Object.keys(methods),
        data: Object.values(methods)
    };
}

/**
 * Obtiene tendencia de ventas (últimos 7 días o similar)
 */
export function getSalesTrendData() {
    const revenue = salesService.getRevenueByPeriod('day');
    
    return {
        labels: Object.keys(revenue),
        data: Object.values(revenue)
    };
}

/**
 * Obtiene productos más vendidos
 */
export function getTopSellingProducts(limit = 5) {
    const sales = salesService.getAllSales();
    const productSales = {};

    sales.forEach(sale => {
        sale.items.forEach(item => {
            if (!productSales[item.id]) {
                productSales[item.id] = {
                    product: item,
                    quantitySold: 0,
                    revenue: 0
                };
            }
            productSales[item.id].quantitySold += item.quantity;
            productSales[item.id].revenue += item.price * item.quantity;
        });
    });

    return Object.values(productSales)
        .sort((a, b) => b.quantitySold - a.quantitySold)
        .slice(0, limit);
}

/**
 * Obtiene alertas y notificaciones importantes
 */
export function getAlerts() {
    const alerts = [];
    const inventory = getInventorySummary();

    if (inventory.lowStockCount > 0) {
        alerts.push({
            type: 'warning',
            message: `${inventory.lowStockCount} productos con bajo stock`,
            products: inventory.lowStockProducts
        });
    }

    const stats = getDashboardStats();
    if (stats.totalSales === 0) {
        alerts.push({
            type: 'info',
            message: 'Aún no hay ventas registradas'
        });
    }

    return alerts;
}
