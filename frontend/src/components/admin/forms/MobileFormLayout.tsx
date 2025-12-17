'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MobileFormLayoutProps {
    title: string
    subtitle?: string
    backHref: string
    children: ReactNode
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
    submitText?: string
    isSubmitting?: boolean
    cancelText?: string
}

export function MobileFormLayout({
    title,
    subtitle,
    backHref,
    children,
    onSubmit,
    submitText = 'Simpan',
    isSubmitting = false,
    cancelText = 'Batal',
}: MobileFormLayoutProps) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 px-4 py-4 shadow-md">
                <div className="flex items-center gap-3 mb-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="text-white hover:bg-white/10 -ml-2"
                    >
                        <Link href={backHref}>
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-white">{title}</h1>
                        {subtitle && (
                            <p className="text-sm text-blue-100 mt-0.5">{subtitle}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <form onSubmit={onSubmit} className="px-4 pt-4 space-y-4">
                {children}

                {/* Sticky Bottom Actions */}
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t dark:border-slate-700 p-4 shadow-lg">
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            asChild
                        >
                            <Link href={backHref}>{cancelText}</Link>
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Menyimpan...' : submitText}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}

// Mobile Form Section Component
interface MobileSectionProps {
    title: string
    description?: string
    children: ReactNode
}

export function MobileFormSection({ title, description, children }: MobileSectionProps) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b dark:border-slate-700">
                <h2 className="font-semibold text-gray-900 dark:text-white">{title}</h2>
                {description && (
                    <p className="text-sm text-muted-foreground mt-1">{description}</p>
                )}
            </div>
            <div className="p-4 space-y-4">{children}</div>
        </div>
    )
}

// Mobile Form Field Component
interface MobileFormFieldProps {
    label: string
    required?: boolean
    error?: string
    hint?: string
    children: ReactNode
}

export function MobileFormField({
    label,
    required,
    error,
    hint,
    children,
}: MobileFormFieldProps) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {children}
            {error && <p className="text-sm text-red-500">{error}</p>}
            {hint && !error && (
                <p className="text-xs text-muted-foreground">{hint}</p>
            )}
        </div>
    )
}
