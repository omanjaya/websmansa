import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAnnouncement, getLatestAnnouncements } from '@/lib/api'
import { Badge } from '@/components/ui'
import { sanitizeHTML } from '@/lib/sanitize'
import { PageClientEnhancements } from './PageClientEnhancements'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Local type for compatibility
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
    start_date?: string
    end_date?: string
    attachment_url?: string
    published_at: string
    created_at: string
    updated_at: string
  }
}

const typeColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  general: 'default',
  academic: 'secondary',
  event: 'outline',
  urgent: 'destructive',
}

const typeLabels: Record<string, string> = {
  general: 'Umum',
  academic: 'Akademik',
  event: 'Kegiatan',
  urgent: 'Penting',
}

// Dummy announcement
const dummyAnnouncement: LocalAnnouncement = {
  id: 1,
  type: 'announcement',
  attributes: {
    title: 'Jadwal Ujian Akhir Semester Ganjil 2025/2026',
    slug: 'jadwal-uas-ganjil-2025',
    content: `
      <p>Kepada Yth. Orang Tua/Wali Siswa dan Seluruh Siswa/Siswi SMAN 1 Denpasar,</p>

      <p>Dengan hormat, bersama ini kami sampaikan informasi mengenai pelaksanaan Ujian Akhir Semester (UAS) Ganjil Tahun Ajaran 2025/2026.</p>

      <h2>Jadwal Pelaksanaan</h2>
      <ul>
        <li><strong>Tanggal:</strong> 16 - 21 Desember 2025</li>
        <li><strong>Waktu:</strong> 07:30 - 12:00 WITA</li>
        <li><strong>Tempat:</strong> Ruang kelas masing-masing</li>
      </ul>

      <h2>Ketentuan Ujian</h2>
      <ol>
        <li>Siswa wajib hadir 15 menit sebelum ujian dimulai</li>
        <li>Mengenakan seragam sekolah lengkap</li>
        <li>Membawa alat tulis sendiri (pensil 2B, penghapus, penggaris)</li>
        <li>Tidak diperkenankan membawa HP ke dalam ruang ujian</li>
        <li>Siswa yang terlambat lebih dari 15 menit tidak diperkenankan mengikuti ujian pada sesi tersebut</li>
      </ol>

      <h2>Mata Pelajaran yang Diujikan</h2>
      <p>Semua mata pelajaran sesuai dengan kurikulum yang berlaku akan diujikan. Jadwal lengkap per mata pelajaran dapat dilihat di papan pengumuman sekolah atau melalui aplikasi sekolah.</p>

      <p>Demikian informasi ini kami sampaikan. Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.</p>

      <p>Denpasar, 10 Desember 2025<br/>
      Kepala SMAN 1 Denpasar</p>
    `,
    excerpt: 'Kepada seluruh siswa/siswi SMAN 1 Denpasar, berikut adalah jadwal Ujian Akhir Semester Ganjil tahun ajaran 2025/2026...',
    type: 'academic' as const,
    priority: 1,
    is_featured: true,
    is_pinned: true,
    start_date: '2025-12-16T00:00:00Z',
    end_date: '2025-12-21T23:59:59Z',
    attachment_url: undefined,
    published_at: '2025-12-10T08:00:00Z',
    created_at: '2025-12-10T08:00:00Z',
    updated_at: '2025-12-10T08:00:00Z',
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const response = await getAnnouncement(slug)
    const announcement = response?.data

    if (!announcement) {
      return {
        title: 'Pengumuman Tidak Ditemukan | SMAN 1 Denpasar',
        description: 'Pengumuman yang Anda cari tidak ditemukan.',
      }
    }

    return {
      title: `${announcement.attributes.title} | SMAN 1 Denpasar`,
      description: announcement.attributes.excerpt || announcement.attributes.title,
    }
  } catch {
    return {
      title: 'Pengumuman | SMAN 1 Denpasar',
      description: 'Pengumuman dari SMA Negeri 1 Denpasar',
    }
  }
}

export default async function AnnouncementDetailPage({ params }: PageProps) {
  const { slug } = await params
  let announcement: LocalAnnouncement | null = null
  let relatedAnnouncements: LocalAnnouncement[] = []

  try {
    const response = await getAnnouncement(slug)
    if (response?.data) {
      announcement = response.data as LocalAnnouncement
    }
  } catch {
    // API error - announcement not found
  }

  // If no announcement found from API, show 404
  if (!announcement) {
    notFound()
  }

  try {
    const latestResponse = await getLatestAnnouncements(4)
    if (latestResponse.data) {
      relatedAnnouncements = latestResponse.data.filter((a) => a.attributes.slug !== slug) as LocalAnnouncement[]
    }
  } catch {
    // No related announcements
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Client-side enhancements */}
      <PageClientEnhancements title={announcement.attributes.title} />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-4">
            <Link href="/" className="hover:text-white">Beranda</Link>
            <span>/</span>
            <Link href="/pengumuman" className="hover:text-white">Pengumuman</Link>
            <span>/</span>
            <span className="text-white">Detail</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Pengumuman</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Header */}
              <div className="p-8 border-b">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge variant={typeColors[announcement.attributes.type] || 'default'}>
                    {typeLabels[announcement.attributes.type] || announcement.attributes.type}
                  </Badge>
                  {announcement.attributes.is_pinned && (
                    <Badge variant="secondary">Disematkan</Badge>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {announcement.attributes.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {new Date(announcement.attributes.published_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  {announcement.attributes.start_date && announcement.attributes.end_date && (
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        Berlaku: {new Date(announcement.attributes.start_date).toLocaleDateString('id-ID')} - {new Date(announcement.attributes.end_date).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div
                  className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(announcement.attributes.content) }}
                />
              </div>

              {/* Attachment */}
              {announcement.attributes.attachment_url && (
                <div className="px-8 pb-8">
                  <a
                    href={announcement.attributes.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Lampiran
                  </a>
                </div>
              )}

              {/* Footer */}
              <div className="px-8 py-6 bg-gray-50 border-t">
                <div className="flex items-center justify-between">
                  <Link
                    href="/pengumuman"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Bagikan:</span>
                    <button
                      aria-label="Bagikan di Facebook"
                      title="Bagikan di Facebook"
                      className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </button>
                    <button
                      aria-label="Bagikan di WhatsApp"
                      title="Bagikan di WhatsApp"
                      className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Pengumuman Lainnya</h2>
              {relatedAnnouncements.length > 0 ? (
                <div className="space-y-4">
                  {relatedAnnouncements.slice(0, 3).map((related) => (
                    <Link
                      key={related.id}
                      href={`/pengumuman/${related.attributes.slug}`}
                      className="block group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600">
                            {related.attributes.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(related.attributes.published_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Tidak ada pengumuman lainnya.</p>
              )}
              <Link
                href="/pengumuman"
                className="block mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Lihat Semua Pengumuman
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
