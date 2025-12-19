import { Metadata } from 'next'
import { getAchievements, Achievement } from '@/lib/api'
import { PrestasiPage } from '@/components/prestasi'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sman1denpasar.sch.id'

export const metadata: Metadata = {
    title: 'Prestasi',
    description: 'Prestasi dan pencapaian siswa SMA Negeri 1 Denpasar di berbagai kompetisi akademik, olahraga, seni, dan lainnya.',
    keywords: ['prestasi', 'pencapaian', 'kompetisi', 'lomba', 'juara', 'medali', 'olimpiade'],
    openGraph: {
        title: 'Prestasi SMA Negeri 1 Denpasar',
        description: 'Prestasi dan pencapaian siswa SMA Negeri 1 Denpasar',
        url: `${BASE_URL}/prestasi`,
        siteName: 'SMAN 1 Denpasar',
        locale: 'id_ID',
        type: 'website',
        images: [
            {
                url: `${BASE_URL}/api/og?title=Prestasi&type=achievement`,
                width: 1200,
                height: 630,
                alt: 'Prestasi SMAN 1 Denpasar',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Prestasi SMA Negeri 1 Denpasar',
        description: 'Prestasi dan pencapaian siswa SMA Negeri 1 Denpasar',
    },
    alternates: {
        canonical: `${BASE_URL}/prestasi`,
    },
}

interface PageProps {
    searchParams: Promise<{ category?: string; year?: string; level?: string; page?: string }>
}

export default async function Page({ searchParams }: PageProps) {
    const params = await searchParams

    let achievements: Achievement[] = []
    const categories: string[] = ['akademik', 'olahraga', 'seni', 'teknologi']
    const years: number[] = [2025, 2024, 2023, 2022]
    const levels: string[] = ['school', 'regional', 'national', 'international']
    let meta = {
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 0,
    }

    try {
        const response = await getAchievements({
            category: params.category,
            year: params.year ? parseInt(params.year) : undefined,
            level: params.level,
            page: params.page ? parseInt(params.page) : undefined,
            per_page: 12,
        })

        if (response.data) {
            achievements = response.data
        }
        if (response.meta) {
            meta = response.meta
        }
    } catch {
        // Use empty data on error
    }

    return (
        <PrestasiPage
            achievements={achievements}
            categories={categories}
            years={years}
            levels={levels}
            currentCategory={params.category}
            currentYear={params.year ? parseInt(params.year) : undefined}
            currentLevel={params.level}
            meta={meta}
        />
    )
}
