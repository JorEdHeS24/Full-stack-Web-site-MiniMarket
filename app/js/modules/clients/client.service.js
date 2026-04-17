/**
 * =============================================================================
 * CLIENT SERVICE - Lógica de gestión de clientes
 * =============================================================================
 */

import * as api from '../../services/api.service.js';
import * as notification from '../../services/notification.service.js';
import { validateRequired, validateEmail, validatePhone } from '../../utils/validators.js';
import { API_MESSAGES } from '../../config/constants.js';

/**
 * Obtiene todos los clientes
 */
export function getAllClients() {
    return api.getAllClients();
}

/**
 * Busca clientes por nombre o email
 */
export function searchClients(searchTerm) {
    const term = String(searchTerm).toLowerCase();
    return getAllClients().filter(client =>
        client.name.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term) ||
        client.phone.includes(term)
    );
}

/**
 * Crea un nuevo cliente
 */
export function createNewClient(clientData) {
    if (!validateRequired(clientData.name)) {
        notification.showError('El nombre es requerido');
        return null;
    }

    if (!validateEmail(clientData.email)) {
        notification.showError('Email no válido');
        return null;
    }

    if (!validatePhone(clientData.phone)) {
        notification.showError('Teléfono no válido');
        return null;
    }

    const newClient = api.createClient(clientData);
    notification.showSuccess(API_MESSAGES.SAVE_SUCCESS);
    return newClient;
}

/**
 * Actualiza un cliente
 */
export function updateExistingClient(id, clientData) {
    if (!validateEmail(clientData.email)) {
        notification.showError('Email no válido');
        return null;
    }

    if (!validatePhone(clientData.phone)) {
        notification.showError('Teléfono no válido');
        return null;
    }

    const updated = api.updateClient(id, clientData);
    if (!updated) {
        notification.showError('Cliente no encontrado');
        return null;
    }

    notification.showSuccess(API_MESSAGES.UPDATE_SUCCESS);
    return updated;
}

/**
 * Elimina un cliente
 */
export function deleteExistingClient(id) {
    if (!notification.showConfirm(API_MESSAGES.CONFIRM_DELETE)) {
        return false;
    }

    const deleted = api.deleteClient(id);
    if (!deleted) {
        notification.showError('Cliente no encontrado');
        return false;
    }

    notification.showSuccess(API_MESSAGES.DELETE_SUCCESS);
    return true;
}
