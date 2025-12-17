import { getPosts, getAnnouncements } from '@/lib/api'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sman1denpasar.sch.id'

// Dummy data for fallback
const dummyPosts = [
  {
    attributes: {
      title: 'Prestasi Siswa di Olimpiade Sains Nasional 2025',
      slug: 'prestasi-osn-2025',
      published_at: '2025-12-10T08:00:00Z',
    },
  },
]

const dummyAnnouncements = [
  {
    attributes: {
      title: 'Jadwal Ujian Akhir Semester Ganjil 2025/2026',
      slug: 'jadwal-uas-ganjil-2025',
      published_at: '2025-12-10T08:00:00Z',
    },
  },
]

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  let posts = dummyPosts
  let announcements = dummyAnnouncements

  // Fetch posts from last 2 days (Google News requirement)
  try {
    const response = await getPosts({ per_page: 50 })
    if (response.data && response.data.length > 0) {
      const twoDaysAgo = new Date()
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

      posts = response.data.filter(
        (post) => new Date(post.attributes.published_at) >= twoDaysAgo
      )
    }
  } catch {
    // Use dummy posts
  }

  try {
    const response = await getAnnouncements({ per_page: 50 })
    if (response.data && response.data.length > 0) {
      const twoDaysAgo = new Date()
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

      announcements = response.data.filter(
        (ann) => new Date(ann.attributes.published_at) >= twoDaysAgo
      )
    }
  } catch {
    // Use dummy announcements
  }

  const newsItems = [
    ...posts.map((post) => ({
      url: `${BASE_URL}/informasi/${post.attributes.slug}`,
      title: post.attributes.title,
      publishedAt: post.attributes.published_at,
    })),
    ...announcements.map((ann) => ({
      url: `${BASE_URL}/pengumuman/${ann.attributes.slug}`,
      title: ann.attributes.title,
      publishedAt: ann.attributes.published_at,
    })),
  ]

  const urlEntries = newsItems
    .map(
      (item) => `
  <url>
    <loc>${item.url}</loc>
    <news:news>
      <news:publication>
        <news:name>SMA Negeri 1 Denpasar</news:name>
        <news:language>id</news:language>
      </news:publication>
      <news:publication_date>${new Date(item.publishedAt).toISOString()}</news:publication_date>
      <news:title>${escapeXml(item.title)}</news:title>
    </news:news>
  </url>`
    )
    .join('')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${urlEntries}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
