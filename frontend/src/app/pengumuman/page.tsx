import { Metadata } from 'next'
import { getAnnouncements } from '@/lib/api'
import { PengumumanPage } from '@/components/pengumuman'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sman1denpasar.sch.id'

export const metadata: Metadata = {
  title: 'Pengumuman',
  description: 'Pengumuman resmi dari SMA Negeri 1 Denpasar. Jadwal ujian, pembayaran SPP, kegiatan sekolah, dan informasi penting lainnya untuk siswa dan orang tua.',
  keywords: ['pengumuman', 'jadwal ujian', 'pengumuman sekolah', 'informasi siswa', 'jadwal kegiatan', 'SPP'],
  openGraph: {
    title: 'Pengumuman SMA Negeri 1 Denpasar',
    description: 'Pengumuman resmi dari SMA Negeri 1 Denpasar untuk siswa dan orang tua',
    url: `${BASE_URL}/pengumuman`,
    siteName: 'SMAN 1 Denpasar',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/api/og?title=Pengumuman&type=announcement`,
        width: 1200,
        height: 630,
        alt: 'Pengumuman SMAN 1 Denpasar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pengumuman SMA Negeri 1 Denpasar',
    description: 'Pengumuman resmi dari SMA Negeri 1 Denpasar untuk siswa dan orang tua',
    images: [`${BASE_URL}/api/og?title=Pengumuman&type=announcement`],
  },
  alternates: {
    canonical: `${BASE_URL}/pengumuman`,
    types: {
      'application/rss+xml': `${BASE_URL}/pengumuman/feed.xml`,
    },
  },
}

const typeColors: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
  general: 'primary',
  academic: 'success',
  event: 'info',
  urgent: 'danger',
}

const typeLabels: Record<string, string> = {
  general: 'Umum',
  academic: 'Akademik',
  event: 'Kegiatan',
  urgent: 'Penting',
}

// Dummy data untuk development
type LocalAnnouncement = {
  id: number
  type: string
  attributes: {
    title: string
    slug: string
    content: string
    excerpt?: string
    type: string
    priority: number
    is_featured: boolean
    is_pinned: boolean
    published_at: string
    created_at: string
    updated_at: string
  }
}

const dummyAnnouncements: LocalAnnouncement[] = [
  {
    id: 1,
    type: 'announcement',
    attributes: {
      title: 'Jadwal Ujian Akhir Semester Ganjil 2025/2026',
      slug: 'jadwal-uas-ganjil-2025',
      content: 'Kepada seluruh siswa/siswi SMAN 1 Denpasar, berikut adalah jadwal Ujian Akhir Semester Ganjil tahun ajaran 2025/2026...',
      excerpt: 'Kepada seluruh siswa/siswi SMAN 1 Denpasar, berikut adalah jadwal Ujian Akhir Semester Ganjil tahun ajaran 2025/2026...',
      type: 'academic',
      priority: 1,
      is_featured: true,
      is_pinned: true,
      published_at: '2025-12-10T08:00:00Z',
      created_at: '2025-12-10T08:00:00Z',
      updated_at: '2025-12-10T08:00:00Z',
    },
  },
  {
    id: 2,
    type: 'announcement',
    attributes: {
      title: 'Perayaan Hari Guru Nasional 2025',
      slug: 'perayaan-hari-guru-2025',
      content: 'Dalam rangka memperingati Hari Guru Nasional, SMAN 1 Denpasar akan mengadakan serangkaian kegiatan...',
      excerpt: 'Dalam rangka memperingati Hari Guru Nasional, SMAN 1 Denpasar akan mengadakan serangkaian kegiatan...',
      type: 'event',
      priority: 2,
      is_featured: false,
      is_pinned: false,
      published_at: '2025-11-25T08:00:00Z',
      created_at: '2025-11-25T08:00:00Z',
      updated_at: '2025-11-25T08:00:00Z',
    },
  },
  {
    id: 3,
    type: 'announcement',
    attributes: {
      title: 'Libur Akhir Tahun dan Tahun Baru 2026',
      slug: 'libur-akhir-tahun-2025',
      content: 'Diberitahukan kepada seluruh warga sekolah bahwa libur akhir tahun dimulai dari tanggal 23 Desember 2025...',
      excerpt: 'Diberitahukan kepada seluruh warga sekolah bahwa libur akhir tahun dimulai dari tanggal 23 Desember 2025...',
      type: 'general',
      priority: 3,
      is_featured: false,
      is_pinned: false,
      published_at: '2025-12-01T08:00:00Z',
      created_at: '2025-12-01T08:00:00Z',
      updated_at: '2025-12-01T08:00:00Z',
    },
  },
  {
    id: 4,
    type: 'announcement',
    attributes: {
      title: 'Pembayaran SPP Semester Genap',
      slug: 'pembayaran-spp-genap-2025',
      content: 'Kepada orang tua/wali siswa, pembayaran SPP semester genap dapat dilakukan mulai tanggal 2 Januari 2026...',
      excerpt: 'Kepada orang tua/wali siswa, pembayaran SPP semester genap dapat dilakukan mulai tanggal 2 Januari 2026...',
      type: 'urgent',
      priority: 1,
      is_featured: true,
      is_pinned: true,
      published_at: '2025-12-15T08:00:00Z',
      created_at: '2025-12-15T08:00:00Z',
      updated_at: '2025-12-15T08:00:00Z',
    },
  },
]

interface PageProps {
  searchParams: Promise<{ type?: string; page?: string }>
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  let announcements = dummyAnnouncements

  // Try to fetch from API, fallback to dummy data
  try {
    const response = await getAnnouncements({
      type: params.type,
      page: params.page ? parseInt(params.page) : undefined,
    })
    if (response.data && response.data.length > 0) {
      announcements = response.data
    }
  } catch {
    // Use dummy data on error
    console.log('Using dummy data for announcements')
  }

  const types = ['general', 'academic', 'event', 'urgent']

  return (
    <PengumumanPage
      announcements={announcements}
      types={types}
      typeColors={typeColors}
      typeLabels={typeLabels}
      currentType={params.type}
    />
  )
}
