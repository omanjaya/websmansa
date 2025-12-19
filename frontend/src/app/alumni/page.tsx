import { Metadata } from 'next'
import { getAlumni, Alumni } from '@/lib/api'
import { AlumniPage } from '@/components/alumni'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sman1denpasar.sch.id'

export const metadata: Metadata = {
    title: 'Alumni',
    description: 'Alumni SMA Negeri 1 Denpasar yang sukses di berbagai bidang. Temukan kisah inspiratif para alumni.',
    keywords: ['alumni', 'lulusan', 'sukses', 'inspirasi', 'karir', 'profesi'],
    openGraph: {
        title: 'Alumni SMA Negeri 1 Denpasar',
        description: 'Alumni SMA Negeri 1 Denpasar yang sukses di berbagai bidang',
        url: `${BASE_URL}/alumni`,
        siteName: 'SMAN 1 Denpasar',
        locale: 'id_ID',
        type: 'website',
        images: [
            {
                url: `${BASE_URL}/api/og?title=Alumni&type=alumni`,
                width: 1200,
                height: 630,
                alt: 'Alumni SMAN 1 Denpasar',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Alumni SMA Negeri 1 Denpasar',
        description: 'Alumni SMA Negeri 1 Denpasar yang sukses di berbagai bidang',
    },
    alternates: {
        canonical: `${BASE_URL}/alumni`,
    },
}

interface PageProps {
    searchParams: Promise<{ year?: string; category?: string; page?: string }>
}

export default async function Page({ searchParams }: PageProps) {
    const params = await searchParams

    let alumni: Alumni[] = []
    let years: number[] = []
    let categories: string[] = []
    let meta = {
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 0,
    }

    try {
        const response = await getAlumni({
            year: params.year ? parseInt(params.year) : undefined,
            category: params.category,
            page: params.page ? parseInt(params.page) : undefined,
            per_page: 12,
            sort: 'latest',
        })

        if (response.data) {
            alumni = response.data
            // Extract unique years from alumni data using Array.from
            const yearSet = new Set(response.data.map(a => a.graduation_year))
            const uniqueYears = Array.from(yearSet).sort((a, b) => b - a)
            years = uniqueYears.slice(0, 10) // Show last 10 years
            // Extract unique categories using Array.from
            const categorySet = new Set(response.data.map(a => a.category).filter((c): c is string => Boolean(c)))
            categories = Array.from(categorySet)
        }
        if (response.meta) {
            meta = response.meta
        }

        // If no years from data, use default range
        if (years.length === 0) {
            const currentYear = new Date().getFullYear()
            years = Array.from({ length: 10 }, (_, i) => currentYear - i)
        }
    } catch {
        // Use empty data on error
        const currentYear = new Date().getFullYear()
        years = Array.from({ length: 10 }, (_, i) => currentYear - i)
    }

    return (
        <AlumniPage
            alumni={alumni}
            years={years}
            categories={categories}
            currentYear={params.year ? parseInt(params.year) : undefined}
            currentCategory={params.category}
            meta={meta}
        />
    )
}
