'use client'

import { useState, useEffect, useMemo } from 'react'
import { Save, Loader2, Upload, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { getAdminSettings, updateSettings, uploadSettingFile } from '@/lib/api'
import { SettingItem, settingGroupsConfig, SettingGroup } from '@/types/settings'
import { toast } from 'sonner'

export function DesktopView() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [settings, setSettings] = useState<Record<string, SettingItem>>({})
    const [formData, setFormData] = useState<Record<string, string>>({})
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<SettingGroup>('general')
    const [uploadingKey, setUploadingKey] = useState<string | null>(null)

    // Fetch settings on mount
    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await getAdminSettings()

            // Convert array to keyed object
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

    // Group settings by their group
    const groupedSettings = useMemo(() => {
        const grouped: Record<string, SettingItem[]> = {}

        Object.values(settings).forEach((setting) => {
            if (!grouped[setting.group]) {
                grouped[setting.group] = []
            }
            grouped[setting.group].push(setting)
        })

        // Sort each group by order
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
            setSaving(true)

            // Prepare settings array for batch update
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
            setSaving(false)
        }
    }

    const renderSettingInput = (setting: SettingItem) => {
        const value = formData[setting.key] || ''
        const isUploading = uploadingKey === setting.key

        // Image/file type settings
        if (setting.key.includes('logo') || setting.key.includes('favicon') ||
            setting.key.includes('photo') || setting.key.includes('image') ||
            setting.key.includes('og_image')) {
            return (
                <div key={setting.key} className="space-y-2">
                    <Label className="text-sm font-medium">
                        {setting.label || setting.key}
                    </Label>
                    {setting.description && (
                        <p className="text-xs text-muted-foreground">{setting.description}</p>
                    )}
                    <div className="flex items-center gap-3">
                        <Input
                            type="text"
                            value={value}
                            onChange={(e) => handleInputChange(setting.key, e.target.value)}
                            placeholder="URL gambar atau upload file"
                            className="flex-1"
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
                            <Button type="button" variant="outline" disabled={isUploading}>
                                {isUploading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Upload className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                    {value && value.startsWith('/') && (
                        <div className="mt-2">
                            <img
                                src={value}
                                alt={setting.label || setting.key}
                                className="h-16 w-auto object-contain rounded border"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                }}
                            />
                        </div>
                    )}
                </div>
            )
        }

        // Color picker for theme colors
        if (setting.key.includes('color')) {
            return (
                <div key={setting.key} className="space-y-2">
                    <Label className="text-sm font-medium">
                        {setting.label || setting.key}
                    </Label>
                    {setting.description && (
                        <p className="text-xs text-muted-foreground">{setting.description}</p>
                    )}
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            title="Pilih warna"
                            value={value || '#000000'}
                            onChange={(e) => handleInputChange(setting.key, e.target.value)}
                            className="h-10 w-14 rounded border cursor-pointer"
                        />
                        <Input
                            type="text"
                            value={value}
                            onChange={(e) => handleInputChange(setting.key, e.target.value)}
                            placeholder="#000000"
                            className="flex-1"
                        />
                    </div>
                </div>
            )
        }

        // JSON type settings (misi, sejarah, departments)
        if (setting.type === 'json') {
            // Parse JSON value for display
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
                <div key={setting.key} className="space-y-2">
                    <Label className="text-sm font-medium">
                        {setting.label || setting.key}
                    </Label>
                    {setting.description && (
                        <p className="text-xs text-muted-foreground">{setting.description}</p>
                    )}
                    <div className="space-y-2">
                        <Textarea
                            value={jsonValue}
                            onChange={(e) => {
                                try {
                                    // Validate JSON on change
                                    const parsed = JSON.parse(e.target.value)
                                    handleInputChange(setting.key, JSON.stringify(parsed))
                                } catch {
                                    // Allow invalid JSON during typing
                                    handleInputChange(setting.key, e.target.value)
                                }
                            }}
                            rows={10}
                            className="font-mono text-sm"
                            placeholder="Masukkan data dalam format JSON"
                        />
                        <p className="text-xs text-muted-foreground">
                            {setting.key === 'misi' && 'Format: ["Misi 1", "Misi 2", "Misi 3"]'}
                            {setting.key === 'sejarah' && 'Format: [{"year": "1950", "title": "Judul", "description": "Deskripsi"}]'}
                            {setting.key === 'departments' && 'Format: [{"name": "Nama", "email": "email@sekolah.id", "phone": "0361-xxx"}]'}
                        </p>
                    </div>
                </div>
            )
        }

        // Textarea for text type or long content
        if (setting.type === 'text' ||
            setting.key.includes('description') ||
            setting.key.includes('message') ||
            setting.key.includes('address') ||
            setting.key.includes('keywords')) {
            return (
                <div key={setting.key} className="space-y-2">
                    <Label className="text-sm font-medium">
                        {setting.label || setting.key}
                    </Label>
                    {setting.description && (
                        <p className="text-xs text-muted-foreground">{setting.description}</p>
                    )}
                    <Textarea
                        value={value}
                        onChange={(e) => handleInputChange(setting.key, e.target.value)}
                        rows={4}
                    />
                </div>
            )
        }

        // Default: regular input
        return (
            <div key={setting.key} className="space-y-2">
                <Label className="text-sm font-medium">
                    {setting.label || setting.key}
                </Label>
                {setting.description && (
                    <p className="text-xs text-muted-foreground">{setting.description}</p>
                )}
                <Input
                    type={setting.key.includes('email') ? 'email' :
                        setting.key.includes('phone') || setting.key.includes('fax') || setting.key.includes('whatsapp') ? 'tel' :
                            setting.key.includes('url') || setting.key.includes('link') ? 'url' : 'text'}
                    value={value}
                    onChange={(e) => handleInputChange(setting.key, e.target.value)}
                />
            </div>
        )
    }

    if (loading) {
        return (
            <div className="space-y-6 max-w-4xl">
                <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="space-y-6 max-w-4xl">
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
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Pengaturan Situs</h1>
                <p className="text-muted-foreground mt-1">
                    Kelola konfigurasi dan informasi umum website
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as SettingGroup)}>
                    <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 h-auto">
                        {tabGroups.map((group) => (
                            <TabsTrigger
                                key={group}
                                value={group}
                                className="text-xs"
                            >
                                {settingGroupsConfig[group].label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {tabGroups.map((group) => (
                        <TabsContent key={group} value={group} className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{settingGroupsConfig[group].label}</CardTitle>
                                    <CardDescription>
                                        {settingGroupsConfig[group].description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {groupedSettings[group] ? (
                                        <div className="grid gap-6 md:grid-cols-2">
                                            {groupedSettings[group].map((setting) => (
                                                <div
                                                    key={setting.key}
                                                    className={
                                                        setting.type === 'text' ||
                                                            setting.key.includes('description') ||
                                                            setting.key.includes('message') ||
                                                            setting.key.includes('keywords')
                                                            ? 'md:col-span-2'
                                                            : ''
                                                    }
                                                >
                                                    {renderSettingInput(setting)}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-center py-8">
                                            Tidak ada pengaturan dalam grup ini
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>

                <div className="flex justify-end mt-6">
                    <Button type="submit" disabled={saving} size="lg">
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Simpan Perubahan
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
