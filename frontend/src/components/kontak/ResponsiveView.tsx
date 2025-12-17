'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'

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

export function ResponsiveView({ contactInfo, departments }: ResponsiveViewProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitStatus('idle')

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500))
            setSubmitStatus('success')
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
        } catch {
            setSubmitStatus('error')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
            {/* Hero Section - Enhanced */}
            <section className="relative -mt-16 lg:-mt-20 pt-28 lg:pt-32 pb-16 md:pb-24 bg-gradient-to-br from-teal-600 via-cyan-700 to-blue-800 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
                <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-20" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

                <div className="relative container mx-auto px-4">
                    <div className="max-w-3xl">
                        <span className="text-teal-200 font-bold tracking-wider uppercase text-sm flex items-center gap-2 mb-4">
                            <span className="w-10 h-[2px] bg-teal-300"></span>
                            Layanan Informasi
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                            Hubungi Kami
                        </h1>
                        <p className="text-lg md:text-xl text-teal-100 max-w-2xl">
                            Kami siap membantu menjawab pertanyaan Anda
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-6 md:py-12 bg-white dark:bg-slate-900 border-b dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                        {contactInfo.map((info) => (
                            <div
                                key={info.title}
                                className="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4 p-4 md:p-6 bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 text-center md:text-left"
                            >
                                <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-600 dark:text-teal-400">
                                    {info.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm md:text-base mb-1">
                                        {info.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm whitespace-pre-line">
                                        {info.content}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content - Form & Departments */}
            <section className="py-8 md:py-16">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
                        {/* Contact Form */}
                        <div>
                            <div className="flex items-center gap-3 mb-6 md:mb-8">
                                <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                    Kirim Pesan
                                </h2>
                            </div>
                            <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl shadow-lg border border-gray-100 dark:border-slate-800 p-6 md:p-8">
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Name & Email */}
                                    <div className="grid md:grid-cols-2 gap-4 md:gap-5">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                                Nama Lengkap <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 md:py-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm md:text-base transition-all"
                                                placeholder="Masukkan nama lengkap"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                                Email <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 md:py-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm md:text-base transition-all"
                                                placeholder="nama@email.com"
                                            />
                                        </div>
                                    </div>

                                    {/* Phone & Subject */}
                                    <div className="grid md:grid-cols-2 gap-4 md:gap-5">
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                                Nomor Telepon
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 md:py-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm md:text-base transition-all"
                                                placeholder="08xxxxxxxxxx"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                                Subjek <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 md:py-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm md:text-base transition-all"
                                            >
                                                <option value="">Pilih Subjek</option>
                                                <option value="informasi_umum">Informasi Umum</option>
                                                <option value="pendaftaran">Pendaftaran Siswa Baru</option>
                                                <option value="akademik">Akademik & Kurikulum</option>
                                                <option value="kesiswaan">Kesiswaan</option>
                                                <option value="kerjasama">Kerjasama</option>
                                                <option value="lainnya">Lainnya</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                            Pesan <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={5}
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-sm md:text-base transition-all"
                                            placeholder="Tulis pesan Anda di sini..."
                                        />
                                    </div>

                                    {/* Status Messages */}
                                    {submitStatus === 'success' && (
                                        <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl text-sm flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Pesan Anda berhasil dikirim! Kami akan segera menghubungi Anda.
                                        </div>
                                    )}

                                    {submitStatus === 'error' && (
                                        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl text-sm flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Terjadi kesalahan. Silakan coba lagi.
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={isSubmitting}
                                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3.5 rounded-xl transition-all"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Mengirim...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                                Kirim Pesan
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </div>

                        {/* Departments & Social Media */}
                        <div className="space-y-8">
                            {/* Departments */}
                            <div>
                                <div className="flex items-center gap-3 mb-6 md:mb-8">
                                    <div className="w-12 h-12 bg-cyan-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                        Kontak Bagian
                                    </h2>
                                </div>
                                <div className="space-y-4">
                                    {departments.map((dept) => (
                                        <div key={dept.name} className="bg-white dark:bg-slate-900 rounded-2xl p-5 md:p-6 shadow-md border border-gray-100 dark:border-slate-800 hover:shadow-lg transition-shadow">
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-base md:text-lg">
                                                {dept.name}
                                            </h3>
                                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-4 h-4 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <a href={`mailto:${dept.email}`} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors break-all">
                                                        {dept.email}
                                                    </a>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-4 h-4 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                        </svg>
                                                    </div>
                                                    <span>{dept.phone}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Social Media */}
                            <div>
                                <div className="flex items-center gap-3 mb-6 md:mb-8">
                                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                        Media Sosial
                                    </h2>
                                </div>
                                <div className="grid grid-cols-4 gap-3 md:gap-4">
                                    <a href="#" className="group w-full aspect-square bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-2xl flex items-center justify-center text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                                        <svg className="w-6 h-6 md:w-7 md:h-7 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                    </a>
                                    <a href="#" className="group w-full aspect-square bg-gradient-to-br from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 rounded-2xl flex items-center justify-center text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                                        <svg className="w-6 h-6 md:w-7 md:h-7 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                        </svg>
                                    </a>
                                    <a href="#" className="group w-full aspect-square bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-2xl flex items-center justify-center text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                                        <svg className="w-6 h-6 md:w-7 md:h-7 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                        </svg>
                                    </a>
                                    <a href="#" className="group w-full aspect-square bg-gradient-to-br from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 rounded-2xl flex items-center justify-center text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                                        <svg className="w-6 h-6 md:w-7 md:h-7 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            {/* Map Preview */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-slate-800">
                                <div className="p-5 md:p-6 border-b border-gray-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-sm md:text-base">Lokasi Sekolah</h3>
                                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Jl. Kamboja No. 4, Denpasar</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-48 md:h-64 bg-gray-200 dark:bg-slate-800">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.2089073567747!2d115.2190339!3d-8.6551831!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd240815f96fc3d%3A0x634ef8d0ff3b79f3!2sSMA%20Negeri%201%20Denpasar!5e0!3m2!1sen!2sid!4v1702800000000!5m2!1sen!2sid"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom Spacing */}
            <div className="h-12 md:h-20" />
        </div>
    )
}
