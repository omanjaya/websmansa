'use client'

import { memo, useMemo } from 'react'
import { Gallery } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Image as ImageIcon, Star } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface GalleryCardProps {
    gallery: Gallery
    className?: string
}

const GalleryCard = memo(function GalleryCard({ gallery, className }: GalleryCardProps) {
    const typeIcons = useMemo(() => ({
        photo: '📷',
        video: '🎥',
        mixed: '🎬',
    }), [])

    const typeLabels = useMemo(() => ({
        photo: 'Foto',
        video: 'Video',
        mixed: 'Campuran',
    }), [])

    return (
        <Link href={`/galeri/${gallery.slug}`}>
            <div
                className={cn(
                    'group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1',
                    className
                )}
            >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    {gallery.thumbnail_url ? (
                        <Image
                            src={gallery.thumbnail_url}
                            alt={gallery.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            loading="lazy"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <ImageIcon className="w-16 h-16 text-gray-400" />
                        </div>
                    )}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Featured Badge */}
                    {gallery.is_featured && (
                        <div className="absolute top-4 right-4 px-3 py-1.5 bg-yellow-500 text-white rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                            <Star className="w-3 h-3 fill-current" />
                            Unggulan
                        </div>
                    )}

                    {/* Type Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                        <span>{typeIcons[gallery.type]}</span>
                        <span>{typeLabels[gallery.type]}</span>
                    </div>

                    {/* Items Count */}
                    <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white rounded-full text-xs font-medium">
                        {gallery.items_count} item
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {gallery.title}
                    </h3>

                    {/* Description */}
                    {gallery.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {gallery.description}
                        </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        {gallery.event_date && (
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>
                                    {format(new Date(gallery.event_date), 'dd MMM yyyy', {
                                        locale: id,
                                    })}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500 rounded-2xl transition-colors duration-300 pointer-events-none" />
            </div>
        </Link>
    )
})

export default GalleryCard
