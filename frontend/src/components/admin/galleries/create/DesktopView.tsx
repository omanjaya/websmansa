'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { adminApi } from '@/lib/admin-api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Save, Upload } from 'lucide-react'
import Link from 'next/link'
import { Alert, AlertDescription } from '@/components/ui/alert'

const gallerySchema = z.object({
    title: z.string().min(1, 'Judul wajib diisi'),
    description: z.string().optional(),
    location: z.string().optional(),
    event_date: z.string().optional(),
    photographer: z.string().optional(),
    is_published: z.boolean(),
})

type GalleryFormValues = z.infer<typeof gallerySchema>

export function DesktopView() {
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
        <div className="space-y-6 max-w-4xl">
            <div>
                <Button variant="ghost" asChild className="mb-4">
                    <Link href="/admin/galleries">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Buat Galeri Baru</h1>
                <p className="text-muted-foreground mt-1">
                    Lengkapi form untuk membuat galeri baru
                </p>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Galeri</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">
                                Judul <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                {...register('title')}
                                placeholder="Judul galeri..."
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">{errors.title.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea
                                id="description"
                                {...register('description')}
                                placeholder="Deskripsi galeri (opsional)..."
                                rows={4}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="location">Lokasi</Label>
                                <Input
                                    id="location"
                                    {...register('location')}
                                    placeholder="Lokasi kegiatan..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="event_date">Tanggal Event</Label>
                                <Input
                                    id="event_date"
                                    type="date"
                                    {...register('event_date')}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="photographer">Fotografer</Label>
                            <Input
                                id="photographer"
                                {...register('photographer')}
                                placeholder="Nama fotografer (opsional)..."
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Upload Foto</CardTitle>
                        <CardDescription>
                            Unggah foto untuk galeri ini
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="border-2 border-dashed rounded-lg p-8 text-center">
                            <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-sm text-muted-foreground mb-2">
                                Drag & drop foto di sini atau klik untuk browse
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Support: JPG, PNG, GIF (Max 5MB per file)
                            </p>
                            <Button type="button" variant="outline" className="mt-4">
                                <Upload className="mr-2 h-4 w-4" />
                                Pilih Foto
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            * Upload foto akan tersedia setelah galeri dibuat
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pengaturan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="is_published">Status Publikasi</Label>
                                <p className="text-sm text-muted-foreground">
                                    Tampilkan galeri di website
                                </p>
                            </div>
                            <Switch
                                id="is_published"
                                checked={watch('is_published')}
                                onCheckedChange={(checked) => setValue('is_published', checked)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-4">
                    <Button type="submit" disabled={isSubmitting}>
                        <Save className="mr-2 h-4 w-4" />
                        {isSubmitting ? 'Menyimpan...' : 'Simpan Galeri'}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                        <Link href="/admin/galleries">Batal</Link>
                    </Button>
                </div>
            </form>
        </div>
    )
}
