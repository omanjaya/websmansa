'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui'

type Announcement = {
    id: number
    type: string
    attributes: {
        title: string
        slug: string
        content: string
        excerpt?: string
        type: string
        priority: number
        is_featured: boolean
        is_pinned: boolean
        published_at: string
        created_at: string
        updated_at: string
    }
}

interface DesktopViewProps {
    announcements: Announcement[]
    types: string[]
    typeColors: Record<string, any>
    typeLabels: Record<string, string>
    currentType?: string
}

const getBadgeVariant = (color: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    const variantMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
        primary: 'default',
        success: 'secondary',
        warning: 'outline',
        danger: 'destructive',
        info: 'default'
    }
    return variantMap[color] || 'default'
}

const getTypeIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
        general: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        academic: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        ),
        event: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        urgent: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
    }
    return icons[type] || icons.general
}

export function DesktopView({
    announcements,
    types,
    typeColors,
    typeLabels,
    currentType
}: DesktopViewProps) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
            {/* Hero Section - Enhanced */}
            <section className="relative -mt-16 lg:-mt-20 pt-28 lg:pt-32 pb-16 md:pb-24 hero-gradient overflow-hidden">
                {/* Decorative Elements */}
                <div className="hero-pattern" />
                <div className="decorative-grid" />
                <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-20" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

                <div className="relative container mx-auto px-4">
                    <div className="max-w-3xl">
                        <span className="text-primary-200 font-bold tracking-wider uppercase text-sm flex items-center gap-2 mb-4">
                            <span className="w-10 h-[2px] bg-primary-300"></span>
                            Informasi Resmi
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                            Pengumuman
                        </h1>
                        <p className="text-lg md:text-xl text-primary-100 max-w-2xl">
                            Informasi dan pengumuman terbaru dari SMA Negeri 1 Denpasar
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-8 md:py-16">
                <div className="container mx-auto px-4">
                    {/* Type Filter - Enhanced */}
                    <div className="mb-8 md:mb-12">
                        <div className="flex flex-wrap gap-2 md:gap-3">
                            <Link
                                href="/pengumuman"
                                className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-300 ${
                                    !currentType
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                                }`}
                            >
                                Semua
                            </Link>
                            {types.map((type) => (
                                <Link
                                    key={type}
                                    href={`/pengumuman?type=${type}`}
                                    className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-300 ${
                                        currentType === type
                                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                                            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                                    }`}
                                >
                                    {typeLabels[type]}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Announcements List - Enhanced */}
                    <div className="space-y-4 md:space-y-6">
                        {announcements.map((announcement) => (
                            <Link
                                key={announcement.id}
                                href={`/pengumuman/${announcement.attributes.slug}`}
                                className="group block bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-slate-800 hover:-translate-y-1"
                            >
                                <div className="flex flex-col md:flex-row">
                                    {/* Date Block */}
                                    <div className="hidden md:flex flex-shrink-0 w-32 bg-gradient-to-br from-primary-500 to-indigo-600 p-6 flex-col items-center justify-center text-white">
                                        <span className="text-4xl font-bold leading-none">
                                            {new Date(announcement.attributes.published_at).getDate()}
                                        </span>
                                        <span className="text-sm uppercase tracking-wider mt-1 opacity-90">
                                            {new Date(announcement.attributes.published_at).toLocaleDateString('id-ID', { month: 'short' })}
                                        </span>
                                        <span className="text-xs mt-1 opacity-75">
                                            {new Date(announcement.attributes.published_at).getFullYear()}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-5 md:p-8">
                                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3 md:mb-4">
                                            {/* Type Badge */}
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold ${
                                                announcement.attributes.type === 'urgent'
                                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                                    : announcement.attributes.type === 'academic'
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                    : announcement.attributes.type === 'event'
                                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                            }`}>
                                                {getTypeIcon(announcement.attributes.type)}
                                                {typeLabels[announcement.attributes.type]}
                                            </span>

                                            {/* Pinned Badge */}
                                            {announcement.attributes.is_pinned && (
                                                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-semibold rounded-full">
                                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                                                    </svg>
                                                    Disematkan
                                                </span>
                                            )}

                                            {/* Mobile Date */}
                                            <span className="md:hidden text-xs text-gray-500 dark:text-gray-400">
                                                {new Date(announcement.attributes.published_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        </div>

                                        <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
                                            {announcement.attributes.title}
                                        </h2>

                                        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base line-clamp-2 mb-4">
                                            {announcement.attributes.excerpt}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <span className="hidden md:block text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(announcement.attributes.published_at).toLocaleDateString('id-ID', {
                                                    weekday: 'long',
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                            <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                                                Baca Selengkapnya
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Empty State - Enhanced */}
                    {announcements.length === 0 && (
                        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800">
                            <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Tidak ada pengumuman
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                                Belum ada pengumuman untuk kategori ini. Silakan pilih kategori lain atau kembali lagi nanti.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Bottom Spacing */}
            <div className="h-12 md:h-20" />
        </div>
    )
}
