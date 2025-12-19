'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { createPost, getCategories, type Category } from '@/lib/api'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'

export default function CreateBeritaPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [content, setContent] = useState('')
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategories, setSelectedCategories] = useState<number[]>([])
    const [loadingCategories, setLoadingCategories] = useState(true)

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await getCategories()
                if (response.data) {
                    setCategories(response.data)
                }
            } catch (error) {
                console.error('Error fetching categories:', error)
            } finally {
                setLoadingCategories(false)
            }
        }
        fetchCategories()
    }, [])

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

    const handleCategoryToggle = (categoryId: number) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        )
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        try {
            const formData = new FormData(e.currentTarget)
            formData.set('content', content)
            formData.set('type', 'news')

            // Remove the old categories field and add as array
            formData.delete('categories')
            selectedCategories.forEach(catId => {
                formData.append('categories[]', catId.toString())
            })

            await createPost(formData)

            toast.success('Berita berhasil dibuat!')
            router.push('/admin/berita')
        } catch (error: unknown) {
            console.error('Error creating berita:', error)
            toast.error(getErrorMessage(error))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/berita"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tambah Berita Baru</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Buat artikel berita dengan editor lengkap
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold mb-6 dark:text-white">Informasi Berita</h2>

                    <div className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Judul Berita <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="title"
                                type="text"
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Masukkan judul berita..."
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
                                placeholder="Ringkasan singkat berita (opsional, akan auto-generate dari konten)"
                            />
                        </div>

                        {/* Content - Rich Text Editor */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Konten Berita <span className="text-red-500">*</span>
                            </label>
                            <RichTextEditor
                                content={content}
                                onChange={setContent}
                                placeholder="Tulis konten berita di sini... Gunakan toolbar untuk formatting, menambah gambar, link, dan video."
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
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full max-w-md h-48 object-cover rounded-lg border"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Categories - Checkboxes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Kategori
                            </label>
                            {loadingCategories ? (
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Memuat kategori...</span>
                                </div>
                            ) : categories.length === 0 ? (
                                <p className="text-sm text-gray-500">Belum ada kategori. Silakan buat kategori terlebih dahulu.</p>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {categories.map((category) => (
                                        <label
                                            key={category.id}
                                            className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${selectedCategories.includes(category.id)
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                    : 'border-gray-200 dark:border-slate-600 hover:border-blue-300'
                                                }`}
                                        >
                                            <Checkbox
                                                checked={selectedCategories.includes(category.id)}
                                                onCheckedChange={() => handleCategoryToggle(category.id)}
                                            />
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {category.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                            {selectedCategories.length > 0 && (
                                <p className="mt-2 text-sm text-blue-600">
                                    {selectedCategories.length} kategori dipilih
                                </p>
                            )}
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
                                    Berita Utama (Featured)
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
                        href="/admin/berita"
                        className="px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        disabled={loading || !content}
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Menyimpan...' : 'Publish Berita'}
                    </button>
                </div>
            </form>
        </div>
    )
}
