'use client'

import { AdminCRUDTable } from '@/components/admin/shared/AdminCRUDTable'
import { useAnnouncements, useDeleteAnnouncement } from '@/hooks/admin/useAnnouncements'
import { announcementColumns } from './columns'
import { Bell, Pin, AlertCircle, CheckCircle } from 'lucide-react'

export function AnnouncementsAdminPage() {
    const { data: announcements, isLoading, error, refetch } = useAnnouncements({ paginate: false })
    const deleteMutation = useDeleteAnnouncement()

    return (
        <AdminCRUDTable
            // Data
            data={announcements || []}
            isLoading={isLoading}
            error={error}

            // Columns
            columns={announcementColumns}

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
            createUrl="/admin/announcements/create"
            detailUrl={(id) => `/admin/announcements/${id}`}
            editUrl={(id) => `/admin/announcements/${id}/edit`}

            // Search
            searchKey="attributes.title"
            searchPlaceholder="Cari judul pengumuman..."

            // Stats
            statsConfig={[
                {
                    label: 'Total Pengumuman',
                    value: (data) => data.length,
                    icon: <Bell className="w-6 h-6" />,
                    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
                },
                {
                    label: 'Dipinkan',
                    value: (data) => data.filter(a => a.attributes.is_pinned).length,
                    icon: <Pin className="w-6 h-6" />,
                    color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
                },
                {
                    label: 'Urgent',
                    value: (data) => data.filter(a => a.attributes.priority === 'urgent').length,
                    icon: <AlertCircle className="w-6 h-6" />,
                    color: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
                },
                {
                    label: 'Aktif',
                    value: (data) => data.filter(a => a.attributes.is_active).length,
                    icon: <CheckCircle className="w-6 h-6" />,
                    color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
                },
            ]}

            // UI
            title="Manajemen Pengumuman"
            description="Kelola pengumuman dan informasi penting sekolah"
            emptyMessage="Belum ada data pengumuman. Tambahkan pengumuman baru untuk memulai."

            // ID extractor
            getId={(item) => item.id}
        />
    )
}
