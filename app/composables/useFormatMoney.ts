export const useFormatMoney = () => {
  const formatMoney = (
    amount: number | string,
    currencyCode: string,
    options: { withCode?: boolean } = {},
  ): string => {
    // The product page shows a bare "$1,200.00"; listings keep the currency code.
    const { withCode = true } = options;
    const code = currencyCode || 'MXN';
    const suffix = withCode ? ` ${code}` : '';
    try {
      const formatted = new Intl.NumberFormat('es-MX', {
        style: 'currency', currency: code, currencyDisplay: 'narrowSymbol',
      }).format(Number(amount));
      return `${formatted}${suffix}`;
    } catch {
      return `$${Number(amount).toFixed(2)}${suffix}`;
    }
  };

  const shopifyImageUrl = (url: string, width: number): string => {
    if (!url) return url;
    try {
      const u = new URL(url);
      u.searchParams.set('width', String(width));
      return u.toString();
    } catch { return url; }
  };

  return { formatMoney, shopifyImageUrl };
};
