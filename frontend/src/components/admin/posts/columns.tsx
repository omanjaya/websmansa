import type { Column } from '@/components/admin/shared/AdminCRUDTable'
import type { Post } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { FileText, Star, Pin } from 'lucide-react'

export const postColumns: Column<Post>[] = [
    {
        key: 'title',
        label: 'Judul',
        render: (post) => (
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {post.attributes.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                        {post.attributes.excerpt}
                    </p>
                </div>
            </div>
        ),
    },
    {
        key: 'type',
        label: 'Kategori',
        render: (post) => {
            const type = post.attributes.type
            const colorMap: Record<string, string> = {
                'berita': 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
                'artikel': 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
                'pengumuman': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
            }
            return (
                <Badge variant="secondary" className={colorMap[type] || 'bg-gray-100 text-gray-700'}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                </Badge>
            )
        },
    },
    {
        key: 'status',
        label: 'Status',
        render: (post) => {
            const status = post.attributes.status
            const colorMap: Record<string, string> = {
                'published': 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
                'draft': 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400',
                'archived': 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
            }
            const labelMap: Record<string, string> = {
                'published': 'Dipublikasi',
                'draft': 'Draft',
                'archived': 'Diarsipkan',
            }
            return (
                <Badge variant="secondary" className={colorMap[status] || ''}>
                    {labelMap[status] || status}
                </Badge>
            )
        },
    },
    {
        key: 'views',
        label: 'Views',
        render: (post) => (
            <div className="text-sm text-gray-600 dark:text-gray-400">
                {post.attributes.views.toLocaleString('id-ID')}
            </div>
        ),
    },
    {
        key: 'featured',
        label: 'Featured',
        render: (post) => (
            <div className="flex gap-2">
                {post.attributes.is_featured && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                    </Badge>
                )}
                {post.attributes.is_pinned && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                        <Pin className="w-3 h-3 mr-1" />
                        Pinned
                    </Badge>
                )}
            </div>
        ),
    },
    {
        key: 'published_at',
        label: 'Dipublikasi',
        render: (post) => {
            const date = post.attributes.published_at
            return date ? (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    {format(new Date(date), 'dd MMM yyyy', { locale: idLocale })}
                </div>
            ) : (
                <span className="text-sm text-gray-400">-</span>
            )
        },
    },
]
