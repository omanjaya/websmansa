import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getFacility, getFeaturedFacilities } from '@/lib/api'
import { Badge } from '@/components/ui'
import { Section, Waves, DotPattern, GlowSpot } from '@/components/shared'
import {
  ChevronRight, ArrowLeft, Users, MapPin, CheckCircle,
  Building2, Sparkles, Share2, Calendar, Bookmark
} from 'lucide-react'

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

const categoryColors: Record<string, { gradient: string, badge: string }> = {
  pembelajaran: { gradient: 'from-blue-600 to-indigo-700', badge: 'bg-blue-500' },
  olahraga: { gradient: 'from-red-600 to-orange-600', badge: 'bg-red-500' },
  laboratorium: { gradient: 'from-purple-600 to-violet-700', badge: 'bg-purple-500' },
  pendukung: { gradient: 'from-teal-600 to-cyan-600', badge: 'bg-teal-500' },
  ibadah: { gradient: 'from-green-600 to-emerald-600', badge: 'bg-green-500' },
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
      title: `${facility.attributes.name} | Fasilitas SMAN 1 Denpasar`,
      description: facility.attributes.short_description || facility.attributes.description,
    }
  } catch {
    return {
      title: 'Fasilitas | SMAN 1 Denpasar',
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

  const colors = categoryColors[facility.attributes.category] || categoryColors.pendukung

  return (
    <div className="-mt-16 lg:-mt-20 min-h-screen bg-white dark:bg-slate-950">
      {/* Fixed Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <DotPattern variant="scattered" className="opacity-30 dark:opacity-20" />
        <GlowSpot color="bg-purple-500" size="xl" position={{ top: '10%', right: '10%' }} />
        <GlowSpot color="bg-indigo-500" size="lg" position={{ bottom: '20%', left: '5%' }} />
      </div>

      {/* Hero Section */}
      <div className="relative min-h-[50vh] md:min-h-[55vh] overflow-hidden">
        {/* Background Image */}
        {facility.attributes.images && facility.attributes.images.length > 0 ? (
          <Image
            src={facility.attributes.images[0]}
            alt={facility.attributes.name}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient}`} />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        {/* Content */}
        <div className="relative z-10 h-full flex items-end">
          <div className="container mx-auto px-4 pb-20 pt-32 lg:pt-40">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/fasilitas" className="hover:text-white transition-colors">Fasilitas</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white truncate max-w-[200px]">{facility.attributes.name}</span>
            </nav>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge
                variant="default"
                className="bg-white/10 backdrop-blur-sm text-white border-white/20"
              >
                <Building2 className="w-3.5 h-3.5 mr-1" />
                {categoryLabels[facility.attributes.category] || facility.attributes.category}
              </Badge>
              {facility.attributes.is_featured && (
                <Badge
                  variant="default"
                  className="bg-yellow-500/20 backdrop-blur-sm text-yellow-300 border-yellow-500/30"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  Unggulan
                </Badge>
              )}
              {facility.attributes.is_bookable && (
                <Badge
                  variant="default"
                  className="bg-green-500/20 backdrop-blur-sm text-green-300 border-green-500/30"
                >
                  <Bookmark className="w-3.5 h-3.5 mr-1" />
                  Dapat Dipesan
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-4xl leading-tight">
              {facility.attributes.name}
            </h1>

            {/* Short Description */}
            {facility.attributes.short_description && (
              <p className="text-lg text-white/80 max-w-2xl mb-6">
                {facility.attributes.short_description}
              </p>
            )}

            {/* Quick Info */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/80">
              {facility.attributes.capacity && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Kapasitas {facility.attributes.capacity} orang</span>
                </div>
              )}
              {facility.attributes.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{facility.attributes.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{facility.attributes.is_active ? 'Aktif' : 'Tidak Aktif'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <Waves
          color="fill-white dark:fill-slate-950"
          position="bottom"
          className="absolute bottom-0 z-20"
        />
      </div>

      {/* Content Section */}
      <Section background="white" padding="large" className="relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <article className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden -mt-16 relative z-30">
                {/* Amenities */}
                {facility.attributes.amenities && facility.attributes.amenities.length > 0 && (
                  <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-slate-800/50 dark:to-slate-800/30">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Fasilitas yang Tersedia</h2>
                    <div className="flex flex-wrap gap-2">
                      {facility.attributes.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium shadow-sm border border-purple-100 dark:border-slate-600"
                        >
                          <CheckCircle className="w-4 h-4 text-purple-500" />
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Main Content */}
                <div className="p-6 md:p-8 lg:p-10">
                  <div
                    className="prose prose-lg max-w-none 
                      prose-headings:text-slate-900 dark:prose-headings:text-white
                      prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-4
                      prose-h2:text-2xl prose-h3:text-xl
                      prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed
                      prose-a:text-purple-600 dark:prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-slate-900 dark:prose-strong:text-white
                      prose-ul:text-slate-600 dark:prose-ul:text-slate-300
                      prose-ol:text-slate-600 dark:prose-ol:text-slate-300
                      prose-li:marker:text-purple-500
                      prose-blockquote:border-l-purple-500 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-800/50"
                    dangerouslySetInnerHTML={{ __html: facility.attributes.description }}
                  />
                </div>

                {/* Footer Actions */}
                <div className="px-6 md:px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Back Button */}
                    <Link
                      href="/fasilitas"
                      className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors group"
                    >
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                      Kembali ke Daftar
                    </Link>

                    {/* Share Buttons */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                        Bagikan:
                      </span>
                      <div className="flex gap-2">
                        <button
                          className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
                          aria-label="Share on Facebook"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </button>
                        <button
                          className="w-9 h-9 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg shadow-green-500/25"
                          aria-label="Share on WhatsApp"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Booking CTA */}
              {facility.attributes.is_bookable && (
                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Ingin Menggunakan Fasilitas Ini?</h3>
                  <p className="text-white/80 text-sm mb-6">
                    Hubungi kami untuk informasi pemesanan dan ketersediaan fasilitas.
                  </p>
                  <Link
                    href="/kontak"
                    className="block w-full py-3 px-4 bg-white text-purple-600 rounded-xl font-semibold text-center hover:bg-slate-50 transition-colors shadow-lg"
                  >
                    Hubungi Kami
                  </Link>
                </div>
              )}

              {/* Related Facilities */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-6 sticky top-24">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Fasilitas Lainnya</h2>
                {relatedFacilities.length > 0 ? (
                  <div className="space-y-4">
                    {relatedFacilities.slice(0, 3).map((related) => (
                      <Link
                        key={related.id}
                        href={`/fasilitas/${related.attributes.slug}`}
                        className="block group"
                      >
                        <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <div className={`flex-shrink-0 w-12 h-12 ${categoryColors[related.attributes.category]?.badge || 'bg-purple-500'} bg-opacity-10 rounded-xl flex items-center justify-center`}>
                            <Building2 className={`w-6 h-6 ${categoryColors[related.attributes.category]?.badge.replace('bg-', 'text-') || 'text-purple-500'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                              {related.attributes.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {related.attributes.location}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tidak ada fasilitas lainnya.</p>
                )}
                <Link
                  href="/fasilitas"
                  className="block mt-4 text-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
                >
                  Lihat Semua Fasilitas →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Bottom Spacing */}
      <div className="h-8 md:h-12 bg-white dark:bg-slate-950 relative z-10" />
    </div>
  )
}
