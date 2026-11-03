import type * as prismic from "@prismicio/client";

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] };


type PickContentRelationshipFieldData<
	TRelationship extends prismic.CustomTypeModelFetchCustomTypeLevel1 | prismic.CustomTypeModelFetchCustomTypeLevel2 | prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2,
	TData extends Record<string, prismic.AnyRegularField | prismic.GroupField | prismic.NestedGroupField | prismic.SliceZone>,
	TLang extends string
> = |
	// Content relationship fields
	{
		[TSubRelationship in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchContentRelationshipLevel1
		> as TSubRelationship["id"]]:
			ContentRelationshipFieldWithData<TSubRelationship["customtypes"], TLang>;
	} &
	// Group
	{
		[TGroup in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2
		> as TGroup["id"]]:
			TData[TGroup["id"]] extends prismic.GroupField<infer TGroupData>
				? prismic.GroupField<PickContentRelationshipFieldData<TGroup, TGroupData, TLang>>
				: never
	} &
	// Other fields
	{
		[TFieldKey in Extract<TRelationship["fields"][number], string>]:
			TFieldKey extends keyof TData ? TData[TFieldKey] : never;
	};

type ContentRelationshipFieldWithData<
	TCustomType extends readonly (prismic.CustomTypeModelFetchCustomTypeLevel1 | string)[] | readonly (prismic.CustomTypeModelFetchCustomTypeLevel2 | string)[],
	TLang extends string = string
> = {
	[ID in Exclude<TCustomType[number], string>["id"]]:
		prismic.ContentRelationshipField<
			ID,
			TLang,
			PickContentRelationshipFieldData<
				Extract<TCustomType[number], { id: ID }>,
				Extract<prismic.Content.AllDocumentTypes, { type: ID }>["data"],
				TLang
			>
		>
}[Exclude<TCustomType[number], string>["id"]];

type ColeccionDocumentDataSlicesSlice = never

/**
 * Content for Colección documents
 */
