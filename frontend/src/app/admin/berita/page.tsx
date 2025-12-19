'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getAdminPosts, deletePost, Post } from '@/lib/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

export default function BeritaPage() {
    const queryClient = useQueryClient()
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)

    const { data, isLoading } = useQuery({
        queryKey: ['admin-posts', 'news', page, search],
        queryFn: () => getAdminPosts({ type: 'news', page, per_page: 10, search }),
    })

    const deleteMutation = useMutation({
        mutationFn: deletePost,
        onSuccess: () => {
            toast.success('Berita berhasil dihapus!')
            queryClient.invalidateQueries({ queryKey: ['admin-posts'] })
        },
        onError: () => {
            toast.error('Gagal menghapus berita')
        },
    })

    const handleDelete = async (id: number, title: string) => {
        if (confirm(`Hapus berita "${title}"?`)) {
            deleteMutation.mutate(id)
        }
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📰 Berita</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Kelola berita dan artikel sekolah
                    </p>
                </div>
                <Link
                    href="/admin/berita/create"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Berita
                </Link>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari berita..."
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                    Judul
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                    Tanggal
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : data?.data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        Belum ada berita
                                    </td>
                                </tr>
                            ) : (
                                data?.data.map((post: Post) => (
                                    <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {post.attributes.featured_image && (
                                                    <Image
                                                        src={post.attributes.featured_image}
                                                        alt={post.attributes.title}
                                                        width={64}
                                                        height={64}
                                                        className="w-16 h-16 rounded-lg object-cover"
                                                    />
                                                )}
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {post.attributes.title}
                                                    </div>
                                                    {post.attributes.is_featured && (
                                                        <span className="inline-block mt-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                                                            Featured
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-sm ${post.attributes.status === 'published'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                    }`}
                                            >
                                                {post.attributes.status === 'published' ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {post.attributes.published_at
                                                ? format(new Date(post.attributes.published_at), 'dd MMM yyyy', { locale: idLocale })
                                                : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/berita/${post.attributes.slug}`}
                                                    target="_blank"
                                                    className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                                    title="Lihat"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </Link>
                                                <Link
                                                    href={`/admin/berita/${post.id}/edit`}
                                                    className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(post.id, post.attributes.title)}
                                                    className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {data?.meta && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-slate-700">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Showing {data.meta.from || 0} to {data.meta.to || 0} of {data.meta.total} entries
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage((p) => p + 1)}
                                disabled={page === data.meta.last_page}
                                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
