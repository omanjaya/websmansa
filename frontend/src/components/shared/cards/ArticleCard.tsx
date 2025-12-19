'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Clock, Eye, ArrowRight } from 'lucide-react'

interface ArticleCardProps {
    title: string
    excerpt?: string
    slug: string
    imageUrl?: string
    category?: string
    publishedAt: string
    readingTime?: number
    views?: number
    featured?: boolean
    variant?: 'default' | 'horizontal' | 'compact'
    index?: number
}

export function ArticleCard({
    title,
    excerpt,
    slug,
    imageUrl,
    category,
    publishedAt,
    readingTime,
    views,
    featured = false,
    variant = 'default',
    index = 0,
}: ArticleCardProps) {
    const formattedDate = new Date(publishedAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })

    if (variant === 'horizontal') {
        return (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
            >
                <Link
                    href={`/informasi/${slug}`}
                    className="group flex gap-4 md:gap-6 p-4 bg-white dark:bg-slate-800 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 hover:shadow-lg transition-all duration-300"
                >
                    {/* Image */}
                    <div className="relative w-24 h-24 md:w-40 md:h-32 flex-shrink-0 rounded-lg md:rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700">
                        {imageUrl ? (
                            <Image
                                src={imageUrl}
                                alt={title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 768px) 96px, 160px"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {title.charAt(0)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        {category && (
                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">
                                {category}
                            </span>
                        )}
                        <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {title}
                        </h3>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formattedDate}
                            </span>
                            {readingTime && (
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {readingTime} menit
                                </span>
                            )}
                        </div>
                    </div>
                </Link>
            </motion.div>
        )
    }

    if (variant === 'compact') {
        return (
            <Link
                href={`/informasi/${slug}`}
                className="group flex gap-3 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 -mx-2 px-2 rounded-lg transition-colors"
            >
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {title}
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        {formattedDate}
                    </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </Link>
        )
    }

    // Default variant
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * index }}
        >
            <Link
                href={`/informasi/${slug}`}
                className={`group block bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${featured ? 'md:col-span-2' : ''}`}
            >
                {/* Image */}
                <div className={`relative ${featured ? 'aspect-[2/1]' : 'aspect-[16/10]'} overflow-hidden bg-slate-100 dark:bg-slate-700`}>
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes={featured ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
                            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                                <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                                    {title.charAt(0)}
                                </span>
                            </div>
                        </div>
                    )}
                    {/* Category Badge */}
                    {category && (
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 text-xs font-semibold bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-blue-600 dark:text-blue-400 rounded-full">
                                {category}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 md:p-6">
                    <h3 className={`font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 ${featured ? 'text-xl md:text-2xl' : 'text-lg'}`}>
                        {title}
                    </h3>
                    {excerpt && (
                        <p className="mt-2 text-slate-600 dark:text-slate-400 line-clamp-2 text-sm">
                            {excerpt}
                        </p>
                    )}
                    <div className="flex items-center gap-4 mt-4 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {formattedDate}
                        </span>
                        {readingTime && (
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {readingTime} menit
                            </span>
                        )}
                        {views && (
                            <span className="flex items-center gap-1.5">
                                <Eye className="w-4 h-4" />
                                {views.toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
