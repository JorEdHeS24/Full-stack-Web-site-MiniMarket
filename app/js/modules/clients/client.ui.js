/**
 * =============================================================================
 * CLIENT UI - Renderizado de clientes
 * =============================================================================
 */

import * as clientService from './client.service.js';
import { ELEMENT_IDS } from '../../config/constants.js';
import { getElement } from '../../utils/helpers.js';

/**
 * Renderiza la tabla de clientes
 */
export function renderClientsTable() {
    const clients = clientService.getAllClients();
    const tbody = document.querySelector(ELEMENT_IDS.CLIENTS_TABLE);
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    clients.forEach(client => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${client.name}</td>
            <td>${client.email}</td>
            <td>${client.phone}</td>
            <td>${client.address}</td>
            <td>
                <button class="action-btn btn-edit" onclick="window.clientUI?.editClientFromUI(${client.id})">✏️ Editar</button>
                <button class="action-btn btn-delete" onclick="window.clientUI?.deleteClientFromUI(${client.id})">🗑️ Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Abre el modal para editar un cliente
 */
export function openEditClientModal(clientId) {
    const client = clientService.getAllClients().find(c => c.id === clientId);
    if (!client) return;

    const modal = getElement('#editClientModal');
    if (!modal) return;

    document.getElementById('editClientId').value = client.id;
    document.getElementById('editClientName').value = client.name;
    document.getElementById('editClientEmail').value = client.email;
    document.getElementById('editClientPhone').value = client.phone;
    document.getElementById('editClientAddress').value = client.address;
    
    modal.classList.add('show');
}

/**
 * Cierra el modal de edición
 */
export function closeEditClientModal() {
    const modal = getElement('#editClientModal');
    if (modal) {
        modal.classList.remove('show');
        const form = getElement('#editClientForm');
        if (form) form.reset();
    }
}

/**
 * Exporta funciones para eventos HTML
 */
export const clientUI = {
    editClientFromUI(clientId) {
        openEditClientModal(clientId);
    },
    
    deleteClientFromUI(clientId) {
        if (clientService.deleteExistingClient(clientId)) {
            renderClientsTable();
        }
    }
};

// Exponer en window para eventos HTML
window.clientUI = clientUI;
