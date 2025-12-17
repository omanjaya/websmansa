'use client'

import { ResponsiveView } from './ResponsiveView'
import type { Post, Category } from '@/lib/api'

interface InformasiPageProps {
    posts: Post[]
    categories: Category[]
    currentCategory?: string
}

export function InformasiPage({ posts, categories, currentCategory }: InformasiPageProps) {
    return <ResponsiveView posts={posts} categories={categories} currentCategory={currentCategory} />
}
