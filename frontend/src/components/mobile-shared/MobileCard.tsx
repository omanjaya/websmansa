'use client'

import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Calendar, User, Eye, Heart, Clock } from 'lucide-react'

export interface MobileCardProps {
    variant: 'news' | 'announcement' | 'staff' | 'facility' | 'gallery' | 'extracurricular'
    title: string
    subtitle?: string
    description?: string
    image?: string
    badge?: string
    badgeColor?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
    href?: string
    onClick?: () => void
    metadata?: {
        date?: string
        author?: string
        views?: number
        likes?: number
        readTime?: number
        category?: string
    }
    index?: number
}

export const MobileCard = memo(function MobileCard({
    variant: _variant,
    title,
    subtitle,
    description,
    image,
    badge,
    badgeColor = 'blue',
    href,
    onClick,
    metadata,
    index = 0
}: MobileCardProps) {
    const badgeColors = useMemo(() => ({
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        yellow: 'bg-yellow-500',
        red: 'bg-red-500',
        purple: 'bg-purple-500'
    }), [])

    const content = (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden active:scale-95 transition-transform"
        >
            {/* Image Section */}
            {image && (
                <div className="relative h-40 bg-gray-200 dark:bg-slate-700">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover"
                        loading="lazy"
                    />
                    {badge && (
                        <div className="absolute top-3 right-3">
                            <span className={`px-2 py-1 ${badgeColors[badgeColor]} text-white text-xs font-medium rounded`}>
                                {badge}
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Content Section */}
            <div className="p-4">
                {!image && badge && (
                    <div className="mb-2">
                        <span className={`px-2 py-1 ${badgeColors[badgeColor]} text-white text-xs font-medium rounded`}>
                            {badge}
                        </span>
                    </div>
                )}

                {subtitle && (
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">
                        {subtitle}
                    </div>
                )}

                <h3 className="text-sm font-semibold mb-2 line-clamp-2 text-slate-900 dark:text-white">
                    {title}
                </h3>

                {description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {description}
                    </p>
                )}

                {/* Metadata */}
                {metadata && (
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        {metadata.date && (
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {metadata.date}
                            </span>
                        )}
                        {metadata.author && (
                            <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {metadata.author}
                            </span>
                        )}
                        {metadata.views !== undefined && (
                            <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {metadata.views}
                            </span>
                        )}
                        {metadata.likes !== undefined && (
                            <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                {metadata.likes}
                            </span>
                        )}
                        {metadata.readTime && (
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {metadata.readTime} min
                            </span>
                        )}
                        {metadata.category && (
                            <span className="text-blue-600 dark:text-blue-400 font-medium">
                                {metadata.category}
                            </span>
                        )}
                    </div>
                )}

                {/* Chevron for clickable cards */}
                {(href || onClick) && (
                    <div className="flex justify-end mt-2">
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                )}
            </div>
        </motion.div>
    )

    if (href) {
        return (
            <Link href={href}>
                {content}
            </Link>
        )
    }

    if (onClick) {
        return (
            <button onClick={onClick} className="w-full text-left">
                {content}
            </button>
        )
    }

    return content
})
