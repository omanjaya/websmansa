'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { createPost } from '@/lib/api'
import { toast } from 'sonner'

export default function CreatePengumumanPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [content, setContent] = useState('')
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
            formData.set('content', content)
            formData.set('type', 'announcement')

            await createPost(formData)

            toast.success('Pengumuman berhasil dibuat!')
            router.push('/admin/pengumuman')
        } catch (error: any) {
            console.error('Error creating pengumuman:', error)
            toast.error(error.message || 'Gagal membuat pengumuman')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/pengumuman"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tambah Pengumuman Baru</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Buat artikel pengumuman dengan editor lengkap
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold mb-6 dark:text-white">Informasi Pengumuman</h2>

                    <div className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Judul Pengumuman <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="title"
                                type="text"
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Masukkan judul pengumuman..."
                            />
                        </div>

                        {/* Excerpt */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Ringkasan
                            </label>
                            <textarea
                                name="excerpt"
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                placeholder="Ringkasan singkat pengumuman (opsional, akan auto-generate dari konten)"
                            />
                        </div>

                        {/* Content - Rich Text Editor */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Konten Pengumuman <span className="text-red-500">*</span>
                            </label>
                            <RichTextEditor
                                content={content}
                                onChange={setContent}
                                placeholder="Tulis konten pengumuman di sini... Gunakan toolbar untuk formatting, menambah gambar, link, dan video."
                            />
                        </div>

                        {/* Featured Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Gambar Utama <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="featured_image"
                                type="file"
                                accept="image/*"
                                required
                                onChange={handleImageChange}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                📸 Auto-optimize: WebP conversion + 7 sizes
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

                        {/* Categories */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Kategori
                            </label>
                            <input
                                name="categories"
                                type="text"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Pisahkan dengan koma: Akademik, Olahraga, ..."
                            />
                        </div>

                        {/* Meta */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Tanggal Publish
                                </label>
                                <input
                                    name="published_at"
                                    type="datetime-local"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Flags */}
                        <div className="flex gap-6">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    name="is_featured"
                                    type="checkbox"
                                    value="1"
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Pengumuman Utama (Featured)
                                </span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    name="is_pinned"
                                    type="checkbox"
                                    value="1"
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Pin di Atas
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-4">
                    <Link
                        href="/admin/pengumuman"
                        className="px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        disabled={loading || !content}
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Menyimpan...' : 'Publish Pengumuman'}
                    </button>
                </div>
            </form>
        </div>
    )
}
