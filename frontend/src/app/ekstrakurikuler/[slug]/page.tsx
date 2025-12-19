import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getExtra, getFeaturedExtras } from '@/lib/api'
import { Badge } from '@/components/ui'
import { Section, Waves, DotPattern, GlowSpot } from '@/components/shared'
import {
  ChevronRight, ArrowLeft, Users, MapPin, Clock,
  User, Trophy, FileText, Sparkles, Share2, CheckCircle
} from 'lucide-react'

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

const categoryColors: Record<string, { gradient: string, badge: string, light: string }> = {
  olahraga: { gradient: 'from-red-600 to-orange-600', badge: 'bg-red-500', light: 'bg-red-50 text-red-700 border-red-100' },
  seni: { gradient: 'from-purple-600 to-pink-600', badge: 'bg-purple-500', light: 'bg-purple-50 text-purple-700 border-purple-100' },
  akademik: { gradient: 'from-blue-600 to-indigo-600', badge: 'bg-blue-500', light: 'bg-blue-50 text-blue-700 border-blue-100' },
  organisasi: { gradient: 'from-green-600 to-emerald-600', badge: 'bg-green-500', light: 'bg-green-50 text-green-700 border-green-100' },
  keagamaan: { gradient: 'from-yellow-600 to-amber-600', badge: 'bg-yellow-500', light: 'bg-yellow-50 text-yellow-700 border-yellow-100' },
  teknologi: { gradient: 'from-cyan-600 to-teal-600', badge: 'bg-cyan-500', light: 'bg-cyan-50 text-cyan-700 border-cyan-100' },
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
      title: `${extra.attributes.name} | Ekstrakurikuler SMAN 1 Denpasar`,
      description: extra.attributes.short_description || extra.attributes.description,
    }
  } catch {
    return {
      title: 'Ekstrakurikuler | SMAN 1 Denpasar',
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

  const colors = categoryColors[extra.attributes.category] || categoryColors.olahraga

  return (
    <div className="-mt-16 lg:-mt-20 min-h-screen bg-white dark:bg-slate-950">
      {/* Fixed Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <DotPattern variant="scattered" className="opacity-30 dark:opacity-20" />
        <GlowSpot color="bg-green-500" size="xl" position={{ top: '10%', right: '10%' }} />
        <GlowSpot color="bg-emerald-500" size="lg" position={{ bottom: '20%', left: '5%' }} />
      </div>

      {/* Hero Section */}
      <div className="relative min-h-[50vh] md:min-h-[55vh] overflow-hidden">
        {/* Background Image */}
        {extra.attributes.image ? (
          <Image
            src={extra.attributes.image}
            alt={extra.attributes.name}
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
              <Link href="/ekstrakurikuler" className="hover:text-white transition-colors">Ekstrakurikuler</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white truncate max-w-[200px]">{extra.attributes.name}</span>
            </nav>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge
                variant="default"
                className="bg-white/10 backdrop-blur-sm text-white border-white/20"
              >
                <Users className="w-3.5 h-3.5 mr-1" />
                {categoryLabels[extra.attributes.category] || extra.attributes.category}
              </Badge>
              {extra.attributes.is_featured && (
                <Badge
                  variant="default"
                  className="bg-yellow-500/20 backdrop-blur-sm text-yellow-300 border-yellow-500/30"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  Unggulan
                </Badge>
              )}
              {extra.attributes.is_active ? (
                <Badge
                  variant="default"
                  className="bg-green-500/20 backdrop-blur-sm text-green-300 border-green-500/30"
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  Aktif
                </Badge>
              ) : (
                <Badge
                  variant="default"
                  className="bg-red-500/20 backdrop-blur-sm text-red-300 border-red-500/30"
                >
                  Tidak Aktif
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-4xl leading-tight">
              {extra.attributes.name}
            </h1>

            {/* Short Description */}
            {extra.attributes.short_description && (
              <p className="text-lg text-white/80 max-w-2xl mb-6">
                {extra.attributes.short_description}
              </p>
            )}

            {/* Quick Info */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/80">
              {extra.attributes.schedule && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{extra.attributes.schedule}</span>
                </div>
              )}
              {extra.attributes.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{extra.attributes.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{extra.attributes.member_count}{extra.attributes.quota && ` / ${extra.attributes.quota}`} Anggota</span>
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
                {/* Coach Info */}
                {extra.attributes.coach && (
                  <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-slate-800/50 dark:to-slate-800/30">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <User className="w-7 h-7 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Pembina/Pelatih</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{extra.attributes.coach}</p>
                      </div>
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
                      prose-a:text-green-600 dark:prose-a:text-green-400 prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-slate-900 dark:prose-strong:text-white
                      prose-ul:text-slate-600 dark:prose-ul:text-slate-300
                      prose-ol:text-slate-600 dark:prose-ol:text-slate-300
                      prose-li:marker:text-green-500
                      prose-blockquote:border-l-green-500 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-800/50"
                    dangerouslySetInnerHTML={{ __html: extra.attributes.description }}
                  />
                </div>

                {/* Achievements */}
                {extra.attributes.achievements && extra.attributes.achievements.length > 0 && (
                  <div className="px-6 md:px-8 pb-8">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      Prestasi
                    </h2>
                    <div className="space-y-3">
                      {extra.attributes.achievements.map((achievement, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border border-yellow-100 dark:border-yellow-900/30"
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                          </div>
                          <span className="text-slate-700 dark:text-slate-200 font-medium pt-2">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {extra.attributes.requirements && (
                  <div className="px-6 md:px-8 pb-8">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-500" />
                      Persyaratan
                    </h2>
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                      <p className="text-slate-700 dark:text-slate-200">{extra.attributes.requirements}</p>
                    </div>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="px-6 md:px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Back Button */}
                    <Link
                      href="/ekstrakurikuler"
                      className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors group"
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
              {/* Registration CTA */}
              {extra.attributes.is_active && (
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Tertarik Bergabung?</h3>
                  <p className="text-white/80 text-sm mb-6">
                    Daftarkan dirimu sekarang dan kembangkan minat serta bakatmu bersama kami!
                  </p>
                  <Link
                    href="/kontak"
                    className="block w-full py-3 px-4 bg-white text-green-600 rounded-xl font-semibold text-center hover:bg-slate-50 transition-colors shadow-lg"
                  >
                    Hubungi Kami
                  </Link>
                </div>
              )}

              {/* Related Extras */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-6 sticky top-24">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Ekstrakurikuler Lainnya</h2>
                {relatedExtras.length > 0 ? (
                  <div className="space-y-4">
                    {relatedExtras.slice(0, 3).map((related) => (
                      <Link
                        key={related.id}
                        href={`/ekstrakurikuler/${related.attributes.slug}`}
                        className="block group"
                      >
                        <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <div className={`flex-shrink-0 w-12 h-12 ${categoryColors[related.attributes.category]?.badge || 'bg-green-500'} bg-opacity-10 rounded-xl flex items-center justify-center`}>
                            <Users className={`w-6 h-6 ${categoryColors[related.attributes.category]?.badge.replace('bg-', 'text-') || 'text-green-500'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                              {related.attributes.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {related.attributes.member_count} Anggota
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tidak ada ekstrakurikuler lainnya.</p>
                )}
                <Link
                  href="/ekstrakurikuler"
                  className="block mt-4 text-center text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold"
                >
                  Lihat Semua Ekstrakurikuler →
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
