'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { School, Users, GraduationCap, Award, Eye, Target, Clock, ChevronRight, ChevronLeft, Camera, Image as ImageIcon } from 'lucide-react'
import { PageHero } from '@/components/shared/PageHero'
import { Section, SectionTitle } from '@/components/shared/Section'
import { GlassCard } from '@/components/shared/cards/GlassCard'
import { ProfileCard } from '@/components/shared/cards/ProfileCard'
import {
    FadeInOnScroll,
    StaggerContainer,
    StaggerItem,
    AnimatedCounter,
} from '@/components/shared/Animations'
import {
    DotPattern,
    FloatingShapes,
    GlowSpot,
    Waves,
    HexagonPattern,
} from '@/components/shared/Decorations'

interface ResponsiveViewProps {
    stats: Array<{ label: string; value: string }>
    visiMisi: { visi: string; misi: string[] }
    sejarah: Array<{ year: string; title: string; description: string }>
    leadership: Array<{ name: string; position: string; image: string | null }>
}

// Photo Milestone Slider Component
const milestonePhotos = [
    { year: '1950', title: 'Pendirian Sekolah', image: '/hero-bg.png', description: 'Awal mula berdirinya SMAN 1 Denpasar sebagai sekolah menengah atas pertama di Bali.' },
    { year: '1965', title: 'Renovasi Gedung', image: '/hero-bg.png', description: 'Pembangunan gedung baru yang lebih modern dan representatif.' },
    { year: '1980', title: 'Akreditasi A', image: '/hero-bg.png', description: 'Meraih akreditasi A pertama kali sebagai bukti kualitas pendidikan.' },
    { year: '2000', title: 'Era Digital', image: '/hero-bg.png', description: 'Integrasi teknologi informasi dalam proses pembelajaran.' },
    { year: '2024', title: 'Sekolah Unggulan', image: '/hero-bg.png', description: 'Status sebagai sekolah unggulan tingkat nasional.' },
]

