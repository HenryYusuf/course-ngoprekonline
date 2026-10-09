import { queryCollection } from '@nuxt/content/nitro'
import { createError, defineEventHandler, getRouterParam, setResponseHeader } from 'h3'
import { useStorage } from 'nitropack/runtime'

import { buildPackageZip } from '#shared/utils/packageZip'
import { isPublished } from '#shared/utils/publishing'

/**
 * Stream every resource file of a post as a single ZIP. Content only changes
 * at deploy, so the archive is assembled on demand from the same
 * `public/downloads` files the per-file links already serve, so there is no
 * stale pre-built zip to drift out of sync.
 */
export default defineEventHandler(async (event) => {
  // `[slug].zip.ts` registers the radix3 param as `slug.zip`, so the captured
  // value includes the extension and must be trimmed back to the slug.
  const param = getRouterParam(event, 'slug.zip') ?? ''
  const slug = param.replace(/\.zip$/, '')
  if (!param || !slug) {
    throw createError({ statusCode: 404, statusMessage: 'Paket tidak ditemukan' })
  }

  const post = await queryCollection(event, 'blog').path(`/blog/${slug}`).first()
  if (!post || !isPublished(post)) {
    throw createError({ statusCode: 404, statusMessage: 'Paket tidak ditemukan' })
  }

  const resources: { file: string }[] = post.resources ?? []
  if (resources.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Paket tidak memiliki berkas unduhan' })
  }

  // Nitro mounts the `serverAssets` dir at the `assets` storage base, keyed by
  // `<baseName>/<file>` (so `downloads/<file>`).
  const assets = useStorage('assets')
  const encoder = new TextEncoder()
  const entries = await Promise.all(resources.map(async ({ file }) => {
    const key = file.replace(/^\//, '')
    const data = await assets.getItemRaw(key)
    if (!data) {
      throw createError({ statusCode: 404, statusMessage: `Berkas ${file} tidak ditemukan` })
    }
    return {
      name: file,
      data: typeof data === 'string' ? encoder.encode(data) : new Uint8Array(data),
    }
  }))

  const zip = buildPackageZip(entries)

  setResponseHeader(event, 'content-type', 'application/zip')
  setResponseHeader(event, 'content-disposition', `attachment; filename="${slug}.zip"`)
  // Content only changes at deploy, so cache like the homepage's SWR window.
  setResponseHeader(event, 'cache-control', 'public, max-age=3600')
  return zip
})
