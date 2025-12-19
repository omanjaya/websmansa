'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trash2 } from 'lucide-react'
import GalleryForm from '@/components/admin/GalleryForm'
import { getAdminGallery, updateGallery, deleteGallery, type UpdateGalleryData, type Gallery } from '@/lib/api'

interface EditGalleryPageProps {
    params: {
        id: string
    }
}

export default function EditGalleryPage({ params }: EditGalleryPageProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [gallery, setGallery] = useState<Gallery | null>(null)
    const [fetchLoading, setFetchLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                setFetchLoading(true)
                setError(null)
                const response = await getAdminGallery(params.id)
                setGallery(response.data)
            } catch (err) {
                console.error('Error fetching gallery:', err)
                setError(err instanceof Error ? err.message : 'Gagal memuat data galeri')
            } finally {
                setFetchLoading(false)
            }
        }

        fetchGallery()
    }, [params.id])

    const handleSubmit = async (data: UpdateGalleryData) => {
        setLoading(true)
        setError(null)

        try {
            await updateGallery(params.id, data)

            // Show success message
            alert('Galeri berhasil diperbarui!')

            // Redirect to galleries list
            router.push('/admin/galleries')
        } catch (err) {
            console.error('Error updating gallery:', err)
            const errorMessage = err instanceof Error ? err.message : 'Gagal memperbarui galeri'
            setError(errorMessage)
            alert(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm(`Apakah Anda yakin ingin menghapus galeri "${gallery?.title}"?`)) {
            return
        }

        try {
            await deleteGallery(params.id)

            // Show success message
            alert('Galeri berhasil dihapus!')

            // Redirect to galleries list
            router.push('/admin/galleries')
        } catch (err) {
            console.error('Error deleting gallery:', err)
            alert(err instanceof Error ? err.message : 'Gagal menghapus galeri')
        }
    }

    if (fetchLoading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-gray-600">Memuat data galeri...</p>
            </div>
        )
    }

    if (!gallery) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Galeri tidak ditemukan</p>
                <Link
                    href="/admin/galleries"
                    className="mt-4 inline-block text-blue-600 hover:underline"
                >
                    Kembali ke daftar galeri
                </Link>
            </div>
        )
    }

    return (
        <div>
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/galleries"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Galeri</h1>
                        <p className="mt-2 text-gray-600">
                            Perbarui informasi galeri
                        </p>
                    </div>
                </div>

                {/* Delete Button */}
                <button
                    onClick={handleDelete}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
                >
                    <Trash2 className="w-5 h-5" />
                    Hapus Galeri
                </button>
            </div>

            {/* Form */}
            <GalleryForm
                onSubmit={handleSubmit}
                loading={loading}
                initialData={gallery}
                error={error}
            />
        </div>
    )
}
