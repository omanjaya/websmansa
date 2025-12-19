import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getGallery, getGalleries } from '@/lib/api'
import Lightbox from '@/components/gallery/Lightbox'
import { Calendar, Image as ImageIcon, ArrowLeft, ChevronRight, Sparkles, Images } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Section, Waves, DotPattern, GlowSpot } from '@/components/shared'
import { Badge } from '@/components/ui'

interface GalleryDetailPageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({
    params,
}: GalleryDetailPageProps): Promise<Metadata> {
    const { slug } = await params
    try {
        const { data: gallery } = await getGallery(slug)

        return {
            title: `${gallery.title} - Galeri SMAN 1 Denpasar`,
            description: gallery.description || `Lihat ${gallery.items_count} foto dari ${gallery.title}`,
            openGraph: {
                title: gallery.title,
                description: gallery.description || undefined,
                images: gallery.thumbnail_url ? [gallery.thumbnail_url] : undefined,
                type: 'website',
            },
        }
    } catch {
        return {
            title: 'Galeri Tidak Ditemukan | SMAN 1 Denpasar',
        }
    }
}

export default async function GalleryDetailPage({
    params,
}: GalleryDetailPageProps) {
    const { slug } = await params
    let gallery
    let relatedGalleries: Array<{
        id: number
        slug: string
        title: string
        thumbnail_url?: string
        items_count: number
        event_date?: string
    }> = []

    try {
        const response = await getGallery(slug)
        gallery = response.data
    } catch {
        notFound()
    }

    // Get related galleries
    try {
        const galleriesResponse = await getGalleries({ per_page: 4 })
        relatedGalleries = galleriesResponse.data
            .filter(g => g.slug !== slug)
            .slice(0, 3)
    } catch {
        // No related galleries
    }

    const images = gallery.items?.map((item) => ({
        id: item.id,
        url: item.media.url,
        caption: item.caption,
        alt: item.media.alt_text || gallery.title,
        width: item.media.width,
        height: item.media.height,
    })) || []

    const typeLabel = {
        photo: 'Galeri Foto',
        video: 'Galeri Video',
        mixed: 'Galeri Campuran',
    }

    const typeColors = {
        photo: 'from-purple-600 to-pink-600',
        video: 'from-red-600 to-orange-600',
        mixed: 'from-blue-600 to-cyan-600',
    }

    return (
        <div className="-mt-16 lg:-mt-20 min-h-screen bg-white dark:bg-slate-950">
            {/* Fixed Background Pattern */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <DotPattern variant="scattered" className="opacity-30 dark:opacity-20" />
                <GlowSpot color="bg-purple-500" size="xl" position={{ top: '10%', right: '10%' }} />
                <GlowSpot color="bg-pink-500" size="lg" position={{ bottom: '20%', left: '5%' }} />
            </div>

            {/* Hero Section */}
            <div className="relative min-h-[50vh] md:min-h-[55vh] overflow-hidden">
                {/* Background Image */}
                {gallery.thumbnail_url ? (
                    <Image
                        src={gallery.thumbnail_url}
                        alt={gallery.title}
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${typeColors[gallery.type] || 'from-purple-600 to-pink-600'}`} />
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
                            <Link href="/galeri" className="hover:text-white transition-colors">Galeri</Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-white truncate max-w-[200px]">{gallery.title}</span>
                        </nav>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Badge
                                variant="default"
                                className="bg-white/10 backdrop-blur-sm text-white border-white/20"
                            >
                                <Images className="w-3.5 h-3.5 mr-1" />
                                {typeLabel[gallery.type]}
                            </Badge>
                            {gallery.is_featured && (
                                <Badge
                                    variant="default"
                                    className="bg-yellow-500/20 backdrop-blur-sm text-yellow-300 border-yellow-500/30"
                                >
                                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                                    Unggulan
                                </Badge>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-4xl leading-tight">
                            {gallery.title}
                        </h1>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/80">
                            {gallery.event_date && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {format(new Date(gallery.event_date), 'dd MMMM yyyy', {
                                            locale: id,
                                        })}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                <span>{gallery.items_count} Foto/Video</span>
                            </div>
                        </div>

                        {/* Description */}
                        {gallery.description && (
                            <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-3xl">
                                {gallery.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Wave Divider */}
                <Waves
                    color="fill-white dark:fill-slate-950"
                    position="bottom"
                    className="absolute bottom-0 z-20"
                />
            </div>

            {/* Gallery Content */}
            <Section background="white" padding="large" className="relative z-10">
                <div className="max-w-7xl mx-auto">
                    {images.length > 0 ? (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-4 md:p-6 lg:p-8 -mt-16 relative z-30">
                            <Lightbox images={images} galleryTitle={gallery.title} />
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 md:p-12 text-center -mt-16 relative z-30">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <ImageIcon className="w-10 h-10 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                Belum Ada Media
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400">
                                Galeri ini belum memiliki foto atau video.
                            </p>
                        </div>
                    )}

                    {/* Related Galleries */}
                    {relatedGalleries.length > 0 && (
                        <div className="mt-16">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8">
                                Galeri <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Lainnya</span>
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relatedGalleries.map((g) => (
                                    <Link
                                        key={g.id}
                                        href={`/galeri/${g.slug}`}
                                        className="group bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-slate-800 dark:to-slate-700 relative overflow-hidden">
                                            {g.thumbnail_url ? (
                                                <Image
                                                    src={g.thumbnail_url}
                                                    alt={g.title}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Images className="w-12 h-12 text-purple-300 dark:text-slate-600" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs">
                                                <ImageIcon className="w-3 h-3" />
                                                <span>{g.items_count}</span>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-2">
                                                {g.title}
                                            </h3>
                                            {g.event_date && (
                                                <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>
                                                        {format(new Date(g.event_date), 'dd MMMM yyyy', {
                                                            locale: id,
                                                        })}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Back Button */}
                    <div className="mt-12 text-center">
                        <Link
                            href="/galeri"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-slate-700 dark:text-slate-200 hover:text-purple-700 dark:hover:text-purple-400 font-semibold rounded-full transition-all group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Kembali ke Galeri
                        </Link>
                    </div>
                </div>
            </Section>

            {/* Bottom Spacing */}
            <div className="h-8 md:h-12 bg-white dark:bg-slate-950 relative z-10" />
        </div>
    )
}
