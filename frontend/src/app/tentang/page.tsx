import { Metadata } from 'next'
import { getServerSettings } from '@/lib/settings-server'
import { getStaff } from '@/lib/api'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sman1denpasar.sch.id'

export const metadata: Metadata = {
    title: 'Tentang Kami',
    description: 'Profil dan sejarah SMA Negeri 1 Denpasar - Sekolah unggulan di Bali. Didirikan tahun 1950, SMAN 1 Denpasar telah menghasilkan ribuan alumni berprestasi.',
    keywords: ['profil sekolah', 'sejarah SMAN 1 Denpasar', 'visi misi', 'pimpinan sekolah', 'sekolah unggulan Bali'],
    openGraph: {
        title: 'Tentang SMA Negeri 1 Denpasar',
        description: 'Profil dan sejarah SMA Negeri 1 Denpasar - Sekolah unggulan di Bali sejak 1950',
        url: `${BASE_URL}/tentang`,
        siteName: 'SMAN 1 Denpasar',
        locale: 'id_ID',
        type: 'website',
        images: [
            {
                url: `${BASE_URL}/api/og?title=Tentang%20Kami&type=news`,
                width: 1200,
                height: 630,
                alt: 'Tentang SMA Negeri 1 Denpasar',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Tentang SMA Negeri 1 Denpasar',
        description: 'Profil dan sejarah SMA Negeri 1 Denpasar - Sekolah unggulan di Bali',
        images: [`${BASE_URL}/api/og?title=Tentang%20Kami&type=news`],
    },
    alternates: {
        canonical: `${BASE_URL}/tentang`,
    },
}

// Default fallback data
const defaultVisiMisi = {
    visi: 'Menjadi sekolah unggul yang menghasilkan lulusan berprestasi, berkarakter Pancasila, berwawasan global, dan berbudaya lingkungan.',
    misi: [
        'Menyelenggarakan pendidikan yang berkualitas dan berstandar nasional/internasional',
        'Mengembangkan potensi akademik dan non-akademik peserta didik secara optimal',
        'Membentuk karakter peserta didik yang berbudi pekerti luhur berdasarkan nilai-nilai Pancasila',
        'Membangun lingkungan sekolah yang kondusif, aman, dan nyaman untuk pembelajaran',
        'Mengembangkan kemitraan dengan berbagai pihak untuk peningkatan mutu pendidikan',
        'Melestarikan budaya lokal dan mengintegrasikannya dalam pembelajaran',
    ],
}

const defaultSejarah = [
    {
        year: '1950',
        title: 'Pendirian Sekolah',
        description: 'SMA Negeri 1 Denpasar didirikan sebagai salah satu sekolah menengah atas pertama di Bali.',
    },
    {
        year: '1960',
        title: 'Perkembangan Awal',
        description: 'Mulai berkembang dengan penambahan fasilitas dan peningkatan jumlah siswa.',
    },
    {
        year: '1980',
        title: 'Status Unggulan',
        description: 'Ditetapkan sebagai salah satu sekolah unggulan di Provinsi Bali.',
    },
    {
        year: '2000',
        title: 'Modernisasi',
        description: 'Renovasi besar-besaran dan penambahan fasilitas modern untuk mendukung pembelajaran.',
    },
    {
        year: '2020',
        title: 'Era Digital',
        description: 'Transformasi digital dengan pembelajaran hybrid dan fasilitas teknologi terkini.',
    },
]

const defaultLeadership: { name: string; position: string; image: string | null }[] = [
    {
        name: 'Drs. I Made Sukarta, M.Pd.',
        position: 'Kepala Sekolah',
        image: null,
    },
    {
        name: 'Ni Luh Putu Sari, S.Pd., M.Pd.',
        position: 'Wakil Kepala Bidang Kurikulum',
        image: null,
    },
    {
        name: 'I Wayan Darta, S.Pd.',
        position: 'Wakil Kepala Bidang Kesiswaan',
        image: null,
    },
    {
        name: 'Ni Ketut Ayu Lestari, S.Pd.',
        position: 'Wakil Kepala Bidang Sarana Prasarana',
        image: null,
    },
]

import { TentangPage } from '@/components/tentang'

export default async function Page() {
    // Fetch settings from API
    const settings = await getServerSettings()

    // Build stats from settings
    const stats = [
        { label: 'Tahun Berdiri', value: settings.founded_year || settings.established_year?.toString() || '1950' },
        { label: 'Siswa Aktif', value: settings.total_students ? `${Number(settings.total_students).toLocaleString('id-ID')}+` : '1,200+' },
        { label: 'Guru & Staff', value: settings.total_teachers ? `${Number(settings.total_teachers).toLocaleString('id-ID')}+` : '120+' },
        { label: 'Alumni', value: settings.total_alumni ? `${Number(settings.total_alumni).toLocaleString('id-ID')}+` : '50,000+' },
    ]

    // Build visi misi from settings
    const visiMisi = {
        visi: settings.visi || defaultVisiMisi.visi,
        misi: Array.isArray(settings.misi) && settings.misi.length > 0 ? settings.misi : defaultVisiMisi.misi,
    }

    // Build sejarah from settings
    const sejarah = Array.isArray(settings.sejarah) && settings.sejarah.length > 0 ? settings.sejarah : defaultSejarah

    // Fetch leadership from Staff API
    let leadership: { name: string; position: string; image: string | null }[] = defaultLeadership
    try {
        // Get principals (using headmaster/vice_headmaster types from backend)
        const principalResponse = await getStaff({ type: 'headmaster', per_page: 1 })
        const vicePrincipalResponse = await getStaff({ type: 'vice_headmaster', per_page: 10 })

        const principals = principalResponse.data || []
        const vicePrincipals = vicePrincipalResponse.data || []

        if (principals.length > 0 || vicePrincipals.length > 0) {
            leadership = [
                ...principals.map(staff => ({
                    name: staff.attributes.name,
                    position: staff.attributes.position || 'Kepala Sekolah',
                    image: staff.attributes.photo_url || null,
                })),
                ...vicePrincipals.map(staff => ({
                    name: staff.attributes.name,
                    position: staff.attributes.position || 'Wakil Kepala Sekolah',
                    image: staff.attributes.photo_url || null,
                })),
            ]
        }
    } catch (error) {
        // Using default leadership data
    }

    return (
        <TentangPage
            stats={stats}
            visiMisi={visiMisi}
            sejarah={sejarah}
            leadership={leadership}
        />
    )
}
