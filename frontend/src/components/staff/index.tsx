'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { Staff } from '@/lib/api'
import { PageHero } from '@/components/shared/PageHero'
import { Section, SectionTitle } from '@/components/shared/Section'
import { FilterBar } from '@/components/shared/FilterBar'
import { ProfileCard } from '@/components/shared/cards/ProfileCard'
import {
    FadeInOnScroll,
    StaggerContainer,
    StaggerItem,
} from '@/components/shared/Animations'
import {
    DotPattern,
    FloatingShapes,
    GlowSpot,
    Waves,
    HexagonPattern,
} from '@/components/shared/Decorations'

interface StaffPageProps {
    staff: Staff[]
    categories: string[]
    currentCategory?: string
    pagination?: {
        currentPage: number
        total: number
        perPage: number
        lastPage: number
    }
}

const categoryLabels: Record<string, string> = {
    guru: 'Guru',
    staff: 'Staff',
    pimpinan: 'Pimpinan',
    tendik: 'Tenaga Pendidik',
}

export function StaffPage({ staff, categories, currentCategory }: StaffPageProps) {
    const router = useRouter()

    // Convert categories to filter format
    const filterOptions = categories.map(cat => ({
        label: categoryLabels[cat] || cat,
        value: cat,
    }))

    // Handle filter change
    const handleFilterChange = (value: string) => {
        if (value) {
            router.push(`/staff?category=${value}`)
        } else {
            router.push('/staff')
        }
    }

    // Group staff by category for display - use attributes.position
    const leadershipStaff = staff.filter(s =>
        s.attributes?.position?.toLowerCase().includes('kepala') ||
        s.attributes?.position?.toLowerCase().includes('wakil')
    )
    const regularStaff = staff.filter(s => !leadershipStaff.includes(s))

    return (
        // -mt-16 lg:-mt-20 pulls page behind fixed header
        <div className="min-h-screen bg-white dark:bg-slate-950 -mt-16 lg:-mt-20 relative">
            {/* Global Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <DotPattern variant="animated" opacity={0.35} className="dark:opacity-25" />
                <GlowSpot color="bg-purple-500" size="xl" position={{ top: '30%', left: '-10%' }} />
                <GlowSpot color="bg-indigo-500" size="lg" position={{ top: '70%', right: '-5%' }} />
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <PageHero
                    title="Guru & Staff"
                    subtitle="Tim pendidik dan tenaga kependidikan yang berdedikasi"
                    badge={{
                        icon: Users,
                        label: 'Tim Kami',
                        color: 'purple',
                    }}
                    backgroundImage="/hero-bg.png"
                    height="medium"
                    overlay="gradient"
                    align="center"
                    breadcrumbs={[
                        { label: 'Staff', href: '/staff' },
                    ]}
                />

                {/* Wave divider */}
                <Waves
                    color="fill-white dark:fill-slate-950"
                    position="bottom"
                    className="absolute bottom-0 z-20"
                />
            </div>

            {/* Content Section */}
            <Section background="white" padding="large" className="relative z-10">
                <div className="relative z-10">
                    {/* Filter Bar */}
                    <FadeInOnScroll delay={0.1} className="mb-8 md:mb-10">
                        <FilterBar
                            filters={filterOptions}
                            currentFilter={currentCategory}
                            onFilterChange={handleFilterChange}
                            searchPlaceholder="Cari staff..."
                            showSearch={true}
                            showAllOption={true}
                            allLabel="Semua"
                        />
                    </FadeInOnScroll>

                    {/* Leadership Section - Magazine Style */}
                    {leadershipStaff.length > 0 && !currentCategory && (
                        <div className="mb-12">
                            <SectionTitle
                                badge={{ icon: Users, label: 'Pimpinan', color: 'gold' }}
                                title="Tim"
                                gradientText="Pimpinan"
                                align="left"
                                className="mb-8"
                            />
                            
                            {/* Magazine Style Layout */}
                            <motion.div 
                                className="relative"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                {/* Featured Principal */}
                                {leadershipStaff[0] && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2, duration: 0.6 }}
                                        className="relative mb-8 md:mb-12"
                                    >
                                        {/* Decorative line */}
                                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
                                        
                                        <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-6 md:p-8">
                                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                                <div className="flex-shrink-0">
                                                    <ProfileCard
                                                        name={leadershipStaff[0].attributes?.name || 'Staff'}
                                                        role={leadershipStaff[0].attributes?.position || 'Staff'}
                                                        imageUrl={leadershipStaff[0].attributes?.photo_url || leadershipStaff[0].attributes?.photo || undefined}
                                                        badge="Kepala Sekolah"
                                                        variant="magazine-featured"
                                                        index={0}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="prose prose-slate dark:prose-invert max-w-none">
                                                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed italic font-light">
                                                            "Memimpin dengan visi, berinovasi dalam tindakan, dan menginspirasi melalui teladan."
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Vice Principals Grid */}
                                {leadershipStaff.length > 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.4, duration: 0.6 }}
                                    >
                                        <div className="mb-4">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                                <span className="w-1 h-6 bg-yellow-400 rounded-full"></span>
                                                Wakil Kepala Sekolah
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {leadershipStaff.slice(1).map((person, index) => (
                                                <motion.div
                                                    key={person.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: 0.5 + (index * 0.1), duration: 0.6 }}
                                                >
                                                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                                        <ProfileCard
                                                            name={person.attributes?.name || 'Staff'}
                                                            role={person.attributes?.position || 'Staff'}
                                                            imageUrl={person.attributes?.photo_url || person.attributes?.photo || undefined}
                                                            variant="magazine-compact"
                                                            index={index + 1}
                                                        />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>
                    )}

                    {/* All Staff Grid */}
                    <div>
                        {!currentCategory && regularStaff.length > 0 && (
                            <SectionTitle
                                title="Guru &"
                                gradientText="Staff"
                                align="left"
                                className="mb-6"
                            />
                        )}

                        {(currentCategory ? staff : regularStaff).length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                                {(currentCategory ? staff : regularStaff).map((person, index) => (
                                    <motion.div
                                        key={person.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.05 * (index % 10) }}
                                    >
                                        <ProfileCard
                                            name={person.attributes?.name || 'Staff'}
                                            role={person.attributes?.position || 'Staff'}
                                            imageUrl={person.attributes?.photo_url || person.attributes?.photo || undefined}
                                            subtitle={person.attributes?.subjects?.[0]}
                                            variant="default"
                                            index={index}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            // Empty State
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-16 md:py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-700"
                            >
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Users className="w-8 h-8 md:w-10 md:h-10 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    Tidak ada data
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
                                    Belum ada data staff untuk kategori ini.
                                </p>
                                <Link
                                    href="/staff"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors"
                                >
                                    Lihat Semua Staff
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </div>
            </Section>

            {/* Bottom Spacing */}
            <div className="h-8 md:h-12 bg-white dark:bg-slate-950 relative z-10" />
        </div>
    )
}
