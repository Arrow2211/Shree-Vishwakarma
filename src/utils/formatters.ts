/**
 * Formats a number according to the Indian numbering system (e.g., 1,23,456)
 * @param amount The number to format
 * @param includeSymbol Whether to include the ₹ symbol (default: true)
 * @returns Formatted string
 */
export const formatCurrency = (amount: number | string, includeSymbol: boolean = true): string => {
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, "")) : amount;
  
  if (isNaN(num)) return typeof amount === 'string' ? amount : "0";

  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
    style: includeSymbol ? 'currency' : 'decimal',
    currency: 'INR',
  }).format(num);

  // If decimal, Intl might add symbol depending on locale, so we manual fix if needed
  if (!includeSymbol) {
    return formatted.replace(/[₹\s,]+/g, (match) => match === ',' ? ',' : '').trim();
  }

  return formatted;
};

/**
 * Formats a number with Indian commas but no currency symbol
 */
export const formatNumber = (amount: number | string): string => {
  return formatCurrency(amount, false);
};
