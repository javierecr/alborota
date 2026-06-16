export type MoneyAmount = { amount: string; currencyCode: string };
export type ProductSelectedOption = { name: string; value: string };
export type ProductImage = { id?: string | null; url: string; altText?: string | null };
export type ProductOption = { id: string; name: string; values: string[] };

export type Variant = {
  id: string; title: string; availableForSale: boolean;
  price: MoneyAmount; compareAtPrice?: MoneyAmount | null;
  sku?: string | null; quantityAvailable?: number | null;
  image?: ProductImage | null; selectedOptions: ProductSelectedOption[];
};

export type Product = {
  id: string; handle: string; title: string;
  description?: string | null; descriptionHtml?: string | null;
  featuredImage?: ProductImage | null;
  images?: { nodes: ProductImage[] };
  options?: ProductOption[];
  variants?: { nodes: Variant[] };
  priceRange?: { minVariantPrice: MoneyAmount; maxVariantPrice?: MoneyAmount };
  collections?: { nodes: { handle: string; title: string }[] };
  seo?: { title?: string | null; description?: string | null };
};
