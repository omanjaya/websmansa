import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getFacility, getFeaturedFacilities } from '@/lib/api'
import { Badge } from '@/components/ui'

interface PageProps {
  params: Promise<{ slug: string }>
}

const categoryLabels: Record<string, string> = {
  pembelajaran: 'Pembelajaran',
  olahraga: 'Olahraga',
  laboratorium: 'Laboratorium',
  pendukung: 'Pendukung',
  ibadah: 'Ibadah',
}

// Local type for compatibility
type LocalFacility = {
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
}

// Dummy data
const dummyFacility: LocalFacility = {
  id: 1,
  type: 'facility',
  attributes: {
    name: 'Perpustakaan Digital',
    slug: 'perpustakaan-digital',
    description: `
      <p>Perpustakaan Digital SMA Negeri 1 Denpasar adalah fasilitas modern yang dirancang untuk mendukung kegiatan belajar mengajar dan pengembangan minat baca siswa. Dengan koleksi lebih dari 15.000 buku fisik dan akses ke ribuan e-book, perpustakaan ini menjadi pusat informasi dan pembelajaran yang lengkap.</p>

      <h2>Fasilitas yang Tersedia</h2>
      <ul>
        <li><strong>Ruang Baca:</strong> Area baca yang nyaman dengan kapasitas 100 siswa</li>
        <li><strong>Komputer:</strong> 20 unit komputer dengan akses internet dan e-library</li>
        <li><strong>WiFi:</strong> Koneksi internet cepat untuk mendukung pembelajaran digital</li>
        <li><strong>AC:</strong> Ruangan ber-AC untuk kenyamanan belajar</li>
      </ul>

      <h2>Koleksi</h2>
      <p>Perpustakaan memiliki koleksi yang beragam mencakup:</p>
      <ul>
        <li>Buku pelajaran semua mata pelajaran</li>
        <li>Buku referensi dan ensiklopedia</li>
        <li>Novel dan buku fiksi</li>
        <li>Majalah dan jurnal ilmiah</li>
        <li>E-book dan sumber digital</li>
      </ul>

      <h2>Jam Operasional</h2>
      <p>Perpustakaan buka setiap hari kerja:</p>
      <ul>
        <li>Senin - Kamis: 07.00 - 15.00 WITA</li>
        <li>Jumat: 07.00 - 11.30 WITA</li>
        <li>Sabtu: 08.00 - 12.00 WITA</li>
      </ul>

      <h2>Layanan</h2>
      <p>Perpustakaan menyediakan berbagai layanan untuk mendukung kegiatan akademik:</p>
      <ul>
        <li>Peminjaman buku (maksimal 3 buku selama 7 hari)</li>
        <li>Fotokopi dan scan dokumen</li>
        <li>Bimbingan penelusuran informasi</li>
        <li>Ruang diskusi kelompok</li>
      </ul>
    `,
    short_description: 'Perpustakaan modern dengan koleksi lengkap',
    category: 'pembelajaran',
    capacity: 100,
    location: 'Gedung A Lantai 2',
    is_featured: true,
    is_bookable: true,
    is_active: true,
    images: [],
    amenities: ['WiFi', 'AC', 'Komputer', 'E-Library', 'Ruang Diskusi', 'Mesin Fotokopi'],
    created_at: '2025-01-01',
    updated_at: '2025-01-01',
  },
}

const dummyRelatedFacilities: LocalFacility[] = [
  {
    id: 2,
    type: 'facility',
    attributes: {
      name: 'Laboratorium Komputer',
      slug: 'lab-komputer',
      description: 'Laboratorium komputer dengan 40 unit PC terbaru.',
      short_description: 'Lab komputer dengan perangkat modern',
      category: 'laboratorium',
      capacity: 40,
      location: 'Gedung B Lantai 1',
      is_featured: true,
      is_bookable: true,
      is_active: true,
      images: [],
      amenities: ['AC', 'Proyektor', 'Internet Fiber'],
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
  },
  {
    id: 3,
    type: 'facility',
    attributes: {
      name: 'Laboratorium IPA',
      slug: 'lab-ipa',
      description: 'Laboratorium IPA lengkap untuk praktikum.',
      short_description: 'Lab IPA dengan peralatan lengkap',
      category: 'laboratorium',
      capacity: 35,
      location: 'Gedung C Lantai 1',
      is_featured: false,
      is_bookable: true,
      is_active: true,
      images: [],
      amenities: ['AC', 'Peralatan Lab'],
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
  },
]

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const response = await getFacility(slug)
    const facility = response.data

    return {
      title: `${facility.attributes.name} - Fasilitas`,
      description: facility.attributes.short_description || facility.attributes.description,
    }
  } catch {
    return {
      title: 'Fasilitas',
      description: 'Fasilitas dan sarana prasarana SMA Negeri 1 Denpasar',
    }
  }
}

