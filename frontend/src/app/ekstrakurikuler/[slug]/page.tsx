import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getExtra, getFeaturedExtras } from '@/lib/api'
import { Badge } from '@/components/ui'

interface PageProps {
  params: Promise<{ slug: string }>
}

const categoryLabels: Record<string, string> = {
  olahraga: 'Olahraga',
  seni: 'Seni & Budaya',
  akademik: 'Akademik',
  organisasi: 'Organisasi',
  keagamaan: 'Keagamaan',
  teknologi: 'Teknologi',
}

const categoryColors: Record<string, string> = {
  olahraga: 'bg-red-100 text-red-800',
  seni: 'bg-purple-100 text-purple-800',
  akademik: 'bg-blue-100 text-blue-800',
  organisasi: 'bg-green-100 text-green-800',
  keagamaan: 'bg-yellow-100 text-yellow-800',
  teknologi: 'bg-cyan-100 text-cyan-800',
}

// Dummy data type
type LocalExtra = {
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
    requirements?: string
    quota?: number
    member_count: number
    is_featured: boolean
    is_active: boolean
    image?: string
    created_at: string
    updated_at: string
  }
}

// Dummy data untuk development
const dummyExtra: LocalExtra = {
  id: 1,
  type: 'extra',
  attributes: {
    name: 'Basket',
    slug: 'basket',
    description: `
      <p>Ekstrakurikuler Basket SMAN 1 Denpasar adalah wadah bagi siswa-siswi yang memiliki minat dan bakat di bidang olahraga bola basket. Kami fokus pada pengembangan keterampilan teknis, taktis, serta pembentukan karakter melalui olahraga.</p>

      <h2>Program Latihan</h2>
      <p>Latihan rutin dilaksanakan dua kali seminggu dengan program yang terstruktur:</p>
      <ul>
        <li><strong>Teknik Dasar:</strong> Dribbling, passing, shooting, dan layup</li>
        <li><strong>Taktik Tim:</strong> Formasi penyerangan dan pertahanan</li>
        <li><strong>Kondisi Fisik:</strong> Stamina, kekuatan, dan kelincahan</li>
        <li><strong>Mental Game:</strong> Fokus, kerja sama tim, dan sportivitas</li>
      </ul>

      <h2>Fasilitas</h2>
      <p>Tim basket sekolah didukung dengan fasilitas yang memadai:</p>
      <ul>
        <li>Lapangan basket indoor berstandar nasional</li>
        <li>Bola basket kualitas pertandingan</li>
        <li>Seragam tim dan perlengkapan latihan</li>
        <li>Akses ke gym sekolah untuk latihan fisik</li>
      </ul>

      <h2>Prestasi</h2>
      <p>Tim basket SMAN 1 Denpasar telah mengukir berbagai prestasi di tingkat daerah dan nasional, menjadikan ekstrakurikuler ini sebagai salah satu yang paling diminati oleh siswa.</p>

      <h2>Persyaratan</h2>
      <p>Untuk bergabung dengan tim basket, siswa diharapkan:</p>
      <ul>
        <li>Memiliki minat dan komitmen terhadap olahraga basket</li>
        <li>Bersedia mengikuti latihan rutin sesuai jadwal</li>
        <li>Menjaga kondisi kesehatan dan kebugaran</li>
        <li>Menjunjung tinggi sportivitas dan kerja sama tim</li>
      </ul>
    `,
    short_description: 'Tim basket sekolah dengan prestasi tingkat provinsi',
    category: 'olahraga',
    schedule: 'Selasa & Kamis, 15:30 - 17:30',
    location: 'Lapangan Basket Indoor',
    coach: 'Bapak I Wayan Sudiarta',
    achievements: [
      'Juara 1 DBL Bali 2024',
      'Juara 2 Porsenijar Provinsi Bali 2024',
      'Juara 3 Honda DBL 2023',
      'Best Player DBL Bali 2024 - I Made Arya Wijaya',
    ],
    requirements: 'Siswa aktif SMAN 1 Denpasar, memiliki minat di bidang basket, dan bersedia mengikuti latihan rutin',
    quota: 30,
    member_count: 25,
    is_featured: true,
    is_active: true,
    image: undefined,
    created_at: '2025-01-01',
    updated_at: '2025-01-01',
  },
}

