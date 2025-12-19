'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Extra } from '@/lib/api'

interface DesktopViewProps {
    extras: Extra[]
    categories: string[]
    currentCategory?: string
}

const categoryLabels: Record<string, string> = {
    olahraga: 'Olahraga',
    seni: 'Seni & Budaya',
    akademik: 'Akademik',
    organisasi: 'Organisasi',
    keagamaan: 'Keagamaan',
    teknologi: 'Teknologi',
}

const categoryColors: Record<string, { bg: string; text: string; gradient: string }> = {
    olahraga: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', gradient: 'from-red-500 to-orange-500' },
    seni: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-400', gradient: 'from-pink-500 to-rose-500' },
    akademik: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', gradient: 'from-blue-500 to-indigo-500' },
    organisasi: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', gradient: 'from-purple-500 to-violet-500' },
    keagamaan: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', gradient: 'from-green-500 to-emerald-500' },
    teknologi: { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-600 dark:text-cyan-400', gradient: 'from-cyan-500 to-teal-500' },
}

export function DesktopView({ extras, categories: _categories, currentCategory }: DesktopViewProps) {
    const filteredExtras = currentCategory
        ? extras.filter((e) => e.attributes?.category === currentCategory)
        : extras

    const featuredExtras = filteredExtras.filter((e) => e.attributes?.is_featured)
    const regularExtras = filteredExtras.filter((e) => !e.attributes?.is_featured)

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
                            Kegiatan Siswa
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                            Ekstrakurikuler
                        </h1>
                        <p className="text-lg md:text-xl text-primary-100 max-w-2xl">
                            Kegiatan ekstrakurikuler untuk pengembangan minat dan bakat siswa SMA Negeri 1 Denpasar
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-8 md:py-16">
                <div className="container mx-auto px-4">
                    {/* Category Filter */}
                    <div className="mb-8 md:mb-12">
                        <div className="flex flex-wrap gap-2 md:gap-3">
                            <Link
                                href="/ekstrakurikuler"
                                className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-300 ${
                                    !currentCategory
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                                }`}
                            >
                                Semua
                            </Link>
                            {Object.entries(categoryLabels).map(([key, label]) => (
                                <Link
                                    key={key}
                                    href={`/ekstrakurikuler?category=${key}`}
                                    className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-300 ${
                                        currentCategory === key
                                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                                            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                                    }`}
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Featured Extras */}
                    {featuredExtras.length > 0 && !currentCategory && (
                        <div className="mb-12 md:mb-16">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8">
                                Ekskul Unggulan
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {featuredExtras.map((item) => {
                                    const color = categoryColors[item.attributes?.category] || categoryColors.olahraga
                                    return (
                                        <Link
                                            key={item.id}
                                            href={`/ekstrakurikuler/${item.attributes?.slug || item.slug}`}
                                            className="group relative bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-slate-800 hover:-translate-y-2"
                                        >
                                            {/* Image */}
                                            <div className="relative h-52 md:h-60 overflow-hidden">
                                                {item.attributes?.image ? (
                                                    <Image
                                                        src={item.attributes.image}
                                                        alt={item.attributes?.name || item.name || 'Ekstrakurikuler'}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                ) : (
                                                    <div className={`w-full h-full bg-gradient-to-br ${color.gradient} flex items-center justify-center`}>
                                                        <svg className="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                                {/* Category Badge */}
                                                <div className="absolute top-4 left-4">
                                                    <span className={`px-3 py-1.5 ${color.bg} ${color.text} text-xs font-bold rounded-full backdrop-blur shadow-lg`}>
                                                        {categoryLabels[item.attributes?.category] || item.attributes?.category}
                                                    </span>
                                                </div>

                                                {/* Member Count */}
                                                {item.attributes?.member_count && (
                                                    <div className="absolute top-4 right-4">
                                                        <span className="px-3 py-1.5 bg-white/90 dark:bg-slate-800/90 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-full backdrop-blur shadow-lg flex items-center gap-1">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                            </svg>
                                                            {item.attributes.member_count}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Content Overlay */}
                                                <div className="absolute bottom-0 left-0 right-0 p-5">
                                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-rose-300 transition-colors">
                                                        {item.attributes?.name || item.name}
                                                    </h3>
                                                    <p className="text-white/80 text-sm line-clamp-2">
                                                        {item.attributes?.short_description || item.attributes?.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Achievements */}
                                            {item.attributes?.achievements && item.attributes.achievements.length > 0 && (
                                                <div className="p-4 border-t border-gray-100 dark:border-slate-800">
                                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        <span className="font-medium truncate">{item.attributes.achievements[0]}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Regular Extras Grid */}
                    <div>
                        {!currentCategory && regularExtras.length > 0 && (
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8">
                                Semua Ekstrakurikuler
                            </h2>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {(currentCategory ? filteredExtras : regularExtras).map((item) => {
                                const color = categoryColors[item.attributes?.category] || categoryColors.olahraga
                                return (
                                    <Link
                                        key={item.id}
                                        href={`/ekstrakurikuler/${item.attributes?.slug || item.slug}`}
                                        className="group bg-white dark:bg-slate-900 rounded-xl md:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-800 hover:-translate-y-1"
                                    >
                                        {/* Image */}
                                        <div className="relative h-40 md:h-48 overflow-hidden">
                                            {item.attributes?.image ? (
                                                <Image
                                                    src={item.attributes.image}
                                                    alt={item.attributes?.name || item.name || 'Ekstrakurikuler'}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className={`w-full h-full bg-gradient-to-br ${color.gradient} flex items-center justify-center`}>
                                                    <svg className="w-12 h-12 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            )}

                                            {/* Category Badge */}
                                            <div className="absolute top-3 left-3">
                                                <span className={`px-2.5 py-1 ${color.bg} ${color.text} text-xs font-bold rounded-full backdrop-blur shadow`}>
                                                    {categoryLabels[item.attributes?.category] || item.attributes?.category}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="p-4 md:p-5">
                                            <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                                                {item.attributes?.name || item.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                                                {item.attributes?.short_description || item.attributes?.description}
                                            </p>

                                            {/* Meta */}
                                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                                                {item.attributes?.member_count && (
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                        {item.attributes.member_count} anggota
                                                    </span>
                                                )}
                                                {item.attributes?.schedule && (
                                                    <span className="flex items-center gap-1 truncate ml-2">
                                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span className="truncate">{item.attributes.schedule.split(',')[0]}</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    {/* Empty State */}
                    {filteredExtras.length === 0 && (
                        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800">
                            <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Tidak ada ekskul
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                                Belum ada ekstrakurikuler untuk kategori ini.
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
