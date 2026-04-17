/**
 * Shared pricing constants for delivery and shipping.
 */

export const SHIPPING_THRESHOLD = 0;
export const SHIPPING_FEE = 0;

/**
 * Helper to calculate shipping fee based on subtotal.
 * @param {number} subtotal 
 * @returns {number}
 */
export const calculateShipping = (subtotal) => {
  if (subtotal === 0) return 0;
  return subtotal < SHIPPING_THRESHOLD ? SHIPPING_FEE : 0;
};
