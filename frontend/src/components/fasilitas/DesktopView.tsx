'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facility } from '@/lib/api'

interface DesktopViewProps {
    facilities: Facility[]
    categories: string[]
    currentCategory?: string
}

const categoryLabels: Record<string, string> = {
    pembelajaran: 'Pembelajaran',
    olahraga: 'Olahraga',
    laboratorium: 'Laboratorium',
    pendukung: 'Pendukung',
    ibadah: 'Ibadah',
}

const categoryIcons: Record<string, JSX.Element> = {
    pembelajaran: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
    ),
    olahraga: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    ),
    laboratorium: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
    ),
    pendukung: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    ),
    ibadah: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    ),
}

export function DesktopView({ facilities, categories: _categories, currentCategory }: DesktopViewProps) {
    const filteredFacilities = currentCategory
        ? facilities.filter((f) => f.attributes?.category === currentCategory)
        : facilities

    // Group facilities by category for display
    const featuredFacilities = filteredFacilities.filter((f) => f.attributes?.is_featured)
    const regularFacilities = filteredFacilities.filter((f) => !f.attributes?.is_featured)

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
                            Sarana Prasarana
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                            Fasilitas
                        </h1>
                        <p className="text-lg md:text-xl text-primary-100 max-w-2xl">
                            Sarana dan prasarana modern SMA Negeri 1 Denpasar untuk mendukung proses pembelajaran
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
                                href="/fasilitas"
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
                                    href={`/fasilitas?category=${key}`}
                                    className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-300 flex items-center gap-2 ${
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

                    {/* Featured Facilities */}
                    {featuredFacilities.length > 0 && !currentCategory && (
                        <div className="mb-12 md:mb-16">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8">
                                Fasilitas Unggulan
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {featuredFacilities.slice(0, 2).map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/fasilitas/${item.attributes?.slug || item.slug}`}
                                        className="group relative bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-slate-800 hover:-translate-y-2"
                                    >
                                        {/* Image */}
                                        <div className="relative h-64 md:h-80 overflow-hidden">
                                            {item.attributes?.images?.[0] ? (
                                                <Image
                                                    src={item.attributes.images[0]}
                                                    alt={item.attributes?.name || item.name || 'Fasilitas'}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30 flex items-center justify-center">
                                                    {categoryIcons[item.attributes?.category] || (
                                                        <svg className="w-20 h-20 text-sky-300 dark:text-sky-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                        </svg>
                                                    )}
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                            {/* Category Badge */}
                                            <div className="absolute top-4 left-4">
                                                <span className="px-3 py-1.5 bg-sky-600 text-white text-xs font-bold rounded-full shadow-lg">
                                                    {categoryLabels[item.attributes?.category] || item.attributes?.category}
                                                </span>
                                            </div>

                                            {/* Content Overlay */}
                                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                                                    {item.attributes?.name || item.name}
                                                </h3>
                                                <p className="text-white/80 text-sm md:text-base line-clamp-2">
                                                    {item.attributes?.short_description || item.attributes?.description}
                                                </p>

                                                {/* Amenities */}
                                                {item.attributes?.amenities && item.attributes.amenities.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        {item.attributes.amenities.slice(0, 3).map((amenity: string, index: number) => (
                                                            <span key={index} className="px-2 py-1 bg-white/20 backdrop-blur text-white text-xs rounded-full">
                                                                {amenity}
                                                            </span>
                                                        ))}
                                                        {item.attributes.amenities.length > 3 && (
                                                            <span className="px-2 py-1 bg-white/20 backdrop-blur text-white text-xs rounded-full">
                                                                +{item.attributes.amenities.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Regular Facilities Grid */}
                    <div>
                        {!currentCategory && regularFacilities.length > 0 && (
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8">
                                Semua Fasilitas
                            </h2>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {(currentCategory ? filteredFacilities : regularFacilities).map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/fasilitas/${item.attributes?.slug || item.slug}`}
                                    className="group bg-white dark:bg-slate-900 rounded-xl md:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-800 hover:-translate-y-1"
                                >
                                    {/* Image */}
                                    <div className="relative h-44 md:h-52 overflow-hidden">
                                        {item.attributes?.images?.[0] ? (
                                            <Image
                                                src={item.attributes.images[0]}
                                                alt={item.attributes?.name || item.name || 'Fasilitas'}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                                                <div className="text-gray-300 dark:text-slate-600 scale-150">
                                                    {categoryIcons[item.attributes?.category] || (
                                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Category Badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className="px-2.5 py-1 bg-white/95 dark:bg-slate-800/95 backdrop-blur text-sky-600 dark:text-sky-400 text-xs font-bold rounded-full shadow">
                                                {categoryLabels[item.attributes?.category] || item.attributes?.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-4 md:p-5">
                                        <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                            {item.attributes?.name || item.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                                            {item.attributes?.short_description || item.attributes?.description}
                                        </p>

                                        {/* Capacity & Location */}
                                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                                            {item.attributes?.capacity && (
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    {item.attributes.capacity}
                                                </span>
                                            )}
                                            {item.attributes?.location && (
                                                <span className="flex items-center gap-1 truncate">
                                                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span className="truncate">{item.attributes.location}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Empty State */}
                    {filteredFacilities.length === 0 && (
                        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800">
                            <div className="w-20 h-20 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-sky-600 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Tidak ada fasilitas
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                                Belum ada fasilitas untuk kategori ini.
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
