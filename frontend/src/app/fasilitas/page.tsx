import { Metadata } from 'next'
import { getFacilities } from '@/lib/api'
import { FasilitasPage as FasilitasPageWrapper } from '@/components/fasilitas'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sman1denpasar.sch.id'

export const metadata: Metadata = {
  title: 'Fasilitas',
  description: 'Fasilitas dan sarana prasarana modern SMA Negeri 1 Denpasar. Perpustakaan digital, laboratorium komputer, lapangan basket indoor, aula serbaguna, dan lainnya.',
  keywords: ['fasilitas sekolah', 'perpustakaan', 'laboratorium', 'lapangan basket', 'aula', 'kolam renang', 'sarana prasarana'],
  openGraph: {
    title: 'Fasilitas SMA Negeri 1 Denpasar',
    description: 'Sarana dan prasarana modern untuk mendukung proses pembelajaran berkualitas',
    url: `${BASE_URL}/fasilitas`,
    siteName: 'SMAN 1 Denpasar',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/api/og?title=Fasilitas&type=facility`,
        width: 1200,
        height: 630,
        alt: 'Fasilitas SMAN 1 Denpasar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fasilitas SMA Negeri 1 Denpasar',
    description: 'Sarana dan prasarana modern untuk mendukung proses pembelajaran berkualitas',
    images: [`${BASE_URL}/api/og?title=Fasilitas&type=facility`],
  },
  alternates: {
    canonical: `${BASE_URL}/fasilitas`,
  },
}

const categoryLabels: Record<string, string> = {
  pembelajaran: 'Pembelajaran',
  olahraga: 'Olahraga',
  laboratorium: 'Laboratorium',
  pendukung: 'Pendukung',
  ibadah: 'Ibadah',
}

// Dummy data
const dummyFacilities: Array<{
  id: number
  type: string
  attributes: {
    name: string
    slug: string
    description: string
    short_description?: string
    category: string
    capacity?: number
    location?: string
    is_featured: boolean
    is_bookable: boolean
    is_active: boolean
    images?: string[]
    amenities?: string[]
    created_at: string
    updated_at: string
  }
}> = [
  {
    id: 1,
    type: 'facility',
    attributes: {
      name: 'Perpustakaan Digital',
      slug: 'perpustakaan-digital',
      description: 'Perpustakaan modern dengan koleksi buku fisik dan digital, dilengkapi ruang baca yang nyaman dan akses e-library.',
      short_description: 'Perpustakaan modern dengan koleksi lengkap',
      category: 'pembelajaran',
      capacity: 100,
      location: 'Gedung A Lantai 2',
      is_featured: true,
      is_bookable: true,
      is_active: true,
      images: [],
      amenities: ['WiFi', 'AC', 'Komputer', 'E-Library'],
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
  },
  {
    id: 2,
    type: 'facility',
    attributes: {
      name: 'Laboratorium Komputer',
      slug: 'lab-komputer',
      description: 'Laboratorium komputer dengan 40 unit PC terbaru dan koneksi internet cepat untuk pembelajaran TIK.',
      short_description: 'Lab komputer dengan perangkat modern',
      category: 'laboratorium',
      capacity: 40,
      location: 'Gedung B Lantai 1',
      is_featured: true,
      is_bookable: true,
      is_active: true,
      images: [],
      amenities: ['AC', 'Proyektor', 'Internet Fiber', '40 PC'],
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
  },
  {
    id: 3,
    type: 'facility',
    attributes: {
      name: 'Lapangan Basket Indoor',
      slug: 'lapangan-basket',
      description: 'Lapangan basket indoor berstandar nasional untuk kegiatan olahraga dan kompetisi.',
      short_description: 'Lapangan basket berstandar nasional',
      category: 'olahraga',
      capacity: 500,
      location: 'Gedung Olahraga',
      is_featured: true,
      is_bookable: true,
      is_active: true,
      images: [],
      amenities: ['Tribun', 'Scoreboard Digital', 'AC'],
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
  },
  {
    id: 4,
    type: 'facility',
    attributes: {
      name: 'Laboratorium IPA',
      slug: 'lab-ipa',
      description: 'Laboratorium IPA lengkap untuk praktikum Fisika, Kimia, dan Biologi dengan peralatan modern.',
      short_description: 'Lab IPA dengan peralatan lengkap',
      category: 'laboratorium',
      capacity: 35,
      location: 'Gedung C Lantai 1',
      is_featured: false,
      is_bookable: true,
      is_active: true,
      images: [],
      amenities: ['AC', 'Peralatan Lab', 'Meja Praktikum'],
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
  },
  {
    id: 5,
    type: 'facility',
    attributes: {
      name: 'Aula Serbaguna',
      slug: 'aula-serbaguna',
      description: 'Aula serbaguna untuk berbagai kegiatan sekolah seperti upacara, seminar, dan pertunjukan.',
      short_description: 'Aula untuk berbagai kegiatan',
      category: 'pendukung',
      capacity: 800,
      location: 'Gedung Utama',
      is_featured: true,
      is_bookable: true,
      is_active: true,
      images: [],
      amenities: ['AC', 'Sound System', 'Proyektor', 'Panggung'],
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
  },
  {
    id: 6,
    type: 'facility',
    attributes: {
      name: 'Musholla',
      slug: 'musholla',
      description: 'Tempat ibadah yang bersih dan nyaman untuk warga sekolah beragama Islam.',
      short_description: 'Tempat ibadah yang nyaman',
      category: 'ibadah',
      capacity: 200,
      location: 'Samping Gedung A',
      is_featured: false,
      is_bookable: false,
      is_active: true,
      images: [],
      amenities: ['Tempat Wudhu', 'AC', 'Mukena', 'Al-Quran'],
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
  },
  {
    id: 7,
    type: 'facility',
    attributes: {
      name: 'Kantin Sehat',
      slug: 'kantin-sehat',
      description: 'Kantin dengan menu makanan sehat dan bergizi yang telah diawasi oleh tim kesehatan sekolah.',
      short_description: 'Kantin dengan menu sehat',
      category: 'pendukung',
      capacity: 150,
      location: 'Belakang Gedung Utama',
      is_featured: false,
      is_bookable: false,
      is_active: true,
      images: [],
      amenities: ['WiFi', 'Meja & Kursi', 'Wastafel'],
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
  },
  {
    id: 8,
    type: 'facility',
    attributes: {
      name: 'Kolam Renang',
      slug: 'kolam-renang',
      description: 'Kolam renang ukuran olimpiade untuk pembelajaran olahraga renang dan latihan tim renang sekolah.',
      short_description: 'Kolam renang ukuran olimpiade',
      category: 'olahraga',
      capacity: 50,
      location: 'Area Olahraga Timur',
      is_featured: true,
      is_bookable: true,
      is_active: true,
      images: [],
      amenities: ['Ruang Ganti', 'Shower', 'Tribun', 'Lifeguard'],
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
  },
]

interface PageProps {
  searchParams: Promise<{ category?: string; page?: string }>
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  let facilities = dummyFacilities

  // Filter by category if specified
  if (params.category) {
    facilities = facilities.filter((f) => f.attributes.category === params.category)
  }

  // Try to fetch from API
  try {
    const response = await getFacilities({
      category: params.category,
      page: params.page ? parseInt(params.page) : undefined,
    })
    if (response.data && response.data.length > 0) {
      facilities = response.data
    }
  } catch {
    // Using dummy data for facilities
  }

  const categories = Object.keys(categoryLabels)

  return (
    <FasilitasPageWrapper
      facilities={facilities}
      categories={categories}
      currentCategory={params.category}
    />
  )
}
