import { describe, expect, it } from 'vitest'

import { articleJsonLd } from './articleJsonLd'

const SITE_URL = 'https://course.ngoprekonline.com'
const SITE_NAME = 'Ngoprek Online'

const post = {
  path: '/blog/halo-dunia',
  title: 'Halo Dunia',
  description: 'Post pertama.',
  publishedAt: new Date('2026-09-20T00:00:00Z'),
}

describe('articleJsonLd', () => {
  it('emits an Article node with the canonical url and publisher', () => {
    const graph = articleJsonLd(post, SITE_URL, SITE_NAME)['@graph']
    const article = graph.find(node => node['@type'] === 'Article')

    expect(article).toBeDefined()
    expect(article?.headline).toBe('Halo Dunia')
    expect(article?.url).toBe(`${SITE_URL}/blog/halo-dunia`)
    expect(article?.datePublished).toBe('2026-09-20T00:00:00.000Z')
    expect(article?.inLanguage).toBe('id')
    expect(article?.publisher).toEqual({
      '@type': 'Organization',
      'name': SITE_NAME,
      'url': SITE_URL,
    })
  })

  it('falls back to the default og:image when the post has none', () => {
    const graph = articleJsonLd(post, SITE_URL, SITE_NAME)['@graph']
    const article = graph.find(node => node['@type'] === 'Article')

    expect(article?.image).toBe(`${SITE_URL}/images/og-default.png`)
  })

  it('uses the post image when present', () => {
    const graph = articleJsonLd({ ...post, image: '/images/cover.png' }, SITE_URL, SITE_NAME)['@graph']
    const article = graph.find(node => node['@type'] === 'Article')

    expect(article?.image).toBe(`${SITE_URL}/images/cover.png`)
  })

  it('builds a BreadcrumbList: Beranda > Blog > article', () => {
    const graph = articleJsonLd(post, SITE_URL, SITE_NAME)['@graph']
    const breadcrumb = graph.find(node => node['@type'] === 'BreadcrumbList')
    const items = breadcrumb?.itemListElement as { position: number, name: string, item: string }[]

    expect(items.map(i => i.name)).toEqual(['Beranda', 'Blog', 'Halo Dunia'])
    expect(items.map(i => i.item)).toEqual([
      SITE_URL,
      `${SITE_URL}/blog`,
      `${SITE_URL}/blog/halo-dunia`,
    ])
  })

  it('inserts the category between Blog and the article when given', () => {
    const graph = articleJsonLd(
      { ...post, categorySlug: 'tutorial', categoryLabel: 'Tutorial' },
      SITE_URL,
      SITE_NAME,
    )['@graph']
    const breadcrumb = graph.find(node => node['@type'] === 'BreadcrumbList')
    const items = breadcrumb?.itemListElement as { position: number, name: string, item: string }[]

    expect(items.map(i => i.name)).toEqual(['Beranda', 'Blog', 'Tutorial', 'Halo Dunia'])
    expect(items[2]?.item).toBe(`${SITE_URL}/blog/category/tutorial`)
    expect(items[3]?.position).toBe(4)
  })
})