const dummyRelatedExtras: LocalExtra[] = [
  {
    id: 2,
    type: 'extra',
    attributes: {
      name: 'Voli',
      slug: 'voli',
      description: 'Ekstrakurikuler voli untuk mengembangkan kemampuan olahraga bola voli.',
      short_description: 'Tim voli dengan prestasi tingkat kota',
      category: 'olahraga',
      schedule: 'Senin & Rabu, 15:30 - 17:30',
      location: 'Lapangan Voli',
      coach: 'Ibu Ni Made Dewi',
      achievements: ['Juara 2 POPDA 2024'],
      member_count: 20,
      is_featured: false,
      is_active: true,
      image: undefined,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
  },
  {
    id: 3,
    type: 'extra',
    attributes: {
      name: 'Futsal',
      slug: 'futsal',
      description: 'Ekstrakurikuler futsal untuk mengembangkan kemampuan sepak bola mini.',
      short_description: 'Tim futsal putra dan putri',
      category: 'olahraga',
      schedule: 'Jumat, 15:30 - 17:30',
      location: 'Lapangan Futsal',
      coach: 'Bapak I Ketut Sudana',
      achievements: ['Juara 1 Liga Futsal Pelajar 2024'],
      member_count: 24,
      is_featured: true,
      is_active: true,
      image: undefined,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
  },
  {
    id: 4,
    type: 'extra',
    attributes: {
      name: 'Badminton',
      slug: 'badminton',
      description: 'Ekstrakurikuler badminton untuk mengembangkan kemampuan bulu tangkis.',
      short_description: 'Klub badminton untuk pemula hingga mahir',
      category: 'olahraga',
      schedule: 'Sabtu, 07:00 - 09:00',
      location: 'GOR Sekolah',
      coach: 'Bapak I Nyoman Sudiana',
      achievements: [],
      member_count: 18,
      is_featured: false,
      is_active: true,
      image: undefined,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
  },
]

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const response = await getExtra(slug)
    const extra = response.data

    return {
      title: `${extra.attributes.name} - Ekstrakurikuler`,
      description: extra.attributes.short_description || extra.attributes.description,
    }
  } catch {
    return {
      title: 'Ekstrakurikuler',
      description: 'Kegiatan ekstrakurikuler SMA Negeri 1 Denpasar',
    }
  }
}

export default async function ExtraDetailPage({ params }: PageProps) {
  const { slug } = await params
  let extra: LocalExtra = dummyExtra
  let relatedExtras: LocalExtra[] = dummyRelatedExtras

  try {
    const response = await getExtra(slug)
    if (response.data) {
      extra = response.data as LocalExtra
    }
  } catch {
    if (slug !== dummyExtra.attributes.slug) {
      notFound()
    }
  }

  try {
    const featuredResponse = await getFeaturedExtras(4)
    if (featuredResponse.data) {
      relatedExtras = featuredResponse.data.filter((e) => e.attributes.slug !== slug) as LocalExtra[]
    }
  } catch {
    // Use dummy related extras
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-4">
            <Link href="/" className="hover:text-white">Beranda</Link>
            <span>/</span>
            <Link href="/ekstrakurikuler" className="hover:text-white">Ekstrakurikuler</Link>
            <span>/</span>
            <span className="text-white">{extra.attributes.name}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Ekstrakurikuler</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Image */}
              <div className="relative h-64 md:h-80 bg-gray-200">
                {extra.attributes.image ? (
                  <Image
                    src={extra.attributes.image}
                    alt={extra.attributes.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
                    <svg className="w-24 h-24 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Header */}
              <div className="p-8 border-b">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[extra.attributes.category]}`}>
                    {categoryLabels[extra.attributes.category] || extra.attributes.category}
                  </span>
                  {extra.attributes.is_featured && (
                    <Badge variant="secondary">Unggulan</Badge>
                  )}
                  {extra.attributes.is_active ? (
                    <Badge variant="secondary">Aktif</Badge>
                  ) : (
                    <Badge variant="destructive">Tidak Aktif</Badge>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {extra.attributes.name}
                </h1>
                {extra.attributes.short_description && (
                  <p className="text-lg text-gray-600">
                    {extra.attributes.short_description}
                  </p>
                )}
              </div>

              {/* Quick Info */}
              <div className="p-8 bg-gray-50 border-b">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {extra.attributes.schedule && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">Jadwal</span>
                      </div>
                      <p className="font-medium text-gray-900">{extra.attributes.schedule}</p>
                    </div>
                  )}
                  {extra.attributes.location && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm">Lokasi</span>
                      </div>
                      <p className="font-medium text-gray-900">{extra.attributes.location}</p>
                    </div>
                  )}
                  {extra.attributes.coach && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-sm">Pembina</span>
                      </div>
                      <p className="font-medium text-gray-900">{extra.attributes.coach}</p>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-sm">Anggota</span>
                    </div>
                    <p className="font-medium text-gray-900">
                      {extra.attributes.member_count}
                      {extra.attributes.quota && ` / ${extra.attributes.quota}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div
                  className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600"
                  dangerouslySetInnerHTML={{ __html: extra.attributes.description }}
                />
              </div>

              {/* Achievements */}
              {extra.attributes.achievements && extra.attributes.achievements.length > 0 && (
                <div className="px-8 pb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Prestasi</h2>
                  <div className="space-y-3">
                    {extra.attributes.achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-100"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </div>
                        <span className="text-gray-700 font-medium">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {extra.attributes.requirements && (
                <div className="px-8 pb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Persyaratan</h2>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-gray-700">{extra.attributes.requirements}</p>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="px-8 py-6 bg-gray-50 border-t">
                <div className="flex items-center justify-between">
                  <Link
                    href="/ekstrakurikuler"
                    className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali ke Daftar
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Bagikan:</span>
                    <button className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>
                    <button className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Registration CTA */}
            {extra.attributes.is_active && (
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 mb-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Tertarik Bergabung?</h3>
                <p className="text-white/90 text-sm mb-4">
                  Daftarkan dirimu sekarang dan kembangkan minat serta bakatmu bersama kami!
                </p>
                <Link
                  href="/kontak"
                  className="block w-full py-3 px-4 bg-white text-green-600 rounded-lg font-medium text-center hover:bg-gray-50 transition"
                >
                  Hubungi Kami
                </Link>
              </div>
            )}

            {/* Related Extras */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Ekstrakurikuler Lainnya</h2>
              {relatedExtras.length > 0 ? (
                <div className="space-y-4">
                  {relatedExtras.slice(0, 3).map((related) => (
                    <Link
                      key={related.id}
                      href={`/ekstrakurikuler/${related.attributes.slug}`}
                      className="block group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-green-600">
                            {related.attributes.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {related.attributes.member_count} Anggota
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Tidak ada ekstrakurikuler lainnya.</p>
              )}
              <Link
                href="/ekstrakurikuler"
                className="block mt-4 text-center text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Lihat Semua Ekstrakurikuler
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
