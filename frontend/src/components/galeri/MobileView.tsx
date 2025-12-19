'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Gallery } from '@/lib/api'
import { MobilePageHeader } from '@/components/mobile-shared/MobilePageHeader'
import { MobileStats, MobileStat } from '@/components/mobile-shared/MobileStats'
import { Image as ImageIcon, Play, Calendar } from 'lucide-react'

interface MobileViewProps {
    galleries: Gallery[]
    stats: MobileStat[]
}

export function MobileView({ galleries, stats }: MobileViewProps) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
            {/* Mobile Header - Violet gradient matching desktop */}
            <MobilePageHeader
                title="Galeri Sekolah"
                subtitle="Dokumentasi kegiatan dan momen berharga di SMA Negeri 1 Denpasar"
                label="Dokumentasi"
                gradient="from-violet-600 via-purple-700 to-indigo-800"
            />

            {/* Stats */}
            <div className="px-4 -mt-4 mb-4">
                <MobileStats stats={stats} layout="4-col" />
            </div>

            {/* Gallery Grid */}
            {galleries.length > 0 ? (
                <div className="px-4 mb-6">
                    <div className="grid grid-cols-2 gap-3">
                        {galleries.map((gallery) => (
                            <Link
                                key={gallery.id}
                                href={`/galeri/${gallery.slug}`}
                                className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-800 active:scale-[0.98] transition-transform"
                            >
                                {/* Image */}
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    {(gallery.thumbnail_url || gallery.thumbnail) ? (
                                        <Image
                                            src={gallery.thumbnail_url || gallery.thumbnail || ''}
                                            alt={gallery.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center">
                                            <ImageIcon className="w-10 h-10 text-violet-300 dark:text-violet-700" />
                                        </div>
                                    )}

                                    {/* Type Badge */}
                                    <div className="absolute top-2 left-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                                            gallery.type === 'video'
                                                ? 'bg-purple-500 text-white'
                                                : 'bg-white/95 dark:bg-slate-800/95 text-violet-600 dark:text-violet-400'
                                        }`}>
                                            {gallery.type === 'video' ? (
                                                <>
                                                    <Play className="w-3 h-3" />
                                                    Video
                                                </>
                                            ) : (
                                                'Foto'
                                            )}
                                        </span>
                                    </div>

                                    {/* Photo Count */}
                                    {gallery.items_count && gallery.items_count > 0 && (
                                        <div className="absolute bottom-2 right-2">
                                            <span className="px-2 py-1 bg-black/60 backdrop-blur text-white text-xs rounded-full">
                                                {gallery.items_count} foto
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-3">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 mb-1">
                                        {gallery.title}
                                    </h3>
                                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(gallery.event_date || gallery.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="px-4 py-12 text-center">
                    <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ImageIcon className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Galeri Tidak Ditemukan</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Belum ada galeri yang ditambahkan</p>
                </div>
            )}

            {/* Bottom Spacing for Navigation */}
            <div className="h-20" />
        </div>
    )
}
