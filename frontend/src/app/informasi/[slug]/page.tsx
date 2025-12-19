import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPost, getLatestPosts } from '@/lib/api'
import { Badge } from '@/components/ui'
import { sanitizeHTML } from '@/lib/sanitize'
import { Section, Waves, DotPattern, GlowSpot } from '@/components/shared'
import { Calendar, Clock, Eye, Heart, ArrowLeft, User, ChevronRight } from 'lucide-react'
import { ArticleClientEnhancements } from './ArticleClientEnhancements'

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
      title: `${post.attributes.title} | SMAN 1 Denpasar`,
      description: post.attributes.excerpt,
      openGraph: {
        title: post.attributes.title,
        description: post.attributes.excerpt,
        images: post.attributes.featured_image ? [post.attributes.featured_image] : [],
        type: 'article',
      },
    }
  } catch {
    return {
      title: 'Berita | SMAN 1 Denpasar',
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
    const latestResponse = await getLatestPosts(4)
    if (latestResponse.data) {
      relatedPosts = latestResponse.data.filter((p) => p.attributes.slug !== slug) as LocalPost[]
    }
  } catch {
    // No related posts
  }

  const formattedDate = new Date(post.attributes.published_at).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="-mt-16 lg:-mt-20 min-h-screen bg-white dark:bg-slate-950">
      {/* Client-side enhancements */}
      <ArticleClientEnhancements title={post.attributes.title} />

      {/* Fixed Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <DotPattern variant="scattered" className="opacity-30 dark:opacity-20" />
        <GlowSpot color="bg-blue-500" size="xl" position={{ top: '10%', right: '10%' }} />
        <GlowSpot color="bg-cyan-500" size="lg" position={{ bottom: '20%', left: '5%' }} />
      </div>

      {/* Hero Section */}
      <div className="relative min-h-[50vh] md:min-h-[55vh] overflow-hidden">
        {/* Background Image */}
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
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        {/* Content */}
        <div className="relative z-10 h-full flex items-end">
          <div className="container mx-auto px-4 pb-40 pt-32 lg:pt-40">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/informasi" className="hover:text-white transition-colors">Informasi</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white truncate max-w-[200px]">{post.attributes.title}</span>
            </nav>

            {/* Categories */}
            {post.relationships.categories && post.relationships.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.relationships.categories.map((category) => (
                  <Link key={category.id} href={`/informasi?category=${category.slug}`}>
                    <Badge
                      variant="default"
                      className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20 transition-colors"
                    >
                      {category.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-4xl leading-tight">
              {post.attributes.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">{post.relationships.author?.name || 'Admin'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.meta.reading_time} menit baca</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{post.attributes.views.toLocaleString()} views</span>
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
        <div className="max-w-4xl mx-auto">
          {/* Article Content */}
          <article className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden -mt-24 relative z-30">
            {/* Featured Image */}
            <div className="relative w-full aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
              {post.attributes.featured_image ? (
                <Image
                  src={post.attributes.featured_image}
                  alt={post.attributes.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 896px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                  <svg className="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">Gambar Utama Berita</span>
                  <span className="text-xs mt-1 text-slate-300 dark:text-slate-600">Upload melalui Admin Panel</span>
                </div>
              )}
            </div>

            {/* Excerpt/Lead */}
            {post.attributes.excerpt && (
              <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/50 dark:to-slate-800/30">
                <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-medium italic">
                  {post.attributes.excerpt}
                </p>
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
                  prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-slate-900 dark:prose-strong:text-white
                  prose-ul:text-slate-600 dark:prose-ul:text-slate-300
                  prose-ol:text-slate-600 dark:prose-ol:text-slate-300
                  prose-li:marker:text-blue-500
                  prose-blockquote:border-l-blue-500 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-800/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                  prose-img:rounded-xl prose-img:shadow-lg"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.attributes.content || post.attributes.excerpt) }}
              />
            </div>

            {/* Author Card */}
            <div className="px-6 md:px-8 pb-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/50 dark:to-slate-800/30 rounded-2xl p-6 md:p-8 border border-blue-100 dark:border-slate-700">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-lg shadow-blue-500/30">
                    {(post.relationships.author?.name || 'Admin').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                      Ditulis oleh
                    </p>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      {post.relationships.author?.name || 'Admin'}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Tim redaksi SMA Negeri 1 Denpasar yang berkomitmen menyajikan informasi terkini dan akurat.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 md:px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Share Buttons */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Bagikan:</span>
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
                      className="w-9 h-9 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/25"
                      aria-label="Share on Twitter"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
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

                {/* Like Button */}
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:border-rose-200 dark:hover:border-rose-800 transition-all group shadow-sm">
                  <Heart className="w-5 h-5 text-rose-500 group-hover:fill-rose-500 transition-all" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{post.attributes.likes} Suka</span>
                </button>
              </div>
            </div>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8">
                Berita <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Terkait</span>
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.slice(0, 3).map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/informasi/${relatedPost.attributes.slug}`}
                    className="group block bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                  >
                    <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 overflow-hidden">
                      {relatedPost.attributes.featured_image ? (
                        <Image
                          src={relatedPost.attributes.featured_image}
                          alt={relatedPost.attributes.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-12 h-12 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-5">
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                        {new Date(relatedPost.attributes.published_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {relatedPost.attributes.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{relatedPost.attributes.excerpt}</p>
                      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:gap-3 transition-all">
                        Baca selengkapnya
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-12 text-center">
            <Link
              href="/informasi"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 font-semibold rounded-full transition-all group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Daftar Berita
            </Link>
          </div>
        </div>
      </Section>

      {/* Bottom Spacing */}
      <div className="h-8 md:h-12 bg-white dark:bg-slate-950 relative z-10" />
    </div>
  )
}
