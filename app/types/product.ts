export type MoneyAmount = { amount: string; currencyCode: string };
export type ProductSelectedOption = { name: string; value: string };
export type ProductImage = {
  id?: string | null;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};
export type ProductOptionValue = { id: string; name: string };
export type ProductOption = { id: string; name: string; values: string[]; optionValues?: ProductOptionValue[] };

export type ProductMetafield = {
  key: string;
  namespace?: string;
  value: string;
  type?: string;
} | null;

/**
 * A "Paleta de Colores" option value, flattened server-side from the `paleta`
 * metaobject so components never see Shopify's `fields[]` shape.
 * `nombre` matches the Shopify option value exactly (e.g. "Paleta 1").
 */
export type Palette = { nombre: string; colors: string[] };

export type Variant = {
  id: string; title: string; availableForSale: boolean;
  price: MoneyAmount; compareAtPrice?: MoneyAmount | null;
  sku?: string | null; quantityAvailable?: number | null;
  image?: ProductImage | null; selectedOptions: ProductSelectedOption[];
  /** `custom.dimensiones` — the grey hint inside the Tamaño select. */
  metafield?: { value: string } | null;
};

export type Product = {
  id: string; handle: string; title: string;
  tags?: string[];
  description?: string | null; descriptionHtml?: string | null;
  featuredImage?: ProductImage | null;
  images?: { nodes: ProductImage[] };
  options?: ProductOption[];
  variants?: { nodes: Variant[] };
  priceRange?: { minVariantPrice: MoneyAmount; maxVariantPrice?: MoneyAmount };
  collections?: { nodes: { handle: string; title: string }[] };
  seo?: { title?: string | null; description?: string | null };
  /** `custom.detalles`, `custom.descripcion_producto`, `custom.tiempos_produccion_envio` */
  metafields?: ProductMetafield[];
  /** Empty when the Storefront token lacks `unauthenticated_read_metaobjects`. */
  palettes?: Palette[];
};

/** Reads a product metafield by key; returns '' when absent or empty. */
export const metafieldValue = (product: Product | null | undefined, key: string): string =>
  product?.metafields?.find((m) => m?.key === key)?.value?.trim() ?? '';
