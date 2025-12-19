'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Send, Building2, MessageCircle, Check, AlertCircle } from 'lucide-react'
import { PageHero } from '@/components/shared/PageHero'
import { Section, SectionTitle } from '@/components/shared/Section'
import { GlassCard } from '@/components/shared/cards/GlassCard'
import {
    FadeInOnScroll,
    StaggerContainer,
    StaggerItem,
} from '@/components/shared/Animations'
import {
    DotPattern,
    GlowSpot,
    Waves,
} from '@/components/shared/Decorations'

interface ContactInfo {
    icon: React.ReactNode
    title: string
    content: string
}

interface Department {
    name: string
    email: string
    phone: string
}

interface ResponsiveViewProps {
    contactInfo: ContactInfo[]
    departments: Department[]
}

interface FormErrors {
    name?: string
    email?: string
    subject?: string
    message?: string
}

// Animated Input Component
function AnimatedInput({
    type = 'text',
    id,
    name,
    value,
    onChange,
    placeholder,
    label,
    required = false,
    error,
    isValid
}: {
    type?: string
    id: string
    name: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    label: string
    required?: boolean
    error?: string
    isValid?: boolean
}) {
    const [isFocused, setIsFocused] = useState(false)

    return (
        <div className="relative">
            <label htmlFor={id} className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <input
                    type={type}
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    required={required}
                    className={`w-full px-4 py-3 pr-10 border rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 text-sm md:text-base transition-all duration-300 ${error
                        ? 'border-red-400 focus:ring-red-500 focus:border-transparent'
                        : isValid
                            ? 'border-green-400 focus:ring-green-500 focus:border-transparent'
                            : 'border-slate-200 dark:border-slate-600 focus:ring-green-500 focus:border-transparent'
                        }`}
                    placeholder={placeholder}
                />
                {/* Validation Icon */}
                <AnimatePresence>
                    {(error || isValid) && !isFocused && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                            {error ? (
                                <AlertCircle className="w-5 h-5 text-red-500" />
                            ) : (
                                <Check className="w-5 h-5 text-green-500" />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    )
}

// Success Checkmark Animation
function SuccessCheckmark() {
    return (
        <motion.div className="flex flex-col items-center justify-center py-8">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30"
            >
                <motion.svg
                    className="w-10 h-10 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <motion.path
                        d="M5 13l4 4L19 7"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    />
                </motion.svg>
            </motion.div>
            <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl font-bold text-slate-900 dark:text-white mt-6"
            >
                Pesan Terkirim!
            </motion.h3>
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-sm text-slate-600 dark:text-slate-400 mt-2 text-center max-w-xs"
            >
                Terima kasih telah menghubungi kami. Kami akan segera membalas pesan Anda.
            </motion.p>
        </motion.div>
    )
}

// Working Hours Status Component
function WorkingHoursStatus() {
    const [isOpen, setIsOpen] = useState(false)
    const [currentTime, setCurrentTime] = useState('')

    useEffect(() => {
        const checkStatus = () => {
            const now = new Date()
            const day = now.getDay() // 0 = Sunday, 1 = Monday, etc.
            const hours = now.getHours()
            const minutes = now.getMinutes()
            const time = hours * 60 + minutes // Convert to minutes

            // Format current time
            setCurrentTime(now.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
            }))

            // Check if open
            if (day === 0) {
                // Sunday - closed
                setIsOpen(false)
            } else if (day === 6) {
                // Saturday: 08:00 - 12:00
                setIsOpen(time >= 480 && time < 720)
            } else if (day === 5) {
                // Friday: 07:30 - 11:30
                setIsOpen(time >= 450 && time < 690)
            } else {
                // Monday - Thursday: 07:30 - 15:00
                setIsOpen(time >= 450 && time < 900)
            }
        }

        checkStatus()
        const interval = setInterval(checkStatus, 60000) // Update every minute
        return () => clearInterval(interval)
    }, [])

    return (
        <div className={`p-4 flex items-center justify-between ${isOpen
            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
            : 'bg-gradient-to-r from-red-500 to-rose-500'
            }`}>
            <div className="flex items-center gap-3">
                {/* Pulsing indicator */}
                <span className="relative flex h-3 w-3">
                    <motion.span
                        className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isOpen ? 'bg-white' : 'bg-white'
                            }`}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.75, 0, 0.75] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${isOpen ? 'bg-white' : 'bg-white'
                        }`} />
                </span>
                <span className="font-semibold text-white">
                    {isOpen ? 'Sedang Buka' : 'Sedang Tutup'}
                </span>
            </div>
            <div className="flex items-center gap-2 text-white/90 text-sm">
                <Clock className="w-4 h-4" />
                <span>{currentTime || '--:--'}</span>
            </div>
        </div>
    )
}

