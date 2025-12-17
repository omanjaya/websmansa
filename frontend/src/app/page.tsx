import { Metadata } from 'next'
import { getLatestPosts, getFeaturedAnnouncements, getSliders } from '@/lib/api'
import { HomePage } from '@/components/homepage'
import type { Post, Slider } from '@/lib/api'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sman1denpasar.sch.id'

export const metadata: Metadata = {
  title: {
    absolute: 'SMA Negeri 1 Denpasar - Unggul dalam Prestasi, Berkarakter Pancasila',
  },
  description: 'Website resmi SMA Negeri 1 Denpasar. Sekolah menengah atas unggulan di Bali dengan prestasi akademik dan non-akademik tingkat nasional. Unggul dalam Prestasi, Berkarakter Pancasila.',
  keywords: ['SMAN 1 Denpasar', 'SMA Negeri 1 Denpasar', 'sekolah unggulan Bali', 'pendidikan Denpasar', 'sekolah terbaik Bali'],
  openGraph: {
    title: 'SMA Negeri 1 Denpasar',
    description: 'Unggul dalam Prestasi, Berkarakter Pancasila - Website Resmi SMA Negeri 1 Denpasar',
    url: BASE_URL,
    siteName: 'SMAN 1 Denpasar',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'SMA Negeri 1 Denpasar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SMA Negeri 1 Denpasar',
    description: 'Unggul dalam Prestasi, Berkarakter Pancasila',
    images: [`${BASE_URL}/og-image.jpg`],
  },
  alternates: {
    canonical: BASE_URL,
    types: {
      'application/rss+xml': `${BASE_URL}/feed.xml`,
    },
  },
}


// Dummy data untuk development
const dummyPosts: Post[] = [
  {
    id: 1,
    uuid: '1',
    type: 'post',
    attributes: {
      title: 'Prestasi Siswa di Olimpiade Sains Nasional 2025',
      slug: 'prestasi-osn-2025',
      excerpt: 'Siswa SMAN 1 Denpasar berhasil meraih medali emas dalam Olimpiade Sains Nasional bidang Fisika...',
      featured_image: undefined,
      status: 'published',
      type: 'news',
      views: 150,
      likes: 25,
      is_featured: true,
      is_pinned: false,
      published_at: '2025-12-10T08:00:00Z',
      created_at: '2025-12-10T08:00:00Z',
      updated_at: '2025-12-10T08:00:00Z',
    },
    relationships: {
      author: { id: 1, name: 'Admin' },
      categories: [{ id: 1, name: 'Prestasi', slug: 'prestasi', order: 1 }],
    },
    meta: { excerpt_length: 100, reading_time: 3 },
  },
  {
    id: 2,
    uuid: '2',
    type: 'post',
    attributes: {
      title: 'Workshop Persiapan UTBK-SNBT 2026',
      slug: 'workshop-utbk-2026',
      excerpt: 'Dalam rangka mempersiapkan siswa kelas XII menghadapi UTBK-SNBT 2026, sekolah mengadakan workshop intensif...',
      featured_image: undefined,
      status: 'published',
      type: 'news',
      views: 200,
      likes: 30,
      is_featured: false,
      is_pinned: false,
      published_at: '2025-12-08T08:00:00Z',
      created_at: '2025-12-08T08:00:00Z',
      updated_at: '2025-12-08T08:00:00Z',
    },
    relationships: {
      author: { id: 1, name: 'Admin' },
      categories: [{ id: 2, name: 'Akademik', slug: 'akademik', order: 2 }],
    },
    meta: { excerpt_length: 100, reading_time: 4 },
  },
  {
    id: 3,
    uuid: '3',
    type: 'post',
    attributes: {
      title: 'Pentas Seni Akhir Tahun 2025',
      slug: 'pentas-seni-2025',
      excerpt: 'SMAN 1 Denpasar akan menggelar pentas seni akhir tahun yang menampilkan berbagai bakat siswa...',
      featured_image: undefined,
      status: 'published',
      type: 'news',
      views: 180,
      likes: 45,
      is_featured: false,
      is_pinned: false,
      published_at: '2025-12-05T08:00:00Z',
      created_at: '2025-12-05T08:00:00Z',
      updated_at: '2025-12-05T08:00:00Z',
    },
    relationships: {
      author: { id: 1, name: 'Admin' },
      categories: [{ id: 3, name: 'Kegiatan', slug: 'kegiatan', order: 3 }],
    },
    meta: { excerpt_length: 100, reading_time: 2 },
  },
]

const dummyAnnouncements: Array<{
  id: number
  type: string
  attributes: {
    title: string
    slug: string
    type: string
    published_at: string
  }
}> = [
    {
      id: 1,
      type: 'announcement',
      attributes: {
        title: 'Jadwal Ujian Akhir Semester Ganjil 2025/2026',
        slug: 'jadwal-uas-ganjil-2025',
        type: 'academic',
        published_at: '2025-12-10T08:00:00Z',
      },
    },
    {
      id: 2,
      type: 'announcement',
      attributes: {
        title: 'Pembayaran SPP Semester Genap',
        slug: 'pembayaran-spp-genap-2025',
        type: 'urgent',
        published_at: '2025-12-15T08:00:00Z',
      },
    },
    {
      id: 3,
      type: 'announcement',
      attributes: {
        title: 'Libur Akhir Tahun dan Tahun Baru 2026',
        slug: 'libur-akhir-tahun-2025',
        type: 'general',
        published_at: '2025-12-01T08:00:00Z',
      },
    },
  ]

export default async function Home() {
  let posts = dummyPosts
  let announcements = dummyAnnouncements
  let slides: Slider[] = []

  // Try to fetch from API
  try {
    const postsResponse = await getLatestPosts(3)
    if (postsResponse.data && postsResponse.data.length > 0) {
      posts = postsResponse.data
    }
  } catch {
    console.log('Using dummy data for posts')
  }

  try {
    const announcementsResponse = await getFeaturedAnnouncements(3)
    if (announcementsResponse.data && announcementsResponse.data.length > 0) {
      announcements = announcementsResponse.data
    }
  } catch {
    console.log('Using dummy data for announcements')
  }

  try {
    const slidersResponse = await getSliders()
    if (slidersResponse.data && slidersResponse.data.length > 0) {
      slides = slidersResponse.data
    }
  } catch {
    console.log('Using default slides for hero section')
  }

  return (
    <HomePage posts={posts} announcements={announcements} slides={slides} />
  )
}
