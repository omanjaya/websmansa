import Image from 'next/image'
import type { Column } from '@/components/admin/shared/AdminCRUDTable'
import type { Slider } from '@/hooks/admin/useSliders'

export const sliderColumns: Column<Slider>[] = [
    {
        key: 'image',
        label: 'Gambar',
        width: '120px',
        render: (slider) => (
            <div className="w-20 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-slate-700">
                {slider.attributes.image_url ? (
                    <Image
                        src={slider.attributes.image_url}
                        alt={slider.attributes.title}
                        width={80}
                        height={48}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>
        ),
    },
    {
        key: 'title',
        label: 'Judul',
        render: (slider) => (
            <div>
                <div className="font-medium text-gray-900 dark:text-white">
                    {slider.attributes.title}
                </div>
                {slider.attributes.subtitle && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
                        {slider.attributes.subtitle}
                    </div>
                )}
            </div>
        ),
    },
    {
        key: 'button',
        label: 'Tombol',
        render: (slider) => {
            if (!slider.attributes.button_text) return '-'
            return (
                <div className="text-sm">
                    <div className="font-medium text-gray-900 dark:text-white">
                        {slider.attributes.button_text}
                    </div>
                    {slider.attributes.link && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                            {slider.attributes.link}
                        </div>
                    )}
                </div>
            )
        },
    },
    {
        key: 'order',
        label: 'Urutan',
        width: '80px',
        render: (slider) => (
            <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                <span className="font-medium">{slider.attributes.order}</span>
            </div>
        ),
    },
    {
        key: 'status',
        label: 'Status',
        width: '100px',
        render: (slider) => (
            <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                    slider.attributes.is_active
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                }`}
            >
                {slider.attributes.is_active ? 'Aktif' : 'Nonaktif'}
            </span>
        ),
    },
]
