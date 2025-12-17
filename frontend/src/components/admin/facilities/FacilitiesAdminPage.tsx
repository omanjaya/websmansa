'use client'

import { AdminCRUDTable } from '@/components/admin/shared/AdminCRUDTable'
import { useFacilities, useDeleteFacility } from '@/hooks/admin/useFacilities'
import { facilityColumns } from './columns'
import { Building2, Star, Calendar, CheckCircle } from 'lucide-react'

export function FacilitiesAdminPage() {
    const { data: facilities, isLoading, error, refetch } = useFacilities({ paginate: false })
    const deleteMutation = useDeleteFacility()

    return (
        <AdminCRUDTable
            // Data
            data={facilities || []}
            isLoading={isLoading}
            error={error}

            // Columns
            columns={facilityColumns}

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
            createUrl="/admin/facilities/create"
            detailUrl={(id) => `/admin/facilities/${id}`}
            editUrl={(id) => `/admin/facilities/${id}/edit`}

            // Search
            searchKey="attributes.name"
            searchPlaceholder="Cari nama fasilitas..."

            // Stats
            statsConfig={[
                {
                    label: 'Total Fasilitas',
                    value: (data) => data.length,
                    icon: <Building2 className="w-6 h-6" />,
                    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
                },
                {
                    label: 'Aktif',
                    value: (data) => data.filter(f => f.attributes.is_active).length,
                    icon: <CheckCircle className="w-6 h-6" />,
                    color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
                },
                {
                    label: 'Bisa Dipesan',
                    value: (data) => data.filter(f => f.attributes.is_bookable).length,
                    icon: <Calendar className="w-6 h-6" />,
                    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
                },
                {
                    label: 'Featured',
                    value: (data) => data.filter(f => f.attributes.is_featured).length,
                    icon: <Star className="w-6 h-6" />,
                    color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
                },
            ]}

            // UI
            title="Manajemen Fasilitas"
            description="Kelola fasilitas dan sarana prasarana sekolah"
            emptyMessage="Belum ada data fasilitas. Tambahkan fasilitas baru untuk memulai."

            // ID extractor
            getId={(item) => item.id}
        />
    )
}
