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
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan data')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <MobileFormLayout
            title="Tambah Staff"
            subtitle="Lengkapi data staff"
            backHref="/admin/staff"
            onSubmit={handleSubmit(onSubmit)}
            submitText="Simpan Staff"
            isSubmitting={isSubmitting}
        >
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <MobileFormSection title="Informasi Dasar">
                <MobileFormField
                    label="Nama Lengkap"
                    required
                    error={errors.name?.message}
                >
                    <Input
                        {...register('name')}
                        placeholder="Dr. Ahmad Wijaya, S.Pd., M.Pd."
                        className="min-h-12"
                    />
                </MobileFormField>

                <MobileFormField label="NIP" hint="Opsional">
                    <Input
                        {...register('nip')}
                        placeholder="1234567890123456"
                        className="min-h-12"
                    />
                </MobileFormField>

                <MobileFormField
                    label="Tipe"
                    required
                    error={errors.type?.message}
                >
                    <Select
                        onValueChange={(value) => setValue('type', value)}
                        defaultValue={watch('type')}
                    >
                        <SelectTrigger className="min-h-12">
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
                </MobileFormField>

                <MobileFormField
                    label="Posisi/Jabatan"
                    required
                    error={errors.position?.message}
                >
                    <Input
                        {...register('position')}
                        placeholder="Guru Matematika"
                        className="min-h-12"
                    />
                </MobileFormField>

                <MobileFormField label="Departemen" hint="Opsional">
                    <Select
                        onValueChange={(value) => setValue('department', value)}
                        defaultValue={watch('department')}
                    >
                        <SelectTrigger className="min-h-12">
                            <SelectValue placeholder="Pilih departemen" />
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
                </MobileFormField>

                <MobileFormField label="Pengalaman (tahun)" hint="Opsional">
                    <Input
                        type="number"
                        {...register('experience', { valueAsNumber: true })}
                        placeholder="0"
                        min="0"
                        className="min-h-12"
                    />
                </MobileFormField>
            </MobileFormSection>

            <MobileFormSection title="Informasi Kontak">
                <MobileFormField
                    label="Email"
                    hint="Opsional"
                    error={errors.email?.message}
                >
                    <Input
                        type="email"
                        {...register('email')}
                        placeholder="ahmad.wijaya@smansa.sch.id"
                        className="min-h-12"
                    />
                </MobileFormField>

                <MobileFormField label="Telepon" hint="Opsional">
                    <Input
                        {...register('phone')}
                        placeholder="081234567890"
                        className="min-h-12"
                    />
                </MobileFormField>
            </MobileFormSection>

            <MobileFormSection title="Biografi">
                <MobileFormField label="Bio" hint="Opsional">
                    <Textarea
                        {...register('bio')}
                        placeholder="Tulis bio singkat..."
                        rows={4}
                        className="min-h-24"
                    />
                </MobileFormField>
            </MobileFormSection>

            <MobileFormSection title="Pengaturan">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-sm">Status Aktif</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Tampilkan staff di website
                        </p>
                    </div>
                    <Switch
                        checked={watch('is_active')}
                        onCheckedChange={(checked) => setValue('is_active', checked)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-sm">Featured</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Tampilkan di halaman utama
                        </p>
                    </div>
                    <Switch
                        checked={watch('is_featured')}
                        onCheckedChange={(checked) => setValue('is_featured', checked)}
                    />
                </div>
            </MobileFormSection>
        </MobileFormLayout>
    )
}
