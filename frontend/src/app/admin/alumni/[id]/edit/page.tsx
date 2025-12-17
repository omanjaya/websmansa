'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { getAdminAlumniMember, updateAlumni } from '@/lib/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Upload, X } from 'lucide-react'
import { toast } from 'sonner'

const CATEGORIES = [
    'Kedokteran',
    'Entrepreneur',
    'Diplomat',
    'Teknologi',
    'Seni',
    'Olahraga',
    'Akademisi',
    'Lainnya',
]

export default function EditAlumniPage() {
    const router = useRouter()
    const params = useParams()
    const queryClient = useQueryClient()
    const id = params.id as string

    const [photoPreview, setPhotoPreview] = useState<string | null>(null)
    const [photoFile, setPhotoFile] = useState<File | null>(null)

    const { data: alumni, isLoading } = useQuery({
        queryKey: ['admin-alumni', id],
        queryFn: () => getAdminAlumniMember(id),
    })

    useEffect(() => {
        if (alumni?.data?.photo_url) {
            setPhotoPreview(alumni.data.photo_url)
        }
    }, [alumni])

    const updateMutation = useMutation({
        mutationFn: (data: FormData) => updateAlumni(id, data),
        onSuccess: () => {
            toast.success('Alumni berhasil diupdate!')
            queryClient.invalidateQueries({ queryKey: ['admin-alumni'] })
            router.push('/admin/alumni')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Gagal mengupdate alumni')
        },
    })

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setPhotoFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        formData.append('_method', 'PUT')

        if (photoFile) {
            formData.append('photo', photoFile)
        }

        updateMutation.mutate(formData)
    }

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        )
    }

    if (!alumni?.data) {
        return (
            <div className="p-6 flex items-center justify-center">
                <div className="text-gray-500">Alumni tidak ditemukan</div>
            </div>
        )
    }

    const data = alumni.data

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/admin/alumni"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Kembali
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Edit Alumni
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Edit data alumni: {data.name}
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Informasi Dasar
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Nama */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nama Lengkap *
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                defaultValue={data.name}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nama lengkap alumni"
                            />
                        </div>

                        {/* Tahun Lulus */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tahun Lulus *
                            </label>
                            <input
                                type="number"
                                name="graduation_year"
                                required
                                min="1960"
                                max={new Date().getFullYear()}
                                defaultValue={data.graduation_year}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Kelas */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Kelas
                            </label>
                            <input
                                type="text"
                                name="class"
                                defaultValue={data.class || ''}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="XII IPA 1"
                            />
                        </div>

                        {/* Kategori */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Kategori
                            </label>
                            <select
                                name="category"
                                defaultValue={data.category || ''}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Pilih Kategori</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Foto */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Foto
                    </h2>

                    <div className="flex items-start gap-6">
                        {photoPreview ? (
                            <div className="relative">
                                <img
                                    src={photoPreview}
                                    alt="Preview"
                                    className="w-32 h-32 rounded-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPhotoPreview(null)
                                        setPhotoFile(null)
                                    }}
                                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <label className="w-32 h-32 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-full flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                                <Upload className="w-8 h-8 text-gray-400" />
                                <span className="text-xs text-gray-500 mt-2">Upload</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhotoChange}
                                />
                            </label>
                        )}
                        <div className="flex-1">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Upload foto alumni. Format: JPG, PNG. Ukuran maksimal 2MB.
                            </p>
                            {!photoFile && photoPreview && (
                                <label className="inline-block mt-3 px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                    Ganti Foto
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handlePhotoChange}
                                    />
                                </label>
                            )}
                        </div>
                    </div>
                </div>

                {/* Karir */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Karir & Prestasi
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Pekerjaan Saat Ini */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Pekerjaan Saat Ini
                            </label>
                            <input
                                type="text"
                                name="current_occupation"
                                defaultValue={data.current_occupation || ''}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="CEO, Dokter, dll"
                            />
                        </div>

                        {/* Institusi */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Institusi
                            </label>
                            <input
                                type="text"
                                name="current_institution"
                                defaultValue={data.current_institution || ''}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nama perusahaan/institusi"
                            />
                        </div>

                        {/* Quote */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Quote/Pesan (untuk carousel)
                            </label>
                            <textarea
                                name="quote"
                                rows={3}
                                defaultValue={data.quote || ''}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Pesan inspiratif dari alumni"
                            />
                        </div>

                        {/* Prestasi */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Prestasi
                            </label>
                            <textarea
                                name="achievements"
                                rows={3}
                                defaultValue={data.achievements || ''}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Daftar prestasi yang diraih"
                            />
                        </div>
                    </div>
                </div>

                {/* Kontak */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Kontak
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                defaultValue={data.email || ''}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="email@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Telepon
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                defaultValue={data.phone || ''}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="081234567890"
                            />
                        </div>
                    </div>
                </div>

                {/* Settings */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Pengaturan
                    </h2>

                    <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="is_featured"
                                value="1"
                                defaultChecked={data.is_featured}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700 dark:text-gray-300">
                                Tampilkan di carousel homepage (Featured)
                            </span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="is_public"
                                value="1"
                                defaultChecked={data.is_public}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700 dark:text-gray-300">
                                Tampilkan di halaman publik
                            </span>
                        </label>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Urutan
                            </label>
                            <input
                                type="number"
                                name="order"
                                defaultValue={data.order || 0}
                                min={0}
                                className="w-32 px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-4">
                    <Link
                        href="/admin/alumni"
                        className="px-6 py-3 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        disabled={updateMutation.isPending}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {updateMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>
        </div>
    )
}
