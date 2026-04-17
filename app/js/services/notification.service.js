/**
 * =============================================================================
 * NOTIFICATION SERVICE - Gestiona notificaciones al usuario
 * =============================================================================
 */

import { API_MESSAGES } from '../config/constants.js';

/**
 * Muestra una notificación de éxito
 * @param {string} message - Mensaje a mostrar
 */
export function showSuccess(message = API_MESSAGES.SUCCESS) {
    alert(message);
    console.log('✅ Éxito:', message);
}

/**
 * Muestra una notificación de error
 * @param {string} message - Mensaje de error
 */
export function showError(message = API_MESSAGES.ERROR) {
    alert(`❌ Error: ${message}`);
    console.error('❌ Error:', message);
}

/**
 * Muestra una notificación de confirmación
 * @param {string} message - Mensaje de confirmación
 * @returns {boolean}
 */
export function showConfirm(message = API_MESSAGES.CONFIRM_DELETE) {
    return confirm(message);
}

/**
 * Muestra una notificación de información
 * @param {string} message - Mensaje informativo
 */
export function showInfo(message) {
    alert(`ℹ️ ${message}`);
    console.info('ℹ️ Info:', message);
}

/**
 * Log en consola para debugging
 * @param {string} label - Etiqueta del log
 * @param {any} data - Datos a loguear
 */
export function logDebug(label, data) {
    console.log(`🔍 [${label}]`, data);
}

/**
 * Reproduce un sonido de notificación (opcional)
 */
export function playNotificationSound() {
    // Aquí puedes añadir un sonido si lo deseas
    // const audio = new Audio('notification.mp3');
    // audio.play();
}
