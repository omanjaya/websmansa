'use client'

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
import { Plus, MoreHorizontal, Edit, Trash2, Eye, ArrowUpDown, Pin } from 'lucide-react'
import Link from 'next/link'
import { exportToCSV } from '@/lib/export-utils'

interface Announcement {
    id: number
    attributes: {
        title: string
        slug: string
        excerpt: string | null
        type: string
        priority: string
        is_pinned: boolean
        is_active: boolean
        published_at: string | null
        expires_at: string | null
        created_at: string
    }
}

export function DesktopView() {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['admin-announcements'],
        queryFn: async () => {
            const response = await adminApi.get('/announcements', { per_page: 100 })
            return response.data as Announcement[]
        },
    })

    const handleBulkDelete = async (selectedRows: Announcement[]) => {
        try {
            await Promise.all(
                selectedRows.map((announcement) =>
                    adminApi.delete(`/announcements/${announcement.id}`)
                )
            )
            refetch()
        } catch (error) {
            console.error('Bulk delete error:', error)
            throw error
        }
    }

    const handleExport = () => {
        if (!data || data.length === 0) {
            alert('Tidak ada data untuk di-export')
            return
        }

        const exportData = data.map((announcement) => ({
            id: announcement.id,
            title: announcement.attributes.title,
            slug: announcement.attributes.slug,
            excerpt: announcement.attributes.excerpt || '',
            type: announcement.attributes.type,
            priority: announcement.attributes.priority,
            is_pinned: announcement.attributes.is_pinned ? 'Ya' : 'Tidak',
            is_active: announcement.attributes.is_active ? 'Aktif' : 'Nonaktif',
            published_at: announcement.attributes.published_at
                ? new Date(announcement.attributes.published_at).toLocaleDateString('id-ID')
                : '',
            expires_at: announcement.attributes.expires_at
                ? new Date(announcement.attributes.expires_at).toLocaleDateString('id-ID')
                : 'Tidak ada',
            created_at: new Date(announcement.attributes.created_at).toLocaleDateString('id-ID'),
        }))

        exportToCSV(
            exportData,
            'pengumuman',
            [
                { key: 'id', label: 'ID' },
                { key: 'title', label: 'Judul' },
                { key: 'slug', label: 'Slug' },
                { key: 'excerpt', label: 'Ringkasan' },
                { key: 'type', label: 'Tipe' },
                { key: 'priority', label: 'Prioritas' },
                { key: 'is_pinned', label: 'Dipasang' },
                { key: 'is_active', label: 'Status' },
                { key: 'published_at', label: 'Tanggal Publikasi' },
                { key: 'expires_at', label: 'Tanggal Kadaluarsa' },
                { key: 'created_at', label: 'Tanggal Dibuat' },
            ]
        )
    }

    const columns: ColumnDef<Announcement>[] = [
        {
            accessorKey: 'attributes.title',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="-ml-4"
                    >
                        Judul
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const title = row.original.attributes.title
                const excerpt = row.original.attributes.excerpt
                const isPinned = row.original.attributes.is_pinned
                return (
                    <div>
                        <div className="flex items-center gap-2">
                            {isPinned && <Pin className="h-3 w-3 text-primary" />}
                            <span className="font-medium">{title}</span>
                        </div>
                        {excerpt && (
                            <div className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                {excerpt}
                            </div>
                        )}
                    </div>
                )
            },
        },
        {
            accessorKey: 'attributes.type',
            header: 'Tipe',
            cell: ({ row }) => {
                const type = row.original.attributes.type
                const colors: Record<string, string> = {
                    info: 'bg-blue-100 text-blue-800',
                    event: 'bg-purple-100 text-purple-800',
                    warning: 'bg-yellow-100 text-yellow-800',
                    success: 'bg-green-100 text-green-800',
                }
                const labels: Record<string, string> = {
                    info: 'Info',
                    event: 'Event',
                    warning: 'Peringatan',
                    success: 'Sukses',
                }
                return (
                    <Badge className={colors[type] || colors.info} variant="secondary">
                        {labels[type] || type}
                    </Badge>
                )
            },
        },
        {
            accessorKey: 'attributes.priority',
            header: 'Prioritas',
            cell: ({ row }) => {
                const priority = row.original.attributes.priority
                const colors: Record<string, string> = {
                    low: 'bg-gray-100 text-gray-800',
                    medium: 'bg-blue-100 text-blue-800',
                    high: 'bg-orange-100 text-orange-800',
                    urgent: 'bg-red-100 text-red-800',
                }
                const labels: Record<string, string> = {
                    low: 'Rendah',
                    medium: 'Sedang',
                    high: 'Tinggi',
                    urgent: 'Mendesak',
                }
                return (
                    <Badge className={colors[priority] || colors.medium} variant="secondary">
                        {labels[priority] || priority}
                    </Badge>
                )
            },
        },
        {
            accessorKey: 'attributes.published_at',
            header: 'Tanggal Publikasi',
            cell: ({ row }) => {
                const publishedAt = row.original.attributes.published_at
                if (!publishedAt) return '-'
                return new Date(publishedAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                })
            },
        },
        {
            accessorKey: 'attributes.expires_at',
            header: 'Kadaluarsa',
            cell: ({ row }) => {
                const expiresAt = row.original.attributes.expires_at
                if (!expiresAt) return 'Tidak ada'
                const date = new Date(expiresAt)
                const isExpired = date < new Date()
                return (
                    <span className={isExpired ? 'text-red-600' : ''}>
                        {date.toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </span>
                )
            },
        },
        {
            accessorKey: 'attributes.is_active',
            header: 'Status',
            cell: ({ row }) => {
                const isActive = row.original.attributes.is_active
                const isPinned = row.original.attributes.is_pinned
                return (
                    <div className="flex gap-1">
                        <Badge variant={isActive ? 'default' : 'secondary'}>
                            {isActive ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                        {isPinned && (
                            <Badge variant="outline" className="border-primary text-primary">
                                Pinned
                            </Badge>
                        )}
                    </div>
                )
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const announcement = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/announcements/${announcement.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Lihat Detail
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/announcements/${announcement.id}/edit`}>
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
    ]

    const activeCount = data?.filter(a => a.attributes.is_active).length || 0
    const pinnedCount = data?.filter(a => a.attributes.is_pinned).length || 0
    const expiredCount = data?.filter(a => {
        const expiresAt = a.attributes.expires_at
        return expiresAt && new Date(expiresAt) < new Date()
    }).length || 0

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manajemen Pengumuman</h1>
                    <p className="text-muted-foreground mt-1">
                        Kelola pengumuman dan informasi penting
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/announcements/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Buat Pengumuman
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total</CardDescription>
                        <CardTitle className="text-3xl">{data?.length || 0}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Aktif</CardDescription>
                        <CardTitle className="text-3xl">{activeCount}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Pinned</CardDescription>
                        <CardTitle className="text-3xl">{pinnedCount}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Kadaluarsa</CardDescription>
                        <CardTitle className="text-3xl text-red-600">{expiredCount}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Daftar Pengumuman</CardTitle>
                    <CardDescription>
                        Semua pengumuman yang dipublikasikan
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
                            searchKey="attributes.title"
                            searchPlaceholder="Cari pengumuman..."
                            enableRowSelection={true}
                            onBulkDelete={handleBulkDelete}
                            onExport={handleExport}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
