'use client'

import { AdminCRUDTable } from '@/components/admin/shared/AdminCRUDTable'
import { usePosts, useDeletePost } from '@/hooks/admin/usePosts'
import { postColumns } from './columns'
import { FileText, Star, Pin, Eye } from 'lucide-react'

export function PostsAdminPage() {
    const { data: posts, isLoading, error, refetch } = usePosts({ paginate: false })
    const deleteMutation = useDeletePost()

    return (
        <AdminCRUDTable
            // Data
            data={posts || []}
            isLoading={isLoading}
            error={error}

            // Columns
            columns={postColumns}

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
            createUrl="/admin/posts/create"
            detailUrl={(id) => `/admin/posts/${id}`}
            editUrl={(id) => `/admin/posts/${id}/edit`}

            // Search
            searchKey="attributes.title"
            searchPlaceholder="Cari judul post..."

            // Stats
            statsConfig={[
                {
                    label: 'Total Post',
                    value: (data) => data.length,
                    icon: <FileText className="w-6 h-6" />,
                    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
                },
                {
                    label: 'Featured',
                    value: (data) => data.filter(p => p.attributes.is_featured).length,
                    icon: <Star className="w-6 h-6" />,
                    color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
                },
                {
                    label: 'Pinned',
                    value: (data) => data.filter(p => p.attributes.is_pinned).length,
                    icon: <Pin className="w-6 h-6" />,
                    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
                },
                {
                    label: 'Total Views',
                    value: (data) => data.reduce((sum, p) => sum + p.attributes.views, 0).toLocaleString('id-ID'),
                    icon: <Eye className="w-6 h-6" />,
                    color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
                },
            ]}

            // UI
            title="Manajemen Informasi"
            description="Kelola informasi dan berita sekolah"
            emptyMessage="Belum ada data informasi. Tambahkan informasi baru untuk memulai."

            // ID extractor
            getId={(item) => item.id}
        />
    )
}
