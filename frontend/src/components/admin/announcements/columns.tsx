import type { Column } from '@/components/admin/shared/AdminCRUDTable'
import type { Announcement } from '@/hooks/admin/useAnnouncements'

export const announcementColumns: Column<Announcement>[] = [
    {
        key: 'title',
        label: 'Judul',
        render: (announcement) => (
            <div>
                <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    {announcement.attributes.is_pinned && (
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c-.25.78.1 1.632.84 1.952l.815.407c.66.33 1.446.132 1.858-.474l1.305-1.932L10 12V4H9L4 6v4.274z" />
                        </svg>
                    )}
                    {announcement.attributes.title}
                </div>
                {announcement.attributes.excerpt && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                        {announcement.attributes.excerpt}
                    </div>
                )}
            </div>
        ),
    },
    {
        key: 'type',
        label: 'Tipe',
        width: '120px',
        render: (announcement) => {
            const typeLabels: Record<string, string> = {
                news: 'Berita',
                announcement: 'Pengumuman',
                event: 'Event',
                info: 'Informasi',
            }
            const typeColors: Record<string, string> = {
                news: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
                announcement: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
                event: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
                info: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400',
            }
            return (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeColors[announcement.attributes.type] || 'bg-gray-100 text-gray-700'}`}>
                    {typeLabels[announcement.attributes.type] || announcement.attributes.type}
                </span>
            )
        },
    },
    {
        key: 'priority',
        label: 'Prioritas',
        width: '100px',
        render: (announcement) => {
            const priorityLabels: Record<string, string> = {
                low: 'Rendah',
                normal: 'Normal',
                high: 'Tinggi',
                urgent: 'Urgent',
            }
            const priorityColors: Record<string, string> = {
                low: 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400',
                normal: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
                high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
                urgent: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
            }
            return (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[announcement.attributes.priority] || 'bg-gray-100 text-gray-700'}`}>
                    {priorityLabels[announcement.attributes.priority] || announcement.attributes.priority}
                </span>
            )
        },
    },
    {
        key: 'published_at',
        label: 'Tanggal Publish',
        width: '130px',
        render: (announcement) => {
            if (!announcement.attributes.published_at) return '-'
            return new Date(announcement.attributes.published_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            })
        },
    },
    {
        key: 'expires_at',
        label: 'Kadaluarsa',
        width: '130px',
        render: (announcement) => {
            if (!announcement.attributes.expires_at) return '-'
            const expiresDate = new Date(announcement.attributes.expires_at)
            const isExpired = expiresDate < new Date()
            return (
                <div className={isExpired ? 'text-red-600 dark:text-red-400' : ''}>
                    {expiresDate.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    })}
                </div>
            )
        },
    },
    {
        key: 'status',
        label: 'Status',
        width: '100px',
        render: (announcement) => (
            <div className="flex items-center gap-2">
                <span
                    className={`w-2 h-2 rounded-full ${
                        announcement.attributes.is_active
                            ? 'bg-green-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                />
                <span className="text-sm">
                    {announcement.attributes.is_active ? 'Aktif' : 'Nonaktif'}
                </span>
            </div>
        ),
    },
]
