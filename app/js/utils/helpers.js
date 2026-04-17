/**
 * =============================================================================
 * HELPERS - Funciones auxiliares generales
 * =============================================================================
 */

/**
 * Obtiene un elemento del DOM de forma segura
 * @param {string} selector - Selector del elemento
 * @returns {Element|null}
 */
export function getElement(selector) {
    return document.querySelector(selector);
}

/**
 * Obtiene múltiples elementos del DOM
 * @param {string} selector - Selector de los elementos
 * @returns {NodeList}
 */
export function getElements(selector) {
    return document.querySelectorAll(selector);
}

/**
 * Busca un elemento en un array por ID
 * @param {array} array - Array donde buscar
 * @param {number} id - ID a buscar
 * @returns {object|undefined}
 */
export function findById(array, id) {
    return array.find(item => item.id === id);
}

/**
 * Filtra un array por múltiples criterios
 * @param {array} array - Array a filtrar
 * @param {object} criteria - Criterios de búsqueda {key: value}
 * @returns {array}
 */
export function filterByMultipleCriteria(array, criteria) {
    return array.filter(item =>
        Object.entries(criteria).every(([key, value]) =>
            String(item[key]).toLowerCase().includes(String(value).toLowerCase())
        )
    );
}

/**
 * Calcula el total con impuesto
 * @param {number} subtotal - Subtotal
 * @param {number} taxRate - Tasa de impuesto
 * @returns {object} {tax, total}
 */
export function calculateTaxedTotal(subtotal, taxRate) {
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    return { tax, total };
}

/**
 * Calcula el cambio en una transacción
 * @param {number} received - Monto recibido
 * @param {number} total - Total a pagar
 * @returns {number} Cambio
 */
export function calculateChange(received, total) {
    return Math.max(0, received - total);
}

/**
 * Obtiene el máximo ID de un array de objetos
 * @param {array} array - Array de objetos
 * @returns {number} Máximo ID + 1
 */
export function getNextId(array) {
    return array.length ? Math.max(...array.map(item => item.id)) + 1 : 1;
}

/**
 * Crea una copia profunda de un objeto
 * @param {object} obj - Objeto a copiar
 * @returns {object} Copia del objeto
 */
export function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Combina dos arrays sin duplicados
 * @param {array} arr1 - Primer array
 * @param {array} arr2 - Segundo array
 * @returns {array} Array combinado
 */
export function mergeArraysUnique(arr1, arr2) {
    return [...new Set([...arr1, ...arr2])];
}
