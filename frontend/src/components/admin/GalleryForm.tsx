'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Calendar, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { type CreateGalleryData } from '@/lib/api'

interface GalleryFormProps {
    onSubmit: (data: CreateGalleryData) => void
    loading?: boolean
    initialData?: Partial<CreateGalleryData> & { thumbnail_url?: string }
    error?: string | null
}

export default function GalleryForm({
    onSubmit,
    loading = false,
    initialData,
    error,
}: GalleryFormProps) {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        type: initialData?.type || 'photo',
        event_date: initialData?.event_date || '',
        is_featured: initialData?.is_featured || false,
    })

    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
        initialData?.thumbnail_url || null
    )
    const [mediaFiles, setMediaFiles] = useState<File[]>([])
    const [mediaPreviews, setMediaPreviews] = useState<string[]>([])

    const thumbnailInputRef = useRef<HTMLInputElement>(null)
    const mediaInputRef = useRef<HTMLInputElement>(null)

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // For future: upload thumbnail via uploadMedia()
            const reader = new FileReader()
            reader.onloadend = () => {
                setThumbnailPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        setMediaFiles((prev) => [...prev, ...files])

        files.forEach((file) => {
            const reader = new FileReader()
            reader.onloadend = () => {
                setMediaPreviews((prev) => [...prev, reader.result as string])
            }
            reader.readAsDataURL(file)
        })
    }

    const removeMedia = (index: number) => {
        setMediaFiles((prev) => prev.filter((_, i) => i !== index))
        setMediaPreviews((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // For now, only submit the basic gallery data
        // File upload will be handled separately after gallery creation
        onSubmit({
            ...formData,
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-medium text-red-900">Gagal menyimpan galeri</p>
                        <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                </div>
            )}

            {/* Basic Info Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    Informasi Dasar
                </h2>

                <div className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Judul Galeri <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                            placeholder="Contoh: Kegiatan Pentas Seni 2024"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Deskripsi
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            rows={4}
                            placeholder="Deskripsi singkat tentang galeri ini..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Type & Event Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipe Galeri <span className="text-red-500">*</span>
                            </label>
                            <select
                                required
                                value={formData.type}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        type: e.target.value as 'photo' | 'video' | 'mixed',
                                    })
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="photo">📷 Foto</option>
                                <option value="video">🎥 Video</option>
                                <option value="mixed">🎬 Campuran</option>
                            </select>
                        </div>

                        {/* Event Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tanggal Acara
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="date"
                                    value={formData.event_date}
                                    onChange={(e) =>
                                        setFormData({ ...formData, event_date: e.target.value })
                                    }
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Featured Toggle */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_featured"
                            checked={formData.is_featured}
                            onChange={(e) =>
                                setFormData({ ...formData, is_featured: e.target.checked })
                            }
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
                            Tandai sebagai galeri unggulan
                        </label>
                    </div>
                </div>
            </div>

            {/* Thumbnail Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    Thumbnail Galeri
                </h2>

                <div>
                    <input
                        ref={thumbnailInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                    />

                    {thumbnailPreview ? (
                        <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-gray-200">
                            <Image
                                src={thumbnailPreview}
                                alt="Thumbnail preview"
                                fill
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setThumbnailPreview(null)
                                }}
                                className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => thumbnailInputRef.current?.click()}
                            className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 transition-colors flex flex-col items-center justify-center gap-4"
                        >
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-700">
                                    Klik untuk upload thumbnail
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    PNG, JPG hingga 5MB
                                </p>
                            </div>
                        </button>
                    )}
                </div>
            </div>

            {/* Media Upload Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Media Galeri ({mediaFiles.length})
                    </h2>
                    <button
                        type="button"
                        onClick={() => mediaInputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors"
                    >
                        <Upload className="w-4 h-4" />
                        Upload Media
                    </button>
                </div>

                <input
                    ref={mediaInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleMediaChange}
                    className="hidden"
                />

                {mediaFiles.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {mediaPreviews.map((preview, index) => (
                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 group">
                                <Image
                                    src={preview}
                                    alt={`Media ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeMedia(index)}
                                    aria-label="Remove media"
                                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                            Belum ada media. Klik tombol &quot;Upload Media&quot; untuk menambahkan.
                        </p>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4">
                <Link
                    href="/admin/galleries"
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                    Batal
                </Link>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Menyimpan...
                        </>
                    ) : (
                        <>
                            <Upload className="w-5 h-5" />
                            Simpan Galeri
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
