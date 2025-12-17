'use client'

import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/lib/admin-api'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Search, Edit, Eye, Users } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'

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

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
}

export function MobileView() {
    const [searchQuery, setSearchQuery] = useState('')

    const { data, isLoading } = useQuery({
        queryKey: ['admin-staff'],
        queryFn: async () => {
            const response = await adminApi.get('/staff', { per_page: 100 })
            return response.data as Staff[]
        },
    })

    const filteredData = data?.filter((staff) =>
        staff.attributes.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const teachersCount = data?.filter(s => s.attributes.type === 'teacher').length || 0
    const adminCount = data?.filter(s => s.attributes.type === 'admin').length || 0
    const activeCount = data?.filter(s => s.attributes.is_active).length || 0

    const typeColors: Record<string, string> = {
        teacher: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        counselor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        headmaster: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        staff: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header with sticky add button */}
            <div className="sticky top-0 z-10 bg-gradient-to-br from-purple-600 to-purple-800 px-4 py-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-white">
                        <h1 className="text-2xl font-bold">Staff</h1>
                        <p className="text-purple-100 text-sm">Kelola data staff & guru</p>
                    </div>
                    <Button asChild size="sm" className="bg-white text-purple-600 hover:bg-purple-50">
                        <Link href="/admin/staff/create">
                            <Plus className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Cari staff..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/95 dark:bg-slate-800/95 border-0"
                    />
                </div>
            </div>

            {/* Stats Grid - 2x2 */}
            <div className="px-4 -mt-3 mb-6">
                <div className="grid grid-cols-2 gap-3">
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground mb-1">Total Staff</p>
                            <p className="text-2xl font-bold">{data?.length || 0}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground mb-1">Guru</p>
                            <p className="text-2xl font-bold text-blue-600">{teachersCount}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground mb-1">Admin</p>
                            <p className="text-2xl font-bold text-purple-600">{adminCount}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground mb-1">Aktif</p>
                            <p className="text-2xl font-bold text-green-600">{activeCount}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Staff Cards */}
            {isLoading ? (
                <div className="px-4 py-12 text-center">
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            ) : filteredData && filteredData.length > 0 ? (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="px-4 space-y-3"
                >
                    {filteredData.map((staff) => {
                        return (
                            <motion.div key={staff.id} variants={item}>
                                <Card className="hover:shadow-md transition-all">
                                    <CardContent className="p-0">
                                        <div className="flex gap-3 p-4">
                                            {/* Photo */}
                                            <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
                                                {staff.attributes.photo_url ? (
                                                    <Image
                                                        src={staff.attributes.photo_url}
                                                        alt={staff.attributes.name}
                                                        width={64}
                                                        height={64}
                                                        className="object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-lg font-medium">
                                                        {staff.attributes.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-sm mb-0.5 line-clamp-1">
                                                    {staff.attributes.name}
                                                </h3>

                                                {staff.attributes.nip && (
                                                    <p className="text-xs text-muted-foreground mb-1">
                                                        NIP: {staff.attributes.nip}
                                                    </p>
                                                )}

                                                <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                                                    {staff.attributes.position}
                                                </p>

                                                <div className="flex flex-wrap gap-1.5">
                                                    <Badge
                                                        variant="secondary"
                                                        className={`text-xs ${typeColors[staff.attributes.type] || typeColors.staff}`}
                                                    >
                                                        {staff.attributes.type_label}
                                                    </Badge>
                                                    <Badge
                                                        variant={staff.attributes.is_active ? 'default' : 'secondary'}
                                                        className="text-xs"
                                                    >
                                                        {staff.attributes.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="border-t dark:border-slate-700 px-4 py-2 flex gap-2">
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="sm"
                                                className="flex-1 text-xs"
                                            >
                                                <Link href={`/admin/staff/${staff.id}`}>
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    Detail
                                                </Link>
                                            </Button>
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="sm"
                                                className="flex-1 text-xs"
                                            >
                                                <Link href={`/admin/staff/${staff.id}/edit`}>
                                                    <Edit className="h-3 w-3 mr-1" />
                                                    Edit
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )
                    })}
                </motion.div>
            ) : (
                <div className="px-4 py-12 text-center">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                        {searchQuery ? 'Staff tidak ditemukan' : 'Belum ada staff'}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                        {searchQuery ? 'Coba kata kunci lain' : 'Mulai dengan menambahkan staff baru'}
                    </p>
                    {!searchQuery && (
                        <Button asChild>
                            <Link href="/admin/staff/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Staff
                            </Link>
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}
