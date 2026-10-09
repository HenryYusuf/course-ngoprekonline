import process from 'node:process'
import { fileURLToPath } from 'node:url'

// https://nuxt.com/docs/api/configuration/nuxt-config
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL ?? 'https://ngoprekonline.example'

// Nitro resolves `serverAssets[].dir` relative to `srcDir` (which is `app/`
// in Nuxt 4), so an absolute path is required to mount the repo-root
// `public/downloads` folder the resource files live in.
const downloadsDir = fileURLToPath(new URL('./public/downloads', import.meta.url))

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@unocss/nuxt',
    '@nuxt/content',
    '@nuxtjs/sitemap',
    'nuxt-studio',
  ],

  // Content only changes at deploy time, so the sitemap can be fully
  // resolved at build (official module recommendation; trims the server
  // bundle and the per-request dynamic-source scan).
  sitemap: {
    zeroRuntime: true,
  },

  // Prefer explicit imports; framework helpers come from `#imports`
  imports: {
    autoImport: false,
  },

  // Site-wide document head: language of the UI, RSS discovery for feed readers.
  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      link: [
        { rel: 'alternate', type: 'application/rss+xml', title: 'RSS', href: '/rss.xml' },
      ],
    },
  },

  // Tailwind-compatible reset so `border`-style utilities actually render
  // (UnoCSS ships no CSS reset; ddpanda look relies on it) + self-hosted font
  // faces for the ddpanda-style design tokens (issue #12).
  css: ['@unocss/reset/tailwind.css', '~/assets/css/fonts.css'],

  // MDC tags like `::youtube` resolve by name at runtime, so embed components
  // must be globally registered. Every other component is imported explicitly.
  components: [
    { path: '~/components/content', pathPrefix: false, global: true },
  ],

  nitro: {
    imports: false,
    // Expose the download files to server routes via `useStorage('assets')`
    // so `/downloads/[slug].zip` can assemble an archive from the same files the
    // per-file links already serve (no separate copy to drift out of sync).
    serverAssets: [
      { baseName: 'downloads', dir: downloadsDir },
    ],
    prerender: {
      // Entry must stay crawlable while `/` itself is excluded (routeRules
      // below): the static layer ignores query strings, so a prerendered
      // index.html would hijack `/?page=N` and always serve page 1 (spec #12).
      // `/rss.xml` and `/robots.txt` are listed explicitly because the crawler
      // skips non-HTML links.
      routes: ['/blog', '/rss.xml', '/robots.txt'],
      crawlLinks: true,
    },
  },

  routeRules: {
    // Not prerendered: the static layer ignores query strings, so a
    // prerendered `/` would hijack `/?page=N` (spec #12). Cached instead:
    // content only changes at deploy, so an hour of SWR absorbs traffic
    // bursts without serving stale data after a redeploy.
    '/': { prerender: false, swr: 3600 },
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
    // run outside CI (e.g. VPS Docker), so the repository and branch are set
    // explicitly.
    repository: {
      provider: 'github',
      owner: 'HenryYusuf',
      repo: 'course-ngoprekonline',
      branch: 'main',
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
