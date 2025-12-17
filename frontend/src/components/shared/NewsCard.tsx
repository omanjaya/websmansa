'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NewsCardProps {
    title: string
    excerpt?: string
    image?: string
    category?: string
    date: string
    href: string
    variant?: 'default' | 'featured' | 'compact'
    className?: string
    index?: number
}

export function NewsCard({
    title,
    excerpt,
    image,
    category,
    date,
    href,
    variant = 'default',
    className,
    index = 0
}: NewsCardProps) {
    const formattedDate = new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })

    if (variant === 'featured') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={cn('group', className)}
            >
                <Link href={href} className="block news-card-editorial h-full">
                    <div className="news-image relative aspect-[16/10] bg-slate-100 dark:bg-slate-700">
                        {image ? (
                            <Image
                                src={image}
                                alt={title}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-12 h-12 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <div className="news-content">
                        {category && <span className="news-category">{category}</span>}
                        <h3 className="news-title">{title}</h3>
                        {excerpt && <p className="news-excerpt">{excerpt}</p>}
                        <div className="news-meta">
                            <Calendar className="w-4 h-4" />
                            <span>{formattedDate}</span>
                        </div>
                    </div>
                </Link>
            </motion.div>
        )
    }

    if (variant === 'compact') {
        return (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={cn('group', className)}
            >
                <Link
                    href={href}
                    className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300"
                >
                    <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 relative">
                        {image ? (
                            <Image
                                src={image}
                                alt={title}
                                fill
                                sizes="80px"
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {title}
                        </h4>
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
                            <Calendar className="w-3 h-3" />
                            <span>{formattedDate}</span>
                        </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0 self-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
            </motion.div>
        )
    }

    // Default variant
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn('group', className)}
        >
            <Link href={href} className="block editorial-card h-full">
                <div className="aspect-[16/10] relative overflow-hidden bg-slate-100 dark:bg-slate-700">
                    {image ? (
                        <Image
                            src={image}
                            alt={title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-12 h-12 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                    {category && (
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs font-medium text-blue-700 dark:text-blue-300 rounded-full">
                                {category}
                            </span>
                        </div>
                    )}
                </div>
                <div className="p-5 md:p-6">
                    <h3 className="font-display text-lg md:text-xl font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                        {title}
                    </h3>
                    {excerpt && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                            {excerpt}
                        </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                        <Calendar className="w-4 h-4" />
                        <span>{formattedDate}</span>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
