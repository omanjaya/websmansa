'use client'

import { useState } from 'react'
import { CalendarDays, Search, Plus, Edit, Trash2, Clock, MapPin, User, BookOpen, RefreshCw, ChevronDown } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSchedules, getSchoolClasses, getSubjects, deleteSchedule, type Schedule } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

const dayLabels: Record<string, string> = {
    monday: 'Senin', tuesday: 'Selasa', wednesday: 'Rabu', thursday: 'Kamis', friday: 'Jumat', saturday: 'Sabtu'
}

const dayColors: Record<string, string> = {
    monday: 'bg-blue-100 text-blue-700', tuesday: 'bg-green-100 text-green-700', wednesday: 'bg-yellow-100 text-yellow-700',
    thursday: 'bg-purple-100 text-purple-700', friday: 'bg-pink-100 text-pink-700', saturday: 'bg-orange-100 text-orange-700'
}

export default function SchedulesPage() {
    const [search, setSearch] = useState('')
    const [dayFilter, setDayFilter] = useState<string>('all')
    const [classFilter, setClassFilter] = useState<string>('all')
    const [page, setPage] = useState(1)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const queryClient = useQueryClient()

    const { data: schedulesData, isLoading, refetch } = useQuery({
        queryKey: ['schedules', { search, day: dayFilter, class_id: classFilter, page }],
        queryFn: () => getSchedules({
            search: search || undefined,
            day: dayFilter !== 'all' ? dayFilter : undefined,
            class_id: classFilter !== 'all' ? parseInt(classFilter) : undefined,
            page, per_page: 20
        }),
    })

    const { data: classesData } = useQuery({
        queryKey: ['school-classes-list'],
        queryFn: () => getSchoolClasses({ per_page: 100 }),
    })

    const deleteMutation = useMutation({
        mutationFn: deleteSchedule,
        onSuccess: () => { toast.success('Jadwal dihapus'); queryClient.invalidateQueries({ queryKey: ['schedules'] }); setDeleteId(null) },
        onError: (error: Error) => toast.error(error.message),
    })

    const schedules = schedulesData?.data || []
    const meta = schedulesData?.meta
    const classes = classesData?.data || []

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold text-gray-900">Jadwal Pelajaran</h1><p className="text-sm text-gray-500 mt-0.5">Kelola jadwal pelajaran sekolah</p></div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => refetch()}><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
                    <Button><Plus className="w-4 h-4 mr-2" />Tambah Jadwal</Button>
                </div>
            </div>

            <Card><CardContent className="p-4"><div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Cari mapel, guru, ruangan..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="pl-10" /></div>
                <Select value={dayFilter} onValueChange={(v) => { setDayFilter(v); setPage(1) }}><SelectTrigger className="w-full md:w-[150px]"><CalendarDays className="w-4 h-4 mr-2" /><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="all">Semua Hari</SelectItem>{Object.entries(dayLabels).map(([val, label]) => <SelectItem key={val} value={val}>{label}</SelectItem>)}</SelectContent></Select>
                <Select value={classFilter} onValueChange={(v) => { setClassFilter(v); setPage(1) }}><SelectTrigger className="w-full md:w-[150px]"><BookOpen className="w-4 h-4 mr-2" /><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="all">Semua Kelas</SelectItem>{classes.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent></Select>
            </div></CardContent></Card>

            <Card><CardHeader className="p-4 pb-2"><CardTitle className="text-base font-semibold">Daftar Jadwal</CardTitle><CardDescription>{meta?.total || 0} jadwal</CardDescription></CardHeader>
                <CardContent className="p-4 pt-2">
                    {isLoading ? <div className="space-y-4">{[1, 2, 3, 4, 5].map(i => <div key={i} className="flex gap-4 p-4 border rounded-lg"><Skeleton className="w-20 h-20" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-48" /><Skeleton className="h-3 w-64" /><Skeleton className="h-3 w-32" /></div></div>)}</div>
                        : schedules.length === 0 ? <div className="text-center py-12"><CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">Tidak ada jadwal</p></div>
                            : <div className="space-y-3">{schedules.map((schedule) => (
                                <div key={schedule.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
                                    <div className={`w-20 h-20 rounded-lg flex flex-col items-center justify-center ${dayColors[schedule.day] || 'bg-gray-100'}`}>
                                        <span className="text-xs font-medium uppercase">{dayLabels[schedule.day]?.substring(0, 3)}</span>
                                        <span className="text-lg font-bold">{schedule.start_time?.substring(0, 5)}</span>
                                        <span className="text-xs">{schedule.end_time?.substring(0, 5)}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-semibold text-gray-900">{schedule.subject?.name || '-'}</span>
                                            <Badge variant="outline">{schedule.school_class?.name || '-'}</Badge>
                                        </div>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                            <span className="flex items-center gap-1"><User className="w-3 h-3" />{schedule.teacher?.name || '-'}</span>
                                            {schedule.room && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{schedule.room}</span>}
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{schedule.start_time?.substring(0, 5)} - {schedule.end_time?.substring(0, 5)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                                            <span>Tahun Ajaran: {schedule.academic_year}</span>
                                            <span>|</span>
                                            <span>Semester: {schedule.semester === 'odd' ? 'Ganjil' : 'Genap'}</span>
                                        </div>
                                    </div>
                                    <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><ChevronDown className="w-4 h-4" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end"><DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem><DropdownMenuItem className="text-red-600" onClick={() => setDeleteId(schedule.id)}><Trash2 className="w-4 h-4 mr-2" />Hapus</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
                                </div>
                            ))}</div>}
                    {meta && meta.last_page > 1 && <div className="flex items-center justify-between mt-6 pt-4 border-t"><p className="text-sm text-gray-500">Halaman {meta.current_page} dari {meta.last_page}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Sebelumnya</Button><Button variant="outline" size="sm" disabled={page === meta.last_page} onClick={() => setPage(p => p + 1)}>Selanjutnya</Button></div></div>}
                </CardContent></Card>

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hapus Jadwal?</AlertDialogTitle><AlertDialogDescription>Jadwal akan dihapus permanen.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteId && deleteMutation.mutate(deleteId)}>Hapus</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
        </div>
    )
}
