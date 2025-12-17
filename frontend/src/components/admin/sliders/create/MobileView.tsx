'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createSlider } from '@/lib/api'
import { toast } from 'sonner'

export function MobileView() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        try {
            const formData = new FormData(e.currentTarget)

            // Validate image
            const image = formData.get('image') as File
            if (!image || image.size === 0) {
                toast.error('Gambar wajib diupload')
                setLoading(false)
                return
            }

            await createSlider(formData)

            toast.success('Slider berhasil dibuat!')
            router.push('/admin/sliders')
        } catch (error: any) {
            console.error('Error creating slider:', error)
            toast.error(error.message || 'Gagal membuat slider')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            {/* Page Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/sliders"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tambah Slider Baru</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Tambahkan slider untuk hero section (Auto-optimize WebP + Multi-size)
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold mb-6">Informasi Slider</h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Judul <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="title"
                                type="text"
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Judul slider"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Subtitle
                            </label>
                            <textarea
                                name="subtitle"
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                placeholder="Subtitle slider"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Link URL
                                </label>
                                <input
                                    name="link"
                                    type="url"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Teks Tombol
                                </label>
                                <input
                                    name="button_text"
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Selengkapnya"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Urutan
                                </label>
                                <input
                                    name="order"
                                    type="number"
                                    min="0"
                                    defaultValue="0"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex items-center h-full pt-8">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        name="is_active"
                                        type="checkbox"
                                        defaultChecked
                                        value="1"
                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Aktifkan slider
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Gambar <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="image"
                                type="file"
                                accept="image/*"
                                required
                                onChange={handleImageChange}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                📸 Auto-optimize: WebP conversion + 7 sizes (thumb to large)
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Rekomendasi: 1920x1080px, format JPG/PNG, maksimal 10MB
                            </p>

                            {imagePreview && (
                                <div className="mt-4">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full max-w-md h-48 object-cover rounded-lg border"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-4">
                    <Link
                        href="/admin/sliders"
                        className="px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Mengupload & Optimizing...' : 'Simpan Slider'}
                    </button>
                </div>
            </form>
        </div>
    )
}
