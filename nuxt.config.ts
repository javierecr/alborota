import { routes } from './prismic/routes';
import { repositoryName } from './slicemachine.config.json';

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
  ],

  css: ['~/assets/css/main.css', '~/assets/css/typeface.css'],

  svgo: {
    defaultImport: 'component',
  },

  prismic: {
    endpoint: repositoryName,
    clientConfig: {
      routes,
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
        apiVersion: '2025-10',
        publicAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
      },
      admin: {
        apiVersion: '2025-10',
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
