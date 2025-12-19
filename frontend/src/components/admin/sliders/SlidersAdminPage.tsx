'use client'

import { AdminCRUDTable } from '@/components/admin/shared/AdminCRUDTable'
import { useSliders, useDeleteSlider } from '@/hooks/admin/useSliders'
import { sliderColumns } from './columns'
import { Image as ImageIcon, CheckCircle, XCircle, ArrowUpDown } from 'lucide-react'

export function SlidersAdminPage() {
    const { data: sliders, isLoading, error, refetch } = useSliders({ paginate: false })
    const deleteMutation = useDeleteSlider()

    return (
        <AdminCRUDTable
            // Data
            data={sliders || []}
            isLoading={isLoading}
            error={error}

            // Columns
            columns={sliderColumns}

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
            createUrl="/admin/sliders/create"
            detailUrl={(id) => `/admin/sliders/${id}`}
            editUrl={(id) => `/admin/sliders/${id}/edit`}

            // Search
            searchKey="attributes.title"
            searchPlaceholder="Cari judul slider..."

            // Stats
            statsConfig={[
                {
                    label: 'Total Slider',
                    value: (data) => data.length,
                    icon: <ImageIcon className="w-6 h-6" aria-hidden="true" />,
                    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
                },
                {
                    label: 'Aktif',
                    value: (data) => data.filter(s => s.attributes.is_active).length,
                    icon: <CheckCircle className="w-6 h-6" />,
                    color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
                },
                {
                    label: 'Nonaktif',
                    value: (data) => data.filter(s => !s.attributes.is_active).length,
                    icon: <XCircle className="w-6 h-6" />,
                    color: 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400',
                },
                {
                    label: 'Dengan Tombol',
                    value: (data) => data.filter(s => s.attributes.button_text).length,
                    icon: <ArrowUpDown className="w-6 h-6" />,
                    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
                },
            ]}

            // UI
            title="Manajemen Slider"
            description="Kelola slider hero di halaman beranda"
            emptyMessage="Belum ada data slider. Tambahkan slider baru untuk memulai."

            // ID extractor
            getId={(item) => item.id}
        />
    )
}
