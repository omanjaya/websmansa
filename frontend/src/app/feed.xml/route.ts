import { getPosts } from '@/lib/api'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sman1denpasar.sch.id'

// Dummy posts for fallback
const dummyPosts = [
  {
    attributes: {
      title: 'Prestasi Siswa di Olimpiade Sains Nasional 2025',
      slug: 'prestasi-osn-2025',
      excerpt: 'Siswa SMAN 1 Denpasar berhasil meraih medali emas dalam Olimpiade Sains Nasional bidang Fisika.',
      published_at: '2025-12-10T08:00:00Z',
    },
  },
  {
    attributes: {
      title: 'Kegiatan Pentas Seni Akhir Tahun',
      slug: 'pentas-seni-2025',
      excerpt: 'SMAN 1 Denpasar menggelar pentas seni akhir tahun dengan menampilkan berbagai bakat siswa.',
      published_at: '2025-12-05T08:00:00Z',
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

  try {
    const response = await getPosts({ per_page: 20 })
    if (response.data && response.data.length > 0) {
      posts = response.data
    }
  } catch {
    // Use dummy posts
  }

  const feedItems = posts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.attributes.title)}</title>
      <link>${BASE_URL}/informasi/${post.attributes.slug}</link>
      <description>${escapeXml(post.attributes.excerpt || '')}</description>
      <pubDate>${new Date(post.attributes.published_at).toUTCString()}</pubDate>
      <guid isPermaLink="true">${BASE_URL}/informasi/${post.attributes.slug}</guid>
    </item>`
    )
    .join('')

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>SMA Negeri 1 Denpasar - Berita &amp; Informasi</title>
    <link>${BASE_URL}</link>
    <description>Berita dan informasi terbaru dari SMA Negeri 1 Denpasar</description>
    <language>id</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${BASE_URL}/logo.png</url>
      <title>SMA Negeri 1 Denpasar</title>
      <link>${BASE_URL}</link>
    </image>
    ${feedItems}
  </channel>
</rss>`

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
