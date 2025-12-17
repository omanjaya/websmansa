import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getStaffMember, getStaff } from '@/lib/api'
import { Badge } from '@/components/ui'

interface PageProps {
  params: Promise<{ slug: string }>
}

const typeLabels: Record<string, string> = {
  principal: 'Kepala Sekolah',
  vice_principal: 'Wakil Kepala Sekolah',
  teacher: 'Guru',
  staff: 'Staff',
}

const typeColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  principal: 'destructive',
  vice_principal: 'secondary',
  teacher: 'default',
  staff: 'outline',
}

// Local type for compatibility
type LocalStaff = {
  id: number
  type: string
  attributes: {
    name: string
    slug: string
    nip?: string
    position: string
    type: string
    department?: string
    subjects?: string[]
    education?: string
    email?: string
    phone?: string
    bio?: string
    photo?: string
    photo_url?: string
    is_featured: boolean
    is_active: boolean
    order: number
    created_at: string
    updated_at: string
  }
}

// Dummy data
const dummyStaff: LocalStaff = {
  id: 1,
  type: 'staff',
  attributes: {
    name: 'Drs. I Made Sukarta, M.Pd.',
    slug: 'i-made-sukarta',
    nip: '196512051990031001',
    position: 'Kepala Sekolah',
    type: 'principal',
    department: undefined,
    subjects: [],
    education: 'S2 Pendidikan - Universitas Pendidikan Ganesha',
    email: 'kepala@sman1denpasar.sch.id',
    phone: '+62 361 234567',
    bio: `
      <p>Drs. I Made Sukarta, M.Pd. adalah Kepala Sekolah SMA Negeri 1 Denpasar yang telah memimpin sekolah sejak tahun 2020. Dengan pengalaman lebih dari 30 tahun di dunia pendidikan, beliau berkomitmen untuk terus meningkatkan kualitas pendidikan dan karakter siswa.</p>

      <h2>Visi Kepemimpinan</h2>
      <p>Menjadikan SMAN 1 Denpasar sebagai sekolah unggulan yang menghasilkan lulusan berkualitas, berkarakter Pancasila, dan siap bersaing di tingkat nasional maupun internasional.</p>

      <h2>Karir Pendidikan</h2>
      <ul>
        <li>2020 - Sekarang: Kepala Sekolah SMAN 1 Denpasar</li>
        <li>2015 - 2020: Kepala Sekolah SMAN 3 Denpasar</li>
        <li>2010 - 2015: Wakil Kepala Sekolah SMAN 1 Denpasar</li>
        <li>1990 - 2010: Guru Fisika SMAN 1 Denpasar</li>
      </ul>

      <h2>Penghargaan</h2>
      <ul>
        <li>Kepala Sekolah Teladan Provinsi Bali 2022</li>
        <li>Satya Lencana Karya Satya 30 Tahun</li>
        <li>Penghargaan Inovasi Pendidikan Kemendikbud 2021</li>
      </ul>

      <h2>Filosofi Pendidikan</h2>
      <p>"Pendidikan bukan hanya tentang transfer ilmu, tetapi juga tentang membentuk karakter dan menyiapkan generasi yang siap menghadapi tantangan masa depan dengan integritas dan kompetensi."</p>
    `,
    photo: undefined,
    is_featured: true,
    is_active: true,
    order: 1,
    created_at: '2025-01-01',
    updated_at: '2025-01-01',
  },
}

const dummyRelatedStaff: LocalStaff[] = [
  {
    id: 2,
    type: 'staff',
    attributes: {
      name: 'Ni Luh Putu Sari, S.Pd., M.Pd.',
      slug: 'ni-luh-putu-sari',
      nip: '197008151995032001',
      position: 'Wakil Kepala Bidang Kurikulum',
      type: 'vice_principal',
      subjects: ['Matematika'],
      education: 'S2 Pendidikan Matematika - UGM',
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
      name: 'I Ketut Dharma, S.Pd.',
      slug: 'i-ketut-dharma',
      nip: '198005201005011002',
      position: 'Wakil Kepala Bidang Kesiswaan',
      type: 'vice_principal',
      subjects: ['Olahraga'],
      education: 'S1 Pendidikan Olahraga - Unud',
      is_featured: true,
      is_active: true,
      order: 3,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
  },
]

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const response = await getStaffMember(slug)
    const staff = response.data

    return {
      title: `${staff.attributes.name} - ${staff.attributes.position}`,
      description: staff.attributes.bio || `Profil ${staff.attributes.name} - ${staff.attributes.position} di SMA Negeri 1 Denpasar`,
    }
  } catch {
    return {
      title: 'Staff & Guru',
      description: 'Tenaga pendidik dan kependidikan SMA Negeri 1 Denpasar',
    }
  }
}