interface ColeccionDocumentData {
	/**
	 * Page Title field in *Colección*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Nombre de la colección
	 * - **API ID Path**: coleccion.page_title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	page_title: prismic.KeyTextField;
	
	/**
	 * Shopify Collection ID field in *Colección*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: gid://shopify/Collection/...
	 * - **API ID Path**: coleccion.shopify_collection_id
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	shopify_collection_id: prismic.KeyTextField;
	
	/**
	 * Slice Zone field in *Colección*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: coleccion.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<ColeccionDocumentDataSlicesSlice>;/**
	 * Meta Title field in *Colección*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: coleccion.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Colección*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: coleccion.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Colección*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: coleccion.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Colección document from Prismic
 *
 * - **API ID**: `coleccion`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ColeccionDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<ColeccionDocumentData>, "coleccion", Lang>;

type CotizarDocumentDataSlicesSlice = never

/**
 * Content for Cotizar documents
 */
interface CotizarDocumentData {
	/**
	 * Page Title field in *Cotizar*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Cotizar
	 * - **API ID Path**: cotizar.page_title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	page_title: prismic.KeyTextField;
	
	/**
	 * Título de la sección field in *Cotizar*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Cotiza tu proyecto / pieza
	 * - **API ID Path**: cotizar.quote_title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	quote_title: prismic.KeyTextField;
	
	/**
	 * Imagen de la sección field in *Cotizar*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: cotizar.quote_image
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	quote_image: prismic.ImageField<never>;
	
	/**
	 * Slice Zone field in *Cotizar*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: cotizar.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<CotizarDocumentDataSlicesSlice>;/**
	 * Meta Title field in *Cotizar*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: cotizar.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Cotizar*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: cotizar.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Cotizar*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: cotizar.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Cotizar document from Prismic
 *
 * - **API ID**: `cotizar`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type CotizarDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<CotizarDocumentData>, "cotizar", Lang>;

/**
 * Item in *Footer → Footer Blocks*
 */
export interface FooterDocumentDataBlocksItem {
	/**
	 * Title field in *Footer → Footer Blocks*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: footer.blocks[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Content field in *Footer → Footer Blocks*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: footer.blocks[].content
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	content: prismic.RichTextField;
}

/**
 * Item in *Footer → Links*
 */
export interface FooterDocumentDataLinksItem {
	/**
	 * Label field in *Footer → Links*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: footer.links[].label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	label: prismic.KeyTextField;
	
	/**
	 * Link field in *Footer → Links*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: footer.links[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Content for Footer documents
 */
interface FooterDocumentData {
	/**
	 * Background Image field in *Footer*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: footer.bg_image
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	bg_image: prismic.ImageField<never>;
	
	/**
	 * Footer Blocks field in *Footer*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: footer.blocks[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	blocks: prismic.GroupField<Simplify<FooterDocumentDataBlocksItem>>;
	
	/**
	 * Links field in *Footer*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: footer.links[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	links: prismic.GroupField<Simplify<FooterDocumentDataLinksItem>>;
}

/**
 * Footer document from Prismic
 *
 * - **API ID**: `footer`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type FooterDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<FooterDocumentData>, "footer", Lang>;

type GaleriaDocumentDataSlicesSlice = never

/**
 * Content for Galería documents
 */
interface GaleriaDocumentData {
	/**
	 * Page Title field in *Galería*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Galería
	 * - **API ID Path**: galeria.page_title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	page_title: prismic.KeyTextField;
	
	/**
	 * Slice Zone field in *Galería*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: galeria.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<GaleriaDocumentDataSlicesSlice>;/**
	 * Meta Title field in *Galería*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: galeria.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Galería*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: galeria.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Galería*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: galeria.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Galería document from Prismic
 *
 * - **API ID**: `galeria`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type GaleriaDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<GaleriaDocumentData>, "galeria", Lang>;

/**
 * Item in *Header → Navigation Links*
 */
export interface HeaderDocumentDataNavigationItem {
	/**
	 * Label field in *Header → Navigation Links*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: header.navigation[].label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	label: prismic.KeyTextField;
	
	/**
	 * Link field in *Header → Navigation Links*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: header.navigation[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Content for Header documents
 */
interface HeaderDocumentData {
	/**
	 * Logo field in *Header*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: header.logo
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	logo: prismic.ImageField<never>;
	
	/**
	 * Navigation Links field in *Header*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: header.navigation[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	navigation: prismic.GroupField<Simplify<HeaderDocumentDataNavigationItem>>;
}

/**
 * Header document from Prismic
 *
 * - **API ID**: `header`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type HeaderDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<HeaderDocumentData>, "header", Lang>;

type HomeDocumentDataSlicesSlice = FeaturedCollectionSlice | MediaCoverSlice | ColorBackgroundBannerSlice | BannerWithTextSlice | ImageWithTextSlice | FeaturedProjectsSlice

/**
 * Content for Home documents
 */
interface HomeDocumentData {
	/**
	 * Page Title field in *Home*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Alborota
	 * - **API ID Path**: home.page_title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	page_title: prismic.KeyTextField;
	
	/**
	 * Slice Zone field in *Home*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: home.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<HomeDocumentDataSlicesSlice>;/**
	 * Meta Title field in *Home*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: home.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Home*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: home.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Home*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: home.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Home document from Prismic
 *
 * - **API ID**: `home`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type HomeDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<HomeDocumentData>, "home", Lang>;

type LegalPageDocumentDataSlicesSlice = never

/**
 * Content for Legal Page documents
 */
interface LegalPageDocumentData {
	/**
	 * Page Title field in *Legal Page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: legal_page.page_title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	page_title: prismic.KeyTextField;
	
	/**
	 * Slice Zone field in *Legal Page*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: legal_page.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<LegalPageDocumentDataSlicesSlice>;/**
	 * Meta Title field in *Legal Page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: legal_page.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Legal Page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: legal_page.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Legal Page*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: legal_page.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Legal Page document from Prismic
 *
 * - **API ID**: `legal_page`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type LegalPageDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<LegalPageDocumentData>, "legal_page", Lang>;

type NosotrosDocumentDataSlicesSlice = never

/**
 * Content for Nosotros documents
 */
interface NosotrosDocumentData {
	/**
	 * Page Title field in *Nosotros*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Nosotros
	 * - **API ID Path**: nosotros.page_title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	page_title: prismic.KeyTextField;
	
	/**
	 * Slice Zone field in *Nosotros*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: nosotros.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<NosotrosDocumentDataSlicesSlice>;/**
	 * Meta Title field in *Nosotros*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: nosotros.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Nosotros*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: nosotros.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Nosotros*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: nosotros.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Nosotros document from Prismic
 *
 * - **API ID**: `nosotros`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type NosotrosDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<NosotrosDocumentData>, "nosotros", Lang>;

type ProductPageDocumentDataSlicesSlice = never

/**
 * Content for Product Page documents
 */
interface ProductPageDocumentData {
	/**
	 * Free Shipping Text field in *Product Page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: product_page.free_shipping_text
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	free_shipping_text: prismic.KeyTextField;
	
	/**
	 * Shipping field in *Product Page*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: product_page.shipping
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	shipping: prismic.RichTextField;
	
	/**
	 * Returns field in *Product Page*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: product_page.returns
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	returns: prismic.RichTextField;
	
	/**
	 * Slice Zone field in *Product Page*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: product_page.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<ProductPageDocumentDataSlicesSlice>;/**
	 * Meta Title field in *Product Page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: product_page.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Product Page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: product_page.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Product Page*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: product_page.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Product Page document from Prismic
 *
 * - **API ID**: `product_page`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ProductPageDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<ProductPageDocumentData>, "product_page", Lang>;

type ProductoDocumentDataSlicesSlice = never

/**
 * Content for Producto documents
 */
interface ProductoDocumentData {
	/**
	 * Product Title field in *Producto*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: producto.page_title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	page_title: prismic.KeyTextField;
	
	/**
	 * Slice Zone field in *Producto*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: producto.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<ProductoDocumentDataSlicesSlice>;/**
	 * Meta Title field in *Producto*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: producto.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Producto*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: producto.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Producto*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: producto.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Producto document from Prismic
 *
 * - **API ID**: `producto`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ProductoDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<ProductoDocumentData>, "producto", Lang>;

/**
 * Item in *Project → Tags*
 */
export interface ProjectDocumentDataTagsItem {
	/**
	 * Tag field in *Project → Tags*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.tags[].tag
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	tag: prismic.KeyTextField;
}

/**
 * Content for Project documents
 */
interface ProjectDocumentData {
	/**
	 * Image field in *Project*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.image
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Title field in *Project*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Description field in *Project*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.description
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
	
	/**
	 * Year field in *Project*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.year
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	year: prismic.NumberField;
	
	/**
	 * Tags field in *Project*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.tags[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	tags: prismic.GroupField<Simplify<ProjectDocumentDataTagsItem>>;
}

/**
 * Project document from Prismic
 *
 * - **API ID**: `project`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ProjectDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<ProjectDocumentData>, "project", Lang>;

type TiendaDocumentDataSlicesSlice = never

/**
 * Content for Tienda documents
 */
interface TiendaDocumentData {
	/**
	 * Page Title field in *Tienda*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Tienda
	 * - **API ID Path**: tienda.page_title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	page_title: prismic.KeyTextField;
	
	/**
	 * Slice Zone field in *Tienda*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: tienda.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<TiendaDocumentDataSlicesSlice>;/**
	 * Meta Title field in *Tienda*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: tienda.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Tienda*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: tienda.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Tienda*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: tienda.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Tienda document from Prismic
 *
 * - **API ID**: `tienda`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type TiendaDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<TiendaDocumentData>, "tienda", Lang>;

export type AllDocumentTypes = ColeccionDocument | CotizarDocument | FooterDocument | GaleriaDocument | HeaderDocument | HomeDocument | LegalPageDocument | NosotrosDocument | ProductPageDocument | ProductoDocument | ProjectDocument | TiendaDocument;

/**
 * Primary content in *BannerWithText → Default → Primary*
 */
export interface BannerWithTextSliceDefaultPrimary {
	/**
	 * Image field in *BannerWithText → Default → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: banner_with_text.default.primary.image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Image Height field in *BannerWithText → Default → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: 1/0.6
	 * - **API ID Path**: banner_with_text.default.primary.image_height
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	image_height: prismic.SelectField<"1/0.6" | "Screen" | "Auto", "filled">;
	
	/**
	 * Heading field in *BannerWithText → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: banner_with_text.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
	
	/**
	 * CTA field in *BannerWithText → Default → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: banner_with_text.default.primary.cta
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	cta: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Text field in *BannerWithText → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: banner_with_text.default.primary.text
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	text: prismic.RichTextField;
	
	/**
	 * Text Position field in *BannerWithText → Default → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: banner_with_text.default.primary.text_position
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	text_position: prismic.SelectField<"Left Top" | "Center Top" | "Right Top" | "Left Center" | "Center Center" | "Right Center" | "Left Bottom" | "Center Bottom" | "Right Bottom">;
}

/**
 * Default variation for BannerWithText Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type BannerWithTextSliceDefault = prismic.SharedSliceVariation<"default", Simplify<BannerWithTextSliceDefaultPrimary>, never>;

/**
 * Slice variation for *BannerWithText*
 */
type BannerWithTextSliceVariation = BannerWithTextSliceDefault

/**
 * BannerWithText Shared Slice
 *
 * - **API ID**: `banner_with_text`
 * - **Description**: BannerWithText
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type BannerWithTextSlice = prismic.SharedSlice<"banner_with_text", BannerWithTextSliceVariation>;

/**
 * Item in *ColorBackgroundBanner → Default → Primary → Text blocks*
 */
export interface ColorBackgroundBannerSliceDefaultPrimaryTextBlocksItem {
	/**
	 * Text field in *ColorBackgroundBanner → Default → Primary → Text blocks*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: color_background_banner.default.primary.text_blocks[].text
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	text: prismic.RichTextField;
}

/**
 * Primary content in *ColorBackgroundBanner → Default → Primary*
 */
export interface ColorBackgroundBannerSliceDefaultPrimary {
	/**
	 * Image field in *ColorBackgroundBanner → Default → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: color_background_banner.default.primary.image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Text blocks field in *ColorBackgroundBanner → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: color_background_banner.default.primary.text_blocks[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	text_blocks: prismic.GroupField<Simplify<ColorBackgroundBannerSliceDefaultPrimaryTextBlocksItem>>;
}

/**
 * Default variation for ColorBackgroundBanner Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ColorBackgroundBannerSliceDefault = prismic.SharedSliceVariation<"default", Simplify<ColorBackgroundBannerSliceDefaultPrimary>, never>;

/**
 * Primary content in *ColorBackgroundBanner → With Heading and CTA → Primary*
 */
export interface ColorBackgroundBannerSliceWithHeadingAndCtaPrimary {
	/**
	 * Image field in *ColorBackgroundBanner → With Heading and CTA → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: color_background_banner.withHeadingAndCta.primary.image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Heading field in *ColorBackgroundBanner → With Heading and CTA → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: color_background_banner.withHeadingAndCta.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
	
	/**
	 * CTA field in *ColorBackgroundBanner → With Heading and CTA → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: color_background_banner.withHeadingAndCta.primary.cta
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	cta: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Text field in *ColorBackgroundBanner → With Heading and CTA → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: color_background_banner.withHeadingAndCta.primary.text
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	text: prismic.RichTextField;
}

/**
 * With Heading and CTA variation for ColorBackgroundBanner Slice
 *
 * - **API ID**: `withHeadingAndCta`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ColorBackgroundBannerSliceWithHeadingAndCta = prismic.SharedSliceVariation<"withHeadingAndCta", Simplify<ColorBackgroundBannerSliceWithHeadingAndCtaPrimary>, never>;

/**
 * Slice variation for *ColorBackgroundBanner*
 */
type ColorBackgroundBannerSliceVariation = ColorBackgroundBannerSliceDefault | ColorBackgroundBannerSliceWithHeadingAndCta

/**
 * ColorBackgroundBanner Shared Slice
 *
 * - **API ID**: `color_background_banner`
 * - **Description**: ColorBackgroundBanner
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ColorBackgroundBannerSlice = prismic.SharedSlice<"color_background_banner", ColorBackgroundBannerSliceVariation>;

/**
 * Primary content in *FeaturedCollection → Default → Primary*
 */
export interface FeaturedCollectionSliceDefaultPrimary {
	/**
	 * Heading field in *FeaturedCollection → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: featured_collection.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
	
	/**
	 * Shopify Collection ID field in *FeaturedCollection → Default → Primary*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: *None*
	 * - **API ID Path**: featured_collection.default.primary.shopify_collection_id
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	shopify_collection_id: prismic.NumberField;
	
	/**
	 * CTA field in *FeaturedCollection → Default → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: featured_collection.default.primary.cta
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	cta: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Default variation for FeaturedCollection Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FeaturedCollectionSliceDefault = prismic.SharedSliceVariation<"default", Simplify<FeaturedCollectionSliceDefaultPrimary>, never>;

/**
 * Slice variation for *FeaturedCollection*
 */
type FeaturedCollectionSliceVariation = FeaturedCollectionSliceDefault

/**
 * FeaturedCollection Shared Slice
 *
 * - **API ID**: `featured_collection`
 * - **Description**: FeaturedCollection
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FeaturedCollectionSlice = prismic.SharedSlice<"featured_collection", FeaturedCollectionSliceVariation>;

/**
 * Item in *FeaturedProjects → Default → Primary → Projects*
 */
export interface FeaturedProjectsSliceDefaultPrimaryProjectsItem {
	/**
	 * Project field in *FeaturedProjects → Default → Primary → Projects*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: featured_projects.default.primary.projects[].project
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	project: ContentRelationshipFieldWithData<[{"fields":["image","title","description","year",{"fields":["tag"],"id":"tags"}],"id":"project"}]>;
}

/**
 * Primary content in *FeaturedProjects → Default → Primary*
 */
export interface FeaturedProjectsSliceDefaultPrimary {
	/**
	 * Heading field in *FeaturedProjects → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: featured_projects.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
	
	/**
	 * CTA field in *FeaturedProjects → Default → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: featured_projects.default.primary.cta
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	cta: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Projects field in *FeaturedProjects → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: featured_projects.default.primary.projects[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	projects: prismic.GroupField<Simplify<FeaturedProjectsSliceDefaultPrimaryProjectsItem>>;
}

/**
 * Default variation for FeaturedProjects Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FeaturedProjectsSliceDefault = prismic.SharedSliceVariation<"default", Simplify<FeaturedProjectsSliceDefaultPrimary>, never>;

/**
 * Slice variation for *FeaturedProjects*
 */
type FeaturedProjectsSliceVariation = FeaturedProjectsSliceDefault

/**
 * FeaturedProjects Shared Slice
 *
 * - **API ID**: `featured_projects`
 * - **Description**: FeaturedProjects
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FeaturedProjectsSlice = prismic.SharedSlice<"featured_projects", FeaturedProjectsSliceVariation>;

/**
 * Primary content in *ImageWithText → Default → Primary*
 */
export interface ImageWithTextSliceDefaultPrimary {
	/**
	 * Image field in *ImageWithText → Default → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: image_with_text.default.primary.image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Heading field in *ImageWithText → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: image_with_text.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
	
	/**
	 * Text field in *ImageWithText → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: image_with_text.default.primary.text
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	text: prismic.RichTextField;
}

/**
 * Default variation for ImageWithText Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ImageWithTextSliceDefault = prismic.SharedSliceVariation<"default", Simplify<ImageWithTextSliceDefaultPrimary>, never>;

/**
 * Slice variation for *ImageWithText*
 */
type ImageWithTextSliceVariation = ImageWithTextSliceDefault

/**
 * ImageWithText Shared Slice
 *
 * - **API ID**: `image_with_text`
 * - **Description**: ImageWithText
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ImageWithTextSlice = prismic.SharedSlice<"image_with_text", ImageWithTextSliceVariation>;

/**
 * Primary content in *MediaCover → Default → Primary*
 */
export interface MediaCoverSliceDefaultPrimary {
	/**
	 * Image field in *MediaCover → Default → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: media_cover.default.primary.image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Height field in *MediaCover → Default → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: 1/0.6
	 * - **API ID Path**: media_cover.default.primary.height
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	height: prismic.SelectField<"1/0.6" | "Screen" | "Auto", "filled">;
}

/**
 * Default variation for MediaCover Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type MediaCoverSliceDefault = prismic.SharedSliceVariation<"default", Simplify<MediaCoverSliceDefaultPrimary>, never>;

/**
 * Slice variation for *MediaCover*
 */
type MediaCoverSliceVariation = MediaCoverSliceDefault

/**
 * MediaCover Shared Slice
 *
 * - **API ID**: `media_cover`
 * - **Description**: MediaCover
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type MediaCoverSlice = prismic.SharedSlice<"media_cover", MediaCoverSliceVariation>;

declare module "@prismicio/client" {
	interface CreateClient {
		(repositoryNameOrEndpoint: string, options?: prismic.ClientConfig): prismic.Client<AllDocumentTypes>;
	}
	
	interface CreateWriteClient {
		(repositoryNameOrEndpoint: string, options: prismic.WriteClientConfig): prismic.WriteClient<AllDocumentTypes>;
	}
	
	interface CreateMigration {
		(): prismic.Migration<AllDocumentTypes>;
	}
	
	namespace Content {
		export type {
			ColeccionDocument,
			ColeccionDocumentData,
			ColeccionDocumentDataSlicesSlice,
			CotizarDocument,
			CotizarDocumentData,
			CotizarDocumentDataSlicesSlice,
			FooterDocument,
			FooterDocumentData,
			FooterDocumentDataBlocksItem,
			FooterDocumentDataLinksItem,
			GaleriaDocument,
			GaleriaDocumentData,
			GaleriaDocumentDataSlicesSlice,
			HeaderDocument,
			HeaderDocumentData,
			HeaderDocumentDataNavigationItem,
			HomeDocument,
			HomeDocumentData,
			HomeDocumentDataSlicesSlice,
			LegalPageDocument,
			LegalPageDocumentData,
			LegalPageDocumentDataSlicesSlice,
			NosotrosDocument,
			NosotrosDocumentData,
			NosotrosDocumentDataSlicesSlice,
			ProductPageDocument,
			ProductPageDocumentData,
			ProductPageDocumentDataSlicesSlice,
			ProductoDocument,
			ProductoDocumentData,
			ProductoDocumentDataSlicesSlice,
			ProjectDocument,
			ProjectDocumentData,
			ProjectDocumentDataTagsItem,
			TiendaDocument,
			TiendaDocumentData,
			TiendaDocumentDataSlicesSlice,
			AllDocumentTypes,
			BannerWithTextSlice,
			BannerWithTextSliceDefaultPrimary,
			BannerWithTextSliceVariation,
			BannerWithTextSliceDefault,
			ColorBackgroundBannerSlice,
			ColorBackgroundBannerSliceDefaultPrimaryTextBlocksItem,
			ColorBackgroundBannerSliceDefaultPrimary,
			ColorBackgroundBannerSliceWithHeadingAndCtaPrimary,
			ColorBackgroundBannerSliceVariation,
			ColorBackgroundBannerSliceDefault,
			ColorBackgroundBannerSliceWithHeadingAndCta,
			FeaturedCollectionSlice,
			FeaturedCollectionSliceDefaultPrimary,
			FeaturedCollectionSliceVariation,
			FeaturedCollectionSliceDefault,
			FeaturedProjectsSlice,
			FeaturedProjectsSliceDefaultPrimaryProjectsItem,
			FeaturedProjectsSliceDefaultPrimary,
			FeaturedProjectsSliceVariation,
			FeaturedProjectsSliceDefault,
			ImageWithTextSlice,
			ImageWithTextSliceDefaultPrimary,
			ImageWithTextSliceVariation,
			ImageWithTextSliceDefault,
			MediaCoverSlice,
			MediaCoverSliceDefaultPrimary,
			MediaCoverSliceVariation,
			MediaCoverSliceDefault
		}
	}
}