'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MobilePageHeader } from '@/components/mobile-shared/MobilePageHeader'
import { Smile, Users, Clock } from 'lucide-react'

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

export function MobileView({ extras, categories, currentCategory }: any) {
    const filteredExtras = currentCategory
        ? extras.filter((e: any) => e.attributes?.category === currentCategory)
        : extras

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
            {/* Mobile Header - Rose/Pink gradient matching desktop */}
            <MobilePageHeader
                title="Ekstrakurikuler"
                subtitle="Kegiatan ekstrakurikuler untuk pengembangan minat dan bakat siswa"
                label="Kegiatan Siswa"
                gradient="from-rose-500 via-pink-600 to-fuchsia-700"
            />

            {/* Category Filters */}
            <div className="px-4 -mt-4 mb-4">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <Link
                        href="/ekstrakurikuler"
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                            !currentCategory
                                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700'
                        }`}
                    >
                        Semua
                    </Link>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                        <Link
                            key={key}
                            href={`/ekstrakurikuler?category=${key}`}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                                currentCategory === key
                                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700'
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Extracurricular Grid */}
            {filteredExtras.length > 0 ? (
                <div className="px-4 mb-6">
                    <div className="grid grid-cols-2 gap-3">
                        {filteredExtras.map((item: any) => {
                            const color = categoryColors[item.attributes?.category] || categoryColors.olahraga
                            return (
                                <Link
                                    key={item.id}
                                    href={`/ekstrakurikuler/${item.attributes?.slug || item.slug}`}
                                    className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-800 active:scale-[0.98] transition-transform"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        {item.attributes?.image ? (
                                            <Image
                                                src={item.attributes.image}
                                                alt={item.attributes?.name || item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className={`w-full h-full bg-gradient-to-br ${color.gradient} flex items-center justify-center`}>
                                                <Smile className="w-10 h-10 text-white/80" />
                                            </div>
                                        )}

                                        {/* Category Badge */}
                                        <div className="absolute top-2 left-2">
                                            <span className={`px-2 py-1 ${color.bg} ${color.text} text-xs font-semibold rounded-full backdrop-blur shadow`}>
                                                {categoryLabels[item.attributes?.category] || item.attributes?.category}
                                            </span>
                                        </div>

                                        {/* Member Count */}
                                        {item.attributes?.member_count && (
                                            <div className="absolute bottom-2 right-2">
                                                <span className="px-2 py-1 bg-black/60 backdrop-blur text-white text-xs rounded-full flex items-center gap-1">
                                                    <Users className="w-3 h-3" />
                                                    {item.attributes.member_count}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-3">
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">
                                            {item.attributes?.name || item.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                                            {item.attributes?.short_description || item.attributes?.description}
                                        </p>

                                        {/* Schedule */}
                                        {item.attributes?.schedule && (
                                            <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                <span className="truncate">{item.attributes.schedule.split(',')[0]}</span>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            ) : (
                <div className="px-4 py-12 text-center">
                    <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Smile className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Tidak ada ekskul</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Belum ada ekstrakurikuler untuk kategori ini.</p>
                </div>
            )}

            {/* Bottom Spacing for Navigation */}
            <div className="h-20" />
        </div>
    )
}
