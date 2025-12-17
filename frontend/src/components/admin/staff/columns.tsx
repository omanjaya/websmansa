import Image from 'next/image'
import type { Column } from '@/components/admin/shared/AdminCRUDTable'
import type { Staff } from '@/hooks/admin/useStaff'

export const staffColumns: Column<Staff>[] = [
    {
        key: 'photo',
        label: 'Foto',
        width: '80px',
        render: (staff) => (
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-slate-700">
                {staff.attributes.photo_url ? (
                    <Image
                        src={staff.attributes.photo_url}
                        alt={staff.attributes.name}
                        width={48}
                        height={48}
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                )}
            </div>
        ),
    },
    {
        key: 'name',
        label: 'Nama',
        render: (staff) => (
            <div>
                <div className="font-medium text-gray-900 dark:text-white">
                    {staff.attributes.name}
                </div>
                {staff.attributes.nip && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        NIP: {staff.attributes.nip}
                    </div>
                )}
            </div>
        ),
    },
    {
        key: 'position',
        label: 'Posisi',
        render: (staff) => staff.attributes.position,
    },
    {
        key: 'type',
        label: 'Tipe',
        render: (staff) => {
            const typeLabels: Record<string, string> = {
                teacher: 'Guru',
                admin: 'Admin',
                staff: 'Staff',
                headmaster: 'Kepala Sekolah',
            }
            return (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                    {typeLabels[staff.attributes.type] || staff.attributes.type}
                </span>
            )
        },
    },
    {
        key: 'department',
        label: 'Departemen',
        render: (staff) => staff.attributes.department || '-',
    },
    {
        key: 'status',
        label: 'Status',
        render: (staff) => (
            <div className="flex items-center gap-2">
                <span
                    className={`w-2 h-2 rounded-full ${
                        staff.attributes.is_active
                            ? 'bg-green-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                />
                <span className="text-sm">
                    {staff.attributes.is_active ? 'Aktif' : 'Nonaktif'}
                </span>
                {staff.attributes.is_featured && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                        Unggulan
                    </span>
                )}
            </div>
        ),
    },
]
