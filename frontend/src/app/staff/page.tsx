import { Metadata } from 'next'
import { getStaff } from '@/lib/api'
import { StaffPage as StaffPageWrapper } from '@/components/staff'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sman1denpasar.sch.id'

export const metadata: Metadata = {
  title: 'Staff & Guru',
  description: 'Tenaga pendidik dan kependidikan SMA Negeri 1 Denpasar. Lebih dari 120 guru dan staff berpengalaman yang berkomitmen pada pendidikan berkualitas.',
  keywords: ['guru', 'staff', 'tenaga pendidik', 'kepala sekolah', 'wakil kepala sekolah', 'pengajar', 'tenaga kependidikan'],
  openGraph: {
    title: 'Staff & Guru SMA Negeri 1 Denpasar',
    description: 'Tenaga pendidik dan kependidikan yang berdedikasi untuk pendidikan berkualitas',
    url: `${BASE_URL}/staff`,
    siteName: 'SMAN 1 Denpasar',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/api/og?title=Staff%20%26%20Guru&type=staff`,
        width: 1200,
        height: 630,
        alt: 'Staff dan Guru SMAN 1 Denpasar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Staff & Guru SMA Negeri 1 Denpasar',
    description: 'Tenaga pendidik dan kependidikan yang berdedikasi untuk pendidikan berkualitas',
    images: [`${BASE_URL}/api/og?title=Staff%20%26%20Guru&type=staff`],
  },
  alternates: {
    canonical: `${BASE_URL}/staff`,
  },
}

const typeLabels: Record<string, string> = {
  principal: 'Kepala Sekolah',
  vice_principal: 'Wakil Kepala Sekolah',
  teacher: 'Guru',
  staff: 'Staff',
}

const departmentLabels: Record<string, string> = {
  matematika: 'Matematika',
  bahasa_indonesia: 'Bahasa Indonesia',
  bahasa_inggris: 'Bahasa Inggris',
  ipa: 'IPA',
  ips: 'IPS',
  seni: 'Seni & Budaya',
  olahraga: 'Olahraga',
  agama: 'Agama',
  tik: 'TIK',
  bk: 'Bimbingan Konseling',
  tata_usaha: 'Tata Usaha',
}

// Dummy data
const dummyStaff: Array<{
  id: number
  type: string
  attributes: {
    name: string
    slug: string
    nip?: string
    position: string
    type: 'principal' | 'vice_principal' | 'teacher' | 'admin' | 'staff' | 'headmaster' | 'vice_headmaster' | 'counselor' | 'librarian' | 'lab_assistant' | 'security' | 'cleaner' | 'cafeteria'
    department?: string
    subjects?: string[]
    education?: string
    email?: string
    phone?: string
    bio?: string
    photo?: string | null
    photo_url?: string | null
    is_featured: boolean
    is_active: boolean
    order: number
    created_at: string
    updated_at: string
  }
}> = [
  {
    id: 1,
    type: 'staff',
    attributes: {
      name: 'Drs. I Made Sukarta, M.Pd.',
      slug: 'i-made-sukarta',
      nip: '196512051990031001',
      position: 'Kepala Sekolah',
      type: 'principal' as const,
      department: undefined,
      subjects: [],
      education: 'S2 Pendidikan - Universitas Pendidikan Ganesha',
      email: 'kepala@sman1denpasar.sch.id',
      phone: undefined,
      bio: 'Memimpin SMAN 1 Denpasar sejak 2020 dengan visi meningkatkan kualitas pendidikan dan karakter siswa.',
      photo: null,
      is_featured: true,
      is_active: true,
      order: 1,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
  },
  {
    id: 2,
    type: 'staff',
    attributes: {
      name: 'Ni Luh Putu Sari, S.Pd., M.Pd.',
      slug: 'ni-luh-putu-sari',
      nip: '197008151995032001',
      position: 'Wakil Kepala Bidang Kurikulum',
      type: 'vice_principal' as const,
      department: undefined,
      subjects: ['Matematika'],
      education: 'S2 Pendidikan Matematika - UGM',
      email: 'wakakur@sman1denpasar.sch.id',
      phone: undefined,
      bio: 'Bertanggung jawab atas perencanaan dan pelaksanaan kurikulum sekolah.',
      photo: null,
      is_featured: true,
      is_active: true,
      order: 2,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
  },
  {
    id: 3,
    type: 'staff',
    attributes: {
      name: 'I Wayan Darta, S.Pd.',
      slug: 'i-wayan-darta',
      nip: '198005201005011001',
      position: 'Wakil Kepala Bidang Kesiswaan',
      type: 'vice_principal' as const,
      department: undefined,
      subjects: ['Olahraga'],
      education: 'S1 Pendidikan Olahraga - Unud',
      email: 'wakasis@sman1denpasar.sch.id',
      phone: undefined,
      bio: 'Membina kegiatan kesiswaan dan ekstrakurikuler.',
      photo: null,
      is_featured: true,
      is_active: true,
      order: 3,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
  },
  {
    id: 4,
    type: 'staff',
    attributes: {
      name: 'Dr. Ni Ketut Ayu Lestari, S.Pd., M.Si.',
      slug: 'ni-ketut-ayu-lestari',
      nip: '197503121998022001',
      position: 'Guru Fisika',
      type: 'teacher' as const,
      department: 'ipa',
      subjects: ['Fisika'],
      education: 'S3 Fisika - ITB',
      email: 'ayu.lestari@sman1denpasar.sch.id',
      phone: undefined,
      bio: 'Guru berpengalaman dengan spesialisasi Fisika dan pembimbing tim olimpiade.',
      photo: null,
      is_featured: true,
      is_active: true,
      order: 10,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
  },
  {
    id: 5,
    type: 'staff',
    attributes: {
      name: 'I Gede Arta, S.Kom., M.T.',
      slug: 'i-gede-arta',
      nip: '198507152010011001',
      position: 'Guru TIK',
      type: 'teacher' as const,
      department: 'tik',
      subjects: ['Informatika', 'TIK'],
      education: 'S2 Teknik Informatika - ITS',
      email: 'gede.arta@sman1denpasar.sch.id',
      phone: undefined,
      bio: 'Pembina ekstrakurikuler robotik dan pemrograman.',
      photo: null,
      is_featured: false,
      is_active: true,
      order: 11,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
  },
  {
    id: 6,
    type: 'staff',
    attributes: {
      name: 'Ni Made Sari, S.Sn., M.Pd.',
      slug: 'ni-made-sari',
      nip: '198203102006042001',
      position: 'Guru Seni Musik',
      type: 'teacher' as const,
      department: 'seni',
      subjects: ['Seni Musik'],
      education: 'S2 Pendidikan Seni - ISI Denpasar',
      email: 'made.sari@sman1denpasar.sch.id',
      phone: undefined,
      bio: 'Pembina paduan suara dan marching band sekolah.',
      photo: null,
      is_featured: false,
      is_active: true,
      order: 12,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
  },
  {
    id: 7,
    type: 'staff',
    attributes: {
      name: 'Putu Agus Wirawan, S.E.',
      slug: 'putu-agus-wirawan',
      nip: '199001152015011001',
      position: 'Kepala Tata Usaha',
      type: 'staff' as const,
      department: 'tata_usaha',
      subjects: [],
      education: 'S1 Ekonomi - Unud',
      email: 'tata.usaha@sman1denpasar.sch.id',
      phone: undefined,
      bio: 'Mengelola administrasi dan keuangan sekolah.',
      photo: null,
      is_featured: false,
      is_active: true,
      order: 20,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
  },
  {
    id: 8,
    type: 'staff',
    attributes: {
      name: 'Dra. Ni Wayan Sukerti, M.Pd.',
      slug: 'ni-wayan-sukerti',
      nip: '196808201992032001',
      position: 'Guru Bahasa Indonesia',
      type: 'teacher' as const,
      department: 'bahasa_indonesia',
      subjects: ['Bahasa Indonesia'],
      education: 'S2 Pendidikan Bahasa - Undiksha',
      email: 'wayan.sukerti@sman1denpasar.sch.id',
      phone: undefined,
      bio: 'Guru senior dengan pengalaman lebih dari 30 tahun.',
      photo: null,
      is_featured: false,
      is_active: true,
      order: 13,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
  },
]

interface PageProps {
  searchParams: Promise<{ type?: string; department?: string; page?: string }>
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  let staff = dummyStaff

  // Filter by type if specified
  if (params.type) {
    staff = staff.filter((s) => s.attributes.type === params.type)
  }

  // Filter by department if specified
  if (params.department) {
    staff = staff.filter((s) => s.attributes.department === params.department)
  }

  // Try to fetch from API with pagination (12 per page for performance)
  let pagination = { currentPage: 1, total: 0, perPage: 12, lastPage: 1 }
  try {
    const response = await getStaff({
      type: params.type,
      department: params.department,
      page: params.page ? parseInt(params.page) : 1,
      per_page: 12, // Limit to 12 for faster loading
    })
    if (response.data && response.data.length > 0) {
      staff = response.data
      if (response.meta) {
        pagination = {
          currentPage: response.meta.current_page || 1,
          total: response.meta.total || 0,
          perPage: 12,
          lastPage: response.meta.last_page || 1,
        }
      }
    }
  } catch {
    // Using dummy data for staff
  }

  // Sort by order and handle null photo
  staff = staff
    .map(item => ({
      ...item,
      attributes: {
        ...item.attributes,
        photo: item.attributes.photo || undefined
      }
    }))
    .sort((a, b) => a.attributes.order - b.attributes.order)

  const types = Object.keys(typeLabels)
  const departments = Object.keys(departmentLabels)

  return (
    <StaffPageWrapper
      staff={staff}
      categories={[...types, ...departments]}
      currentCategory={params.type || params.department}
      pagination={pagination}
    />
  )
}
