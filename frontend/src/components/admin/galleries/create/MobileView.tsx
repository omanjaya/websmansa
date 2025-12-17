'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { adminApi } from '@/lib/admin-api'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Upload } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MobileFormLayout, MobileFormSection, MobileFormField } from '@/components/admin/forms/MobileFormLayout'
import { Button } from '@/components/ui/button'

const gallerySchema = z.object({
    title: z.string().min(1, 'Judul wajib diisi'),
    description: z.string().optional(),
    location: z.string().optional(),
    event_date: z.string().optional(),
    photographer: z.string().optional(),
    is_published: z.boolean(),
})

type GalleryFormValues = z.infer<typeof gallerySchema>

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
    } = useForm<GalleryFormValues>({
        resolver: zodResolver(gallerySchema),
        defaultValues: {
            is_published: false,
        },
    })

    const onSubmit = async (data: GalleryFormValues) => {
        try {
            setIsSubmitting(true)
            setError('')
            await adminApi.post('/galleries', data)
            router.push('/admin/galleries')
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Terjadi kesalahan saat menyimpan data')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <MobileFormLayout
            title="Buat Galeri"
            subtitle="Lengkapi form di bawah"
            backHref="/admin/galleries"
            onSubmit={handleSubmit(onSubmit)}
            submitText="Simpan Galeri"
            isSubmitting={isSubmitting}
        >
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <MobileFormSection title="Informasi Galeri">
                <MobileFormField
                    label="Judul"
                    required
                    error={errors.title?.message}
                >
                    <Input
                        {...register('title')}
                        placeholder="Judul galeri..."
                        className="min-h-12"
                    />
                </MobileFormField>

                <MobileFormField
                    label="Deskripsi"
                    hint="Opsional"
                >
                    <Textarea
                        {...register('description')}
                        placeholder="Deskripsi galeri..."
                        rows={4}
                        className="min-h-24"
                    />
                </MobileFormField>

                <MobileFormField label="Lokasi" hint="Opsional">
                    <Input
                        {...register('location')}
                        placeholder="Lokasi kegiatan..."
                        className="min-h-12"
                    />
                </MobileFormField>

                <MobileFormField label="Tanggal Event" hint="Opsional">
                    <Input
                        type="date"
                        {...register('event_date')}
                        className="min-h-12"
                    />
                </MobileFormField>

                <MobileFormField label="Fotografer" hint="Opsional">
                    <Input
                        {...register('photographer')}
                        placeholder="Nama fotografer..."
                        className="min-h-12"
                    />
                </MobileFormField>
            </MobileFormSection>

            <MobileFormSection
                title="Upload Foto"
                description="Unggah foto untuk galeri"
            >
                <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-6 text-center active:scale-95 transition-transform">
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground mb-2">
                        Tap untuk upload foto
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                        JPG, PNG, GIF (Max 5MB)
                    </p>
                    <Button type="button" variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Pilih Foto
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                    * Upload foto tersedia setelah galeri dibuat
                </p>
            </MobileFormSection>

            <MobileFormSection title="Pengaturan">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-sm">Status Publikasi</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Tampilkan di website
                        </p>
                    </div>
                    <Switch
                        checked={watch('is_published')}
                        onCheckedChange={(checked) => setValue('is_published', checked)}
                    />
                </div>
            </MobileFormSection>
        </MobileFormLayout>
    )
}
