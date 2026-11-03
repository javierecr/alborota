export const useFormatMoney = () => {
  const formatMoney = (
    amount: number | string,
    currencyCode: string,
    options: { withCode?: boolean } = {},
  ): string => {
    // The product page shows a bare "$1,200"; listings keep the currency code.
    const { withCode = true } = options;
    const code = currencyCode || 'MXN';
    const suffix = withCode ? ` ${code}` : '';
    try {
      const formatted = new Intl.NumberFormat('es-MX', {
        style: 'currency', currency: code, currencyDisplay: 'narrowSymbol',
        // Prices are whole amounts in practice and the designs show no cents, so
        // trailing ".00" is dropped — but a price that really has cents still
        // shows them rather than being rounded into a different number.
        minimumFractionDigits: 0, maximumFractionDigits: 2,
      }).format(Number(amount));
      return `${formatted}${suffix}`;
    } catch {
      const n = Number(amount);
      return `$${Number.isInteger(n) ? n : n.toFixed(2)}${suffix}`;
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
