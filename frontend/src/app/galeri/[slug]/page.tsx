import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getGallery } from '@/lib/api'
import Lightbox from '@/components/gallery/Lightbox'
import { Calendar, Image as ImageIcon, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface GalleryDetailPageProps {
    params: {
        slug: string
    }
}

export async function generateMetadata({
    params,
}: GalleryDetailPageProps): Promise<Metadata> {
    try {
        const { data: gallery } = await getGallery(params.slug)

        return {
            title: `${gallery.title} - Galeri SMA Negeri 1 Surakarta`,
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
            title: 'Galeri Tidak Ditemukan',
        }
    }
}

export default async function GalleryDetailPage({
    params,
}: GalleryDetailPageProps) {
    let gallery

    try {
        const response = await getGallery(params.slug)
        gallery = response.data
    } catch {
        notFound()
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <Link
                        href="/galeri"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Galeri</span>
                    </Link>
                </div>
            </div>

            {/* Gallery Header */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl">
                        {/* Badge */}
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                                {typeLabel[gallery.type]}
                            </span>
                            {gallery.is_featured && (
                                <span className="px-3 py-1 bg-yellow-500/20 backdrop-blur-sm rounded-full text-sm font-medium">
                                    ⭐ Unggulan
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {gallery.title}
                        </h1>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-6 text-blue-100">
                            {gallery.event_date && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    <span>
                                        {format(new Date(gallery.event_date), 'dd MMMM yyyy', {
                                            locale: id,
                                        })}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <ImageIcon className="w-5 h-5" />
                                <span>{gallery.items_count} Foto/Video</span>
                            </div>
                        </div>

                        {/* Description */}
                        {gallery.description && (
                            <p className="mt-6 text-lg text-blue-100 leading-relaxed">
                                {gallery.description}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Gallery Content */}
            <section className="container mx-auto px-4 py-12">
                {images.length > 0 ? (
                    <Lightbox images={images} galleryTitle={gallery.title} />
                ) : (
                    <div className="text-center py-20">
                        <ImageIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            Belum Ada Media
                        </h3>
                        <p className="text-gray-500">
                            Galeri ini belum memiliki foto atau video.
                        </p>
                    </div>
                )}
            </section>

            {/* Related Galleries (Optional - can add later) */}
            {/* <section className="container mx-auto px-4 py-12 border-t">
        <h2 className="text-2xl font-bold mb-6">Galeri Lainnya</h2>
      </section> */}
        </div>
    )
}
