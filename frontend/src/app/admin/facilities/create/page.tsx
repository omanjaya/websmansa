'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { useCreateFacility } from '@/hooks/admin/useFacilities'

export default function CreateFacilityPage() {
    const router = useRouter()
    const createFacility = useCreateFacility()
    const [formData, setFormData] = useState({
        name: '',
        category: 'pembelajaran',
        description: '',
        capacity: '',
        location: '',
        facilities: '',
        rules: '',
        is_active: true,
        is_featured: false,
        is_bookable: false,
    })
    const [error, setError] = useState<string | null>(null)

    const categories = [
        { value: 'pembelajaran', label: 'Ruang Pembelajaran' },
        { value: 'laboratorium', label: 'Laboratorium' },
        { value: 'olahraga', label: 'Fasilitas Olahraga' },
        { value: 'pendukung', label: 'Fasilitas Pendukung' },
        { value: 'ibadah', label: 'Tempat Ibadah' },
        { value: 'auditorium', label: 'Aula' },
        { value: 'music', label: 'Ruang Musik' },
        { value: 'canteen', label: 'Kantin' },
        { value: 'worship', label: 'Tempat Ibadah' },
    ]

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        try {
            await createFacility.mutateAsync({
                ...formData,
                capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
            })
            router.push('/admin/facilities')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal menyimpan data')
        }
    }

    return (
        <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/admin/facilities"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold">Tambah Fasilitas</h1>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Fasilitas *
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kategori *
                    </label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deskripsi
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Kapasitas (orang)
                        </label>
                        <input
                            type="number"
                            value={formData.capacity}
                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Lokasi
                        </label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Contoh: Gedung A, Lantai 2"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">Aktif</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.is_featured}
                            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                            className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">Unggulan</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.is_bookable}
                            onChange={(e) => setFormData({ ...formData, is_bookable: e.target.checked })}
                            className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">Dapat Dipinjam</span>
                    </label>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={createFacility.isPending}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {createFacility.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        Simpan
                    </button>
                    <Link
                        href="/admin/facilities"
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    )
}
