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
import { Plus, MoreHorizontal, Edit, Trash2, Eye, ArrowUpDown, Images } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { exportToCSV } from '@/lib/export-utils'

interface Gallery {
    id: number
    uuid: string
    title: string
    slug: string
    description: string | null
    thumbnail: string | null
    thumbnail_url: string | null
    type: string
    event_date: string | null
    is_featured: boolean
    items_count: number
    items: Array<{
        id: number
        url: string
        caption: string | null
        is_featured: boolean
    }>
    created_at: string
    updated_at: string
}

export function DesktopView() {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['admin-galleries'],
        queryFn: async () => {
            const response = await adminApi.get('/galleries', { per_page: 100 })
            return response.data as Gallery[]
        },
    })

    const handleBulkDelete = async (selectedRows: Gallery[]) => {
        try {
            await Promise.all(
                selectedRows.map((gallery) => adminApi.delete(`/galleries/${gallery.id}`))
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

        const exportData = data.map((gallery) => ({
            id: gallery.id,
            title: gallery.title,
            slug: gallery.slug,
            description: gallery.description || '',
            type: gallery.type || '',
            event_date: gallery.event_date || '',
            total_images: gallery.items_count || 0,
            is_featured: gallery.is_featured ? 'Ya' : 'Tidak',
            created_at: new Date(gallery.created_at).toLocaleDateString('id-ID'),
        }))

        exportToCSV(
            exportData,
            'galeri',
            [
                { key: 'id', label: 'ID' },
                { key: 'title', label: 'Judul' },
                { key: 'slug', label: 'Slug' },
                { key: 'description', label: 'Deskripsi' },
                { key: 'type', label: 'Tipe' },
                { key: 'event_date', label: 'Tanggal Event' },
                { key: 'total_images', label: 'Total Foto' },
                { key: 'is_featured', label: 'Featured' },
                { key: 'created_at', label: 'Tanggal Dibuat' },
            ]
        )
    }

    const columns: ColumnDef<Gallery>[] = [
        {
            accessorKey: 'thumbnail_url',
            header: 'Preview',
            cell: ({ row }) => {
                const thumbnail = row.original.thumbnail_url
                return (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                        {thumbnail ? (
                            <Image
                                src={thumbnail}
                                alt="Gallery preview"
                                width={64}
                                height={64}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <Images className="w-6 h-6 text-muted-foreground" />
                        )}
                    </div>
                )
            },
        },
        {
            accessorKey: 'title',
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
                const title = row.original.title
                const description = row.original.description
                return (
                    <div>
                        <div className="font-medium">{title}</div>
                        {description && (
                            <div className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                {description}
                            </div>
                        )}
                    </div>
                )
            },
        },
        {
            accessorKey: 'items_count',
            header: 'Foto',
            cell: ({ row }) => {
                const count = row.original.items_count || 0
                return (
                    <div className="flex items-center gap-2">
                        <Images className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{count}</span>
                    </div>
                )
            },
        },
        {
            accessorKey: 'event_date',
            header: 'Tanggal Event',
            cell: ({ row }) => {
                const eventDate = row.original.event_date
                if (!eventDate) return '-'
                return new Date(eventDate).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                })
            },
        },
        {
            accessorKey: 'type',
            header: 'Tipe',
            cell: ({ row }) => {
                const type = row.original.type
                return (
                    <Badge variant="outline">
                        {type === 'photo' ? '📷 Foto' : type === 'video' ? '🎬 Video' : type}
                    </Badge>
                )
            },
        },
        {
            accessorKey: 'is_featured',
            header: 'Status',
            cell: ({ row }) => {
                const isFeatured = row.original.is_featured
                return (
                    <Badge variant={isFeatured ? 'default' : 'secondary'}>
                        {isFeatured ? 'Featured' : 'Normal'}
                    </Badge>
                )
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const gallery = row.original
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
                                <Link href={`/admin/galleries/${gallery.uuid}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Lihat Detail
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/galleries/${gallery.uuid}/edit`}>
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

    const featuredCount = data?.filter(g => g.is_featured).length || 0
    const totalImages = data?.reduce((sum, g) => sum + (g.items_count || 0), 0) || 0

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manajemen Galeri</h1>
                    <p className="text-muted-foreground mt-1">
                        Kelola foto dan dokumentasi kegiatan sekolah
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/galleries/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Buat Galeri
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Galeri</CardDescription>
                        <CardTitle className="text-3xl">{data?.length || 0}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Featured</CardDescription>
                        <CardTitle className="text-3xl text-green-600">{featuredCount}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Foto</CardDescription>
                        <CardTitle className="text-3xl">{totalImages}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Daftar Galeri</CardTitle>
                    <CardDescription>
                        Semua galeri foto yang ada
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
                            searchKey="title"
                            searchPlaceholder="Cari galeri..."
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
