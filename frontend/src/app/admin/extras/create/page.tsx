'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { useCreateExtra } from '@/hooks/admin/useExtras'

export default function CreateExtraPage() {
    const router = useRouter()
    const createExtra = useCreateExtra()
    const [formData, setFormData] = useState({
        name: '',
        category: 'olahraga',
        description: '',
        schedule: '',
        coach: '',
        is_active: true,
        is_featured: false,
    })
    const [error, setError] = useState<string | null>(null)

    const categories = [
        { value: 'olahraga', label: 'Olahraga' },
        { value: 'seni', label: 'Seni' },
        { value: 'akademik', label: 'Akademik' },
        { value: 'teknologi', label: 'Teknologi' },
        { value: 'keagamaan', label: 'Keagamaan' },
        { value: 'kepemimpinan', label: 'Kepemimpinan' },
        { value: 'sosial', label: 'Sosial' },
        { value: 'lainnya', label: 'Lainnya' },
    ]

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        try {
            await createExtra.mutateAsync(formData)
            router.push('/admin/extras')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal menyimpan data')
        }
    }

    return (
        <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/admin/extras"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Kembali ke daftar ekstrakurikuler"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold">Tambah Ekstrakurikuler</h1>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg" role="alert">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                <div>
                    <label htmlFor="extra-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Ekstrakurikuler *
                    </label>
                    <input
                        id="extra-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="Masukkan nama ekstrakurikuler"
                    />
                </div>

                <div>
                    <label htmlFor="extra-category" className="block text-sm font-medium text-gray-700 mb-1">
                        Kategori *
                    </label>
                    <select
                        id="extra-category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Pilih kategori ekstrakurikuler"
                    >
                        {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="extra-description" className="block text-sm font-medium text-gray-700 mb-1">
                        Deskripsi
                    </label>
                    <textarea
                        id="extra-description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        placeholder="Masukkan deskripsi ekstrakurikuler"
                    />
                </div>

                <div>
                    <label htmlFor="extra-schedule" className="block text-sm font-medium text-gray-700 mb-1">
                        Jadwal
                    </label>
                    <input
                        id="extra-schedule"
                        type="text"
                        value={formData.schedule}
                        onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Contoh: Senin & Kamis, 15:00 - 17:00"
                    />
                </div>

                <div>
                    <label htmlFor="extra-coach" className="block text-sm font-medium text-gray-700 mb-1">
                        Pembina
                    </label>
                    <input
                        id="extra-coach"
                        type="text"
                        value={formData.coach}
                        onChange={(e) => setFormData({ ...formData, coach: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Masukkan nama pembina"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <label htmlFor="extra-is-active" className="flex items-center gap-2 cursor-pointer">
                        <input
                            id="extra-is-active"
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">Aktif</span>
                    </label>
                    <label htmlFor="extra-is-featured" className="flex items-center gap-2 cursor-pointer">
                        <input
                            id="extra-is-featured"
                            type="checkbox"
                            checked={formData.is_featured}
                            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                            className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">Unggulan</span>
                    </label>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={createExtra.isPending}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {createExtra.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        Simpan
                    </button>
                    <Link
                        href="/admin/extras"
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    )
}
