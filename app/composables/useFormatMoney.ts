export const useFormatMoney = () => {
  const formatMoney = (amount: number | string, currencyCode: string): string => {
    const code = currencyCode || 'MXN';
    try {
      const formatted = new Intl.NumberFormat('es-MX', {
        style: 'currency', currency: code, currencyDisplay: 'narrowSymbol',
      }).format(Number(amount));
      return `${formatted} ${code}`;
    } catch {
      return `$${Number(amount).toFixed(2)} ${code}`;
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
