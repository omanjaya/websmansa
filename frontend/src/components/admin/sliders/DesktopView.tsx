'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Search, Edit, Trash2, Eye, GripVertical, Image as ImageIcon } from 'lucide-react'

interface Slider {
    id: number
    title: string
    subtitle?: string
    image_url: string
    link?: string
    button_text?: string
    order: number
    is_active: boolean
}

export function DesktopView() {
    const [sliders, setSliders] = useState<Slider[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        // TODO: Fetch sliders from API
        setLoading(false)
    }, [])

    const filteredSliders = sliders
        .filter((slider) =>
            slider.title.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => a.order - b.order)

    return (
        <div>
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kelola Slider</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Manage hero slider di halaman beranda
                    </p>
                </div>
                <Link
                    href="/admin/sliders/create"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Slider
                </Link>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="search"
                        placeholder="Cari slider..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                    />
                </div>
            </div>

            {/* Sliders List */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Memuat slider...</p>
                </div>
            ) : filteredSliders.length > 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                    <div className="divide-y divide-gray-200 dark:divide-slate-700">
                        {filteredSliders.map((slider) => (
                            <div
                                key={slider.id}
                                className="p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                            >
                                <div className="flex items-center gap-6">
                                    {/* Drag Handle */}
                                    <button className="cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                        <GripVertical className="w-5 h-5" />
                                    </button>

                                    {/* Order Badge */}
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg flex items-center justify-center font-bold">
                                        {slider.order}
                                    </div>

                                    {/* Image */}
                                    <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-700 flex-shrink-0">
                                        <Image
                                            src={slider.image_url}
                                            alt={slider.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate">
                                                {slider.title}
                                            </h3>
                                            {slider.is_active ? (
                                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 text-xs font-semibold rounded-full">
                                                    Aktif
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full">
                                                    Nonaktif
                                                </span>
                                            )}
                                        </div>
                                        {slider.subtitle && (
                                            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-1">
                                                {slider.subtitle}
                                            </p>
                                        )}
                                        {slider.link && (
                                            <p className="text-blue-600 dark:text-blue-400 text-xs mt-1 truncate">
                                                {slider.link}
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {slider.link && (
                                            <Link
                                                href={slider.link}
                                                target="_blank"
                                                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                                title="Preview"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </Link>
                                        )}
                                        <Link
                                            href={`/admin/sliders/${slider.id}/edit`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </Link>
                                        <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg transition-colors">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {search ? 'Slider tidak ditemukan' : 'Belum ada slider'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {search
                            ? `Tidak ada slider yang cocok dengan "${search}"`
                            : 'Mulai dengan membuat slider pertama Anda'}
                    </p>
                    {!search && (
                        <Link
                            href="/admin/sliders/create"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Tambah Slider Pertama
                        </Link>
                    )}
                </div>
            )}

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                    💡 <strong>Tips:</strong> Gunakan drag handle (☰) untuk mengubah urutan slider. Slider dengan urutan lebih kecil akan ditampilkan terlebih dahulu.
                </p>
            </div>
        </div>
    )
}
