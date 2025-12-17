'use client'

import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { adminApi } from '@/lib/admin-api'
import { DataTable } from '@/components/admin/data-table/DataTable'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, MoreHorizontal, Edit, Trash2, Eye, ArrowUpDown } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Staff {
    id: number
    attributes: {
        name: string
        nip: string | null
        position: string
        type: string
        type_label: string
        department_label: string
        email: string | null
        phone: string | null
        photo_url: string | null
        is_active: boolean
        is_featured: boolean
    }
}

export function DesktopView() {
    const { data, isLoading } = useQuery({
        queryKey: ['admin-staff'],
        queryFn: async () => {
            const response = await adminApi.get('/staff', { per_page: 100 })
            return response.data as Staff[]
        },
    })

    const columns = useMemo<ColumnDef<Staff>[]>(() => [
        {
            accessorKey: 'attributes.photo_url',
            header: 'Foto',
            cell: ({ row }) => {
                const photoUrl = row.original.attributes.photo_url
                const name = row.original.attributes.name
                return (
                    <div className="flex items-center justify-center">
                        {photoUrl ? (
                            <Image
                                src={photoUrl}
                                alt={name}
                                width={40}
                                height={40}
                                className="rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                                {name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                )
            },
        },
        {
            accessorKey: 'attributes.name',
            id: 'name',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="-ml-4"
                    >
                        Nama
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const name = row.original.attributes.name
                const nip = row.original.attributes.nip
                return (
                    <div>
                        <div className="font-medium">{name}</div>
                        {nip && <div className="text-sm text-muted-foreground">NIP: {nip}</div>}
                    </div>
                )
            },
        },
        {
            accessorKey: 'attributes.position',
            header: 'Posisi',
            cell: ({ row }) => row.original.attributes.position || '-',
        },
        {
            accessorKey: 'attributes.type_label',
            header: 'Tipe',
            cell: ({ row }) => {
                const type = row.original.attributes.type
                const typeLabel = row.original.attributes.type_label

                const colors: Record<string, string> = {
                    teacher: 'bg-blue-100 text-blue-800',
                    admin: 'bg-purple-100 text-purple-800',
                    counselor: 'bg-green-100 text-green-800',
                    headmaster: 'bg-red-100 text-red-800',
                    staff: 'bg-gray-100 text-gray-800',
                }

                return (
                    <Badge className={colors[type] || colors.staff} variant="secondary">
                        {typeLabel}
                    </Badge>
                )
            },
        },
        {
            accessorKey: 'attributes.department_label',
            header: 'Departemen',
        },
        {
            accessorKey: 'attributes.email',
            header: 'Email',
            cell: ({ row }) => row.original.attributes.email || '-',
        },
        {
            accessorKey: 'attributes.is_active',
            header: 'Status',
            cell: ({ row }) => {
                const isActive = row.original.attributes.is_active
                return (
                    <Badge variant={isActive ? 'default' : 'secondary'}>
                        {isActive ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                )
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const staff = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/staff/${staff.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Lihat Detail
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/staff/${staff.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ], [])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manajemen Staff</h1>
                    <p className="text-muted-foreground mt-1">
                        Kelola data staff dan guru sekolah
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/staff/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Staff
                    </Link>
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Staff</CardDescription>
                        <CardTitle className="text-3xl">
                            {data?.length || 0}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Guru</CardDescription>
                        <CardTitle className="text-3xl">
                            {data?.filter(s => s.attributes.type === 'teacher').length || 0}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Admin</CardDescription>
                        <CardTitle className="text-3xl">
                            {data?.filter(s => s.attributes.type === 'admin').length || 0}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Aktif</CardDescription>
                        <CardTitle className="text-3xl">
                            {data?.filter(s => s.attributes.is_active).length || 0}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Data Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Staff</CardTitle>
                    <CardDescription>
                        Daftar lengkap staff dan guru yang terdaftar
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-muted-foreground">Loading...</div>
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={data || []}
                            searchKey="name"
                            searchPlaceholder="Cari nama staff..."
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