function PhotoMilestoneSlider() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % milestonePhotos.length)
    }, [])

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + milestonePhotos.length) % milestonePhotos.length)
    }, [])

    // Auto-advance
    useEffect(() => {
        if (!isAutoPlaying) return
        const interval = setInterval(nextSlide, 6000)
        return () => clearInterval(interval)
    }, [isAutoPlaying, nextSlide])

    const currentPhoto = milestonePhotos[currentIndex]

    return (
        <motion.div
            className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Main Image */}
            <div className="relative aspect-[16/9] md:aspect-[21/9]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.7 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={currentPhoto.image}
                            alt={currentPhoto.title}
                            fill
                            className="object-cover"
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
                {/* Year Badge */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`year-${currentIndex}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-white font-bold text-sm md:text-base mb-3 shadow-lg">
                            <Camera className="w-4 h-4" />
                            {currentPhoto.year}
                        </span>
                        <h3 className="text-2xl md:text-4xl font-bold text-white mb-2">
                            {currentPhoto.title}
                        </h3>
                        <p className="text-white/80 text-sm md:text-base max-w-2xl line-clamp-2">
                            {currentPhoto.description}
                        </p>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6">
                    {/* Dots */}
                    <div className="flex items-center gap-2">
                        {milestonePhotos.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`transition-all ${index === currentIndex
                                    ? 'w-10 h-2 bg-amber-500 rounded-full'
                                    : 'w-2 h-2 bg-white/40 hover:bg-white/60 rounded-full'
                                    }`}
                                aria-label={`Lihat foto ${milestonePhotos[index].year}`}
                            />
                        ))}
                    </div>

                    {/* Arrows */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={prevSlide}
                            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                            aria-label="Foto sebelumnya"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                            aria-label="Foto selanjutnya"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <motion.div
                    className="h-full bg-amber-500"
                    initial={{ width: '0%' }}
                    animate={{ width: isAutoPlaying ? '100%' : '0%' }}
                    transition={{ duration: 6, ease: 'linear' }}
                    key={`${currentIndex}-${isAutoPlaying}`}
                />
            </div>
        </motion.div>
    )
}

export function ResponsiveView({ stats, visiMisi, sejarah, leadership }: ResponsiveViewProps) {
    const statIcons = [School, Users, GraduationCap, Award]

    // Scroll-driven animations for timeline
    const { scrollYProgress } = useScroll()

    const timelineOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1])
    const timelineY = useTransform(scrollYProgress, [0.2, 0.4], [50, 0])

    return (
        // -mt-16 lg:-mt-20 pulls page behind fixed header so hero background shows behind it
        <div className="min-h-screen bg-white dark:bg-slate-950 -mt-16 lg:-mt-20 relative">
            {/* Global Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <DotPattern variant="animated" opacity={0.35} className="dark:opacity-25" />
                <GlowSpot color="bg-blue-500" size="xl" position={{ top: '30%', left: '-10%' }} />
                <GlowSpot color="bg-cyan-500" size="lg" position={{ top: '70%', right: '-5%' }} />
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <PageHero
                    title="Tentang Kami"
                    subtitle="Profil dan sejarah SMA Negeri 1 Denpasar, sekolah unggulan di Bali sejak tahun 1950"
                    badge={{
                        icon: School,
                        label: 'Profil Sekolah',
                        color: 'blue',
                    }}
                    backgroundImage="/hero-bg.png"
                    height="medium"
                    overlay="gradient"
                    align="center"
                    breadcrumbs={[
                        { label: 'Tentang', href: '/tentang' },
                    ]}
                />

                {/* Wave divider */}
                <Waves
                    color="fill-white dark:fill-slate-950"
                    position="bottom"
                    className="absolute bottom-0 z-20"
                />
            </div>

            {/* Stats Section - Glassmorphism */}
            <Section background="white" padding="medium" className="relative z-10">
                <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 relative z-10">
                    {stats.map((stat, index) => {
                        const Icon = statIcons[index] || School
                        return (
                            <StaggerItem key={stat.label}>
                                <GlassCard
                                    padding="medium"
                                    glow
                                    glowColor="blue"
                                    className="text-center h-full"
                                >
                                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white mx-auto mb-3">
                                        <Icon className="w-6 h-6 md:w-7 md:h-7" />
                                    </div>
                                    <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                                        {index === 0 ? (
                                            // For "Tahun Berdiri", just display the year as is
                                            stat.value
                                        ) : (
                                            // For other stats, extract number and use AnimatedCounter
                                            (() => {
                                                const numValue = parseInt(stat.value.replace(/[^\d]/g, ''))
                                                const suffix = stat.value.match(/[^\d]+$/)?.[0] || ''
                                                const prefix = stat.value.match(/^[^\d]+/)?.[0] || ''

                                                return (
                                                    <AnimatedCounter
                                                        value={numValue}
                                                        duration={2}
                                                        prefix={prefix}
                                                        suffix={suffix}
                                                        formatter={(val) => val.toLocaleString('id-ID')}
                                                    />
                                                )
                                            })()
                                        )}
                                    </div>
                                    <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium">
                                        {stat.label}
                                    </div>
                                </GlassCard>
                            </StaggerItem>
                        )
                    })}
                </StaggerContainer>
            </Section>

            {/* Profile Section */}
            <Section background="slate" padding="large">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl order-2 lg:order-1"
                    >
                        <Image
                            src="/hero-bg.png"
                            alt="SMA Negeri 1 Denpasar"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/30">
                                Sejak 1950
                            </span>
                        </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="order-1 lg:order-2"
                    >
                        <SectionTitle
                            badge={{ icon: School, label: 'Profil', color: 'blue' }}
                            title="SMA Negeri 1"
                            gradientText="Denpasar"
                            align="left"
                            className="mb-6"
                        />
                        <div className="space-y-4 text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed">
                            <p>
                                SMA Negeri 1 Denpasar adalah salah satu sekolah menengah atas tertua dan paling bergengsi di Provinsi Bali. Didirikan pada tahun 1950, sekolah ini telah menghasilkan ribuan alumni yang berkontribusi di berbagai bidang.
                            </p>
                            <p>
                                Berlokasi strategis di pusat Kota Denpasar, SMAN 1 Denpasar dilengkapi dengan fasilitas modern dan tenaga pengajar berkualitas yang berkomitmen untuk memberikan pendidikan terbaik.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* Visi & Misi Section */}
            <Section background="white" padding="large">
                <SectionTitle
                    badge={{ icon: Eye, label: 'Arah Tujuan', color: 'purple' }}
                    title="Visi &"
                    gradientText="Misi"
                    subtitle="Panduan dan tujuan yang menjadi dasar pengembangan sekolah"
                    align="center"
                />

                <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                    {/* Visi */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="h-full bg-gradient-to-br from-blue-50 via-blue-50/50 to-indigo-50 dark:from-blue-900/30 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-blue-100 dark:border-blue-800/30">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Eye className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-100">Visi</h3>
                            </div>
                            <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                                {visiMisi.visi}
                            </p>
                        </div>
                    </motion.div>

                    {/* Misi */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="h-full bg-gradient-to-br from-green-50 via-green-50/50 to-emerald-50 dark:from-green-900/30 dark:via-green-900/20 dark:to-emerald-900/20 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-green-100 dark:border-green-800/30">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Target className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-green-900 dark:text-green-100">Misi</h3>
                            </div>
                            <ul className="space-y-3">
                                {visiMisi.misi.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3 text-sm md:text-base text-slate-700 dark:text-slate-300">
                                        <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                                            {index + 1}
                                        </span>
                                        <span className="leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* History Timeline */}
            <Section background="gradient" padding="large">
                <SectionTitle
                    badge={{ icon: Clock, label: 'Sejarah', color: 'gold' }}
                    title="Perjalanan"
                    gradientText="Sejarah"
                    subtitle="Tonggak penting dalam perjalanan SMA Negeri 1 Denpasar"
                    align="center"
                />

                <motion.div
                    className="max-w-3xl mx-auto"
                    style={{ opacity: timelineOpacity, y: timelineY }}
                >
                    <div className="relative">
                        {/* Animated Timeline line */}
                        <motion.div
                            className="absolute left-8 md:left-10 top-0 w-0.5 bg-gradient-to-b from-yellow-400 via-orange-400 to-yellow-400/20"
                            initial={{ height: 0 }}
                            whileInView={{ height: "100%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />

                        {/* Timeline items */}
                        <div className="space-y-6 md:space-y-8">
                            {sejarah.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * index }}
                                    className="relative flex gap-4 md:gap-6 pl-2"
                                >
                                    {/* Year badge with hover animation */}
                                    <motion.div
                                        className="flex-shrink-0 relative z-10"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-xl md:rounded-2xl flex items-center justify-center font-bold text-sm shadow-lg">
                                            {item.year}
                                        </div>
                                    </motion.div>

                                    {/* Content with hover effect */}
                                    <motion.div
                                        className="flex-1 bg-white dark:bg-slate-800 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-slate-100 dark:border-slate-700"
                                        whileHover={{
                                            scale: 1.02,
                                            boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </Section>

            {/* Photo Milestone Section */}
            <Section background="white" padding="large">
                <SectionTitle
                    badge={{ icon: Camera, label: 'Galeri', color: 'gold' }}
                    title="Momen"
                    gradientText="Bersejarah"
                    subtitle="Perjalanan visual SMA Negeri 1 Denpasar dari masa ke masa"
                    align="center"
                />
                <FadeInOnScroll delay={0.2}>
                    <PhotoMilestoneSlider />
                </FadeInOnScroll>
            </Section>

            {/* Leadership Section */}
            <Section background="slate" padding="large">
                <SectionTitle
                    badge={{ icon: Users, label: 'Pimpinan', color: 'purple' }}
                    title="Tim"
                    gradientText="Kepemimpinan"
                    subtitle="Para pemimpin yang menggerakkan roda pendidikan di SMAN 1 Denpasar"
                    align="center"
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {leadership.map((leader, index) => (
                        <ProfileCard
                            key={index}
                            name={leader.name}
                            role={leader.position}
                            imageUrl={leader.image || undefined}
                            variant="default"
                            index={index}
                        />
                    ))}
                </div>
            </Section>

            {/* Bottom Spacing for Footer */}
            <div className="h-8 md:h-12 bg-white dark:bg-slate-950 relative z-10" />
        </div>
    )
}
