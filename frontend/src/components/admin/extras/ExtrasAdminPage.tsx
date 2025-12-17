'use client'

import { AdminCRUDTable } from '@/components/admin/shared/AdminCRUDTable'
import { useExtras, useDeleteExtra } from '@/hooks/admin/useExtras'
import { extraColumns } from './columns'
import { Dumbbell, Star, Users, CheckCircle } from 'lucide-react'

export function ExtrasAdminPage() {
    const { data: extras, isLoading, error, refetch } = useExtras({ paginate: false })
    const deleteMutation = useDeleteExtra()

    return (
        <AdminCRUDTable
            // Data
            data={extras || []}
            isLoading={isLoading}
            error={error}

            // Columns
            columns={extraColumns}

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
            createUrl="/admin/extras/create"
            detailUrl={(id) => `/admin/extras/${id}`}
            editUrl={(id) => `/admin/extras/${id}/edit`}

            // Search
            searchKey="attributes.name"
            searchPlaceholder="Cari nama ekstrakurikuler..."

            // Stats
            statsConfig={[
                {
                    label: 'Total Ekskul',
                    value: (data) => data.length,
                    icon: <Dumbbell className="w-6 h-6" />,
                    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
                },
                {
                    label: 'Aktif',
                    value: (data) => data.filter(e => e.attributes.is_active).length,
                    icon: <CheckCircle className="w-6 h-6" />,
                    color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
                },
                {
                    label: 'Featured',
                    value: (data) => data.filter(e => e.attributes.is_featured).length,
                    icon: <Star className="w-6 h-6" />,
                    color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
                },
                {
                    label: 'Total Anggota',
                    value: (data) => data.reduce((sum, e) => sum + e.attributes.member_count, 0).toLocaleString('id-ID'),
                    icon: <Users className="w-6 h-6" />,
                    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
                },
            ]}

            // UI
            title="Manajemen Ekstrakurikuler"
            description="Kelola ekstrakurikuler dan kegiatan siswa"
            emptyMessage="Belum ada data ekstrakurikuler. Tambahkan ekstrakurikuler baru untuk memulai."

            // ID extractor
            getId={(item) => item.id}
        />
    )
}
