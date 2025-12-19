import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sman1denpasar.sch.id'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  // Static pages
  const staticPages = [
    '',
    '/informasi',
    '/galeri',
    '/fasilitas',
    '/ekstrakurikuler',
    '/pengumuman',
    '/prestasi',
    '/alumni',
    '/staff',
    '/tentang',
    '/kontak',
  ]

  const staticRoutes: MetadataRoute.Sitemap = staticPages.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }))

  // Note: For dynamic pages (like /informasi/[slug]), you would typically
  // fetch data from API to generate all URLs. For now, returning static pages.
  // Example with API:
  // const posts = await getPosts()
  // const postRoutes = posts.data.map((post) => ({
  //   url: `${SITE_URL}/informasi/${post.attributes.slug}`,
  //   lastModified: new Date(post.attributes.updated_at),
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.6,
  // }))

  return [
    ...staticRoutes,
    // ...postRoutes, // Add when API is available
  ]
}
