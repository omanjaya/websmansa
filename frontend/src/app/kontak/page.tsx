import { KontakPage } from '@/components/kontak'
import { getServerSettings } from '@/lib/settings-server'
import { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sman1denpasar.sch.id'

export const metadata: Metadata = {
    title: 'Kontak',
    description: 'Hubungi SMA Negeri 1 Denpasar. Informasi alamat, telepon, email, dan jam operasional sekolah.',
    openGraph: {
        title: 'Kontak - SMA Negeri 1 Denpasar',
        description: 'Hubungi SMA Negeri 1 Denpasar untuk informasi lebih lanjut.',
        url: `${BASE_URL}/kontak`,
    },
}

export default async function Page() {
    // Fetch settings from API
    const settings = await getServerSettings()

    // Build contact info from settings (icons added in client component)
    const contactData = {
        address: settings.address || 'Jl. Kamboja No. 4, Denpasar, Bali 80111',
        phone: settings.phone || '(0361) 226109',
        email: settings.email || 'info@sman1denpasar.sch.id',
        weekdayHours: settings.weekday_hours || '07:00 - 15:00 WITA',
        saturdayHours: settings.saturday_hours || '07:00 - 12:00 WITA',
        mapsEmbed: settings.maps_embed || '',
    }

    // Get departments from settings (with fallback)
    const departments = settings.departments || [
        { name: 'Tata Usaha', email: 'tata.usaha@sman1denpasar.sch.id', phone: '(0361) 226109 ext. 101' },
        { name: 'Kesiswaan', email: 'kesiswaan@sman1denpasar.sch.id', phone: '(0361) 226109 ext. 102' },
        { name: 'Kurikulum', email: 'kurikulum@sman1denpasar.sch.id', phone: '(0361) 226109 ext. 103' },
        { name: 'Bimbingan Konseling', email: 'bk@sman1denpasar.sch.id', phone: '(0361) 226109 ext. 104' },
    ]

    return (
        <KontakPage
            contactData={contactData}
            departments={departments}
        />
    )
}
