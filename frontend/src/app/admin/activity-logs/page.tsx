'use client'

import { useState } from 'react'
import {
    Activity,
    Search,
    Filter,
    Calendar,
    User,
    RefreshCw,
    Eye,
    Edit,
    Trash2,
    Upload,
    LogIn,
    LogOut,
    CheckCircle,
    XCircle,
    Archive,
    RotateCcw,
    PlusCircle,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getActivityLogs, getActivityLogStats, type ActivityLog } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { formatDistanceToNow, format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

const getActionIcon = (action: string) => {
    switch (action) {
        case 'create':
            return PlusCircle
        case 'update':
            return Edit
        case 'delete':
            return Trash2
        case 'login':
            return LogIn
        case 'logout':
            return LogOut
        case 'upload':
            return Upload
        case 'publish':
            return CheckCircle
        case 'unpublish':
            return XCircle
        case 'archive':
            return Archive
        case 'restore':
            return RotateCcw
        default:
            return Activity
    }
}

const getActionColor = (action: string) => {
    switch (action) {
        case 'create':
            return { bg: 'bg-green-100', text: 'text-green-600', badge: 'bg-green-100 text-green-700' }
        case 'update':
            return { bg: 'bg-blue-100', text: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' }
        case 'delete':
            return { bg: 'bg-red-100', text: 'text-red-600', badge: 'bg-red-100 text-red-700' }
        case 'login':
            return { bg: 'bg-purple-100', text: 'text-purple-600', badge: 'bg-purple-100 text-purple-700' }
        case 'logout':
            return { bg: 'bg-gray-100', text: 'text-gray-600', badge: 'bg-gray-100 text-gray-700' }
        case 'upload':
            return { bg: 'bg-cyan-100', text: 'text-cyan-600', badge: 'bg-cyan-100 text-cyan-700' }
        default:
            return { bg: 'bg-gray-100', text: 'text-gray-600', badge: 'bg-gray-100 text-gray-700' }
    }
}

const getActionLabel = (action: string) => {
    switch (action) {
        case 'create':
            return 'Membuat'
        case 'update':
            return 'Mengubah'
        case 'delete':
            return 'Menghapus'
        case 'login':
            return 'Login'
        case 'logout':
            return 'Logout'
        case 'upload':
            return 'Mengunggah'
        case 'publish':
            return 'Mempublikasi'
        case 'unpublish':
            return 'Membatalkan'
        case 'archive':
            return 'Mengarsipkan'
        case 'restore':
            return 'Memulihkan'
        default:
            return action
    }
}

export default function ActivityLogsPage() {
    const [search, setSearch] = useState('')
    const [actionFilter, setActionFilter] = useState<string>('all')
    const [page, setPage] = useState(1)
    const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null)

    const { data: logsData, isLoading, refetch } = useQuery({
        queryKey: ['activity-logs', { search, action: actionFilter, page }],
        queryFn: () => getActivityLogs({
            search: search || undefined,
            action: actionFilter !== 'all' ? actionFilter : undefined,
            page,
            per_page: 20,
        }),
    })

    const { data: statsData, isLoading: isLoadingStats } = useQuery({
        queryKey: ['activity-logs-stats'],
        queryFn: () => getActivityLogStats(30),
    })

    const logs = logsData?.data || []
    const meta = logsData?.meta
    const stats = statsData?.data

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Pantau semua aktivitas di admin panel
                    </p>
                </div>
                <Button variant="outline" onClick={() => refetch()}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-xs font-medium text-gray-500 uppercase">
                            Total Aktivitas (30 hari)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        {isLoadingStats ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold">{stats?.total || 0}</div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-xs font-medium text-gray-500 uppercase">
                            Pembuatan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        {isLoadingStats ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold text-green-600">
                                {stats?.by_action?.create || 0}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-xs font-medium text-gray-500 uppercase">
                            Perubahan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        {isLoadingStats ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold text-blue-600">
                                {stats?.by_action?.update || 0}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-xs font-medium text-gray-500 uppercase">
                            Penghapusan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        {isLoadingStats ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold text-red-600">
                                {stats?.by_action?.delete || 0}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Cari aktivitas..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value)
                                    setPage(1)
                                }}
                                className="pl-10"
                            />
                        </div>
                        <Select value={actionFilter} onValueChange={(value) => {
                            setActionFilter(value)
                            setPage(1)
                        }}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <Filter className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Filter aksi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Aksi</SelectItem>
                                <SelectItem value="create">Membuat</SelectItem>
                                <SelectItem value="update">Mengubah</SelectItem>
                                <SelectItem value="delete">Menghapus</SelectItem>
                                <SelectItem value="login">Login</SelectItem>
                                <SelectItem value="logout">Logout</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Activity List */}
            <Card>
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base font-semibold">Daftar Aktivitas</CardTitle>
                    <CardDescription>
                        {meta?.total || 0} aktivitas ditemukan
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
                                    <Skeleton className="w-10 h-10 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-3 w-64" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-12">
                            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Tidak ada aktivitas ditemukan</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {logs.map((log) => {
                                const Icon = getActionIcon(log.action)
                                const colors = getActionColor(log.action)

                                return (
                                    <div
                                        key={log.id}
                                        className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => setSelectedLog(log)}
                                    >
                                        <div className={`w-10 h-10 ${colors.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                                            <Icon className={`w-5 h-5 ${colors.text}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-medium text-gray-900">
                                                    {log.user?.name || 'System'}
                                                </span>
                                                <Badge className={colors.badge}>
                                                    {getActionLabel(log.action)}
                                                </Badge>
                                                {log.model_type && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {log.model_type.split('\\').pop()}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1 truncate">
                                                {log.description}
                                            </p>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDistanceToNow(new Date(log.created_at), {
                                                        addSuffix: true,
                                                        locale: idLocale
                                                    })}
                                                </span>
                                                {log.ip_address && (
                                                    <span>IP: {log.ip_address}</span>
                                                )}
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="flex-shrink-0">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {meta && meta.last_page > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t">
                            <p className="text-sm text-gray-500">
                                Halaman {meta.current_page} dari {meta.last_page}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                >
                                    Sebelumnya
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page === meta.last_page}
                                    onClick={() => setPage(p => p + 1)}
                                >
                                    Selanjutnya
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Detail Dialog */}
            <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Detail Aktivitas</DialogTitle>
                        <DialogDescription>
                            Informasi lengkap tentang aktivitas ini
                        </DialogDescription>
                    </DialogHeader>
                    {selectedLog && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">Pengguna</label>
                                    <p className="mt-1 text-sm">{selectedLog.user?.name || 'System'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">Aksi</label>
                                    <p className="mt-1 text-sm capitalize">{getActionLabel(selectedLog.action)}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">Model</label>
                                    <p className="mt-1 text-sm">{selectedLog.model_type?.split('\\').pop() || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">Model ID</label>
                                    <p className="mt-1 text-sm">{selectedLog.model_id || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">IP Address</label>
                                    <p className="mt-1 text-sm">{selectedLog.ip_address || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">Waktu</label>
                                    <p className="mt-1 text-sm">
                                        {format(new Date(selectedLog.created_at), 'dd MMM yyyy, HH:mm:ss', { locale: idLocale })}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase">Deskripsi</label>
                                <p className="mt-1 text-sm">{selectedLog.description}</p>
                            </div>

                            {selectedLog.user_agent && (
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">User Agent</label>
                                    <p className="mt-1 text-xs text-gray-500 break-all">{selectedLog.user_agent}</p>
                                </div>
                            )}

                            {selectedLog.old_values && Object.keys(selectedLog.old_values).length > 0 && (
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">Nilai Lama</label>
                                    <pre className="mt-1 text-xs bg-gray-100 p-3 rounded-lg overflow-x-auto">
                                        {JSON.stringify(selectedLog.old_values, null, 2)}
                                    </pre>
                                </div>
                            )}

                            {selectedLog.new_values && Object.keys(selectedLog.new_values).length > 0 && (
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase">Nilai Baru</label>
                                    <pre className="mt-1 text-xs bg-gray-100 p-3 rounded-lg overflow-x-auto">
                                        {JSON.stringify(selectedLog.new_values, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