export function ResponsiveView({ contactInfo, departments }: ResponsiveViewProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

    // Validation functions
    const validateEmail = (email: string) => {
        const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
        return regex.test(email)
    }

    const validateField = (name: string, value: string): string | undefined => {
        switch (name) {
            case 'name':
                if (!value.trim()) return 'Nama wajib diisi'
                if (value.length < 3) return 'Nama minimal 3 karakter'
                return undefined
            case 'email':
                if (!value.trim()) return 'Email wajib diisi'
                if (!validateEmail(value)) return 'Format email tidak valid'
                return undefined
            case 'subject':
                if (!value) return 'Pilih subjek pesan'
                return undefined
            case 'message':
                if (!value.trim()) return 'Pesan wajib diisi'
                if (value.length < 10) return 'Pesan minimal 10 karakter'
                return undefined
            default:
                return undefined
        }
    }

    // Validate on change
    useEffect(() => {
        const newErrors: FormErrors = {}
        Object.keys(touched).forEach(key => {
            if (touched[key]) {
                const error = validateField(key, formData[key as keyof typeof formData])
                if (error) newErrors[key as keyof FormErrors] = error
            }
        })
        setErrors(newErrors)
    }, [formData, touched])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        // Mark as touched on change
        setTouched((prev) => ({ ...prev, [name]: true }))
    }

    const handleBlur = (name: string) => {
        setTouched((prev) => ({ ...prev, [name]: true }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate all fields
        const allTouched = { name: true, email: true, subject: true, message: true }
        setTouched(allTouched)

        const newErrors: FormErrors = {}
        Object.keys(allTouched).forEach(key => {
            const error = validateField(key, formData[key as keyof typeof formData])
            if (error) newErrors[key as keyof FormErrors] = error
        })
        setErrors(newErrors)

        // If there are errors, don't submit
        if (Object.keys(newErrors).length > 0) return

        setIsSubmitting(true)
        setSubmitStatus('idle')

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500))
            setSubmitStatus('success')
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
            setTouched({})
            setErrors({})
        } catch {
            setSubmitStatus('error')
        } finally {
            setIsSubmitting(false)
        }
    }

    const isFieldValid = (name: keyof typeof formData) => {
        return touched[name] && !errors[name as keyof FormErrors] && formData[name].length > 0
    }

    return (
        // -mt-16 lg:-mt-20 pulls page behind fixed header
        <div className="min-h-screen bg-white dark:bg-slate-950 -mt-16 lg:-mt-20 relative">
            {/* Global Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <DotPattern variant="animated" opacity={0.35} className="dark:opacity-25" />
                <GlowSpot color="bg-green-500" size="xl" position={{ top: '30%', left: '-10%' }} />
                <GlowSpot color="bg-emerald-500" size="lg" position={{ top: '70%', right: '-5%' }} />
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <PageHero
                    title="Hubungi Kami"
                    subtitle="Kami siap membantu menjawab pertanyaan Anda"
                    badge={{
                        icon: Phone,
                        label: 'Layanan Informasi',
                        color: 'green',
                    }}
                    backgroundImage="/hero-bg.png"
                    height="medium"
                    overlay="gradient"
                    align="center"
                    breadcrumbs={[
                        { label: 'Kontak', href: '/kontak' },
                    ]}
                />

                {/* Wave divider */}
                <Waves
                    color="fill-white dark:fill-slate-950"
                    position="bottom"
                    className="absolute bottom-0 z-20"
                />
            </div>

            {/* Contact Info Cards */}
            <Section background="white" padding="medium" className="relative z-10">
                <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 relative z-10">
                    {contactInfo.map((info) => (
                        <StaggerItem key={info.title}>
                            <GlassCard
                                padding="medium"
                                glow
                                glowColor="green"
                                className="h-full text-center md:text-left"
                            >
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center text-white">
                                        {info.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-sm md:text-base mb-1">
                                            {info.title}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm whitespace-pre-line">
                                            {info.content}
                                        </p>
                                    </div>
                                </div>
                            </GlassCard>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </Section>

            {/* Main Content - Form & Departments */}
            <Section background="slate" padding="large">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <SectionTitle
                            badge={{ icon: Send, label: 'Kirim Pesan', color: 'green' }}
                            title="Form"
                            gradientText="Kontak"
                            align="left"
                            className="mb-6"
                        />

                        <div className="bg-white dark:bg-slate-800 rounded-2xl md:rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-6 md:p-8">
                            <AnimatePresence mode="wait">
                                {submitStatus === 'success' ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                    >
                                        <SuccessCheckmark />
                                        <motion.button
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.8 }}
                                            onClick={() => setSubmitStatus('idle')}
                                            className="w-full mt-6 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold py-3 rounded-xl"
                                        >
                                            Kirim Pesan Lagi
                                        </motion.button>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onSubmit={handleSubmit}
                                        className="space-y-5"
                                    >
                                        {/* Name & Email */}
                                        <div className="grid md:grid-cols-2 gap-4 md:gap-5">
                                            <AnimatedInput
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                label="Nama Lengkap"
                                                required
                                                error={errors.name}
                                                isValid={isFieldValid('name')}
                                                placeholder="Masukkan nama lengkap"
                                            />
                                            <AnimatedInput
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                label="Email"
                                                required
                                                error={errors.email}
                                                isValid={isFieldValid('email')}
                                                placeholder="nama@email.com"
                                            />
                                        </div>

                                        {/* Phone & Subject */}
                                        <div className="grid md:grid-cols-2 gap-4 md:gap-5">
                                            <AnimatedInput
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                label="Nomor Telepon"
                                                placeholder="08xxxxxxxxxx"
                                            />
                                            <div className="relative">
                                                <label htmlFor="subject" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                                    Subjek <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    id="subject"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    required
                                                    className={`w-full px-4 py-3 border rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm md:text-base transition-all ${errors.subject
                                                        ? 'border-red-400'
                                                        : touched.subject && formData.subject
                                                            ? 'border-green-400'
                                                            : 'border-slate-200 dark:border-slate-600'
                                                        }`}
                                                >
                                                    <option value="">Pilih Subjek</option>
                                                    <option value="informasi_umum">Informasi Umum</option>
                                                    <option value="pendaftaran">Pendaftaran Siswa Baru</option>
                                                    <option value="akademik">Akademik & Kurikulum</option>
                                                    <option value="kesiswaan">Kesiswaan</option>
                                                    <option value="kerjasama">Kerjasama</option>
                                                    <option value="lainnya">Lainnya</option>
                                                </select>
                                                <AnimatePresence>
                                                    {errors.subject && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -10, height: 0 }}
                                                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                                                            exit={{ opacity: 0, y: -10, height: 0 }}
                                                            className="text-red-500 text-xs mt-1.5"
                                                        >
                                                            {errors.subject}
                                                        </motion.p>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        {/* Message */}
                                        <div className="relative">
                                            <label htmlFor="message" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                                Pesan <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                rows={5}
                                                className={`w-full px-4 py-3 border rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm md:text-base transition-all ${errors.message
                                                    ? 'border-red-400'
                                                    : touched.message && formData.message.length >= 10
                                                        ? 'border-green-400'
                                                        : 'border-slate-200 dark:border-slate-600'
                                                    }`}
                                                placeholder="Tulis pesan Anda di sini..."
                                            />
                                            <AnimatePresence>
                                                {errors.message && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -10, height: 0 }}
                                                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                                                        exit={{ opacity: 0, y: -10, height: 0 }}
                                                        className="text-red-500 text-xs mt-1.5"
                                                    >
                                                        {errors.message}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Error Status */}
                                        {submitStatus === 'error' && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl text-sm flex items-center gap-2"
                                            >
                                                <AlertCircle className="w-5 h-5" />
                                                Terjadi kesalahan. Silakan coba lagi.
                                            </motion.div>
                                        )}

                                        {/* Submit Button */}
                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <motion.svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                    >
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </motion.svg>
                                                    Mengirim...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5" />
                                                    Kirim Pesan
                                                </>
                                            )}
                                        </motion.button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Right Column - Departments & Social & Map */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        {/* Departments */}
                        <div>
                            <SectionTitle
                                badge={{ icon: Building2, label: 'Kontak Bagian', color: 'blue' }}
                                title="Unit"
                                gradientText="Layanan"
                                align="left"
                                className="mb-6"
                            />
                            <div className="space-y-4">
                                {departments.map((dept, index) => (
                                    <motion.div
                                        key={dept.name}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.1 * index }}
                                        className="bg-white dark:bg-slate-800 rounded-xl md:rounded-2xl p-4 md:p-5 shadow-lg border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-shadow"
                                    >
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-base">
                                            {dept.name}
                                        </h3>
                                        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                            <a
                                                href={`mailto:${dept.email}`}
                                                className="flex items-center gap-3 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                            >
                                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Mail className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                </div>
                                                <span className="break-all">{dept.email}</span>
                                            </a>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                </div>
                                                <span>{dept.phone}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Working Hours Widget */}
                        <div className="mb-8">
                            <SectionTitle
                                badge={{ icon: Clock, label: 'Jam Operasional', color: 'gold' }}
                                title="Jam"
                                gradientText="Layanan"
                                align="left"
                                className="mb-6"
                            />
                            <motion.div
                                className="bg-white dark:bg-slate-800 rounded-2xl md:rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                {/* Status Banner */}
                                <WorkingHoursStatus />

                                {/* Schedule List */}
                                <div className="p-5 space-y-3">
                                    {[
                                        { day: 'Senin - Kamis', hours: '07:30 - 15:00', isActive: true },
                                        { day: 'Jumat', hours: '07:30 - 11:30', isActive: true },
                                        { day: 'Sabtu', hours: '08:00 - 12:00', isActive: false },
                                        { day: 'Minggu & Libur', hours: 'Tutup', isActive: false },
                                    ].map((schedule, index) => (
                                        <motion.div
                                            key={schedule.day}
                                            className={`flex items-center justify-between p-3 rounded-xl transition-colors ${schedule.hours === 'Tutup'
                                                ? 'bg-red-50 dark:bg-red-900/10'
                                                : 'bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700'
                                                }`}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <span className="font-medium text-sm text-slate-700 dark:text-slate-300">
                                                {schedule.day}
                                            </span>
                                            <span className={`text-sm font-semibold ${schedule.hours === 'Tutup'
                                                ? 'text-red-500'
                                                : 'text-green-600 dark:text-green-400'
                                                }`}>
                                                {schedule.hours}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Social Media */}
                        <div>
                            <SectionTitle
                                badge={{ icon: MessageCircle, label: 'Ikuti Kami', color: 'purple' }}
                                title="Media"
                                gradientText="Sosial"
                                align="left"
                                className="mb-6"
                            />
                            <div className="grid grid-cols-4 gap-3 md:gap-4">
                                <a href="#" className="group w-full aspect-square bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl md:rounded-2xl flex items-center justify-center text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1" aria-label="Facebook">
                                    <svg className="w-6 h-6 md:w-7 md:h-7 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                                <a href="#" className="group w-full aspect-square bg-gradient-to-br from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 rounded-xl md:rounded-2xl flex items-center justify-center text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1" aria-label="Instagram">
                                    <svg className="w-6 h-6 md:w-7 md:h-7 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                                <a href="#" className="group w-full aspect-square bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl md:rounded-2xl flex items-center justify-center text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1" aria-label="YouTube">
                                    <svg className="w-6 h-6 md:w-7 md:h-7 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                </a>
                                <a href="#" className="group w-full aspect-square bg-gradient-to-br from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 rounded-xl md:rounded-2xl flex items-center justify-center text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1" aria-label="Twitter">
                                    <svg className="w-6 h-6 md:w-7 md:h-7 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-700">
                            <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-sm md:text-base">Lokasi Sekolah</h3>
                                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Jl. Kamboja No. 4, Denpasar</p>
                                    </div>
                                </div>
                            </div>
                            <div className="h-48 md:h-64 bg-slate-200 dark:bg-slate-700">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.2089073567747!2d115.2190339!3d-8.6551831!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd240815f96fc3d%3A0x634ef8d0ff3b79f3!2sSMA%20Negeri%201%20Denpasar!5e0!3m2!1sen!2sid!4v1702800000000!5m2!1sen!2sid"
                                    width="100%"
                                    height="100%"
                                    className="border-0"
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Lokasi SMA Negeri 1 Denpasar"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* Bottom Spacing */}
            <div className="h-8 md:h-12 bg-white dark:bg-slate-950 relative z-10" />
        </div>
    )
}
