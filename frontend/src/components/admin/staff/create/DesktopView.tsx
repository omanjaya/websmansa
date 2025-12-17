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

const staffSchema = z.object({
    nip: z.string().optional(),
    name: z.string().min(1, 'Nama wajib diisi'),
    position: z.string().min(1, 'Posisi wajib diisi'),
    type: z.string().min(1, 'Tipe wajib dipilih'),
    department: z.string().optional(),
    email: z.string().email('Email tidak valid').optional().or(z.literal('')),
    phone: z.string().optional(),
    bio: z.string().optional(),
    experience: z.number().min(0).optional(),
    is_active: z.boolean(),
    is_featured: z.boolean(),
})

type StaffFormValues = z.infer<typeof staffSchema>

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
    } = useForm<StaffFormValues>({
        resolver: zodResolver(staffSchema),
        defaultValues: {
            is_active: true,
            is_featured: false,
            experience: 0,
        },
    })

    const onSubmit = async (data: StaffFormValues) => {
        try {
            setIsSubmitting(true)
            setError('')
            await adminApi.post('/staff', data)
            router.push('/admin/staff')
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
                    <Link href="/admin/staff">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Tambah Staff Baru</h1>
                <p className="text-muted-foreground mt-1">
                    Lengkapi form berikut untuk menambahkan staff baru
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
                        <CardTitle>Informasi Dasar</CardTitle>
                        <CardDescription>Data identitas dan informasi dasar staff</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Nama Lengkap <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    {...register('name')}
                                    placeholder="Dr. Ahmad Wijaya, S.Pd., M.Pd."
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nip">NIP</Label>
                                <Input
                                    id="nip"
                                    {...register('nip')}
                                    placeholder="1234567890123456"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="type">
                                    Tipe <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    onValueChange={(value) => setValue('type', value)}
                                    defaultValue={watch('type')}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih tipe staff" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="teacher">Guru</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="counselor">Konselor/BK</SelectItem>
                                        <SelectItem value="headmaster">Kepala Sekolah</SelectItem>
                                        <SelectItem value="vice_headmaster">Wakil Kepala</SelectItem>
                                        <SelectItem value="librarian">Pustakawan</SelectItem>
                                        <SelectItem value="lab_assistant">Laboran</SelectItem>
                                        <SelectItem value="staff">Staff</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.type && (
                                    <p className="text-sm text-red-500">{errors.type.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="position">
                                    Posisi/Jabatan <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="position"
                                    {...register('position')}
                                    placeholder="Guru Matematika"
                                />
                                {errors.position && (
                                    <p className="text-sm text-red-500">{errors.position.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="department">Departemen</Label>
                            <Select
                                onValueChange={(value) => setValue('department', value)}
                                defaultValue={watch('department')}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih departemen (opsional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mathematics">Matematika</SelectItem>
                                    <SelectItem value="indonesian">Bahasa Indonesia</SelectItem>
                                    <SelectItem value="english">Bahasa Inggris</SelectItem>
                                    <SelectItem value="physics">Fisika</SelectItem>
                                    <SelectItem value="chemistry">Kimia</SelectItem>
                                    <SelectItem value="biology">Biologi</SelectItem>
                                    <SelectItem value="history">Sejarah</SelectItem>
                                    <SelectItem value="geography">Geografi</SelectItem>
                                    <SelectItem value="economics">Ekonomi</SelectItem>
                                    <SelectItem value="sociology">Sosiologi</SelectItem>
                                    <SelectItem value="civics">PKN</SelectItem>
                                    <SelectItem value="religion">Agama</SelectItem>
                                    <SelectItem value="art">Seni</SelectItem>
                                    <SelectItem value="pe">Penjaskes</SelectItem>
                                    <SelectItem value="it">TIK</SelectItem>
                                    <SelectItem value="counseling">BK</SelectItem>
                                    <SelectItem value="administration">Administrasi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="experience">Pengalaman (tahun)</Label>
                            <Input
                                id="experience"
                                type="number"
                                {...register('experience', { valueAsNumber: true })}
                                placeholder="0"
                                min="0"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Kontak</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register('email')}
                                    placeholder="ahmad.wijaya@smansa.sch.id"
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Telepon</Label>
                                <Input
                                    id="phone"
                                    {...register('phone')}
                                    placeholder="081234567890"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Biografi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            {...register('bio')}
                            placeholder="Tulis bio singkat..."
                            rows={4}
                        />
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
                                    Tampilkan staff di website
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
                                <Label htmlFor="is_featured">Featured</Label>
                                <p className="text-sm text-muted-foreground">
                                    Tampilkan di halaman utama
                                </p>
                            </div>
                            <Switch
                                id="is_featured"
                                checked={watch('is_featured')}
                                onCheckedChange={(checked) => setValue('is_featured', checked)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-4">
                    <Button type="submit" disabled={isSubmitting}>
                        <Save className="mr-2 h-4 w-4" />
                        {isSubmitting ? 'Menyimpan...' : 'Simpan Staff'}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                        <Link href="/admin/staff">Batal</Link>
                    </Button>
                </div>
            </form>
        </div>
    )
}
