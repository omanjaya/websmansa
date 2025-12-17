'use client'

import { ResponsiveView } from './ResponsiveView'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

interface ContactData {
    address: string
    phone: string
    email: string
    weekdayHours: string
    saturdayHours: string
    mapsEmbed: string
}

interface Department {
    name: string
    email: string
    phone: string
}

interface KontakPageProps {
    contactData: ContactData
    departments: Department[]
}

export function KontakPage({ contactData, departments }: KontakPageProps) {
    // Build contactInfo with icons in client component
    const contactInfo = [
        {
            icon: <MapPin className="w-6 h-6" />,
            title: 'Alamat',
            content: contactData.address,
        },
        {
            icon: <Phone className="w-6 h-6" />,
            title: 'Telepon',
            content: contactData.phone,
        },
        {
            icon: <Mail className="w-6 h-6" />,
            title: 'Email',
            content: contactData.email,
        },
        {
            icon: <Clock className="w-6 h-6" />,
            title: 'Jam Operasional',
            content: `Senin - Jumat: ${contactData.weekdayHours}\nSabtu: ${contactData.saturdayHours}`,
        },
    ]

    return <ResponsiveView contactInfo={contactInfo} departments={departments} />
}
