/**
 * =============================================================================
 * FORMATTERS - Funciones para formatear datos
 * =============================================================================
 */

import { APP_CONFIG } from '../config/constants.js';

/**
 * Formatea un número como moneda
 * @param {number} amount - Cantidad a formatear
 * @returns {string} Cantidad formateada
 */
export function formatCurrency(amount) {
    return `${APP_CONFIG.CURRENCY_SYMBOL}${amount.toFixed(2)}`;
}

/**
 * Formatea una fecha
 * @param {Date} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export function formatDate(date) {
    return new Date(date).toLocaleString(APP_CONFIG.DATE_FORMAT);
}

/**
 * Formatea texto a mayúsculas
 * @param {string} text - Texto a formatear
 * @returns {string} Texto en mayúsculas
 */
export function formatUpperCase(text) {
     return String(text).toUpperCase();
}

/**
 * Trunca texto a cierta longitud
 * @param {string} text - Texto a truncar
 * @param {number} length - Longitud máxima
 * @returns {string} Texto truncado
 */
export function truncateText(text, length = 50) {
    if (String(text).length <= length) return text;
    return String(text).substring(0, length) + '...';
}

/**
 * Genera un ID único
 * @returns {string} ID único basado en timestamp
 */
export function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
