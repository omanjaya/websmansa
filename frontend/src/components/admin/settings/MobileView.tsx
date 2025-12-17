'use client'

import { useState, useEffect, useMemo } from 'react'
import { Loader2, Upload, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { MobileFormLayout, MobileFormSection, MobileFormField } from '@/components/admin/forms/MobileFormLayout'
import { getAdminSettings, updateSettings, uploadSettingFile } from '@/lib/api'
import { SettingItem, settingGroupsConfig, SettingGroup } from '@/types/settings'
import { toast } from 'sonner'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

export function MobileView() {
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [settings, setSettings] = useState<Record<string, SettingItem>>({})
    const [formData, setFormData] = useState<Record<string, string>>({})
    const [error, setError] = useState<string | null>(null)
    const [uploadingKey, setUploadingKey] = useState<string | null>(null)
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
        general: true, // First group expanded by default
    })

    // Fetch settings on mount
    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await getAdminSettings()

            const settingsMap: Record<string, SettingItem> = {}
            const formMap: Record<string, string> = {}

            response.data.forEach((setting) => {
                settingsMap[setting.key] = setting
                formMap[setting.key] = setting.value || ''
            })

            setSettings(settingsMap)
            setFormData(formMap)
        } catch (err) {
            console.error('Failed to fetch settings:', err)
            setError('Gagal memuat pengaturan. Silakan refresh halaman.')
        } finally {
            setLoading(false)
        }
    }

    const groupedSettings = useMemo(() => {
        const grouped: Record<string, SettingItem[]> = {}

        Object.values(settings).forEach((setting) => {
            if (!grouped[setting.group]) {
                grouped[setting.group] = []
            }
            grouped[setting.group].push(setting)
        })

        Object.keys(grouped).forEach((group) => {
            grouped[group].sort((a, b) => a.order - b.order)
        })

        return grouped
    }, [settings])

    const handleInputChange = (key: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }))
    }

    const handleFileUpload = async (key: string, file: File) => {
        try {
            setUploadingKey(key)
            const response = await uploadSettingFile(key, file)

            setFormData((prev) => ({
                ...prev,
                [key]: response.data.url,
            }))

            toast.success('File berhasil diupload')
        } catch (err) {
            console.error('Failed to upload file:', err)
            toast.error('Gagal mengupload file')
        } finally {
            setUploadingKey(null)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            setIsSubmitting(true)

            const settingsToUpdate = Object.entries(formData).map(([key, value]) => ({
                key,
                value,
                type: settings[key]?.type || 'string',
                group: settings[key]?.group || 'general',
            }))

            await updateSettings(settingsToUpdate)
            toast.success('Pengaturan berhasil disimpan')
        } catch (err) {
            console.error('Failed to save settings:', err)
            toast.error('Gagal menyimpan pengaturan')
        } finally {
            setIsSubmitting(false)
        }
    }

    const toggleGroup = (group: string) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [group]: !prev[group],
        }))
    }

    const renderSettingInput = (setting: SettingItem) => {
        const value = formData[setting.key] || ''
        const isUploading = uploadingKey === setting.key

        // Image/file type settings
        if (setting.key.includes('logo') || setting.key.includes('favicon') ||
            setting.key.includes('photo') || setting.key.includes('image') ||
            setting.key.includes('og_image')) {
            return (
                <MobileFormField key={setting.key} label={setting.label || setting.key} hint={setting.description || undefined}>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Input
                                type="text"
                                value={value}
                                onChange={(e) => handleInputChange(setting.key, e.target.value)}
                                placeholder="URL gambar"
                                className="min-h-12 flex-1"
                            />
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    title="Upload gambar"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) handleFileUpload(setting.key, file)
                                    }}
                                    disabled={isUploading}
                                />
                                <Button type="button" variant="outline" size="icon" disabled={isUploading} className="h-12 w-12">
                                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                        {value && (
                            <img
                                src={value}
                                alt={setting.label || setting.key}
                                className="h-12 w-auto object-contain rounded border"
                                onError={(e) => { e.currentTarget.style.display = 'none' }}
                            />
                        )}
                    </div>
                </MobileFormField>
            )
        }

        // Color picker
        if (setting.key.includes('color')) {
            return (
                <MobileFormField key={setting.key} label={setting.label || setting.key} hint={setting.description || undefined}>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            title="Pilih warna"
                            value={value || '#000000'}
                            onChange={(e) => handleInputChange(setting.key, e.target.value)}
                            className="h-12 w-14 rounded border cursor-pointer"
                        />
                        <Input
                            type="text"
                            value={value}
                            onChange={(e) => handleInputChange(setting.key, e.target.value)}
                            placeholder="#000000"
                            className="min-h-12 flex-1"
                        />
                    </div>
                </MobileFormField>
            )
        }

        // JSON type settings (misi, sejarah, departments)
        if (setting.type === 'json') {
            let jsonValue = value
            try {
                if (typeof value === 'string' && value) {
                    const parsed = JSON.parse(value)
                    jsonValue = JSON.stringify(parsed, null, 2)
                }
            } catch {
                // Keep original value if parsing fails
            }

            return (
                <MobileFormField key={setting.key} label={setting.label || setting.key} hint={setting.description || undefined}>
                    <div className="space-y-2">
                        <Textarea
                            value={jsonValue}
                            onChange={(e) => {
                                try {
                                    const parsed = JSON.parse(e.target.value)
                                    handleInputChange(setting.key, JSON.stringify(parsed))
                                } catch {
                                    handleInputChange(setting.key, e.target.value)
                                }
                            }}
                            rows={8}
                            className="font-mono text-sm min-h-40"
                            placeholder="Masukkan data dalam format JSON"
                        />
                        <p className="text-xs text-muted-foreground">
                            {setting.key === 'misi' && 'Format: ["Misi 1", "Misi 2"]'}
                            {setting.key === 'sejarah' && 'Format: [{"year": "1950", "title": "...", "description": "..."}]'}
                            {setting.key === 'departments' && 'Format: [{"name": "...", "email": "...", "phone": "..."}]'}
                        </p>
                    </div>
                </MobileFormField>
            )
        }

        // Textarea
        if (setting.type === 'text' ||
            setting.key.includes('description') ||
            setting.key.includes('message') ||
            setting.key.includes('address') ||
            setting.key.includes('keywords')) {
            return (
                <MobileFormField key={setting.key} label={setting.label || setting.key} hint={setting.description || undefined}>
                    <Textarea
                        value={value}
                        onChange={(e) => handleInputChange(setting.key, e.target.value)}
                        rows={3}
                        className="min-h-20"
                    />
                </MobileFormField>
            )
        }

        // Default input
        return (
            <MobileFormField key={setting.key} label={setting.label || setting.key} hint={setting.description || undefined}>
                <Input
                    type={setting.key.includes('email') ? 'email' :
                        setting.key.includes('phone') || setting.key.includes('fax') || setting.key.includes('whatsapp') ? 'tel' :
                            setting.key.includes('url') || setting.key.includes('link') ? 'url' : 'text'}
                    value={value}
                    onChange={(e) => handleInputChange(setting.key, e.target.value)}
                    className="min-h-12"
                />
            </MobileFormField>
        )
    }

    if (loading) {
        return (
            <div className="p-4 space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4 space-y-4">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button onClick={fetchSettings}>Coba Lagi</Button>
            </div>
        )
    }

    const tabGroups = Object.keys(settingGroupsConfig) as SettingGroup[]

    return (
        <MobileFormLayout
            title="Pengaturan Situs"
            subtitle="Kelola konfigurasi website"
            backHref="/admin"
            onSubmit={handleSubmit}
            submitText={isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            isSubmitting={isSubmitting}
        >
            {tabGroups.map((group) => (
                <Collapsible
                    key={group}
                    open={expandedGroups[group]}
                    onOpenChange={() => toggleGroup(group)}
                >
                    <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer mb-2">
                            <div>
                                <h3 className="font-medium">{settingGroupsConfig[group].label}</h3>
                                <p className="text-xs text-muted-foreground">{settingGroupsConfig[group].description}</p>
                            </div>
                            {expandedGroups[group] ? (
                                <ChevronUp className="h-5 w-5 text-muted-foreground" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            )}
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <MobileFormSection title="">
                            {groupedSettings[group]?.map((setting) => renderSettingInput(setting))}
                        </MobileFormSection>
                    </CollapsibleContent>
                </Collapsible>
            ))}
        </MobileFormLayout>
    )
}
