import { Metadata } from 'next'
import { getCategories, getPosts } from '@/lib/api'
import { InformasiPage } from '@/components/informasi'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sman1denpasar.sch.id'

export const metadata: Metadata = {
  title: 'Informasi',
  description: 'Berita dan informasi terbaru dari SMA Negeri 1 Denpasar. Prestasi siswa, kegiatan akademik, event sekolah, dan berbagai informasi penting lainnya.',
  keywords: ['berita sekolah', 'informasi', 'prestasi siswa', 'kegiatan akademik', 'event sekolah', 'news SMAN 1 Denpasar'],
  openGraph: {
    title: 'Berita & Informasi SMA Negeri 1 Denpasar',
    description: 'Berita dan informasi terbaru dari SMA Negeri 1 Denpasar',
    url: `${BASE_URL}/informasi`,
    siteName: 'SMAN 1 Denpasar',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/api/og?title=Berita%20%26%20Informasi&type=news`,
        width: 1200,
        height: 630,
        alt: 'Berita dan Informasi SMAN 1 Denpasar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Berita & Informasi SMA Negeri 1 Denpasar',
    description: 'Berita dan informasi terbaru dari SMA Negeri 1 Denpasar',
    images: [`${BASE_URL}/api/og?title=Berita%20%26%20Informasi&type=news`],
  },
  alternates: {
    canonical: `${BASE_URL}/informasi`,
    types: {
      'application/rss+xml': `${BASE_URL}/feed.xml`,
    },
  },
}

import type { Post, Category } from '@/lib/api'

// Dummy data untuk development
const dummyCategories: Category[] = [
  { id: 1, name: 'Prestasi', slug: 'prestasi', order: 1 },
  { id: 2, name: 'Akademik', slug: 'akademik', order: 2 },
  { id: 3, name: 'Kegiatan', slug: 'kegiatan', order: 3 },
  { id: 4, name: 'Berita', slug: 'berita', order: 4 },
]

const dummyPosts: Post[] = [
  {
    id: 1,
    uuid: '1',
    type: 'post',
    attributes: {
      title: 'Prestasi Siswa di Olimpiade Sains Nasional 2025',
      slug: 'prestasi-osn-2025',
      excerpt: 'Siswa SMAN 1 Denpasar berhasil meraih medali emas dalam Olimpiade Sains Nasional bidang Fisika. Prestasi gemilang ini menambah deretan pencapaian sekolah di tingkat nasional.',
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
      excerpt: 'Dalam rangka mempersiapkan siswa kelas XII menghadapi UTBK-SNBT 2026, sekolah mengadakan workshop intensif dengan pembicara dari berbagai perguruan tinggi ternama.',
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
      excerpt: 'SMAN 1 Denpasar akan menggelar pentas seni akhir tahun yang menampilkan berbagai bakat siswa dalam bidang seni musik, tari, dan drama.',
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
  {
    id: 4,
    uuid: '4',
    type: 'post',
    attributes: {
      title: 'Kunjungan Industri ke Perusahaan Teknologi',
      slug: 'kunjungan-industri-2025',
      excerpt: 'Siswa kelas XI melaksanakan kunjungan industri ke beberapa perusahaan teknologi terkemuka untuk memperluas wawasan tentang dunia kerja.',
      featured_image: undefined,
      status: 'published',
      type: 'news',
      views: 120,
      likes: 18,
      is_featured: false,
      is_pinned: false,
      published_at: '2025-12-01T08:00:00Z',
      created_at: '2025-12-01T08:00:00Z',
      updated_at: '2025-12-01T08:00:00Z',
    },
    relationships: {
      author: { id: 1, name: 'Admin' },
      categories: [{ id: 3, name: 'Kegiatan', slug: 'kegiatan', order: 3 }],
    },
    meta: { excerpt_length: 100, reading_time: 3 },
  },
  {
    id: 5,
    uuid: '5',
    type: 'post',
    attributes: {
      title: 'Seminar Pendidikan Karakter',
      slug: 'seminar-pendidikan-karakter',
      excerpt: 'Sekolah mengadakan seminar pendidikan karakter untuk siswa dengan mengundang pembicara dari Kementerian Pendidikan dan Kebudayaan.',
      featured_image: undefined,
      status: 'published',
      type: 'news',
      views: 95,
      likes: 12,
      is_featured: false,
      is_pinned: false,
      published_at: '2025-11-28T08:00:00Z',
      created_at: '2025-11-28T08:00:00Z',
      updated_at: '2025-11-28T08:00:00Z',
    },
    relationships: {
      author: { id: 1, name: 'Admin' },
      categories: [{ id: 2, name: 'Akademik', slug: 'akademik', order: 2 }],
    },
    meta: { excerpt_length: 100, reading_time: 4 },
  },
  {
    id: 6,
    uuid: '6',
    type: 'post',
    attributes: {
      title: 'Tim Basket Juara Regional 2025',
      slug: 'juara-basket-regional-2025',
      excerpt: 'Tim basket putra SMAN 1 Denpasar berhasil meraih juara 1 dalam kompetisi basket tingkat regional Bali.',
      featured_image: undefined,
      status: 'published',
      type: 'news',
      views: 250,
      likes: 60,
      is_featured: true,
      is_pinned: false,
      published_at: '2025-11-25T08:00:00Z',
      created_at: '2025-11-25T08:00:00Z',
      updated_at: '2025-11-25T08:00:00Z',
    },
    relationships: {
      author: { id: 1, name: 'Admin' },
      categories: [{ id: 1, name: 'Prestasi', slug: 'prestasi', order: 1 }],
    },
    meta: { excerpt_length: 100, reading_time: 2 },
  },
]

interface PageProps {
  searchParams: Promise<{ category?: string; page?: string; search?: string }>
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  let categories = dummyCategories
  let posts = dummyPosts

  // Filter by category if specified
  if (params.category) {
    posts = posts.filter((p) =>
      p.relationships.categories?.some((c) => c.slug === params.category)
    )
  }

  // Try to fetch from API
  try {
    const categoriesResponse = await getCategories()
    if (categoriesResponse.data && categoriesResponse.data.length > 0) {
      categories = categoriesResponse.data
    }
  } catch {
    console.log('Using dummy data for categories')
  }

  try {
    const postsResponse = await getPosts({
      category: params.category,
      page: params.page ? parseInt(params.page) : undefined,
      search: params.search,
    })
    if (postsResponse.data && postsResponse.data.length > 0) {
      posts = postsResponse.data
    }
  } catch {
    console.log('Using dummy data for posts')
  }

  return (
    <InformasiPage
      posts={posts}
      categories={categories}
      currentCategory={params.category}
    />
  )
}
