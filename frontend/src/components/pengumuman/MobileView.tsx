'use client'

import Link from 'next/link'
import { MobilePageHeader } from '@/components/mobile-shared/MobilePageHeader'
import { Megaphone, Pin, Calendar, ChevronRight } from 'lucide-react'

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

interface MobileViewProps {
    announcements: Announcement[]
    types: string[]
    typeLabels: Record<string, string>
    currentType?: string
}

const typeColors: Record<string, { bg: string; text: string }> = {
    general: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300' },
    academic: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
    event: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
    urgent: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
}

export function MobileView({
    announcements,
    types,
    typeLabels,
    currentType
}: MobileViewProps) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
            {/* Mobile Header - Orange gradient matching desktop */}
            <MobilePageHeader
                title="Pengumuman"
                subtitle="Informasi dan pengumuman terbaru dari SMA Negeri 1 Denpasar"
                label="Informasi Resmi"
                gradient="from-amber-500 via-orange-600 to-red-600"
            />

            {/* Type Filters */}
            <div className="px-4 -mt-4 mb-4">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <Link
                        href="/pengumuman"
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                            !currentType
                                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700'
                        }`}
                    >
                        Semua
                    </Link>
                    {types.map(type => (
                        <Link
                            key={type}
                            href={`/pengumuman?type=${type}`}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                                currentType === type
                                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700'
                            }`}
                        >
                            {typeLabels[type]}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Announcements List */}
            {announcements.length > 0 ? (
                <div className="px-4 space-y-3 mb-6">
                    {announcements.map((announcement) => {
                        const color = typeColors[announcement.attributes.type] || typeColors.general
                        return (
                            <Link
                                key={announcement.id}
                                href={`/pengumuman/${announcement.attributes.slug}`}
                                className="block bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-800 active:scale-[0.98] transition-transform"
                            >
                                {/* Header */}
                                <div className="flex items-start gap-3 mb-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                        announcement.attributes.type === 'urgent'
                                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                            : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                                    }`}>
                                        <Megaphone className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color.bg} ${color.text}`}>
                                                {typeLabels[announcement.attributes.type]}
                                            </span>
                                            {announcement.attributes.is_pinned && (
                                                <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-semibold flex items-center gap-1">
                                                    <Pin className="w-3 h-3" />
                                                    Disematkan
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2">
                                            {announcement.attributes.title}
                                        </h3>
                                    </div>
                                </div>

                                {/* Excerpt */}
                                {announcement.attributes.excerpt && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                                        {announcement.attributes.excerpt}
                                    </p>
                                )}

                                {/* Footer */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(announcement.attributes.published_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </div>
                                    <span className="text-orange-600 dark:text-orange-400 text-xs font-semibold flex items-center gap-0.5">
                                        Baca
                                        <ChevronRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            ) : (
                <div className="px-4 py-12 text-center">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Megaphone className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Tidak ada pengumuman</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Belum ada pengumuman untuk kategori ini.</p>
                </div>
            )}

            {/* Bottom Spacing for Navigation */}
            <div className="h-20" />
        </div>
    )
}
