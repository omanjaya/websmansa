'use client'

import { useState } from 'react'
import { UserCog, Search, Plus, Edit, Trash2, Shield, Mail, Phone, ToggleLeft, ToggleRight, RefreshCw } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUsers, getUserStats, deleteUser, toggleUserActive, type User } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

const roleConfig = {
    super_admin: { label: 'Super Admin', color: 'bg-purple-100 text-purple-700' },
    admin: { label: 'Admin', color: 'bg-blue-100 text-blue-700' },
    editor: { label: 'Editor', color: 'bg-green-100 text-green-700' },
    contributor: { label: 'Kontributor', color: 'bg-yellow-100 text-yellow-700' },
}

export default function UsersPage() {
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState<string>('all')
    const [page, setPage] = useState(1)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const queryClient = useQueryClient()

    const { data: usersData, isLoading, refetch } = useQuery({
        queryKey: ['users', { search, role: roleFilter, page }],
        queryFn: () => getUsers({ search: search || undefined, role: roleFilter !== 'all' ? roleFilter : undefined, page, per_page: 20 }),
    })

    const { data: statsData, isLoading: isLoadingStats } = useQuery({
        queryKey: ['users-stats'],
        queryFn: getUserStats,
    })

    const toggleMutation = useMutation({
        mutationFn: toggleUserActive,
        onSuccess: () => { toast.success('Status pengguna diperbarui'); queryClient.invalidateQueries({ queryKey: ['users'] }) },
        onError: (error: Error) => toast.error(error.message),
    })

    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => { toast.success('Pengguna dihapus'); queryClient.invalidateQueries({ queryKey: ['users'] }); setDeleteId(null) },
        onError: (error: Error) => toast.error(error.message),
    })

    const users = usersData?.data || []
    const meta = usersData?.meta
    const stats = statsData?.data

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h1><p className="text-sm text-gray-500 mt-0.5">Kelola admin dan editor website</p></div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => refetch()}><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
                    <Button><Plus className="w-4 h-4 mr-2" />Tambah Pengguna</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                {[{ label: 'Total Pengguna', value: stats?.total, color: '' },
                { label: 'Aktif', value: stats?.active, color: 'text-green-600' },
                { label: 'Tidak Aktif', value: stats?.inactive, color: 'text-red-600' },
                { label: 'Aktif Minggu Ini', value: stats?.recently_active, color: 'text-blue-600' }].map((stat, i) => (
                    <Card key={i}><CardHeader className="p-4 pb-2"><CardTitle className="text-xs font-medium text-gray-500 uppercase">{stat.label}</CardTitle></CardHeader>
                        <CardContent className="p-4 pt-0">{isLoadingStats ? <Skeleton className="h-8 w-16" /> : <div className={`text-2xl font-bold ${stat.color}`}>{stat.value || 0}</div>}</CardContent></Card>
                ))}
            </div>

            <Card><CardContent className="p-4"><div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Cari nama atau email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="pl-10" /></div>
                <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1) }}><SelectTrigger className="w-full md:w-[180px]"><Shield className="w-4 h-4 mr-2" /><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="all">Semua Role</SelectItem><SelectItem value="super_admin">Super Admin</SelectItem><SelectItem value="admin">Admin</SelectItem><SelectItem value="editor">Editor</SelectItem><SelectItem value="contributor">Kontributor</SelectItem></SelectContent></Select>
            </div></CardContent></Card>

            <Card><CardHeader className="p-4 pb-2"><CardTitle className="text-base font-semibold">Daftar Pengguna</CardTitle><CardDescription>{meta?.total || 0} pengguna</CardDescription></CardHeader>
                <CardContent className="p-4 pt-2">
                    {isLoading ? <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="flex gap-4 p-4 border rounded-lg"><Skeleton className="w-12 h-12 rounded-full" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-48" /><Skeleton className="h-3 w-64" /></div></div>)}</div>
                        : users.length === 0 ? <div className="text-center py-12"><UserCog className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">Tidak ada pengguna</p></div>
                            : <div className="space-y-3">{users.map((user) => {
                                const role = roleConfig[user.role as keyof typeof roleConfig] || { label: user.role, color: 'bg-gray-100 text-gray-700' }
                                return (<div key={user.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg">{user.name.charAt(0).toUpperCase()}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap"><span className="font-medium text-gray-900">{user.name}</span><Badge className={role.color}>{role.label}</Badge>{!user.is_active && <Badge variant="outline" className="text-red-600 border-red-200">Nonaktif</Badge>}</div>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500"><span className="flex items-center gap-1"><Mail className="w-3 h-3" />{user.email}</span>{user.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{user.phone}</span>}</div>
                                        {user.last_login_at && <p className="text-xs text-gray-400 mt-1">Login terakhir: {formatDistanceToNow(new Date(user.last_login_at), { addSuffix: true, locale: idLocale })}</p>}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => toggleMutation.mutate(user.id)} title={user.is_active ? 'Nonaktifkan' : 'Aktifkan'}>{user.is_active ? <ToggleRight className="w-5 h-5 text-green-600" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}</Button>
                                        <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => setDeleteId(user.id)}><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                </div>)
                            })}</div>}
                    {meta && meta.last_page > 1 && <div className="flex items-center justify-between mt-6 pt-4 border-t"><p className="text-sm text-gray-500">Halaman {meta.current_page} dari {meta.last_page}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Sebelumnya</Button><Button variant="outline" size="sm" disabled={page === meta.last_page} onClick={() => setPage(p => p + 1)}>Selanjutnya</Button></div></div>}
                </CardContent></Card>

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hapus Pengguna?</AlertDialogTitle><AlertDialogDescription>Pengguna akan dihapus permanen.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteId && deleteMutation.mutate(deleteId)}>Hapus</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
        </div>
    )
}
