/**
 * =============================================================================
 * SUPPLIER SERVICE - Lógica de gestión de proveedores
 * =============================================================================
 */

import * as api from '../../services/api.service.js';
import * as notification from '../../services/notification.service.js';
import { validateRequired, validateEmail, validatePhone } from '../../utils/validators.js';
import { API_MESSAGES } from '../../config/constants.js';

/**
 * Obtiene todos los proveedores
 */
export function getAllSuppliers() {
    return api.getAllSuppliers();
}

/**
 * Busca proveedores por nombre
 */
export function searchSuppliers(searchTerm) {
    const term = String(searchTerm).toLowerCase();
    return getAllSuppliers().filter(supplier =>
        supplier.name.toLowerCase().includes(term) ||
        supplier.contact.toLowerCase().includes(term) ||
        supplier.email.toLowerCase().includes(term)
    );
}

/**
 * Crea un nuevo proveedor
 */
export function createNewSupplier(supplierData) {
    if (!validateRequired(supplierData.name)) {
        notification.showError('El nombre del proveedor es requerido');
        return null;
    }

    if (!validateEmail(supplierData.email)) {
        notification.showError('Email no válido');
        return null;
    }

    if (!validatePhone(supplierData.phone)) {
        notification.showError('Teléfono no válido');
        return null;
    }

    const newSupplier = api.createSupplier(supplierData);
    notification.showSuccess(API_MESSAGES.SAVE_SUCCESS);
    return newSupplier;
}

/**
 * Actualiza un proveedor
 */
export function updateExistingSupplier(id, supplierData) {
    if (!validateEmail(supplierData.email)) {
        notification.showError('Email no válido');
        return null;
    }

    if (!validatePhone(supplierData.phone)) {
        notification.showError('Teléfono no válido');
        return null;
    }

    const updated = api.updateSupplier(id, supplierData);
    if (!updated) {
        notification.showError('Proveedor no encontrado');
        return null;
    }

    notification.showSuccess(API_MESSAGES.UPDATE_SUCCESS);
    return updated;
}

/**
 * Elimina un proveedor
 */
export function deleteExistingSupplier(id) {
    if (!notification.showConfirm(API_MESSAGES.CONFIRM_DELETE)) {
        return false;
    }

    const deleted = api.deleteSupplier(id);
    if (!deleted) {
        notification.showError('Proveedor no encontrado');
        return false;
    }

    notification.showSuccess(API_MESSAGES.DELETE_SUCCESS);
    return true;
}
