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

type CotizarDocumentDataSlicesSlice = ProcessStepsSlice

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

type GaleriaDocumentDataSlicesSlice = FeaturedProjectsSlice | BannerWithTextSlice

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

/**
 * Content for Info documents
 */
interface InfoDocumentData {
	/**
	 * Page Title field in *Info*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: info.page_title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	page_title: prismic.KeyTextField;
	
	/**
	 * Content field in *Info*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: info.content
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	content: prismic.RichTextField;/**
	 * Meta Title field in *Info*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: info.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Info*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: info.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Info*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: info.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Info document from Prismic
 *
 * - **API ID**: `info`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type InfoDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<InfoDocumentData>, "info", Lang>;

type NosotrosDocumentDataSlicesSlice = FeaturedProjectsSlice | BannerWithTextSlice | CollageBannerSlice | HeadingWithQuoteSlice | FramedPhotoGridSlice | FramedPhotoSlice | FeaturedCollectionSlice

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

export type AllDocumentTypes = ColeccionDocument | CotizarDocument | FooterDocument | GaleriaDocument | HeaderDocument | HomeDocument | InfoDocument | NosotrosDocument | ProductPageDocument | ProductoDocument | ProjectDocument | TiendaDocument;

/**
 * Primary content in *BannerWithText → Default → Primary*
 */
export interface BannerWithTextSliceDefaultPrimary {
	/**
	 * Frame Color field in *BannerWithText → Default → Primary*
	 *
	 * - **Field Type**: Color
	 * - **Placeholder**: *None*
	 * - **API ID Path**: banner_with_text.default.primary.frame_color
	 * - **Documentation**: https://prismic.io/docs/fields/color
	 */
	frame_color: prismic.ColorField;
	
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
 * Item in *CollageBanner → Default → Primary → Text blocks*
 */
export interface CollageBannerSliceDefaultPrimaryTextBlocksItem {
	/**
	 * Kind field in *CollageBanner → Default → Primary → Text blocks*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: Body
	 * - **API ID Path**: collage_banner.default.primary.text_blocks[].kind
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	kind: prismic.SelectField<"Heading" | "Body", "filled">;
	
	/**
	 * Text field in *CollageBanner → Default → Primary → Text blocks*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: collage_banner.default.primary.text_blocks[].text
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	text: prismic.RichTextField;
	
	/**
	 * Position field in *CollageBanner → Default → Primary → Text blocks*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: Left
	 * - **API ID Path**: collage_banner.default.primary.text_blocks[].position
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	position: prismic.SelectField<"Left" | "Center" | "Right", "filled">;
	
	/**
	 * Tilt field in *CollageBanner → Default → Primary → Text blocks*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: None
	 * - **API ID Path**: collage_banner.default.primary.text_blocks[].tilt
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	tilt: prismic.SelectField<"None" | "Left" | "Right", "filled">;
}

/**
 * Primary content in *CollageBanner → Default → Primary*
 */
export interface CollageBannerSliceDefaultPrimary {
	/**
	 * Image field in *CollageBanner → Default → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: collage_banner.default.primary.image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Image Mobile (optional) field in *CollageBanner → Default → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: collage_banner.default.primary.image_mobile
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image_mobile: prismic.ImageField<never>;
	
	/**
	 * Image Height field in *CollageBanner → Default → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: 1/0.35
	 * - **API ID Path**: collage_banner.default.primary.image_height
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	image_height: prismic.SelectField<"1/0.35" | "Screen" | "Auto", "filled">;
	
	/**
	 * Vertical Layout field in *CollageBanner → Default → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: Spread
	 * - **API ID Path**: collage_banner.default.primary.vertical_layout
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	vertical_layout: prismic.SelectField<"Spread" | "Top" | "Center" | "Bottom", "filled">;
	
	/**
	 * Text blocks field in *CollageBanner → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: collage_banner.default.primary.text_blocks[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	text_blocks: prismic.GroupField<Simplify<CollageBannerSliceDefaultPrimaryTextBlocksItem>>;
}

/**
 * Default variation for CollageBanner Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type CollageBannerSliceDefault = prismic.SharedSliceVariation<"default", Simplify<CollageBannerSliceDefaultPrimary>, never>;

/**
 * Slice variation for *CollageBanner*
 */
type CollageBannerSliceVariation = CollageBannerSliceDefault

/**
 * CollageBanner Shared Slice
 *
 * - **API ID**: `collage_banner`
 * - **Description**: CollageBanner
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type CollageBannerSlice = prismic.SharedSlice<"collage_banner", CollageBannerSliceVariation>;

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
 * Primary content in *FeaturedCollection → All Products → Primary*
 */
export interface FeaturedCollectionSliceAllProductsPrimary {
	/**
	 * Heading field in *FeaturedCollection → All Products → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: featured_collection.allProducts.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
	
	/**
	 * CTA field in *FeaturedCollection → All Products → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: featured_collection.allProducts.primary.cta
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	cta: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Randomize order field in *FeaturedCollection → All Products → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: featured_collection.allProducts.primary.randomize
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	randomize: prismic.BooleanField;
}

/**
 * All Products variation for FeaturedCollection Slice
 *
 * - **API ID**: `allProducts`
 * - **Description**: All Products
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FeaturedCollectionSliceAllProducts = prismic.SharedSliceVariation<"allProducts", Simplify<FeaturedCollectionSliceAllProductsPrimary>, never>;

/**
 * Slice variation for *FeaturedCollection*
 */
type FeaturedCollectionSliceVariation = FeaturedCollectionSliceDefault | FeaturedCollectionSliceAllProducts

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
 * Primary content in *FramedPhoto → With Caption → Primary*
 */
export interface FramedPhotoSliceDefaultPrimary {
	/**
	 * Image field in *FramedPhoto → With Caption → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: framed_photo.default.primary.image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Name field in *FramedPhoto → With Caption → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: framed_photo.default.primary.name
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	name: prismic.KeyTextField;
	
	/**
	 * Role field in *FramedPhoto → With Caption → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: framed_photo.default.primary.role
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	role: prismic.KeyTextField;
	
	/**
	 * Frame Color field in *FramedPhoto → With Caption → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: Pink
	 * - **API ID Path**: framed_photo.default.primary.frame_color
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	frame_color: prismic.SelectField<"Olive" | "Pink" | "Orange" | "Grass" | "Cream" | "Beige", "filled">;
	
	/**
	 * Image Align field in *FramedPhoto → With Caption → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: Left
	 * - **API ID Path**: framed_photo.default.primary.image_align
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	image_align: prismic.SelectField<"Left" | "Right", "filled">;
	
	/**
	 * Image Ratio field in *FramedPhoto → With Caption → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: 3/2
	 * - **API ID Path**: framed_photo.default.primary.image_ratio
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	image_ratio: prismic.SelectField<"3/2" | "2/1" | "16/9" | "Auto", "filled">;
	
	/**
	 * Tilt field in *FramedPhoto → With Caption → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: Left
	 * - **API ID Path**: framed_photo.default.primary.tilt
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	tilt: prismic.SelectField<"None" | "Left" | "Right", "filled">;
}

/**
 * With Caption variation for FramedPhoto Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FramedPhotoSliceDefault = prismic.SharedSliceVariation<"default", Simplify<FramedPhotoSliceDefaultPrimary>, never>;

/**
 * Primary content in *FramedPhoto → Image Only → Primary*
 */
export interface FramedPhotoSliceImageOnlyPrimary {
	/**
	 * Image field in *FramedPhoto → Image Only → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: framed_photo.imageOnly.primary.image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Frame Color field in *FramedPhoto → Image Only → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: Pink
	 * - **API ID Path**: framed_photo.imageOnly.primary.frame_color
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	frame_color: prismic.SelectField<"Olive" | "Pink" | "Orange" | "Grass" | "Cream" | "Beige", "filled">;
	
	/**
	 * Image Align field in *FramedPhoto → Image Only → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: Left
	 * - **API ID Path**: framed_photo.imageOnly.primary.image_align
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	image_align: prismic.SelectField<"Left" | "Right", "filled">;
	
	/**
	 * Image Ratio field in *FramedPhoto → Image Only → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: 2/1
	 * - **API ID Path**: framed_photo.imageOnly.primary.image_ratio
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	image_ratio: prismic.SelectField<"3/2" | "2/1" | "16/9" | "Auto", "filled">;
	
	/**
	 * Tilt field in *FramedPhoto → Image Only → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: Left
	 * - **API ID Path**: framed_photo.imageOnly.primary.tilt
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	tilt: prismic.SelectField<"None" | "Left" | "Right", "filled">;
}

/**
 * Image Only variation for FramedPhoto Slice
 *
 * - **API ID**: `imageOnly`
 * - **Description**: Image Only
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FramedPhotoSliceImageOnly = prismic.SharedSliceVariation<"imageOnly", Simplify<FramedPhotoSliceImageOnlyPrimary>, never>;

/**
 * Slice variation for *FramedPhoto*
 */
type FramedPhotoSliceVariation = FramedPhotoSliceDefault | FramedPhotoSliceImageOnly

/**
 * FramedPhoto Shared Slice
 *
 * - **API ID**: `framed_photo`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FramedPhotoSlice = prismic.SharedSlice<"framed_photo", FramedPhotoSliceVariation>;

/**
 * Item in *FramedPhotoGrid → Default → Primary → Photos*
 */
export interface FramedPhotoGridSliceDefaultPrimaryPhotosItem {
	/**
	 * Image field in *FramedPhotoGrid → Default → Primary → Photos*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: framed_photo_grid.default.primary.photos[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Name field in *FramedPhotoGrid → Default → Primary → Photos*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: framed_photo_grid.default.primary.photos[].name
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	name: prismic.KeyTextField;
	
	/**
	 * Role field in *FramedPhotoGrid → Default → Primary → Photos*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: framed_photo_grid.default.primary.photos[].role
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	role: prismic.KeyTextField;
}

/**
 * Primary content in *FramedPhotoGrid → Default → Primary*
 */
export interface FramedPhotoGridSliceDefaultPrimary {
	/**
	 * Frame Color field in *FramedPhotoGrid → Default → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: Olive
	 * - **API ID Path**: framed_photo_grid.default.primary.frame_color
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	frame_color: prismic.SelectField<"Olive" | "Pink" | "Orange" | "Grass" | "Cream" | "Beige", "filled">;
	
	/**
	 * Columns field in *FramedPhotoGrid → Default → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: 2
	 * - **API ID Path**: framed_photo_grid.default.primary.columns
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	columns: prismic.SelectField<"2" | "3", "filled">;
	
	/**
	 * Photos field in *FramedPhotoGrid → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: framed_photo_grid.default.primary.photos[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	photos: prismic.GroupField<Simplify<FramedPhotoGridSliceDefaultPrimaryPhotosItem>>;
}

/**
 * Default variation for FramedPhotoGrid Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FramedPhotoGridSliceDefault = prismic.SharedSliceVariation<"default", Simplify<FramedPhotoGridSliceDefaultPrimary>, never>;

/**
 * Slice variation for *FramedPhotoGrid*
 */
type FramedPhotoGridSliceVariation = FramedPhotoGridSliceDefault

/**
 * FramedPhotoGrid Shared Slice
 *
 * - **API ID**: `framed_photo_grid`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FramedPhotoGridSlice = prismic.SharedSlice<"framed_photo_grid", FramedPhotoGridSliceVariation>;

/**
 * Primary content in *HeadingWithQuote → Default → Primary*
 */
export interface HeadingWithQuoteSliceDefaultPrimary {
	/**
	 * Heading field in *HeadingWithQuote → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: heading_with_quote.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
	
	/**
	 * Heading Tilt field in *HeadingWithQuote → Default → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: Left
	 * - **API ID Path**: heading_with_quote.default.primary.heading_tilt
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	heading_tilt: prismic.SelectField<"None" | "Left" | "Right", "filled">;
	
	/**
	 * Quote field in *HeadingWithQuote → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: heading_with_quote.default.primary.quote
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	quote: prismic.RichTextField;
}

/**
 * Default variation for HeadingWithQuote Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HeadingWithQuoteSliceDefault = prismic.SharedSliceVariation<"default", Simplify<HeadingWithQuoteSliceDefaultPrimary>, never>;

/**
 * Slice variation for *HeadingWithQuote*
 */
type HeadingWithQuoteSliceVariation = HeadingWithQuoteSliceDefault

/**
 * HeadingWithQuote Shared Slice
 *
 * - **API ID**: `heading_with_quote`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HeadingWithQuoteSlice = prismic.SharedSlice<"heading_with_quote", HeadingWithQuoteSliceVariation>;

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

/**
 * Item in *ProcessSteps → Default → Primary → Pasos*
 */
export interface ProcessStepsSliceDefaultPrimaryStepsItem {
	/**
	 * Imagen field in *ProcessSteps → Default → Primary → Pasos*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: process_steps.default.primary.steps[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Título del paso field in *ProcessSteps → Default → Primary → Pasos*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Conceptualizar
	 * - **API ID Path**: process_steps.default.primary.steps[].heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
	
	/**
	 * Descripción field in *ProcessSteps → Default → Primary → Pasos*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: process_steps.default.primary.steps[].text
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	text: prismic.KeyTextField;
}

/**
 * Primary content in *ProcessSteps → Default → Primary*
 */
export interface ProcessStepsSliceDefaultPrimary {
	/**
	 * Título field in *ProcessSteps → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Más sobre el proceso
	 * - **API ID Path**: process_steps.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
	
	/**
	 * Pasos field in *ProcessSteps → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: process_steps.default.primary.steps[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	steps: prismic.GroupField<Simplify<ProcessStepsSliceDefaultPrimaryStepsItem>>;
}

/**
 * Default variation for ProcessSteps Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ProcessStepsSliceDefault = prismic.SharedSliceVariation<"default", Simplify<ProcessStepsSliceDefaultPrimary>, never>;

/**
 * Slice variation for *ProcessSteps*
 */
type ProcessStepsSliceVariation = ProcessStepsSliceDefault

/**
 * ProcessSteps Shared Slice
 *
 * - **API ID**: `process_steps`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ProcessStepsSlice = prismic.SharedSlice<"process_steps", ProcessStepsSliceVariation>;

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
			InfoDocument,
			InfoDocumentData,
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
			CollageBannerSlice,
			CollageBannerSliceDefaultPrimaryTextBlocksItem,
			CollageBannerSliceDefaultPrimary,
			CollageBannerSliceVariation,
			CollageBannerSliceDefault,
			ColorBackgroundBannerSlice,
			ColorBackgroundBannerSliceDefaultPrimaryTextBlocksItem,
			ColorBackgroundBannerSliceDefaultPrimary,
			ColorBackgroundBannerSliceWithHeadingAndCtaPrimary,
			ColorBackgroundBannerSliceVariation,
			ColorBackgroundBannerSliceDefault,
			ColorBackgroundBannerSliceWithHeadingAndCta,
			FeaturedCollectionSlice,
			FeaturedCollectionSliceDefaultPrimary,
			FeaturedCollectionSliceAllProductsPrimary,
			FeaturedCollectionSliceVariation,
			FeaturedCollectionSliceDefault,
			FeaturedCollectionSliceAllProducts,
			FeaturedProjectsSlice,
			FeaturedProjectsSliceDefaultPrimaryProjectsItem,
			FeaturedProjectsSliceDefaultPrimary,
			FeaturedProjectsSliceVariation,
			FeaturedProjectsSliceDefault,
			FramedPhotoSlice,
			FramedPhotoSliceDefaultPrimary,
			FramedPhotoSliceImageOnlyPrimary,
			FramedPhotoSliceVariation,
			FramedPhotoSliceDefault,
			FramedPhotoSliceImageOnly,
			FramedPhotoGridSlice,
			FramedPhotoGridSliceDefaultPrimaryPhotosItem,
			FramedPhotoGridSliceDefaultPrimary,
			FramedPhotoGridSliceVariation,
			FramedPhotoGridSliceDefault,
			HeadingWithQuoteSlice,
			HeadingWithQuoteSliceDefaultPrimary,
			HeadingWithQuoteSliceVariation,
			HeadingWithQuoteSliceDefault,
			ImageWithTextSlice,
			ImageWithTextSliceDefaultPrimary,
			ImageWithTextSliceVariation,
			ImageWithTextSliceDefault,
			MediaCoverSlice,
			MediaCoverSliceDefaultPrimary,
			MediaCoverSliceVariation,
			MediaCoverSliceDefault,
			ProcessStepsSlice,
			ProcessStepsSliceDefaultPrimaryStepsItem,
			ProcessStepsSliceDefaultPrimary,
			ProcessStepsSliceVariation,
			ProcessStepsSliceDefault
		}
	}
}