export default async function FacilityDetailPage({ params }: PageProps) {
  const { slug } = await params
  let facility: LocalFacility = dummyFacility
  let relatedFacilities: LocalFacility[] = dummyRelatedFacilities

  try {
    const response = await getFacility(slug)
    if (response.data) {
      facility = response.data as LocalFacility
    }
  } catch {
    if (slug !== dummyFacility.attributes.slug) {
      notFound()
    }
  }

  try {
    const featuredResponse = await getFeaturedFacilities(4)
    if (featuredResponse.data) {
      relatedFacilities = featuredResponse.data.filter((f) => f.attributes.slug !== slug) as LocalFacility[]
    }
  } catch {
    // Use dummy related facilities
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-4">
            <Link href="/" className="hover:text-white">Beranda</Link>
            <span>/</span>
            <Link href="/fasilitas" className="hover:text-white">Fasilitas</Link>
            <span>/</span>
            <span className="text-white">{facility.attributes.name}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Fasilitas</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Image Gallery */}
              <div className="relative h-64 md:h-96 bg-gray-200">
                {facility.attributes.images && facility.attributes.images.length > 0 ? (
                  <Image
                    src={facility.attributes.images[0]}
                    alt={facility.attributes.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200">
                    <svg className="w-24 h-24 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Header */}
              <div className="p-8 border-b">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {categoryLabels[facility.attributes.category] || facility.attributes.category}
                  </span>
                  {facility.attributes.is_featured && (
                    <Badge variant="secondary">Unggulan</Badge>
                  )}
                  {facility.attributes.is_bookable && (
                    <Badge variant="secondary">Dapat Dipesan</Badge>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {facility.attributes.name}
                </h1>
                {facility.attributes.short_description && (
                  <p className="text-lg text-gray-600">
                    {facility.attributes.short_description}
                  </p>
                )}
              </div>

              {/* Quick Info */}
              <div className="p-8 bg-gray-50 border-b">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {facility.attributes.capacity && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm">Kapasitas</span>
                      </div>
                      <p className="font-medium text-gray-900">{facility.attributes.capacity} orang</p>
                    </div>
                  )}
                  {facility.attributes.location && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm">Lokasi</span>
                      </div>
                      <p className="font-medium text-gray-900">{facility.attributes.location}</p>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">Status</span>
                    </div>
                    <p className="font-medium text-gray-900">
                      {facility.attributes.is_active ? 'Aktif' : 'Tidak Aktif'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              {facility.attributes.amenities && facility.attributes.amenities.length > 0 && (
                <div className="p-8 border-b">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Fasilitas yang Tersedia</h2>
                  <div className="flex flex-wrap gap-2">
                    {facility.attributes.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-8">
                <div
                  className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600"
                  dangerouslySetInnerHTML={{ __html: facility.attributes.description }}
                />
              </div>

              {/* Footer */}
              <div className="px-8 py-6 bg-gray-50 border-t">
                <div className="flex items-center justify-between">
                  <Link
                    href="/fasilitas"
                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
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
            {/* Booking CTA */}
            {facility.attributes.is_bookable && (
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 mb-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Ingin Menggunakan Fasilitas Ini?</h3>
                <p className="text-white/90 text-sm mb-4">
                  Hubungi kami untuk informasi pemesanan dan ketersediaan.
                </p>
                <Link
                  href="/kontak"
                  className="block w-full py-3 px-4 bg-white text-purple-600 rounded-lg font-medium text-center hover:bg-gray-50 transition"
                >
                  Hubungi Kami
                </Link>
              </div>
            )}

            {/* Related Facilities */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Fasilitas Lainnya</h2>
              {relatedFacilities.length > 0 ? (
                <div className="space-y-4">
                  {relatedFacilities.slice(0, 3).map((related) => (
                    <Link
                      key={related.id}
                      href={`/fasilitas/${related.attributes.slug}`}
                      className="block group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-purple-600">
                            {related.attributes.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {related.attributes.location}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Tidak ada fasilitas lainnya.</p>
              )}
              <Link
                href="/fasilitas"
                className="block mt-4 text-center text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Lihat Semua Fasilitas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
