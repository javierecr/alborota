export interface CartAttribute {
  key: string;
  value: string;
}

export interface CartItem {
  variantId: string;
  productHandle: string;
  title: string;
  variantTitle: string;
  price: { amount: string; currencyCode: string };
  image?: { url: string; altText?: string | null } | null;
  quantity: number;
  attributes?: CartAttribute[];
}

// Identifies a cart line: same variant with different attributes (message, date, place) are separate lines.
export const lineKey = (item: Pick<CartItem, 'variantId' | 'attributes'>): string =>
  item.attributes?.length
    ? `${item.variantId}|${item.attributes.map(a => `${a.key}=${a.value}`).join('&')}`
    : item.variantId;

const CART_KEY = 'alborota-cart';
const CART_VERSION = 1;

export const useCart = () => {
  const items = useState<CartItem[]>('cart-items', () => []);
  const isCartOpen = useState<boolean>('cart-open', () => false);

  const itemCount = computed(() => items.value.reduce((acc, i) => acc + i.quantity, 0));
  const subtotal = computed(() =>
    items.value.reduce((acc, i) => acc + parseFloat(i.price.amount) * i.quantity, 0),
  );
  const isEmpty = computed(() => items.value.length === 0);

  function restore() {
    if (!import.meta.client) return;
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.version === CART_VERSION && Array.isArray(parsed.items)) {
        items.value = parsed.items;
      }
    } catch {}
  }

  function persist() {
    if (!import.meta.client) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify({ version: CART_VERSION, items: items.value }));
    } catch {}
  }

  function openCart() { isCartOpen.value = true; }
  function closeCart() { isCartOpen.value = false; }

  function addToCart(item: CartItem) {
    const existing = items.value.find(i => lineKey(i) === lineKey(item));
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      items.value = [...items.value, item];
    }
    persist();
    openCart();
  }

  function removeFromCart(key: string) {
    items.value = items.value.filter(i => lineKey(i) !== key);
    persist();
  }

  function updateQuantity(key: string, quantity: number) {
    if (quantity <= 0) return removeFromCart(key);
    const idx = items.value.findIndex(i => lineKey(i) === key);
    if (idx === -1) return;
    const item = items.value[idx];
    if (!item) return;
    const updated = [...items.value];
    updated[idx] = { ...item, quantity };
    items.value = updated;
    persist();
  }

  function clearCart() {
    items.value = [];
    persist();
  }

  async function createCheckout(): Promise<string> {
    const lines = items.value.map(i => ({
      merchandiseId: i.variantId,
      quantity: i.quantity,
      ...(i.attributes?.length ? { attributes: i.attributes } : {}),
    }));
    const { checkoutUrl } = await $fetch<{ checkoutId: string; checkoutUrl: string }>('/api/checkout', {
      method: 'POST',
      body: { lines },
    });
    return checkoutUrl;
  }

  async function createDirectCheckout(variantId: string, quantity: number, attributes?: CartAttribute[]): Promise<string> {
    const { checkoutUrl } = await $fetch<{ checkoutId: string; checkoutUrl: string }>('/api/checkout/direct', {
      method: 'POST',
      body: { variantId, quantity, attributes },
    });
    return checkoutUrl;
  }

  return {
    items: readonly(items),
    itemCount,
    subtotal,
    isEmpty,
    isCartOpen: readonly(isCartOpen),
    openCart,
    closeCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    restore,
    createCheckout,
    createDirectCheckout,
  };
};
