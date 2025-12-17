import Image from 'next/image'
import type { Column } from '@/components/admin/shared/AdminCRUDTable'
import type { Gallery } from '@/hooks/admin/useGalleries'

export const galleryColumns: Column<Gallery>[] = [
    {
        key: 'thumbnail',
        label: 'Thumbnail',
        width: '100px',
        render: (gallery) => (
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-slate-700">
                {gallery.attributes.thumbnail ? (
                    <Image
                        src={gallery.attributes.thumbnail}
                        alt={gallery.attributes.title}
                        width={64}
                        height={64}
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>
        ),
    },
    {
        key: 'title',
        label: 'Judul',
        render: (gallery) => (
            <div>
                <div className="font-medium text-gray-900 dark:text-white">
                    {gallery.attributes.title}
                </div>
                {gallery.attributes.description && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
                        {gallery.attributes.description}
                    </div>
                )}
            </div>
        ),
    },
    {
        key: 'type',
        label: 'Tipe',
        render: (gallery) => {
            const typeLabels: Record<string, string> = {
                event: 'Event',
                activity: 'Kegiatan',
                facility: 'Fasilitas',
                achievement: 'Prestasi',
            }
            const typeColors: Record<string, string> = {
                event: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
                activity: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
                facility: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
                achievement: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
            }
            return (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeColors[gallery.attributes.type] || 'bg-gray-100 text-gray-700'}`}>
                    {typeLabels[gallery.attributes.type] || gallery.attributes.type}
                </span>
            )
        },
    },
    {
        key: 'date',
        label: 'Tanggal',
        render: (gallery) => {
            if (!gallery.attributes.date) return '-'
            return new Date(gallery.attributes.date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            })
        },
    },
    {
        key: 'location',
        label: 'Lokasi',
        render: (gallery) => gallery.attributes.location || '-',
    },
    {
        key: 'media_count',
        label: 'Media',
        render: (gallery) => (
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{gallery.attributes.media_count || 0}</span>
            </div>
        ),
    },
    {
        key: 'status',
        label: 'Status',
        render: (gallery) => (
            <div className="flex items-center gap-2">
                {gallery.attributes.is_featured && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                        Unggulan
                    </span>
                )}
            </div>
        ),
    },
]
