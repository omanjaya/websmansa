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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { Alert, AlertDescription } from '@/components/ui/alert'

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
                    <Link href="/admin/announcements">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Buat Pengumuman Baru</h1>
                <p className="text-muted-foreground mt-1">
                    Lengkapi form untuk membuat pengumuman baru
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
                        <CardTitle>Informasi Pengumuman</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">
                                Judul <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                {...register('title')}
                                placeholder="Judul pengumuman..."
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">{errors.title.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="excerpt">Ringkasan</Label>
                            <Textarea
                                id="excerpt"
                                {...register('excerpt')}
                                placeholder="Ringkasan singkat (opsional)..."
                                rows={2}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">
                                Konten <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="content"
                                {...register('content')}
                                placeholder="Tulis konten pengumuman..."
                                rows={8}
                            />
                            {errors.content && (
                                <p className="text-sm text-red-500">{errors.content.message}</p>
                            )}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="type">Tipe</Label>
                                <Select
                                    onValueChange={(value: any) => setValue('type', value)}
                                    defaultValue={watch('type')}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="info">Info</SelectItem>
                                        <SelectItem value="event">Event</SelectItem>
                                        <SelectItem value="warning">Peringatan</SelectItem>
                                        <SelectItem value="success">Sukses</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="priority">Prioritas</Label>
                                <Select
                                    onValueChange={(value: any) => setValue('priority', value)}
                                    defaultValue={watch('priority')}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Rendah</SelectItem>
                                        <SelectItem value="medium">Sedang</SelectItem>
                                        <SelectItem value="high">Tinggi</SelectItem>
                                        <SelectItem value="urgent">Mendesak</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Jadwal Publikasi</CardTitle>
                        <CardDescription>
                            Atur kapan pengumuman ditampilkan
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="published_at">Tanggal Publikasi</Label>
                                <Input
                                    id="published_at"
                                    type="datetime-local"
                                    {...register('published_at')}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Kosongkan untuk publikasi sekarang
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="expires_at">Tanggal Kadaluarsa</Label>
                                <Input
                                    id="expires_at"
                                    type="datetime-local"
                                    {...register('expires_at')}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Kosongkan jika tidak ada batas waktu
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pengaturan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="is_active">Status Aktif</Label>
                                <p className="text-sm text-muted-foreground">
                                    Tampilkan pengumuman di website
                                </p>
                            </div>
                            <Switch
                                id="is_active"
                                checked={watch('is_active')}
                                onCheckedChange={(checked) => setValue('is_active', checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="is_pinned">Pin di Atas</Label>
                                <p className="text-sm text-muted-foreground">
                                    Tampilkan di posisi teratas
                                </p>
                            </div>
                            <Switch
                                id="is_pinned"
                                checked={watch('is_pinned')}
                                onCheckedChange={(checked) => setValue('is_pinned', checked)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-4">
                    <Button type="submit" disabled={isSubmitting}>
                        <Save className="mr-2 h-4 w-4" />
                        {isSubmitting ? 'Menyimpan...' : 'Publikasikan'}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                        <Link href="/admin/announcements">Batal</Link>
                    </Button>
                </div>
            </form>
        </div>
    )
}