export default async function StaffDetailPage({ params }: PageProps) {
  const { slug } = await params
  let staff: LocalStaff = dummyStaff
  let relatedStaff: LocalStaff[] = dummyRelatedStaff

  try {
    const response = await getStaffMember(slug)
    if (response.data) {
      staff = response.data as LocalStaff
    }
  } catch {
    if (slug !== dummyStaff.attributes.slug) {
      notFound()
    }
  }

  try {
    const staffResponse = await getStaff({ featured: true, per_page: 4 })
    if (staffResponse.data) {
      relatedStaff = staffResponse.data.filter((s) => s.attributes.slug !== slug) as LocalStaff[]
    }
  } catch {
    // Use dummy related staff
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-4">
            <Link href="/" className="hover:text-white">Beranda</Link>
            <span>/</span>
            <Link href="/staff" className="hover:text-white">Staff & Guru</Link>
            <span>/</span>
            <span className="text-white">{staff.attributes.name}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Staff & Guru</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Profile Header */}
              <div className="p-8 border-b">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Photo */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-200 rounded-xl overflow-hidden">
                      {staff.attributes.photo_url ? (
                        <Image
                          src={staff.attributes.photo_url}
                          alt={staff.attributes.name}
                          width={160}
                          height={160}
                          className="object-cover w-full h-full"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-200">
                          <svg className="w-16 h-16 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant={typeColors[staff.attributes.type] || 'default'}>
                        {typeLabels[staff.attributes.type] || staff.attributes.type}
                      </Badge>
                      {staff.attributes.is_featured && (
                        <Badge variant="secondary">Unggulan</Badge>
                      )}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {staff.attributes.name}
                    </h1>
                    <p className="text-lg text-indigo-600 font-medium mb-4">
                      {staff.attributes.position}
                    </p>

                    {/* Quick Info */}
                    <div className="space-y-2 text-sm text-gray-600">
                      {staff.attributes.nip && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                          </svg>
                          <span>NIP: {staff.attributes.nip}</span>
                        </div>
                      )}
                      {staff.attributes.education && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                          </svg>
                          <span>{staff.attributes.education}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact & Subjects */}
              <div className="p-8 bg-gray-50 border-b">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Kontak</h3>
                    <div className="space-y-2">
                      {staff.attributes.email && (
                        <a
                          href={`mailto:${staff.attributes.email}`}
                          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>{staff.attributes.email}</span>
                        </a>
                      )}
                      {staff.attributes.phone && (
                        <a
                          href={`tel:${staff.attributes.phone}`}
                          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{staff.attributes.phone}</span>
                        </a>
                      )}
                      {!staff.attributes.email && !staff.attributes.phone && (
                        <p className="text-gray-500 text-sm">Tidak ada kontak publik</p>
                      )}
                    </div>
                  </div>

                  {/* Subjects */}
                  {staff.attributes.subjects && staff.attributes.subjects.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Mata Pelajaran</h3>
                      <div className="flex flex-wrap gap-2">
                        {staff.attributes.subjects.map((subject, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              {staff.attributes.bio && (
                <div className="p-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Profil</h2>
                  <div
                    className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600"
                    dangerouslySetInnerHTML={{ __html: staff.attributes.bio }}
                  />
                </div>
              )}

              {/* Footer */}
              <div className="px-8 py-6 bg-gray-50 border-t">
                <div className="flex items-center justify-between">
                  <Link
                    href="/staff"
                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali ke Daftar
                  </Link>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Related Staff */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Staff Lainnya</h2>
              {relatedStaff.length > 0 ? (
                <div className="space-y-4">
                  {relatedStaff.slice(0, 4).map((related) => (
                    <Link
                      key={related.id}
                      href={`/staff/${related.attributes.slug}`}
                      className="block group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center overflow-hidden">
                          {related.attributes.photo_url ? (
                            <Image
                              src={related.attributes.photo_url}
                              alt={related.attributes.name}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                              loading="lazy"
                            />
                          ) : (
                            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600">
                            {related.attributes.name}
                          </h3>
                          <p className="text-xs text-gray-500 truncate">
                            {related.attributes.position}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Tidak ada staff lainnya.</p>
              )}
              <Link
                href="/staff"
                className="block mt-4 text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Lihat Semua Staff
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
