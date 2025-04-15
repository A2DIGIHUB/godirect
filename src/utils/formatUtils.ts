
/**
 * Format a number as currency with proper symbol and formatting
 * @param amount - The amount to format
 * @param currency - The currency code (default: NGN for Nigerian Naira)
 * @param locale - The locale to use for formatting (default: en-NG)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number | string | null | undefined,
  currency: string = 'NGN',
  locale: string = 'en-NG'
): string => {
  // Return placeholder if amount is null/undefined
  if (amount === null || amount === undefined) {
    return '₦0.00';
  }
  
  // Convert string to number if needed
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numAmount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    
    // Fallback for NGN (Nigerian Naira)
    if (currency === 'NGN') {
      return `₦${numAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    }
    
    // Generic fallback
    return `${numAmount.toFixed(2)}`;
  }
};

/**
 * Format a large number in a readable format (K, M, B)
 * @param num - The number to format
 * @returns Formatted number string
 */
export const formatLargeNumber = (num: number | string | null | undefined): string => {
  if (num === null || num === undefined) return '0';
  
  const numValue = typeof num === 'string' ? parseFloat(num) : num;
  
  if (numValue >= 1000000000) {
    return (numValue / 1000000000).toFixed(1) + 'B';
  }
  if (numValue >= 1000000) {
    return (numValue / 1000000).toFixed(1) + 'M';
  }
  if (numValue >= 1000) {
    return (numValue / 1000).toFixed(1) + 'K';
  }
  
  return numValue.toString();
};

/**
 * Format a date in a localized format
 * @param dateString - Date string to format
 * @param locale - The locale to use (default: en-US)
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string | Date | null | undefined, 
  locale: string = 'en-US'
): string => {
  if (!dateString) return '';
  
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

// Helper function specifically for the project to ensure consistent formatting
export const formatPriceWithCommas = (price: number | string): string => {
  // Handle null/undefined/empty values
  if (price === null || price === undefined || price === '') {
    return '₦0';
  }
  
  // Convert string to number if needed
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Format with Naira symbol and commas
  return `₦${numPrice.toLocaleString('en-NG')}`;
};
