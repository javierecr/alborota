import { asText, isFilled } from '@prismicio/client';
import type { ImageField, KeyTextField, RichTextField } from '@prismicio/client';
import type { Ref } from 'vue';
import { seoConfig } from '~/seo/config';

export interface PrismicSeoData {
  meta_title?: KeyTextField;
  page_title?: KeyTextField;
  title?: KeyTextField;
  meta_description?: KeyTextField;
  description?: KeyTextField | RichTextField;
  intro?: RichTextField;
  meta_image?: ImageField;
  cover_image?: ImageField;
}

export interface PrismicSeoDoc {
  data: PrismicSeoData;
  url?: string | null;
}

export interface UsePrismicMetadataOptions {
  titleFallback?: string;
  descriptionFallback?: string;
  imageFallback?: string;
  imageAltFallback?: string;
  ogType?: 'website' | 'article';
  index?: boolean;
}

function getFieldText(value: KeyTextField | RichTextField | undefined): string | undefined {
  if (value == null) return undefined;
  if (typeof value === 'string') {
    const text = value.trim();
    return text || undefined;
  }
  if (isFilled.richText(value)) {
    const text = asText(value).trim();
    return text || undefined;
  }
  return undefined;
}

function getImageUrl(image: ImageField | undefined): string | undefined {
  return isFilled.image(image) ? (image.url ?? undefined) : undefined;
}

function getImageAlt(image: ImageField | undefined): string | undefined {
  return isFilled.image(image) && image.alt ? image.alt : undefined;
}

export function usePrismicMetadata(
  doc: Ref<PrismicSeoDoc | undefined>,
  options: UsePrismicMetadataOptions = {},
) {
  const route = useRoute();
  const ogType = options.ogType ?? 'website';
  const robots =
    options.index === false
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  const title = computed(() => {
    const data = doc.value?.data;
    const pageTitle =
      getFieldText(data?.meta_title) ??
      getFieldText(data?.page_title) ??
      getFieldText(data?.title) ??
      options.titleFallback;
    return pageTitle ? `${pageTitle} | ${seoConfig.siteName}` : seoConfig.defaultTitle;
  });

  const description = computed(() =>
    getFieldText(doc.value?.data?.meta_description) ??
    getFieldText(doc.value?.data?.description) ??
    getFieldText(doc.value?.data?.intro) ??
    options.descriptionFallback ??
    seoConfig.shortDescription,
  );

  const image = computed(() =>
    getImageUrl(doc.value?.data?.meta_image) ??
    getImageUrl(doc.value?.data?.cover_image) ??
    options.imageFallback ??
    `${seoConfig.siteUrl}${seoConfig.ogImagePath}`,
  );

  const imageAlt = computed(() =>
    getImageAlt(doc.value?.data?.meta_image) ??
    options.imageAltFallback ??
    seoConfig.siteName,
  );

  const canonicalUrl = computed(() => {
    if (doc.value?.url) return `${seoConfig.siteUrl}${doc.value.url}`;
    const path = route.path;
    return path === '/' ? seoConfig.siteUrl : `${seoConfig.siteUrl}${path}`;
  });

  useHead({
    htmlAttrs: { lang: seoConfig.htmlLang },
    link: [{ rel: 'canonical', href: canonicalUrl }],
  });

  useSeoMeta({
    title, description,
    ogTitle: title, ogDescription: description,
    ogType, ogImage: image, ogImageAlt: imageAlt,
    ogUrl: canonicalUrl, ogSiteName: seoConfig.siteName,
    ogLocale: seoConfig.locale,
    twitterCard: 'summary_large_image',
    twitterTitle: title, twitterDescription: description, twitterImage: image,
    robots,
  });
}
