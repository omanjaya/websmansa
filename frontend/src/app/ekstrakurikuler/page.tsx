import { Metadata } from 'next'
import { getExtras } from '@/lib/api'
import { EkstrakurikulerPage as EkstrakurikulerPageWrapper } from '@/components/ekstrakurikuler'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sman1denpasar.sch.id'

export const metadata: Metadata = {
  title: 'Ekstrakurikuler',
  description: 'Kegiatan ekstrakurikuler dan pengembangan minat bakat siswa SMA Negeri 1 Denpasar. Tersedia lebih dari 25 ekskul mulai dari olahraga, seni, akademik, hingga teknologi.',
  keywords: ['ekstrakurikuler', 'ekskul', 'kegiatan siswa', 'basket', 'paduan suara', 'robotik', 'OSIS', 'tari Bali', 'KIR'],
  openGraph: {
    title: 'Ekstrakurikuler SMA Negeri 1 Denpasar',
    description: 'Lebih dari 25 kegiatan ekstrakurikuler untuk pengembangan minat dan bakat siswa',
    url: `${BASE_URL}/ekstrakurikuler`,
    siteName: 'SMAN 1 Denpasar',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/api/og?title=Ekstrakurikuler&type=extracurricular`,
        width: 1200,
        height: 630,
        alt: 'Ekstrakurikuler SMAN 1 Denpasar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ekstrakurikuler SMA Negeri 1 Denpasar',
    description: 'Lebih dari 25 kegiatan ekstrakurikuler untuk pengembangan minat dan bakat siswa',
    images: [`${BASE_URL}/api/og?title=Ekstrakurikuler&type=extracurricular`],
  },
  alternates: {
    canonical: `${BASE_URL}/ekstrakurikuler`,
  },
}

const categoryLabels: Record<string, string> = {
  olahraga: 'Olahraga',
  seni: 'Seni & Budaya',
  akademik: 'Akademik',
  organisasi: 'Organisasi',
  keagamaan: 'Keagamaan',
  teknologi: 'Teknologi',
}

// Dummy data
const dummyExtras: Array<{
  id: number
  type: string
  attributes: {
    name: string
    slug: string
    description: string
    short_description?: string
    category: string
    schedule?: string
    location?: string
    coach?: string
    achievements?: string[]
    member_count: number
    is_featured: boolean
    is_active: boolean
    image?: string | null
    created_at: string
    updated_at: string
  }
}> = [
  {
    id: 1,
    type: 'extra',
    attributes: {
      name: 'Basket',
      slug: 'basket',
      description: 'Ekstrakurikuler basket untuk mengembangkan kemampuan olahraga bola basket dan membangun kerja sama tim.',
      short_description: 'Tim basket sekolah dengan prestasi tingkat provinsi',
      category: 'olahraga',
      schedule: 'Selasa & Kamis, 15:30 - 17:30',
      location: 'Lapangan Basket Indoor',
      coach: 'Bapak I Wayan Sudiarta',
      achievements: ['Juara 1 DBL Bali 2024', 'Juara 2 Porsenijar 2024'],
      member_count: 25,
      is_featured: true,
      is_active: true,
      image: null,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
  },
  {
    id: 2,
    type: 'extra',
    attributes: {
      name: 'Paduan Suara',
      slug: 'paduan-suara',
      description: 'Ekstrakurikuler paduan suara untuk mengembangkan bakat menyanyi dan harmonisasi vokal.',
      short_description: 'Grup paduan suara dengan berbagai penampilan',
      category: 'seni',
      schedule: 'Rabu, 15:30 - 17:00',
      location: 'Ruang Musik',
      coach: 'Ibu Ni Made Sari',
      achievements: ['Juara 1 Lomba Paduan Suara Tingkat Kota 2024'],
      member_count: 40,
      is_featured: true,
      is_active: true,
      image: null,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
  },
  {
    id: 3,
    type: 'extra',
    attributes: {
      name: 'Karya Ilmiah Remaja (KIR)',
      slug: 'kir',
      description: 'Wadah untuk mengembangkan kemampuan penelitian dan penulisan karya ilmiah siswa.',
      short_description: 'Klub penelitian dan karya ilmiah siswa',
      category: 'akademik',
      schedule: 'Jumat, 14:00 - 16:00',
      location: 'Laboratorium IPA',
      coach: 'Ibu Dr. Ni Luh Putu Ayu',
      achievements: ['Medali Emas OPSI 2024', 'Best Paper LKIR 2024'],
      member_count: 30,
      is_featured: true,
      is_active: true,
      image: null,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
  },
  {
    id: 4,
    type: 'extra',
    attributes: {
      name: 'OSIS',
      slug: 'osis',
      description: 'Organisasi Siswa Intra Sekolah sebagai wadah kepemimpinan dan pengembangan organisasi siswa.',
      short_description: 'Organisasi kepemimpinan siswa',
      category: 'organisasi',
      schedule: 'Senin & Kamis, 14:00 - 16:00',
      location: 'Ruang OSIS',
      coach: 'Bapak I Ketut Darma',
      achievements: [],
      member_count: 35,
      is_featured: false,
      is_active: true,
      image: null,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
  },
  {
    id: 5,
    type: 'extra',
    attributes: {
      name: 'Tari Bali',
      slug: 'tari-bali',
      description: 'Ekstrakurikuler tari tradisional Bali untuk melestarikan budaya lokal.',
      short_description: 'Pelestarian tari tradisional Bali',
      category: 'seni',
      schedule: 'Sabtu, 08:00 - 10:00',
      location: 'Aula Sekolah',
      coach: 'Ibu Ni Wayan Sukerti',
      achievements: ['Penampilan Terbaik Pesta Kesenian Bali 2024'],
      member_count: 45,
      is_featured: true,
      is_active: true,
      image: null,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
  },
  {
    id: 6,
    type: 'extra',
    attributes: {
      name: 'Robotik',
      slug: 'robotik',
      description: 'Ekstrakurikuler robotik untuk mengembangkan kemampuan teknologi dan programming.',
      short_description: 'Klub robotik dan teknologi',
      category: 'teknologi',
      schedule: 'Rabu & Jumat, 15:30 - 17:30',
      location: 'Lab Komputer',
      coach: 'Bapak I Gede Arta',
      achievements: ['Juara 2 Kontes Robot Indonesia Regional Bali 2024'],
      member_count: 20,
      is_featured: false,
      is_active: true,
      image: null,
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
  let extras = dummyExtras

  // Filter by category if specified
  if (params.category) {
    extras = extras.filter((e) => e.attributes.category === params.category)
  }

  // Try to fetch from API
  try {
    const response = await getExtras({
      category: params.category,
      page: params.page ? parseInt(params.page) : undefined,
    })
    if (response.data && response.data.length > 0) {
      extras = response.data
    }
  } catch {
    console.log('Using dummy data for extras')
  }

  const categories = Object.keys(categoryLabels)

  return (
    <EkstrakurikulerPageWrapper
      extras={extras}
      categories={categories}
      currentCategory={params.category}
    />
  )
}
