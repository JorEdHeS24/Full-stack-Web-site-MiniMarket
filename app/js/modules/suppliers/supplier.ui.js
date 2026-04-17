/**
 * =============================================================================
 * SUPPLIER UI - Renderizado de proveedores
 * =============================================================================
 */

import * as supplierService from './supplier.service.js';
import { ELEMENT_IDS } from '../../config/constants.js';
import { getElement } from '../../utils/helpers.js';

/**
 * Renderiza la tabla de proveedores
 */
export function renderSuppliersTable() {
    const suppliers = supplierService.getAllSuppliers();
    const tbody = document.querySelector(ELEMENT_IDS.SUPPLIERS_TABLE);
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    suppliers.forEach(supplier => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${supplier.name}</td>
            <td>${supplier.contact}</td>
            <td>${supplier.email}</td>
            <td>${supplier.phone}</td>
            <td>${supplier.address}</td>
            <td>${supplier.products}</td>
            <td>
                <button class="action-btn btn-edit" onclick="window.supplierUI?.editSupplierFromUI(${supplier.id})">✏️ Editar</button>
                <button class="action-btn btn-delete" onclick="window.supplierUI?.deleteSupplierFromUI(${supplier.id})">🗑️ Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Abre el modal para editar un proveedor
 */
export function openEditSupplierModal(supplierId) {
    const supplier = supplierService.getAllSuppliers().find(s => s.id === supplierId);
    if (!supplier) return;

    const modal = getElement('#editSupplierModal');
    if (!modal) return;

    document.getElementById('editSupplierId').value = supplier.id;
    document.getElementById('editSupplierName').value = supplier.name;
    document.getElementById('editSupplierContact').value = supplier.contact;
    document.getElementById('editSupplierEmail').value = supplier.email;
    document.getElementById('editSupplierPhone').value = supplier.phone;
    document.getElementById('editSupplierAddress').value = supplier.address;
    document.getElementById('editSupplierProducts').value = supplier.products;
    
    modal.classList.add('show');
}

/**
 * Cierra el modal de edición
 */
export function closeEditSupplierModal() {
    const modal = getElement('#editSupplierModal');
    if (modal) {
        modal.classList.remove('show');
        const form = getElement('#editSupplierForm');
        if (form) form.reset();
    }
}

/**
 * Exporta funciones para eventos HTML
 */
export const supplierUI = {
    editSupplierFromUI(supplierId) {
        openEditSupplierModal(supplierId);
    },
    
    deleteSupplierFromUI(supplierId) {
        if (supplierService.deleteExistingSupplier(supplierId)) {
            renderSuppliersTable();
        }
    }
};

// Exponer en window para eventos HTML
window.supplierUI = supplierUI;
