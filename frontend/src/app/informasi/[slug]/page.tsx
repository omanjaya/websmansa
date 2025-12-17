import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPost, getLatestPosts } from '@/lib/api'
import { Badge } from '@/components/ui'
import { sanitizeHTML } from '@/lib/sanitize'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Local type for compatibility
type LocalPost = {
  id: number
  uuid: string
  type: string
  attributes: {
    title: string
    slug: string
    excerpt: string
    content?: string
    featured_image?: string
    status: string
    type: string
    views: number
    likes: number
    is_featured: boolean
    is_pinned: boolean
    published_at: string
    created_at: string
    updated_at: string
  }
  relationships: {
    author?: {
      id: number
      name: string
      avatar?: string
    }
    categories?: Array<{
      id: number
      name: string
      slug: string
      order: number
    }>
  }
  meta: {
    excerpt_length: number
    reading_time: number
  }
}

// Dummy post data
const dummyPost: LocalPost = {
  id: 1,
  uuid: '1',
  type: 'post',
  attributes: {
    title: 'Prestasi Siswa di Olimpiade Sains Nasional 2025',
    slug: 'prestasi-osn-2025',
    excerpt: 'Siswa SMAN 1 Denpasar berhasil meraih medali emas dalam Olimpiade Sains Nasional bidang Fisika.',
    content: `
      <p>Siswa SMAN 1 Denpasar kembali mengukir prestasi membanggakan di ajang Olimpiade Sains Nasional (OSN) 2025. Dalam kompetisi yang diselenggarakan oleh Kementerian Pendidikan dan Kebudayaan ini, perwakilan sekolah berhasil meraih medali emas di bidang Fisika.</p>

      <h2>Perjalanan Menuju Prestasi</h2>
      <p>Prestasi ini tidak diraih secara instan. Siswa yang bersangkutan telah menjalani pembinaan intensif selama lebih dari satu tahun di bawah bimbingan guru-guru berpengalaman. Latihan rutin dan simulasi ujian menjadi bagian dari persiapan menghadapi kompetisi tingkat nasional.</p>

      <h2>Dukungan Penuh dari Sekolah</h2>
      <p>Kepala Sekolah SMAN 1 Denpasar menyampaikan apresiasi tertinggi atas prestasi yang diraih. "Ini adalah bukti bahwa dengan kerja keras dan dedikasi, siswa-siswa kita mampu bersaing di tingkat nasional," ujarnya.</p>

      <p>Sekolah juga menyediakan fasilitas laboratorium yang memadai dan akses ke berbagai sumber belajar untuk mendukung persiapan olimpiade.</p>

      <h2>Inspirasi untuk Generasi Berikutnya</h2>
      <p>Prestasi ini diharapkan dapat memotivasi siswa-siswa lain untuk terus berprestasi dan mengharumkan nama sekolah. Program pembinaan olimpiade akan terus ditingkatkan untuk mencetak lebih banyak siswa berprestasi di masa depan.</p>
    `,
    featured_image: undefined,
    status: 'published',
    type: 'news',
    views: 150,
    likes: 25,
    is_featured: true,
    is_pinned: false,
    published_at: '2025-12-10T08:00:00Z',
    created_at: '2025-12-10T08:00:00Z',
    updated_at: '2025-12-10T08:00:00Z',
  },
  relationships: {
    author: { id: 1, name: 'Admin', avatar: undefined },
    categories: [{ id: 1, name: 'Prestasi', slug: 'prestasi', order: 1 }],
  },
  meta: { excerpt_length: 100, reading_time: 5 },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const response = await getPost(slug)
    const post = response.data

    return {
      title: post.attributes.title,
      description: post.attributes.excerpt,
      openGraph: {
        title: post.attributes.title,
        description: post.attributes.excerpt,
        images: post.attributes.featured_image ? [post.attributes.featured_image] : [],
      },
    }
  } catch {
    return {
      title: 'Berita',
      description: 'Berita dan informasi dari SMA Negeri 1 Denpasar',
    }
  }
}

export default async function PostDetailPage({ params }: PageProps) {
  const { slug } = await params
  let post: LocalPost = dummyPost
  let relatedPosts: LocalPost[] = []

  try {
    const response = await getPost(slug)
    if (response.data) {
      post = response.data as LocalPost
    }
  } catch {
    // Use dummy data
    if (slug !== dummyPost.attributes.slug) {
      notFound()
    }
  }

  // Get related posts
  try {
    const latestResponse = await getLatestPosts(3)
    if (latestResponse.data) {
      relatedPosts = latestResponse.data.filter((p) => p.attributes.slug !== slug) as LocalPost[]
    }
  } catch {
    // No related posts
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-[400px] bg-gradient-to-r from-blue-600 to-blue-800">
        {post.attributes.featured_image ? (
          <Image
            src={post.attributes.featured_image}
            alt={post.attributes.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800" />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-32 relative z-10 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Article Card */}
          <article className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="p-8 pb-0">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Link href="/" className="hover:text-blue-600">Beranda</Link>
                <span>/</span>
                <Link href="/informasi" className="hover:text-blue-600">Informasi</Link>
                <span>/</span>
                <span className="text-gray-900">{post.attributes.title.substring(0, 30)}...</span>
              </nav>

              {/* Categories */}
              {post.relationships.categories && post.relationships.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.relationships.categories.map((category) => (
                    <Link key={category.id} href={`/informasi?category=${category.slug}`}>
                      <Badge variant="default">{category.name}</Badge>
                    </Link>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {post.attributes.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pb-6 border-b">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span>{post.relationships.author?.name || 'Admin'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {new Date(post.attributes.published_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{post.meta.reading_time} menit baca</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{post.attributes.views} views</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-blue-600"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.attributes.content || post.attributes.excerpt) }}
              />
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-gray-50 border-t">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Share Buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Bagikan:</span>
                  <button className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </button>
                  <button className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </button>
                </div>

                {/* Like Button */}
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-sm font-medium">{post.attributes.likes} Suka</span>
                </button>
              </div>
            </div>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Berita Terkait</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedPosts.slice(0, 2).map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/informasi/${relatedPost.attributes.slug}`}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition group"
                  >
                    <div className="h-40 bg-gray-200 relative">
                      {relatedPost.attributes.featured_image ? (
                        <Image
                          src={relatedPost.attributes.featured_image}
                          alt={relatedPost.attributes.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600">
                        {relatedPost.attributes.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(relatedPost.attributes.published_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-8 text-center">
            <Link
              href="/informasi"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Daftar Berita
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
