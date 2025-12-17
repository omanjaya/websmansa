import { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sman1denpasar.sch.id'

export const metadata: Metadata = {
  title: 'Hubungi Kami',
  description: 'Hubungi SMA Negeri 1 Denpasar. Alamat: Jl. Kamboja No. 4, Denpasar Utara. Telepon: (0361) 226109. Email: info@sman1denpasar.sch.id.',
  keywords: ['kontak', 'hubungi kami', 'alamat sekolah', 'telepon', 'email', 'lokasi SMAN 1 Denpasar'],
  openGraph: {
    title: 'Hubungi SMA Negeri 1 Denpasar',
    description: 'Informasi kontak dan lokasi SMA Negeri 1 Denpasar',
    url: `${BASE_URL}/kontak`,
    siteName: 'SMAN 1 Denpasar',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/api/og?title=Hubungi%20Kami`,
        width: 1200,
        height: 630,
        alt: 'Kontak SMAN 1 Denpasar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hubungi SMA Negeri 1 Denpasar',
    description: 'Informasi kontak dan lokasi SMA Negeri 1 Denpasar',
    images: [`${BASE_URL}/api/og?title=Hubungi%20Kami`],
  },
  alternates: {
    canonical: `${BASE_URL}/kontak`,
  },
}

export default function KontakLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
