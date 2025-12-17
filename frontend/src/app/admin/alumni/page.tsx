'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getAdminAlumni, deleteAlumni, toggleAlumniFeatured } from '@/lib/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Edit, Trash2, Star, GraduationCap } from 'lucide-react'
import { toast } from 'sonner'

const CATEGORIES = [
    { value: '', label: 'Semua Kategori' },
    { value: 'Kedokteran', label: 'Kedokteran' },
    { value: 'Entrepreneur', label: 'Entrepreneur' },
    { value: 'Diplomat', label: 'Diplomat' },
    { value: 'Teknologi', label: 'Teknologi' },
    { value: 'Seni', label: 'Seni' },
    { value: 'Olahraga', label: 'Olahraga' },
    { value: 'Akademisi', label: 'Akademisi' },
    { value: 'Lainnya', label: 'Lainnya' },
]

export default function AlumniPage() {
    const queryClient = useQueryClient()
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('')
    const [page, setPage] = useState(1)

    const { data, isLoading } = useQuery({
        queryKey: ['admin-alumni', page, search, category],
        queryFn: () => getAdminAlumni({ page, per_page: 10, search, category: category || undefined }),
    })

    const deleteMutation = useMutation({
        mutationFn: deleteAlumni,
        onSuccess: () => {
            toast.success('Alumni berhasil dihapus!')
            queryClient.invalidateQueries({ queryKey: ['admin-alumni'] })
        },
        onError: () => {
            toast.error('Gagal menghapus alumni')
        },
    })

    const toggleFeaturedMutation = useMutation({
        mutationFn: toggleAlumniFeatured,
        onSuccess: () => {
            toast.success('Status featured berhasil diubah!')
            queryClient.invalidateQueries({ queryKey: ['admin-alumni'] })
        },
        onError: () => {
            toast.error('Gagal mengubah status featured')
        },
    })

    const handleDelete = async (id: number, name: string) => {
        if (confirm(`Hapus alumni "${name}"?`)) {
            deleteMutation.mutate(id)
        }
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <GraduationCap className="w-8 h-8" />
                        Alumni
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Kelola data alumni untuk ditampilkan di carousel homepage
                    </p>
                </div>
                <Link
                    href="/admin/alumni/create"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Alumni
                </Link>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari alumni..."
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white"
                    />
                </div>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white"
                >
                    {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                            {cat.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                    Nama
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                    Tahun Lulus
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                    Kategori
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                    Pekerjaan
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                                    Featured
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : data?.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        Belum ada data alumni
                                    </td>
                                </tr>
                            ) : (
                                data?.data.map((alumni) => (
                                    <tr key={alumni.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {alumni.photo_url ? (
                                                    <img
                                                        src={alumni.photo_url}
                                                        alt={alumni.name}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                                        <span className="text-white font-bold">
                                                            {alumni.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {alumni.name}
                                                    </div>
                                                    {alumni.current_institution && (
                                                        <div className="text-sm text-gray-500">
                                                            {alumni.current_institution}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {alumni.graduation_year}
                                        </td>
                                        <td className="px-6 py-4">
                                            {alumni.category && (
                                                <span className="inline-block px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                    {alumni.category}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {alumni.current_occupation || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => toggleFeaturedMutation.mutate(alumni.id)}
                                                className={`p-2 rounded-lg transition-colors ${
                                                    alumni.is_featured
                                                        ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600'
                                                }`}
                                                title={alumni.is_featured ? 'Hapus dari featured' : 'Jadikan featured'}
                                            >
                                                <Star className={`w-5 h-5 ${alumni.is_featured ? 'fill-current' : ''}`} />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/alumni/${alumni.id}/edit`}
                                                    className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(alumni.id, alumni.name)}
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
                            Total {data.meta.total} alumni
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg disabled:opacity-50 dark:text-white"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage((p) => p + 1)}
                                disabled={page === data.meta.last_page}
                                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg disabled:opacity-50 dark:text-white"
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
