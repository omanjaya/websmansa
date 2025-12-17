'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MobilePageHeader } from '@/components/mobile-shared/MobilePageHeader'
import { Building, MapPin, Users } from 'lucide-react'

const categoryLabels: Record<string, string> = {
    pembelajaran: 'Pembelajaran',
    olahraga: 'Olahraga',
    laboratorium: 'Laboratorium',
    pendukung: 'Pendukung',
    ibadah: 'Ibadah',
}

export function MobileView({ facilities, categories, currentCategory }: any) {
    const filteredFacilities = currentCategory
        ? facilities.filter((f: any) => f.attributes?.category === currentCategory)
        : facilities

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
            {/* Mobile Header - Sky/Blue gradient matching desktop */}
            <MobilePageHeader
                title="Fasilitas"
                subtitle="Sarana dan prasarana modern SMA Negeri 1 Denpasar"
                label="Sarana Prasarana"
                gradient="from-sky-600 via-blue-700 to-indigo-800"
            />

            {/* Category Filters */}
            <div className="px-4 -mt-4 mb-4">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <Link
                        href="/fasilitas"
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                            !currentCategory
                                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700'
                        }`}
                    >
                        Semua
                    </Link>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                        <Link
                            key={key}
                            href={`/fasilitas?category=${key}`}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                                currentCategory === key
                                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700'
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Facilities Grid */}
            {filteredFacilities.length > 0 ? (
                <div className="px-4 mb-6">
                    <div className="grid grid-cols-2 gap-3">
                        {filteredFacilities.map((item: any) => (
                            <Link
                                key={item.id}
                                href={`/fasilitas/${item.attributes?.slug || item.slug}`}
                                className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-800 active:scale-[0.98] transition-transform"
                            >
                                {/* Image */}
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    {item.attributes?.images?.[0] ? (
                                        <Image
                                            src={item.attributes.images[0]}
                                            alt={item.attributes?.name || item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30 flex items-center justify-center">
                                            <Building className="w-10 h-10 text-sky-300 dark:text-sky-700" />
                                        </div>
                                    )}

                                    {/* Category Badge */}
                                    <div className="absolute top-2 left-2">
                                        <span className="px-2 py-1 bg-white/95 dark:bg-slate-800/95 text-sky-600 dark:text-sky-400 text-xs font-semibold rounded-full shadow">
                                            {categoryLabels[item.attributes?.category] || item.attributes?.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-3">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">
                                        {item.attributes?.name || item.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                                        {item.attributes?.short_description || item.attributes?.description}
                                    </p>

                                    {/* Meta */}
                                    <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                                        {item.attributes?.capacity && (
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                {item.attributes.capacity}
                                            </span>
                                        )}
                                        {item.attributes?.location && (
                                            <span className="flex items-center gap-1 truncate">
                                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">{item.attributes.location}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="px-4 py-12 text-center">
                    <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building className="w-8 h-8 text-sky-600 dark:text-sky-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Tidak ada fasilitas</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Belum ada fasilitas untuk kategori ini.</p>
                </div>
            )}

            {/* Bottom Spacing for Navigation */}
            <div className="h-20" />
        </div>
    )
}
