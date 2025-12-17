'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getAdminAchievements, deleteAchievement, toggleAchievementFeatured, toggleAchievementActive } from '@/lib/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Edit, Trash2, Star, Award, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

const CATEGORIES = [
    { value: '', label: 'Semua Kategori' },
    { value: 'Akademik', label: 'Akademik' },
    { value: 'Olahraga', label: 'Olahraga' },
    { value: 'Seni', label: 'Seni' },
    { value: 'Teknologi', label: 'Teknologi' },
    { value: 'Bahasa', label: 'Bahasa' },
    { value: 'Kepemimpinan', label: 'Kepemimpinan' },
    { value: 'Sosial', label: 'Sosial' },
    { value: 'Lainnya', label: 'Lainnya' },
]

const LEVELS = [
    { value: '', label: 'Semua Level' },
    { value: 'school', label: 'Sekolah' },
    { value: 'regional', label: 'Regional' },
    { value: 'national', label: 'Nasional' },
    { value: 'international', label: 'Internasional' },
]

const MEDAL_LABELS: Record<string, string> = {
    gold: 'Emas',
    silver: 'Perak',
    bronze: 'Perunggu',
    winner: 'Juara',
    finalist: 'Finalis',
}

const LEVEL_LABELS: Record<string, string> = {
    school: 'Sekolah',
    regional: 'Regional',
    national: 'Nasional',
    international: 'Internasional',
}

export default function AchievementsPage() {
    const queryClient = useQueryClient()
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('')
    const [level, setLevel] = useState('')
    const [page, setPage] = useState(1)

    const { data, isLoading } = useQuery({
        queryKey: ['admin-achievements', page, search, category, level],
        queryFn: () => getAdminAchievements({
            page,
            per_page: 10,
            search,
            category: category || undefined,
            level: level || undefined,
        }),
    })

    const deleteMutation = useMutation({
        mutationFn: deleteAchievement,
        onSuccess: () => {
            toast.success('Prestasi berhasil dihapus!')
            queryClient.invalidateQueries({ queryKey: ['admin-achievements'] })
        },
        onError: () => {
            toast.error('Gagal menghapus prestasi')
        },
    })

    const toggleFeaturedMutation = useMutation({
        mutationFn: toggleAchievementFeatured,
        onSuccess: () => {
            toast.success('Status featured berhasil diubah!')
            queryClient.invalidateQueries({ queryKey: ['admin-achievements'] })
        },
        onError: () => {
            toast.error('Gagal mengubah status featured')
        },
    })

    const toggleActiveMutation = useMutation({
        mutationFn: toggleAchievementActive,
        onSuccess: () => {
            toast.success('Status aktif berhasil diubah!')
            queryClient.invalidateQueries({ queryKey: ['admin-achievements'] })
        },
        onError: () => {
            toast.error('Gagal mengubah status aktif')
        },
    })

    const handleDelete = async (id: number, title: string) => {
        if (confirm(`Hapus prestasi "${title}"?`)) {
            deleteMutation.mutate(id)
        }
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <Award className="w-8 h-8" />
                        Prestasi Carousel
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Kelola data prestasi untuk carousel homepage
                    </p>
                </div>
                <Link
                    href="/admin/achievements/create"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Prestasi
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
                        placeholder="Cari prestasi..."
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
                <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white"
                >
                    {LEVELS.map((lvl) => (
                        <option key={lvl.value} value={lvl.value}>
                            {lvl.label}
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
                                    Prestasi
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                    Kategori
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                    Level
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                    Medali
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                                    Status
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
                                        Belum ada data prestasi
                                    </td>
                                </tr>
                            ) : (
                                data?.data.map((achievement) => (
                                    <tr key={achievement.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {achievement.image_url ? (
                                                    <Image
                                                        src={achievement.image_url}
                                                        alt={achievement.title}
                                                        width={64}
                                                        height={64}
                                                        className="w-16 h-16 rounded-xl object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                                                        <Award className="w-8 h-8 text-white" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {achievement.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {achievement.year} - {achievement.organizer || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                {achievement.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {LEVEL_LABELS[achievement.level] || achievement.level}
                                        </td>
                                        <td className="px-6 py-4">
                                            {achievement.medal_type ? (
                                                <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                                                    achievement.medal_type === 'gold'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : achievement.medal_type === 'silver'
                                                        ? 'bg-gray-200 text-gray-800'
                                                        : achievement.medal_type === 'bronze'
                                                        ? 'bg-orange-100 text-orange-800'
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {MEDAL_LABELS[achievement.medal_type] || achievement.medal_type}
                                                    {achievement.rank && ` #${achievement.rank}`}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => toggleFeaturedMutation.mutate(achievement.id)}
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        achievement.is_featured
                                                            ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600'
                                                    }`}
                                                    title={achievement.is_featured ? 'Hapus dari featured' : 'Jadikan featured'}
                                                >
                                                    <Star className={`w-4 h-4 ${achievement.is_featured ? 'fill-current' : ''}`} />
                                                </button>
                                                <button
                                                    onClick={() => toggleActiveMutation.mutate(achievement.id)}
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        achievement.is_active
                                                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600'
                                                    }`}
                                                    title={achievement.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                >
                                                    {achievement.is_active ? (
                                                        <Eye className="w-4 h-4" />
                                                    ) : (
                                                        <EyeOff className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/achievements/${achievement.id}/edit`}
                                                    className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(achievement.id, achievement.title)}
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
                            Total {data.meta.total} prestasi
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
