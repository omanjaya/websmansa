import { Metadata } from 'next'
import { getGalleries } from '@/lib/api'
import { GaleriPage as GaleriPageWrapper } from '@/components/galeri'

export const metadata: Metadata = {
    title: 'Galeri - SMA Negeri 1 Denpasar',
    description: 'Dokumentasi kegiatan dan momen berharga di SMA Negeri 1 Denpasar. Lihat foto dan video kegiatan sekolah, prestasi siswa, dan berbagai acara.',
    openGraph: {
        title: 'Galeri - SMA Negeri 1 Denpasar',
        description: 'Dokumentasi kegiatan dan momen berharga di SMA Negeri 1 Denpasar',
        type: 'website',
    },
}

interface GaleriPageProps {
    searchParams: {
        type?: 'photo' | 'video' | 'mixed'
        search?: string
        page?: string
    }
}

export default async function GaleriPage({ searchParams }: GaleriPageProps) {
    const currentPage = parseInt(searchParams.page || '1')
    const type = searchParams.type
    const search = searchParams.search

    const { data: galleries, meta } = await getGalleries({
        type,
        search,
        page: currentPage,
        per_page: 12,
        sort: 'latest',
    })

    // Stats without icon components (icons added in client component)
    const stats = {
        total: meta.total,
        photo: galleries.filter((g) => g.type === 'photo').length,
        video: galleries.filter((g) => g.type === 'video').length,
    }

    return (
        <GaleriPageWrapper
            galleries={galleries}
            stats={stats}
            meta={meta}
            search={search}
        />
    )
}
