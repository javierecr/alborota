import prismicConfig from './prismic.config.json';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  modules: [
    '@nuxtjs/prismic',
    '@nuxtjs/tailwindcss',
    'nuxt-svgo',
    'nuxt-viewport',
    '@nuxt/image',
    '@nuxtjs/shopify',
    '@nuxt/fonts',
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      link: [
        {
          rel: 'preload',
          href: '/typeface/StevieSans.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
      ],
    },
  },

  fonts: {
    families: [
      { name: 'StevieSans', src: '/typeface/StevieSans.woff2', weight: 400, global: true },
      { name: 'StevieSans', src: '/typeface/StevieSans-Bold.woff2', weight: 700, global: true },
      { name: 'StevieSansBook', src: '/typeface/StevieSansBook.woff2', weight: 400, global: true },
      { name: 'ABC Diatype Extended', src: '/typeface/ABCDiatypeExtended-Bold.woff2', weight: 700, global: true },
    ],
  },

  prismic: {
    endpoint: prismicConfig.repositoryName,
    clientConfig: {
      routes: prismicConfig.routes,
    },
  },

  viewport: {
    breakpoints: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    },
  },

   vite: {
    optimizeDeps: {
      include: [
        '@prismicio/client',
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ]
    }
  },
  shopify: {
    name: 'alborota-2',
    clients: {
      storefront: {
        apiVersion: '2026-04',
        publicAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
      },
      admin: {
        apiVersion: '2026-04',
        accessToken: process.env.SHOPIFY_PRIVATE_ACCESS_TOKEN || '',
        codegen: { skip: true },
      },
    },
  },

  image: {
    domains: ['images.prismic.io', 'cdn.shopify.com'],
  },

  runtimeConfig: {
    public: {
      formspark: { formId: process.env.NUXT_PUBLIC_FORMSPARK_FORM_ID || '' },
    },
  },
});
