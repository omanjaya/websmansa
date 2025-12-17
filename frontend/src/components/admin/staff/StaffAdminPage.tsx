'use client'

import { AdminCRUDTable } from '@/components/admin/shared/AdminCRUDTable'
import { useStaff, useDeleteStaff } from '@/hooks/admin/useStaff'
import { staffColumns } from './columns'
import { Users, UserCheck, Award, UserX } from 'lucide-react'

export function StaffAdminPage() {
    const { data: staff, isLoading, error, refetch } = useStaff({ paginate: false })
    const deleteMutation = useDeleteStaff()

    return (
        <AdminCRUDTable
            // Data
            data={staff || []}
            isLoading={isLoading}
            error={error}

            // Columns
            columns={staffColumns}

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
            createUrl="/admin/staff/create"
            detailUrl={(id) => `/admin/staff/${id}`}
            editUrl={(id) => `/admin/staff/${id}/edit`}

            // Search
            searchKey="attributes.name"
            searchPlaceholder="Cari nama staff..."

            // Stats
            statsConfig={[
                {
                    label: 'Total Staff',
                    value: (data) => data.length,
                    icon: <Users className="w-6 h-6" />,
                    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
                },
                {
                    label: 'Guru',
                    value: (data) => data.filter(s => s.attributes.type === 'teacher').length,
                    icon: <UserCheck className="w-6 h-6" />,
                    color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
                },
                {
                    label: 'Staff Aktif',
                    value: (data) => data.filter(s => s.attributes.is_active).length,
                    icon: <Award className="w-6 h-6" />,
                    color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
                },
                {
                    label: 'Nonaktif',
                    value: (data) => data.filter(s => !s.attributes.is_active).length,
                    icon: <UserX className="w-6 h-6" />,
                    color: 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400',
                },
            ]}

            // UI
            title="Manajemen Staff"
            description="Kelola data staff dan guru sekolah"
            emptyMessage="Belum ada data staff. Tambahkan staff baru untuk memulai."

            // ID extractor
            getId={(item) => item.id}
        />
    )
}
