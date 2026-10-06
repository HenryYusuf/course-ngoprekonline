// https://nuxt.com/docs/api/configuration/nuxt-config
import process from 'node:process'

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL ?? 'https://ngoprekonline.example'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@unocss/nuxt',
    '@nuxt/content',
    '@nuxtjs/sitemap',
    'nuxt-studio',
  ],

  // Prefer explicit imports; framework helpers come from `#imports`
  imports: {
    autoImport: false,
  },

  // MDC tags like `::youtube` resolve by name at runtime, so embed components
  // must be globally registered. Every other component is imported explicitly.
  components: [
    { path: '~/components/content', pathPrefix: false, global: true },
  ],

  nitro: {
    imports: false,
    prerender: {
      routes: ['/'],
      crawlLinks: true,
    },
  },

  runtimeConfig: {
    public: {
      siteUrl,
      siteName: 'Ngoprek Online',
      siteDescription: 'Kursus online dan artikel seputar ngoprek untuk developer Indonesia.',
    },
  },

  // Consumed by @nuxtjs/sitemap (site config)
  site: {
    url: siteUrl,
    name: 'Ngoprek Online',
  },

  studio: {
    // Required for production builds: Studio's CI-based auto-detection cannot
    // run outside CI (e.g. VPS Docker), so the repository is set explicitly.
    repository: {
      provider: 'github',
      owner: 'HenryYusuf',
      repo: 'course-ngoprekonline',
    },
    i18n: {
      defaultLocale: 'id',
    },
    git: {
      commit: {
        // Keep Studio-generated commits compatible with commitlint
        messagePrefix: 'content:',
      },
    },
  },
})
