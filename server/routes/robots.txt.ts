import { defineEventHandler } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'

/** Advertise the sitemap location; URL comes from the same runtime config as the site. */
export default defineEventHandler((event) => {
  const { siteUrl } = useRuntimeConfig(event).public
  return `User-Agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
})
