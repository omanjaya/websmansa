'use client'

import { ResponsiveView } from './ResponsiveView'

interface TentangPageProps {
    stats: Array<{ label: string; value: string }>
    visiMisi: { visi: string; misi: string[] }
    sejarah: Array<{ year: string; title: string; description: string }>
    leadership: Array<{ name: string; position: string; image: string | null }>
}

export function TentangPage({ stats, visiMisi, sejarah, leadership }: TentangPageProps) {
    return <ResponsiveView stats={stats} visiMisi={visiMisi} sejarah={sejarah} leadership={leadership} />
}
