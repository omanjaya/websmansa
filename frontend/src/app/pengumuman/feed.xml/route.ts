import { getAnnouncements } from '@/lib/api'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sman1denpasar.sch.id'

// Local type for announcements (compatible with API response)
type LocalAnnouncement = {
  attributes: {
    title: string
    slug: string
    excerpt?: string
    published_at: string
  }
}

// Dummy announcements for fallback
const dummyAnnouncements: LocalAnnouncement[] = [
  {
    attributes: {
      title: 'Jadwal Ujian Akhir Semester Ganjil 2025/2026',
      slug: 'jadwal-uas-ganjil-2025',
      excerpt: 'Kepada seluruh siswa/siswi SMAN 1 Denpasar, berikut adalah jadwal Ujian Akhir Semester.',
      published_at: '2025-12-10T08:00:00Z',
    },
  },
  {
    attributes: {
      title: 'Pembayaran SPP Semester Genap',
      slug: 'pembayaran-spp-genap-2025',
      excerpt: 'Kepada orang tua/wali siswa, pembayaran SPP semester genap dapat dilakukan.',
      published_at: '2025-12-15T08:00:00Z',
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
  let announcements: LocalAnnouncement[] = dummyAnnouncements

  try {
    const response = await getAnnouncements({ per_page: 20 })
    if (response.data && response.data.length > 0) {
      announcements = response.data as LocalAnnouncement[]
    }
  } catch {
    // Use dummy announcements
  }

  const feedItems = announcements
    .map(
      (announcement) => `
    <item>
      <title>${escapeXml(announcement.attributes.title)}</title>
      <link>${BASE_URL}/pengumuman/${announcement.attributes.slug}</link>
      <description>${escapeXml(announcement.attributes.excerpt || '')}</description>
      <pubDate>${new Date(announcement.attributes.published_at).toUTCString()}</pubDate>
      <guid isPermaLink="true">${BASE_URL}/pengumuman/${announcement.attributes.slug}</guid>
    </item>`
    )
    .join('')

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SMA Negeri 1 Denpasar - Pengumuman</title>
    <link>${BASE_URL}/pengumuman</link>
    <description>Pengumuman resmi dari SMA Negeri 1 Denpasar</description>
    <language>id</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/pengumuman/feed.xml" rel="self" type="application/rss+xml"/>
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
