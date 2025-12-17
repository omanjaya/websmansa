'use client'

import { Gallery } from '@/lib/api'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import GalleryFilters from '@/components/gallery/GalleryFilters'
import { Suspense } from 'react'
import { Image } from 'lucide-react'

interface DesktopViewProps {
    galleries: Gallery[]
    stats: Array<{
        icon: any
        label: string
        value: number
        color: string
    }>
    meta: {
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
    search?: string
}

export function DesktopView({ galleries, stats, meta, search }: DesktopViewProps) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
            {/* Hero Section - Enhanced - extends behind header */}
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
                            Dokumentasi
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                            Galeri Sekolah
                        </h1>
                        <p className="text-lg md:text-xl text-primary-100 max-w-2xl mb-10">
                            Dokumentasi kegiatan dan momen berharga di SMA Negeri 1 Denpasar
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="glass-hero p-5 hover:bg-white/15 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/20 rounded-xl">
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-primary-200 text-sm">{stat.label}</p>
                                            <p className="text-3xl font-bold text-white">{stat.value}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-8 md:py-16">
                <div className="container mx-auto px-4">
                    {/* Filters */}
                    <Suspense fallback={
                        <div className="animate-pulse bg-gray-200 dark:bg-slate-800 h-12 rounded-xl mb-8" />
                    }>
                        <GalleryFilters />
                    </Suspense>

                    {/* Gallery Grid */}
                    <div className="mt-8">
                        {galleries.length > 0 ? (
                            <GalleryGrid galleries={galleries} pagination={meta} />
                        ) : (
                            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800">
                                <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Image className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Galeri Tidak Ditemukan
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                                    {search
                                        ? `Tidak ada galeri yang cocok dengan pencarian "${search}"`
                                        : 'Belum ada galeri yang ditambahkan'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Bottom Spacing */}
            <div className="h-12 md:h-20" />
        </div>
    )
}
