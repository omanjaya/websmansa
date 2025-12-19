'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { adminApi } from '@/lib/admin-api'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MobileFormLayout, MobileFormSection, MobileFormField } from '@/components/admin/forms/MobileFormLayout'

const announcementSchema = z.object({
    title: z.string().min(1, 'Judul wajib diisi'),
    content: z.string().min(1, 'Konten wajib diisi'),
    excerpt: z.string().optional(),
    type: z.enum(['info', 'event', 'warning', 'success']),
    priority: z.enum(['low', 'medium', 'high', 'urgent']),
    published_at: z.string().optional(),
    expires_at: z.string().optional(),
    is_pinned: z.boolean(),
    is_active: z.boolean(),
})

type AnnouncementFormValues = z.infer<typeof announcementSchema>

export function MobileView() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<AnnouncementFormValues>({
        resolver: zodResolver(announcementSchema),
        defaultValues: {
            type: 'info',
            priority: 'medium',
            is_active: true,
            is_pinned: false,
        },
    })

    const onSubmit = async (data: AnnouncementFormValues) => {
        try {
            setIsSubmitting(true)
            setError('')
            await adminApi.post('/announcements', data)
            router.push('/admin/announcements')
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan data')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <MobileFormLayout
            title="Buat Pengumuman"
            subtitle="Lengkapi form pengumuman"
            backHref="/admin/announcements"
            onSubmit={handleSubmit(onSubmit)}
            submitText="Publikasikan"
            isSubmitting={isSubmitting}
        >
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <MobileFormSection title="Informasi Pengumuman">
                <MobileFormField
                    label="Judul"
                    required
                    error={errors.title?.message}
                >
                    <Input
                        {...register('title')}
                        placeholder="Judul pengumuman..."
                        className="min-h-12"
                    />
                </MobileFormField>

                <MobileFormField label="Ringkasan" hint="Opsional">
                    <Textarea
                        {...register('excerpt')}
                        placeholder="Ringkasan singkat..."
                        rows={2}
                        className="min-h-16"
                    />
                </MobileFormField>

                <MobileFormField
                    label="Konten"
                    required
                    error={errors.content?.message}
                >
                    <Textarea
                        {...register('content')}
                        placeholder="Tulis konten pengumuman..."
                        rows={8}
                        className="min-h-32"
                    />
                </MobileFormField>

                <MobileFormField label="Tipe">
                    <Select
                        onValueChange={(value) => setValue('type', value as 'info' | 'event' | 'warning' | 'success')}
                        defaultValue={watch('type')}
                    >
                        <SelectTrigger className="min-h-12">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="info">Info</SelectItem>
                            <SelectItem value="event">Event</SelectItem>
                            <SelectItem value="warning">Peringatan</SelectItem>
                            <SelectItem value="success">Sukses</SelectItem>
                        </SelectContent>
                    </Select>
                </MobileFormField>

                <MobileFormField label="Prioritas">
                    <Select
                        onValueChange={(value) => setValue('priority', value as 'low' | 'medium' | 'high' | 'urgent')}
                        defaultValue={watch('priority')}
                    >
                        <SelectTrigger className="min-h-12">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="low">Rendah</SelectItem>
                            <SelectItem value="medium">Sedang</SelectItem>
                            <SelectItem value="high">Tinggi</SelectItem>
                            <SelectItem value="urgent">Mendesak</SelectItem>
                        </SelectContent>
                    </Select>
                </MobileFormField>
            </MobileFormSection>

            <MobileFormSection
                title="Jadwal Publikasi"
                description="Atur waktu tampil"
            >
                <MobileFormField
                    label="Tanggal Publikasi"
                    hint="Kosongkan untuk sekarang"
                >
                    <Input
                        type="datetime-local"
                        {...register('published_at')}
                        className="min-h-12"
                    />
                </MobileFormField>

                <MobileFormField
                    label="Tanggal Kadaluarsa"
                    hint="Kosongkan jika tidak ada"
                >
                    <Input
                        type="datetime-local"
                        {...register('expires_at')}
                        className="min-h-12"
                    />
                </MobileFormField>
            </MobileFormSection>

            <MobileFormSection title="Pengaturan">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-sm">Status Aktif</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Tampilkan di website
                        </p>
                    </div>
                    <Switch
                        checked={watch('is_active')}
                        onCheckedChange={(checked) => setValue('is_active', checked)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-sm">Pin di Atas</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Posisi teratas
                        </p>
                    </div>
                    <Switch
                        checked={watch('is_pinned')}
                        onCheckedChange={(checked) => setValue('is_pinned', checked)}
                    />
                </div>
            </MobileFormSection>
        </MobileFormLayout>
    )
}
