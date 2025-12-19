'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Play, Image as ImageIcon } from 'lucide-react'

interface PhotoCardProps {
    title: string
    imageUrl: string
    type?: 'photo' | 'video'
    itemCount?: number
    onClick?: () => void
    index?: number
    aspectRatio?: 'square' | 'portrait' | 'landscape' | 'auto'
}

const aspectRatioVariants = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    auto: 'aspect-auto h-64',
}

export function PhotoCard({
    title,
    imageUrl,
    type = 'photo',
    itemCount,
    onClick,
    index = 0,
    aspectRatio = 'landscape',
}: PhotoCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 * (index % 6) }}
            className="group cursor-pointer"
            onClick={onClick}
        >
            <div className={`relative ${aspectRatioVariants[aspectRatio]} rounded-xl md:rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800`}>
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 33vw"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                {/* Video indicator */}
                {type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300">
                            <Play className="w-6 h-6 text-white fill-white ml-1" />
                        </div>
                    </div>
                )}

                {/* Item count */}
                {itemCount && itemCount > 1 && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-full">
                        <ImageIcon className="w-3.5 h-3.5 text-white" />
                        <span className="text-xs font-medium text-white">{itemCount}</span>
                    </div>
                )}

                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-semibold text-white text-sm md:text-base line-clamp-2 drop-shadow-lg group-hover:text-blue-200 transition-colors">
                        {title}
                    </h3>
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 ring-2 ring-white/0 group-hover:ring-white/30 rounded-xl md:rounded-2xl transition-all duration-300" />
            </div>
        </motion.div>
    )
}

// Simpler version for lightbox grid
interface PhotoThumbnailProps {
    imageUrl: string
    alt: string
    onClick?: () => void
    index?: number
    isActive?: boolean
}

export function PhotoThumbnail({
    imageUrl,
    alt,
    onClick,
    index = 0,
    isActive = false,
}: PhotoThumbnailProps) {
    return (
        <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05 * index }}
            onClick={onClick}
            className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-200 ${isActive
                    ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900'
                    : 'opacity-70 hover:opacity-100'
                }`}
        >
            <Image
                src={imageUrl}
                alt={alt}
                fill
                className="object-cover"
                sizes="80px"
            />
        </motion.button>
    )
}
