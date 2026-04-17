/**
 * =============================================================================
 * VALIDATORS - Funciones de validación
 * =============================================================================
 */

/**
 * Valida que un email sea correcto
 * @param {string} email - Email a validar
 * @returns {boolean}
 */
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Valida que un teléfono sea correcto
 * @param {string} phone - Teléfono a validar
 * @returns {boolean}
 */
export function validatePhone(phone) {
    const phoneRegex = /^[0-9]{7,15}$/;
    return phoneRegex.test(String(phone).replace(/\D/g, ''));
}

/**
 * Valida que un precio sea válido
 * @param {number} price - Precio a validar
 * @returns {boolean}
 */
export function validatePrice(price) {
    return !isNaN(price) && price > 0;
}

/**
 * Valida que un stock sea válido
 * @param {number} stock - Stock a validar
 * @returns {boolean}
 */
export function validateStock(stock) {
    return !isNaN(stock) && stock >= 0 && Number.isInteger(stock);
}

/**
 * Valida que un campo no esté vacío
 * @param {string} value - Valor a validar
 * @returns {boolean}
 */
export function validateRequired(value) {
    return String(value).trim().length > 0;
}

/**
 * Valida que la cantidad sea válida y dentro del stock
 * @param {number} quantity - Cantidad a validar
 * @param {number} stock - Stock disponible
 * @returns {boolean}
 */
export function validateQuantity(quantity, stock) {
    return !isNaN(quantity) && quantity > 0 && quantity <= stock;
}

/**
 * Valida múltiples campos requeridos
 * @param {object} fields - Objeto con campos a validar
 * @returns {boolean}
 */
export function validateRequiredFields(fields) {
    return Object.values(fields).every(value => validateRequired(value));
}
