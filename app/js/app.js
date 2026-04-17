/**
 * =============================================================================
 * APP.JS - Punto de entrada de la aplicación
 * =============================================================================
 * Este archivo orquesta la inicialización de todos los módulos
 */

// ============ IMPORTAR MÓDULOS ============

// Services
import * as notificationService from './services/notification.service.js';

// Modules - Products
import * as productService from './modules/products/product.service.js';
import * as productUI from './modules/products/product.ui.js';

// Modules - Clients
import * as clientService from './modules/clients/client.service.js';
import * as clientUI from './modules/clients/client.ui.js';

// Modules - Suppliers
import * as supplierService from './modules/suppliers/supplier.service.js';
import * as supplierUI from './modules/suppliers/supplier.ui.js';

// Modules - Cart
import * as cartService from './modules/cart/cart.service.js';
import * as cartUI from './modules/cart/cart.ui.js';

// Modules - Sales
import * as salesService from './modules/sales/sales.service.js';
import * as salesUI from './modules/sales/sales.ui.js';

// Modules - Dashboard
import * as dashboardService from './modules/dashboard/dashboard.service.js';
import * as dashboardUI from './modules/dashboard/dashboard.ui.js';

// ============ INICIALIZACIÓN ============

/**
 * Inicializa la aplicación cuando el DOM está listo
 */
async function initializeApp() {
    console.log('🚀 Inicializando MiniMarket...');

    try {
        // 1. Renderizar productos
        productUI.renderProductsGrid();
        productUI.renderProductsTable();

        // 2. Renderizar clientes
        clientUI.renderClientsTable();

        // 3. Renderizar proveedores
        supplierUI.renderSuppliersTable();

        // 4. Renderizar carrito
        cartUI.renderCart();

        // 5. Actualizar dashboard
        dashboardUI.updateStats();
        dashboardUI.refreshAlerts();
        dashboardUI.refreshLowStock();
        dashboardUI.refreshTopProducts();

        // 6. Configurar event listeners
        setupEventListeners();

        console.log('✅ MiniMarket inicializado correctamente');
        notificationService.showInfo('¡Bienvenido a MiniMarket!');
    } catch (error) {
        console.error('❌ Error al inicializar la aplicación:', error);
        notificationService.showError('Error al inicializar la aplicación');
    }
}

/**
 * Configura todos los event listeners
 */
function setupEventListeners() {
    // ===== Buscadores =====
    const productSearch = document.getElementById('productSearch');
    if (productSearch) {
        productSearch.addEventListener('input', (e) => {
            const filtered = productService.searchProducts(e.target.value);
            productUI.renderProductsGrid(filtered);
        });
    }

    // ===== Formularios de Productos =====
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(addProductForm);
            const product = productService.createNewProduct({
                name: formData.get('newProductName'),
                price: parseFloat(formData.get('newProductPrice')),
                stock: parseInt(formData.get('newProductStock')),
                barcode: formData.get('newProductBarcode') || `BC-${Date.now()}`
            });

            if (product) {
                productUI.renderProductsTable();
                productUI.closeAddProductModal();
                dashboardUI.updateStats();
            }
        });
    }

    const editProductForm = document.getElementById('editProductForm');
    if (editProductForm) {
        editProductForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = parseInt(document.getElementById('editProductId').value);
            const product = productService.updateExistingProduct(id, {
                name: document.getElementById('editProductName').value,
                price: parseFloat(document.getElementById('editProductPrice').value),
                stock: parseInt(document.getElementById('editProductStock').value)
            });

            if (product) {
                productUI.renderProductsTable();
                productUI.closeEditProductModal();
                dashboardUI.updateStats();
            }
        });
    }

    // ===== Formularios de Clientes =====
    const addClientForm = document.getElementById('addClientForm');
    if (addClientForm) {
        addClientForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const client = clientService.createNewClient({
                name: document.getElementById('newClientName').value,
                email: document.getElementById('newClientEmail').value,
                phone: document.getElementById('newClientPhone').value,
                address: document.getElementById('newClientAddress').value
            });

            if (client) {
                clientUI.renderClientsTable();
                addClientForm.reset();
                dashboardUI.updateStats();
            }
        });
    }

    const editClientForm = document.getElementById('editClientForm');
    if (editClientForm) {
        editClientForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = parseInt(document.getElementById('editClientId').value);
            const client = clientService.updateExistingClient(id, {
                name: document.getElementById('editClientName').value,
                email: document.getElementById('editClientEmail').value,
                phone: document.getElementById('editClientPhone').value,
                address: document.getElementById('editClientAddress').value
            });

            if (client) {
                clientUI.renderClientsTable();
                clientUI.closeEditClientModal();
            }
        });
    }

    // ===== Formularios de Proveedores =====
    const addSupplierForm = document.getElementById('addSupplierForm');
    if (addSupplierForm) {
        addSupplierForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const supplier = supplierService.createNewSupplier({
                name: document.getElementById('supplierCompany').value,
                contact: document.getElementById('supplierContact').value,
                email: document.getElementById('supplierEmail').value,
                phone: document.getElementById('supplierPhone').value,
                address: document.getElementById('supplierAddress').value,
                products: document.getElementById('supplierProducts').value
            });

            if (supplier) {
                supplierUI.renderSuppliersTable();
                addSupplierForm.reset();
                dashboardUI.updateStats();
            }
        });
    }

    const editSupplierForm = document.getElementById('editSupplierForm');
    if (editSupplierForm) {
        editSupplierForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = parseInt(document.getElementById('editSupplierId').value);
            const supplier = supplierService.updateExistingSupplier(id, {
                name: document.getElementById('editSupplierName').value,
                contact: document.getElementById('editSupplierContact').value,
                email: document.getElementById('editSupplierEmail').value,
                phone: document.getElementById('editSupplierPhone').value,
                address: document.getElementById('editSupplierAddress').value,
                products: document.getElementById('editSupplierProducts').value
            });

            if (supplier) {
                supplierUI.renderSuppliersTable();
                supplierUI.closeEditSupplierModal();
            }
        });
    }

    // ===== Botón de Pago =====
    const completeBtn = document.getElementById('completeBtn');
    if (completeBtn) {
        completeBtn.addEventListener('click', () => {
            salesUI.completeSaleFromUI();
        });
    }

    // ===== Navegación =====
    document.querySelectorAll('[data-section]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sectionId = e.currentTarget.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    console.log('✅ Event listeners configurados');
}

/**
 * Muestra la sección seleccionada
 */
function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Mostrar sección seleccionada
    const selectedSection = document.getElementById(`${sectionId}-section`);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }

    // Actualizar navegación activa
    document.querySelectorAll('.nav-item').forEach(navItem => {
        navItem.classList.remove('active');
    });

    const activeNavItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
}

// ============ EJECUTAR CUANDO EL DOM ESTÉ LISTO ============

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Exponer funciones globales útiles para debugging
window.app = {
    showSection,
    reload: () => location.reload(),
    stats: () => dashboardService.getDashboardStats(),
    cart: () => cartService.getCart(),
    sales: () => salesService.getAllSales()
};

console.log('💡 Usa window.app para debugging. Ejemplos: window.app.stats(), window.app.cart()');
