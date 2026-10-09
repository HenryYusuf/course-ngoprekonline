export interface ArticleJsonLdInput {
  path: string
  title: string
  description: string
  publishedAt: Date | string
  image?: string
  categorySlug?: string
  categoryLabel?: string
}

interface JsonLdNode {
  '@type': string
  [key: string]: unknown
}

/**
 * Build a compact Article + BreadcrumbList graph for rich results. The
 * publisher is the site itself; there is no per-author data in the content
 * model, so an Organization is the honest shape rather than a fabricated
 * Person.
 */
export function articleJsonLd(
  post: ArticleJsonLdInput,
  siteUrl: string,
  siteName: string,
): { '@context': string, '@graph': JsonLdNode[] } {
  const url = `${siteUrl}${post.path}`
  const image = post.image ? `${siteUrl}${post.image}` : `${siteUrl}/images/og-default.png`

  const breadcrumbItems: JsonLdNode[] = [
    { '@type': 'ListItem', 'position': 1, 'name': 'Beranda', 'item': siteUrl },
    { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': `${siteUrl}/blog` },
  ]
  if (post.categoryLabel && post.categorySlug) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      'position': 3,
      'name': post.categoryLabel,
      'item': `${siteUrl}/blog/category/${post.categorySlug}`,
    })
  }
  breadcrumbItems.push({
    '@type': 'ListItem',
    'position': breadcrumbItems.length + 1,
    'name': post.title,
    'item': url,
  })

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        'headline': post.title,
        'description': post.description,
        image,
        'datePublished': new Date(post.publishedAt).toISOString(),
        url,
        'mainEntityOfPage': url,
        'inLanguage': 'id',
        'publisher': {
          '@type': 'Organization',
          'name': siteName,
          'url': siteUrl,
        },
      },
      {
        '@type': 'BreadcrumbList',
        'itemListElement': breadcrumbItems,
      },
    ],
  }
}
