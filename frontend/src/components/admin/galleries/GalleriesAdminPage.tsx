'use client'

import { AdminCRUDTable } from '@/components/admin/shared/AdminCRUDTable'
import { useGalleries, useDeleteGallery } from '@/hooks/admin/useGalleries'
import { galleryColumns } from './columns'
import { Image as ImageIcon, Calendar, MapPin, Star } from 'lucide-react'

export function GalleriesAdminPage() {
    const { data: galleries, isLoading, error, refetch } = useGalleries({ paginate: false })
    const deleteMutation = useDeleteGallery()

    return (
        <AdminCRUDTable
            // Data
            data={galleries || []}
            isLoading={isLoading}
            error={error}

            // Columns
            columns={galleryColumns}

            // Actions
            onDelete={async (id) => {
                await deleteMutation.mutateAsync(id)
                refetch()
            }}
            onBulkDelete={async (ids) => {
                await Promise.all(ids.map(id => deleteMutation.mutateAsync(id)))
                refetch()
            }}
            onRefresh={refetch}

            // URLs
            createUrl="/admin/galleries/create"
            detailUrl={(id) => `/admin/galleries/${id}`}
            editUrl={(id) => `/admin/galleries/${id}/edit`}

            // Search
            searchKey="attributes.title"
            searchPlaceholder="Cari judul galeri..."

            // Stats
            statsConfig={[
                {
                    label: 'Total Galeri',
                    value: (data) => data.length,
                    icon: <ImageIcon className="w-6 h-6" aria-hidden="true" />,
                    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
                },
                {
                    label: 'Event',
                    value: (data) => data.filter(g => g.attributes.type === 'event').length,
                    icon: <Calendar className="w-6 h-6" />,
                    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
                },
                {
                    label: 'Kegiatan',
                    value: (data) => data.filter(g => g.attributes.type === 'activity').length,
                    icon: <MapPin className="w-6 h-6" />,
                    color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
                },
                {
                    label: 'Unggulan',
                    value: (data) => data.filter(g => g.attributes.is_featured).length,
                    icon: <Star className="w-6 h-6" />,
                    color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
                },
            ]}

            // UI
            title="Manajemen Galeri"
            description="Kelola galeri foto dan video kegiatan sekolah"
            emptyMessage="Belum ada data galeri. Tambahkan galeri baru untuk memulai."

            // ID extractor
            getId={(item) => item.id}
        />
    )
}
