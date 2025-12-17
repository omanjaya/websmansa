import type { Column } from '@/components/admin/shared/AdminCRUDTable'
import type { Facility } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Building2, Users, MapPin, Calendar } from 'lucide-react'

export const facilityColumns: Column<Facility>[] = [
    {
        key: 'name',
        label: 'Nama Fasilitas',
        render: (facility) => (
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {facility.attributes.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                        {facility.attributes.short_description || facility.attributes.description}
                    </p>
                </div>
            </div>
        ),
    },
    {
        key: 'category',
        label: 'Kategori',
        render: (facility) => {
            const category = facility.attributes.category
            const colorMap: Record<string, string> = {
                'ruang_kelas': 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
                'laboratorium': 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
                'lapangan': 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
                'perpustakaan': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
                'aula': 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
            }
            const displayName = category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            return (
                <Badge variant="secondary" className={colorMap[category.toLowerCase()] || 'bg-gray-100 text-gray-700'}>
                    {displayName}
                </Badge>
            )
        },
    },
    {
        key: 'location',
        label: 'Lokasi',
        render: (facility) => {
            const location = facility.attributes.location
            return location ? (
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    {location}
                </div>
            ) : (
                <span className="text-sm text-gray-400">-</span>
            )
        },
    },
    {
        key: 'capacity',
        label: 'Kapasitas',
        render: (facility) => {
            const capacity = facility.attributes.capacity
            return capacity ? (
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {capacity} orang
                    </span>
                </div>
            ) : (
                <span className="text-sm text-gray-400">-</span>
            )
        },
    },
    {
        key: 'is_bookable',
        label: 'Bookable',
        render: (facility) => {
            const isBookable = facility.attributes.is_bookable
            return isBookable ? (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    Bisa Dipesan
                </Badge>
            ) : (
                <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    Tidak Bisa Dipesan
                </Badge>
            )
        },
    },
    {
        key: 'is_active',
        label: 'Status',
        render: (facility) => {
            const isActive = facility.attributes.is_active
            return (
                <Badge
                    variant="secondary"
                    className={isActive
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                    }
                >
                    {isActive ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
            )
        },
    },
]
