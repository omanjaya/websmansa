'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { getAdminAchievement, updateAchievement } from '@/lib/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Upload, X } from 'lucide-react'
import { toast } from 'sonner'

const CATEGORIES = [
    'Akademik',
    'Olahraga',
    'Seni',
    'Teknologi',
    'Bahasa',
    'Kepemimpinan',
    'Sosial',
    'Lainnya',
]

const LEVELS = [
    { value: 'school', label: 'Sekolah' },
    { value: 'regional', label: 'Regional' },
    { value: 'national', label: 'Nasional' },
    { value: 'international', label: 'Internasional' },
]

const MEDAL_TYPES = [
    { value: 'gold', label: 'Emas' },
    { value: 'silver', label: 'Perak' },
    { value: 'bronze', label: 'Perunggu' },
    { value: 'winner', label: 'Juara' },
    { value: 'finalist', label: 'Finalis' },
]

export default function EditAchievementPage() {
    const router = useRouter()
    const params = useParams()
    const queryClient = useQueryClient()
    const id = params.id as string

    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [participants, setParticipants] = useState<string[]>([''])

    const { data: achievement, isLoading } = useQuery({
        queryKey: ['admin-achievement', id],
        queryFn: () => getAdminAchievement(id),
    })

    useEffect(() => {
        if (achievement?.data) {
            if (achievement.data.image_url) {
                setImagePreview(achievement.data.image_url)
            }
            if (achievement.data.participants && achievement.data.participants.length > 0) {
                setParticipants(achievement.data.participants)
            }
        }
    }, [achievement])

    const updateMutation = useMutation({
        mutationFn: (data: FormData) => updateAchievement(id, data),
        onSuccess: () => {
            toast.success('Prestasi berhasil diupdate!')
            queryClient.invalidateQueries({ queryKey: ['admin-achievements'] })
            router.push('/admin/achievements')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Gagal mengupdate prestasi')
        },
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        formData.append('_method', 'PUT')

        if (imageFile) {
            formData.append('image', imageFile)
        }

        // Add participants array
        const filteredParticipants = participants.filter((p) => p.trim())
        formData.append('participants', JSON.stringify(filteredParticipants))

        updateMutation.mutate(formData)
    }

    const addParticipant = () => {
        setParticipants([...participants, ''])
    }

    const removeParticipant = (index: number) => {
        setParticipants(participants.filter((_, i) => i !== index))
    }

    const updateParticipant = (index: number, value: string) => {
        const newParticipants = [...participants]
        newParticipants[index] = value
        setParticipants(newParticipants)
    }

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        )
    }

    if (!achievement?.data) {
        return (
            <div className="p-6 flex items-center justify-center">
                <div className="text-gray-500">Prestasi tidak ditemukan</div>
            </div>
        )
    }

    const data = achievement.data

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/admin/achievements"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Kembali
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Edit Prestasi
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Edit data prestasi: {data.title}
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Informasi Dasar
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Judul */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Judul Prestasi *
                            </label>
                            <input
                                type="text"
                                name="title"
                                required
                                defaultValue={data.title}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Kategori */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Kategori *
                            </label>
                            <select
                                name="category"
                                required
                                defaultValue={data.category}
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

                        {/* Level */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Level *
                            </label>
                            <select
                                name="level"
                                required
                                defaultValue={data.level}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Pilih Level</option>
                                {LEVELS.map((lvl) => (
                                    <option key={lvl.value} value={lvl.value}>
                                        {lvl.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tahun */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tahun *
                            </label>
                            <input
                                type="number"
                                name="year"
                                required
                                min="2000"
                                max={new Date().getFullYear() + 1}
                                defaultValue={data.year}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Penyelenggara */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Penyelenggara
                            </label>
                            <input
                                type="text"
                                name="organizer"
                                defaultValue={data.organizer || ''}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Tanggal */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tanggal Prestasi
                            </label>
                            <input
                                type="date"
                                name="achievement_date"
                                defaultValue={data.achievement_date ? data.achievement_date.split('T')[0] : ''}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Pembimbing */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Pembimbing/Coach
                            </label>
                            <input
                                type="text"
                                name="coach"
                                defaultValue={data.coach || ''}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Deskripsi */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Deskripsi
                            </label>
                            <textarea
                                name="description"
                                rows={3}
                                defaultValue={data.description || ''}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Medali */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Penghargaan
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Tipe Medali */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tipe Medali/Penghargaan
                            </label>
                            <select
                                name="medal_type"
                                defaultValue={data.medal_type || ''}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Pilih Tipe</option>
                                {MEDAL_TYPES.map((medal) => (
                                    <option key={medal.value} value={medal.value}>
                                        {medal.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Peringkat */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Peringkat
                            </label>
                            <input
                                type="number"
                                name="rank"
                                min="1"
                                defaultValue={data.rank || ''}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Peserta */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Peserta
                    </h2>

                    <div className="space-y-3">
                        {participants.map((participant, index) => (
                            <div key={index} className="flex gap-3">
                                <input
                                    type="text"
                                    value={participant}
                                    onChange={(e) => updateParticipant(index, e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Nama peserta"
                                />
                                {participants.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeParticipant(index)}
                                        className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addParticipant}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            + Tambah Peserta
                        </button>
                    </div>
                </div>

                {/* Gambar */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Gambar
                    </h2>

                    <div className="flex items-start gap-6">
                        {imagePreview ? (
                            <div className="relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-40 h-40 rounded-xl object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImagePreview(null)
                                        setImageFile(null)
                                    }}
                                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <label className="w-40 h-40 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                                <Upload className="w-8 h-8 text-gray-400" />
                                <span className="text-xs text-gray-500 mt-2">Upload</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                        )}
                        <div className="flex-1">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Upload gambar prestasi (sertifikat, piala, foto kegiatan). Format: JPG, PNG. Ukuran maksimal 2MB.
                            </p>
                            {!imageFile && imagePreview && (
                                <label className="inline-block mt-3 px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                    Ganti Gambar
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            )}
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
                                name="is_active"
                                value="1"
                                defaultChecked={data.is_active}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700 dark:text-gray-300">
                                Aktif (tampilkan di website)
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
                        href="/admin/achievements"
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
