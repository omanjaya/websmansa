'use client'

import { useState } from 'react'
import { Mail, Search, Filter, Eye, Trash2, Archive, CheckCircle, MessageCircle, RefreshCw, MailOpen, ChevronDown, Clock, Phone, Globe } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getContactMessages, getContactMessageStats, markMessageAsReplied, archiveMessage, deleteContactMessage, type ContactMessage } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { formatDistanceToNow, format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

const statusConfig = {
    unread: { label: 'Belum Dibaca', color: 'bg-red-100 text-red-700', icon: Mail },
    read: { label: 'Sudah Dibaca', color: 'bg-blue-100 text-blue-700', icon: MailOpen },
    replied: { label: 'Sudah Dibalas', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    archived: { label: 'Diarsipkan', color: 'bg-gray-100 text-gray-700', icon: Archive },
}

export default function ContactMessagesPage() {
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [page, setPage] = useState(1)
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
    const [replyNotes, setReplyNotes] = useState('')
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const queryClient = useQueryClient()

    const { data: messagesData, isLoading, refetch } = useQuery({
        queryKey: ['contact-messages', { search, status: statusFilter, page }],
        queryFn: () => getContactMessages({ search: search || undefined, status: statusFilter !== 'all' ? statusFilter : undefined, page, per_page: 20 }),
    })

    const { data: statsData, isLoading: isLoadingStats } = useQuery({
        queryKey: ['contact-messages-stats'],
        queryFn: getContactMessageStats,
    })

    const replyMutation = useMutation({
        mutationFn: ({ id, notes }: { id: number; notes?: string }) => markMessageAsReplied(id, notes),
        onSuccess: () => { toast.success('Pesan ditandai sudah dibalas'); queryClient.invalidateQueries({ queryKey: ['contact-messages'] }); setSelectedMessage(null) },
        onError: (error: Error) => toast.error(error.message),
    })

    const archiveMutation = useMutation({
        mutationFn: archiveMessage,
        onSuccess: () => { toast.success('Pesan diarsipkan'); queryClient.invalidateQueries({ queryKey: ['contact-messages'] }) },
    })

    const deleteMutation = useMutation({
        mutationFn: deleteContactMessage,
        onSuccess: () => { toast.success('Pesan dihapus'); queryClient.invalidateQueries({ queryKey: ['contact-messages'] }); setDeleteId(null) },
    })

    const messages = messagesData?.data || []
    const meta = messagesData?.meta
    const stats = statsData?.data

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold text-gray-900">Pesan Kontak</h1><p className="text-sm text-gray-500 mt-0.5">Kelola pesan dari form kontak</p></div>
                <Button variant="outline" onClick={() => refetch()}><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                {[{ label: 'Belum Dibaca', value: stats?.unread, color: 'text-red-600', icon: Mail },
                { label: 'Sudah Dibaca', value: stats?.read, color: 'text-blue-600', icon: MailOpen },
                { label: 'Sudah Dibalas', value: stats?.replied, color: 'text-green-600', icon: CheckCircle },
                { label: 'Bulan Ini', value: stats?.this_month, color: '', icon: MessageCircle }].map((stat, i) => (
                    <Card key={i}><CardHeader className="p-4 pb-2"><CardTitle className="text-xs font-medium text-gray-500 uppercase flex items-center gap-2"><stat.icon className="w-4 h-4" />{stat.label}</CardTitle></CardHeader>
                        <CardContent className="p-4 pt-0">{isLoadingStats ? <Skeleton className="h-8 w-16" /> : <div className={`text-2xl font-bold ${stat.color}`}>{stat.value || 0}</div>}</CardContent></Card>
                ))}
            </div>

            <Card><CardContent className="p-4"><div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Cari..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="pl-10" /></div>
                <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}><SelectTrigger className="w-full md:w-[180px]"><Filter className="w-4 h-4 mr-2" /><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="all">Semua</SelectItem><SelectItem value="unread">Belum Dibaca</SelectItem><SelectItem value="read">Sudah Dibaca</SelectItem><SelectItem value="replied">Sudah Dibalas</SelectItem><SelectItem value="archived">Diarsipkan</SelectItem></SelectContent></Select>
            </div></CardContent></Card>

            <Card><CardHeader className="p-4 pb-2"><CardTitle className="text-base font-semibold">Daftar Pesan</CardTitle><CardDescription>{meta?.total || 0} pesan</CardDescription></CardHeader>
                <CardContent className="p-4 pt-2">
                    {isLoading ? <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="flex gap-4 p-4 border rounded-lg"><Skeleton className="w-10 h-10 rounded-full" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-48" /><Skeleton className="h-3 w-64" /></div></div>)}</div>
                        : messages.length === 0 ? <div className="text-center py-12"><Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">Tidak ada pesan</p></div>
                            : <div className="space-y-3">{messages.map((msg) => {
                                const status = statusConfig[msg.status]; const Icon = status.icon
                                return (<div key={msg.id} className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer ${msg.status === 'unread' ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`} onClick={() => setSelectedMessage(msg)}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${msg.status === 'unread' ? 'bg-blue-100' : 'bg-gray-100'}`}><Icon className={`w-5 h-5 ${msg.status === 'unread' ? 'text-blue-600' : 'text-gray-500'}`} /></div>
                                    <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><span className="font-medium">{msg.name}</span><Badge className={status.color}>{status.label}</Badge></div><p className="text-sm font-medium mt-1">{msg.subject}</p><p className="text-sm text-gray-500 truncate">{msg.message}</p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400"><span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDistanceToNow(new Date(msg.created_at), { addSuffix: true, locale: idLocale })}</span><span>{msg.email}</span></div></div>
                                    <DropdownMenu><DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}><Button variant="ghost" size="icon"><ChevronDown className="w-4 h-4" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end"><DropdownMenuItem onClick={e => { e.stopPropagation(); setSelectedMessage(msg) }}><Eye className="w-4 h-4 mr-2" />Lihat</DropdownMenuItem>
                                            {msg.status !== 'archived' && <DropdownMenuItem onClick={e => { e.stopPropagation(); archiveMutation.mutate(msg.id) }}><Archive className="w-4 h-4 mr-2" />Arsipkan</DropdownMenuItem>}
                                            <DropdownMenuItem className="text-red-600" onClick={e => { e.stopPropagation(); setDeleteId(msg.id) }}><Trash2 className="w-4 h-4 mr-2" />Hapus</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
                                </div>)
                            })}</div>}
                    {meta && meta.last_page > 1 && <div className="flex items-center justify-between mt-6 pt-4 border-t"><p className="text-sm text-gray-500">Halaman {meta.current_page} dari {meta.last_page}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Sebelumnya</Button><Button variant="outline" size="sm" disabled={page === meta.last_page} onClick={() => setPage(p => p + 1)}>Selanjutnya</Button></div></div>}
                </CardContent></Card>

            <Dialog open={!!selectedMessage} onOpenChange={() => { setSelectedMessage(null); setReplyNotes('') }}>
                <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Detail Pesan</DialogTitle><DialogDescription>Dari: {selectedMessage?.name}</DialogDescription></DialogHeader>
                    {selectedMessage && <div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-medium text-gray-500 uppercase">Email</label><p className="mt-1 text-sm">{selectedMessage.email}</p></div>
                        {selectedMessage.phone && <div><label className="text-xs font-medium text-gray-500 uppercase">Telepon</label><p className="mt-1 text-sm">{selectedMessage.phone}</p></div>}
                        <div><label className="text-xs font-medium text-gray-500 uppercase">Waktu</label><p className="mt-1 text-sm">{format(new Date(selectedMessage.created_at), 'dd MMM yyyy, HH:mm', { locale: idLocale })}</p></div></div>
                        <div><label className="text-xs font-medium text-gray-500 uppercase">Subjek</label><p className="mt-1 font-medium">{selectedMessage.subject}</p></div>
                        <div><label className="text-xs font-medium text-gray-500 uppercase">Pesan</label><div className="mt-1 p-4 bg-gray-50 rounded-lg text-sm whitespace-pre-wrap">{selectedMessage.message}</div></div>
                        {selectedMessage.status !== 'replied' && <div className="pt-4 border-t"><label className="text-xs font-medium text-gray-500 uppercase">Catatan (opsional)</label><Textarea value={replyNotes} onChange={e => setReplyNotes(e.target.value)} placeholder="Catatan balasan..." className="mt-2" rows={3} /></div>}</div>}
                    <DialogFooter><Button variant="outline" onClick={() => setSelectedMessage(null)}>Tutup</Button>{selectedMessage && selectedMessage.status !== 'replied' && <Button onClick={() => replyMutation.mutate({ id: selectedMessage.id, notes: replyNotes })} disabled={replyMutation.isPending}><CheckCircle className="w-4 h-4 mr-2" />Tandai Dibalas</Button>}</DialogFooter></DialogContent></Dialog>

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hapus Pesan?</AlertDialogTitle><AlertDialogDescription>Pesan akan dihapus permanen.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteId && deleteMutation.mutate(deleteId)}>Hapus</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
        </div>
    )
}
