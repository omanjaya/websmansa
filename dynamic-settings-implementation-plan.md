# 🎯 Dynamic Settings Implementation Plan

## Website Sekolah yang Dapat Dikonfigurasi dari Admin Panel

**Tanggal:** 17 Desember 2024  
**Project:** SMA Negeri 1 Denpasar - Website Baru  
**Tujuan:** Membuat semua konten website dapat diubah melalui admin panel tanpa perlu edit kode

---

## 📊 Analisis Status Saat Ini

### ✅ Yang Sudah Ada

| Komponen | Status | Catatan |
|----------|--------|---------|
| Backend Settings Model | ✅ Ada | `app/Models/Setting.php` dengan caching |
| Settings API Controller | ✅ Ada | CRUD endpoints tersedia |
| Settings Table Migration | ✅ Ada | Key-value storage dengan group + metadata |
| Admin Settings Page | ✅ DONE | Form dengan tabs, API connected |
| Slider Management | ✅ Ada | Full CRUD di admin |
| Staff Management | ✅ Ada | Full CRUD di admin |
| Posts/Berita Management | ✅ Ada | Full CRUD di admin |
| Galleries Management | ✅ Ada | Full CRUD di admin |

### ✅ Yang Sudah Dinamis (Updated 17 Des 2024 - SELESAI!)

| Lokasi | Status |
|--------|--------|
| `layout.tsx` | ✅ Dinamis - metadata dari settings + SiteConfigProvider |
| `Footer.tsx` | ✅ Dinamis - useSiteConfig() |
| `DesktopView.tsx` (Homepage) | ✅ Dinamis - principal + CTA |
| `MobileView.tsx` (Homepage) | ✅ Dinamis - hero + CTA |
| `LocationMap.tsx` | ✅ Dinamis - contact info + maps embed |
| `DynamicJsonLd.tsx` | ✅ BARU - Dynamic Schema.org wrappers |
| `manifest.ts` | ✅ Dinamis - PWA metadata dari settings |

---

## 🏗️ Arsitektur Solusi

```
┌─────────────────────────────────────────────────────────────────┐
│                        ADMIN PANEL                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────────┐ │
│  │   General    │ │   Contact    │ │   Homepage Config        │ │
│  │   Settings   │ │   Settings   │ │   (Principal, CTA, etc)  │ │
│  └──────────────┘ └──────────────┘ └──────────────────────────┘ │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────────┐ │
│  │   Social     │ │   SEO/Meta   │ │   Theme/Branding         │ │
│  │   Media      │ │   Settings   │ │   (Colors, Logos)        │ │
│  └──────────────┘ └──────────────┘ └──────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Laravel)                             │
├─────────────────────────────────────────────────────────────────┤
│  Settings Model    →    Redis/File Cache    →    REST API       │
│  (with Groups)          (TTL: 1 hour)            (/api/settings)│
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  SiteConfigProvider (React Context)                        │ │
│  │  - Fetches settings on app load                            │ │
│  │  - Provides settings to all components                     │ │
│  │  - Server-side rendering support                           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                             │                                    │
│           ┌─────────────────┼─────────────────┐                  │
│           ▼                 ▼                 ▼                  │
│     ┌──────────┐     ┌──────────┐     ┌──────────────┐          │
│     │  Layout  │     │  Footer  │     │  All Pages   │          │
│     │  (Meta)  │     │ (Contact)│     │  (Dynamic)   │          │
│     └──────────┘     └──────────┘     └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Implementation Phases

### Phase 1: Backend Settings Enhancement (Estimasi: 4-6 jam)

#### 1.1 Update Settings Migration

Tambahkan field untuk better organization:

```php
// New migration: add_metadata_to_settings_table
Schema::table('settings', function (Blueprint $table) {
    $table->string('label')->nullable()->after('key');
    $table->text('description')->nullable()->after('label');
    $table->boolean('is_public')->default(true)->after('group');
    $table->json('options')->nullable()->after('is_public'); // For dropdown/select types
    $table->integer('order')->default(0)->after('options');
});
```

#### 1.2 Create Settings Seeder

Seed default settings dengan organisasi group yang jelas:

| Group | Key | Label | Type | Default Value |
|-------|-----|-------|------|---------------|
| **general** | `site_name` | Nama Sekolah | string | SMA Negeri 1 Denpasar |
| **general** | `site_short_name` | Nama Singkat | string | SMAN 1 Denpasar |
| **general** | `site_tagline` | Tagline/Motto | string | Unggul dalam Prestasi, Berkarakter Pancasila |
| **general** | `site_description` | Deskripsi Situs | text | SMA Negeri 1 Denpasar adalah... |
| **general** | `site_logo` | Logo | string | /logo.png |
| **general** | `site_favicon` | Favicon | string | /favicon.ico |
| **general** | `established_year` | Tahun Berdiri | integer | 1950 |
| **contact** | `address` | Alamat | text | Jl. Kamboja No. 4... |
| **contact** | `phone` | Telepon | string | (0361) 226109 |
| **contact** | `fax` | Fax | string | (0361) 226110 |
| **contact** | `email` | Email | string | <info@sman1denpasar.sch.id> |
| **contact** | `whatsapp` | WhatsApp | string | +6281... |
| **contact** | `maps_embed` | Google Maps Embed URL | text | <https://maps.google.com/>... |
| **contact** | `latitude` | Latitude | string | -8.6478 |
| **contact** | `longitude` | Longitude | string | 115.2145 |
| **social** | `facebook_url` | Facebook | string | <https://facebook.com/>... |
| **social** | `instagram_url` | Instagram | string | <https://instagram.com/>... |
| **social** | `youtube_url` | YouTube | string | <https://youtube.com/>... |
| **social** | `twitter_url` | Twitter/X | string | <https://twitter.com/>... |
| **social** | `tiktok_url` | TikTok | string | |
| **hours** | `weekday_hours` | Jam Senin-Jumat | string | 07:00 - 15:00 WITA |
| **hours** | `saturday_hours` | Jam Sabtu | string | 07:00 - 12:00 WITA |
| **hours** | `sunday_hours` | Jam Minggu | string | Tutup |
| **homepage** | `principal_name` | Nama Kepala Sekolah | string | Nama Kepala Sekolah, M.Pd |
| **homepage** | `principal_title` | Jabatan Kepala Sekolah | string | Kepala Sekolah |
| **homepage** | `principal_message` | Kutipan Kepala Sekolah | text | "Pendidikan bukan hanya..." |
| **homepage** | `principal_description` | Deskripsi Sambutan | text | Kami berkomitmen... |
| **homepage** | `principal_photo` | Foto Kepala Sekolah | string | /principal.png |
| **homepage** | `principal_since` | Menjabat Sejak | string | 2020 |
| **homepage** | `cta_title` | Judul CTA | string | Mulai Langkah Besar Anda Disini |
| **homepage** | `cta_subtitle` | Subtitle CTA | string | Kami membuka pintu... |
| **homepage** | `cta_button_text` | Teks Tombol CTA | string | Hubungi Kami |
| **homepage** | `cta_button_link` | Link Tombol CTA | string | /kontak |
| **seo** | `meta_title` | Default Meta Title | string | SMA Negeri 1 Denpasar |
| **seo** | `meta_description` | Default Meta Description | text | SMA terbaik di Denpasar... |
| **seo** | `meta_keywords` | Keywords (comma separated) | text | SMA, Denpasar, Bali... |
| **seo** | `og_image` | Default OG Image | string | /og-image.jpg |
| **seo** | `google_analytics_id` | Google Analytics ID | string | |
| **seo** | `google_tag_manager_id` | GTM ID | string | |
| **theme** | `primary_color` | Warna Utama | string | #2563eb |
| **theme** | `secondary_color` | Warna Sekunder | string | #4f46e5 |

#### 1.3 Update Settings API

Enhance API endpoints:

```php
// Public endpoint (no auth required)
GET /api/v1/settings                    // Get all public settings
GET /api/v1/settings/group/{group}      // Get settings by group
GET /api/v1/settings/{key}              // Get single setting

// Admin endpoints (auth required)
GET /api/admin/v1/settings              // Get all settings (including non-public)
GET /api/admin/v1/settings/groups       // Get list of groups
PUT /api/admin/v1/settings              // Batch update settings
PUT /api/admin/v1/settings/{key}        // Update single setting
POST /api/admin/v1/settings/upload      // Upload image/file for settings
```

#### 1.4 Create SettingsSeeder

```php
// database/seeders/SettingsSeeder.php
class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // General
            ['key' => 'site_name', 'value' => 'SMA Negeri 1 Denpasar', 'type' => 'string', 'group' => 'general', 'label' => 'Nama Sekolah', 'order' => 1],
            // ... all settings
        ];
        
        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
```

---

### Phase 2: Frontend Settings Context (Estimasi: 3-4 jam)

#### 2.1 Create Types

```typescript
// src/types/settings.ts
export interface SiteSettings {
  // General
  site_name: string;
  site_short_name: string;
  site_tagline: string;
  site_description: string;
  site_logo: string;
  site_favicon: string;
  established_year: number;
  
  // Contact
  address: string;
  phone: string;
  fax: string;
  email: string;
  whatsapp: string;
  maps_embed: string;
  latitude: string;
  longitude: string;
  
  // Social
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  twitter_url: string;
  tiktok_url: string;
  
  // Hours
  weekday_hours: string;
  saturday_hours: string;
  sunday_hours: string;
  
  // Homepage
  principal_name: string;
  principal_title: string;
  principal_message: string;
  principal_description: string;
  principal_photo: string;
  principal_since: string;
  cta_title: string;
  cta_subtitle: string;
  cta_button_text: string;
  cta_button_link: string;
  
  // SEO
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_image: string;
  google_analytics_id: string;
  google_tag_manager_id: string;
  
  // Theme
  primary_color: string;
  secondary_color: string;
}
```

#### 2.2 Create Settings API Functions

```typescript
// src/lib/api.ts (additions)
export async function getPublicSettings(): Promise<{ data: SiteSettings }> {
  return fetchApi<{ data: SiteSettings }>('/settings')
}

export async function getSettingsByGroup(group: string): Promise<{ data: Partial<SiteSettings> }> {
  return fetchApi<{ data: Partial<SiteSettings> }>(`/settings/group/${group}`)
}

// Admin functions
export async function getAdminSettings(): Promise<{ data: SettingItem[] }> {
  return fetchAdminApi<{ data: SettingItem[] }>('/settings')
}

export async function updateSettings(settings: { key: string; value: any }[]): Promise<{ message: string }> {
  return fetchAdminApi<{ message: string }>('/settings', {
    method: 'PUT',
    body: JSON.stringify({ settings }),
  })
}

export async function uploadSettingFile(key: string, file: File): Promise<{ url: string }> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('key', key)
  return fetchAdminApi<{ url: string }>('/settings/upload', {
    method: 'POST',
    body: formData,
  })
}
```

#### 2.3 Create Settings Context Provider

```typescript
// src/contexts/SiteConfigContext.tsx
'use client'

import { createContext, useContext, ReactNode } from 'react'
import { SiteSettings } from '@/types/settings'

interface SiteConfigContextType {
  settings: SiteSettings
  isLoading: boolean
}

const SiteConfigContext = createContext<SiteConfigContextType | null>(null)

export function SiteConfigProvider({ 
  children, 
  initialSettings 
}: { 
  children: ReactNode
  initialSettings: SiteSettings 
}) {
  return (
    <SiteConfigContext.Provider value={{ settings: initialSettings, isLoading: false }}>
      {children}
    </SiteConfigContext.Provider>
  )
}

export function useSiteConfig() {
  const context = useContext(SiteConfigContext)
  if (!context) {
    throw new Error('useSiteConfig must be used within SiteConfigProvider')
  }
  return context
}
```

#### 2.4 Server-Side Settings Fetching

```typescript
// src/lib/settings-server.ts
import { cache } from 'react'

export const getSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`, {
      next: { revalidate: 300 } // Cache for 5 minutes
    })
    
    if (!response.ok) {
      return defaultSettings // Fallback to defaults
    }
    
    const { data } = await response.json()
    return { ...defaultSettings, ...data }
  } catch (error) {
    console.error('Failed to fetch settings:', error)
    return defaultSettings
  }
})
```

#### 2.5 Update Root Layout

```typescript
// src/app/layout.tsx
import { SiteConfigProvider } from '@/contexts/SiteConfigContext'
import { getSettings } from '@/lib/settings-server'

export async function generateMetadata() {
  const settings = await getSettings()
  return {
    title: {
      default: settings.site_name,
      template: `%s | ${settings.site_short_name}`,
    },
    description: settings.meta_description,
    keywords: settings.meta_keywords.split(','),
    // ... other metadata
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  
  return (
    <html lang="id">
      <body>
        <SiteConfigProvider initialSettings={settings}>
          {children}
        </SiteConfigProvider>
      </body>
    </html>
  )
}
```

---

### Phase 3: Admin Settings UI Enhancement (Estimasi: 4-5 jam)

#### 3.1 Settings Page Structure

```
/admin/settings
├── Tab: Umum (General)
│   ├── Nama Sekolah
│   ├── Nama Singkat
│   ├── Tagline/Motto
│   ├── Deskripsi
│   ├── Logo (with upload)
│   └── Tahun Berdiri
├── Tab: Kontak & Lokasi
│   ├── Alamat (textarea)
│   ├── Telepon
│   ├── Fax
│   ├── Email
│   ├── WhatsApp
│   ├── Koordinat Maps (lat/long)
│   └── Google Maps Embed URL
├── Tab: Media Sosial
│   ├── Facebook URL
│   ├── Instagram URL
│   ├── YouTube URL
│   ├── Twitter/X URL
│   └── TikTok URL
├── Tab: Jam Operasional
│   ├── Senin - Jumat
│   ├── Sabtu
│   └── Minggu
├── Tab: Homepage
│   ├── == Sambutan Kepala Sekolah ==
│   ├── Nama Kepala Sekolah
│   ├── Jabatan
│   ├── Kutipan/Pesan
│   ├── Deskripsi Sambutan
│   ├── Foto (with upload)
│   ├── Menjabat Sejak
│   ├── == Call to Action ==
│   ├── Judul CTA
│   ├── Subtitle CTA
│   ├── Teks Tombol
│   └── Link Tombol
├── Tab: SEO & Analytics
│   ├── Meta Title Default
│   ├── Meta Description Default
│   ├── Keywords (comma separated)
│   ├── OG Image (with upload)
│   ├── Google Analytics ID
│   └── Google Tag Manager ID
└── Tab: Tema & Branding
    ├── Warna Utama (color picker)
    └── Warna Sekunder (color picker)
```

#### 3.2 Component Architecture

```typescript
// src/components/admin/settings/
├── index.tsx                 // Main export
├── SettingsPage.tsx          // Container component
├── SettingsTabs.tsx          // Tab navigation
├── GeneralSettings.tsx       // General settings form
├── ContactSettings.tsx       // Contact settings form
├── SocialSettings.tsx        // Social media settings form
├── HoursSettings.tsx         // Operating hours form
├── HomepageSettings.tsx      // Homepage content settings
├── SEOSettings.tsx           // SEO & analytics settings
├── ThemeSettings.tsx         // Theme & branding settings
├── SettingsImageUpload.tsx   // Reusable image upload for settings
└── SettingsColorPicker.tsx   // Color picker component
```

---

### Phase 4: Refactor Frontend Components (Estimasi: 6-8 jam)

#### 4.1 Components to Update

| Component | Current | After |
|-----------|---------|-------|
| `Footer.tsx` | Hardcoded address, phone, email, social links | Uses `useSiteConfig()` |
| `HeroSection.tsx` | Static default data | Uses settings for fallback |
| `DesktopView.tsx` | Hardcoded principal data | Uses `useSiteConfig()` |
| `LocationMap.tsx` | Hardcoded coordinates | Uses settings |
| `JsonLd.tsx` | 50+ hardcoded strings | Uses settings props |
| `manifest.ts` | Static values | Dynamic from settings |
| All page metadata | Hardcoded per page | Template with settings |

#### 4.2 Example Refactor: Footer.tsx

```typescript
// BEFORE
export default function Footer() {
  return (
    <footer>
      <p>SMA Negeri 1 Denpasar</p>
      <p>Jl. Kamboja No. 4...</p>
      <p>(0361) 226109</p>
    </footer>
  )
}

// AFTER
'use client'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

export default function Footer() {
  const { settings } = useSiteConfig()
  
  return (
    <footer>
      <p>{settings.site_name}</p>
      <p>{settings.address}</p>
      <p>{settings.phone}</p>
    </footer>
  )
}
```

#### 4.3 Example Refactor: Homepage Principal Section

```typescript
// BEFORE (hardcoded in component)
const principalData = {
  name: 'Nama Kepala Sekolah, M.Pd',
  title: 'Kepala Sekolah SMA Negeri 1 Denpasar',
  // ...
}

// AFTER (from settings)
'use client'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

function PrincipalSection() {
  const { settings } = useSiteConfig()
  
  const principalData = {
    name: settings.principal_name,
    title: `${settings.principal_title} ${settings.site_name}`,
    message: settings.principal_message,
    description: settings.principal_description,
    image: settings.principal_photo,
    since: settings.principal_since,
  }
  
  return (/* ... use principalData */)
}
```

#### 4.4 Files to Update

1. `src/components/layout/Footer.tsx`
2. `src/components/homepage/DesktopView.tsx`
3. `src/components/homepage/MobileView.tsx`
4. `src/components/homepage/components/HeroSection.tsx`
5. `src/components/homepage/components/LocationMap.tsx`
6. `src/components/seo/JsonLd.tsx`
7. `src/app/layout.tsx`
8. `src/app/manifest.ts`
9. `src/app/robots.ts`
10. `src/app/sitemap.ts`
11. `src/app/tentang/page.tsx`
12. `src/app/kontak/*` pages
13. `src/components/tentang/ResponsiveView.tsx`
14. `src/components/galeri/*.tsx`
15. `src/components/fasilitas/*.tsx`
16. `src/components/ekstrakurikuler/*.tsx`
17. `src/components/informasi/*.tsx`
18. `src/app/pengumuman/page.tsx`
19. ~15 more component files

---

### Phase 5: Testing & Validation (Estimasi: 2-3 jam)

#### 5.1 Backend Tests

- [ ] Settings CRUD API tests
- [ ] Settings cache invalidation tests
- [ ] File upload tests
- [ ] Authorization tests

#### 5.2 Frontend Tests

- [ ] Settings context provides values correctly
- [ ] Components render with settings
- [ ] Fallback to defaults when API fails
- [ ] Admin settings form submission

#### 5.3 Integration Tests

- [ ] Change setting in admin → verify update on frontend
- [ ] Upload image → verify URL is correct
- [ ] Cache invalidation works

---

## 📁 Files to Create

### Backend

```
backend/
├── database/
│   ├── migrations/
│   │   └── 2025_12_17_000001_add_metadata_to_settings_table.php
│   └── seeders/
│       └── SettingsSeeder.php
├── app/
│   └── Http/
│       └── Controllers/
│           └── Api/
│               └── SettingController.php (update)
```

### Frontend

```
frontend/src/
├── types/
│   └── settings.ts
├── contexts/
│   └── SiteConfigContext.tsx
├── lib/
│   ├── settings-server.ts
│   └── api.ts (additions)
├── components/
│   └── admin/
│       └── settings/
│           ├── index.tsx (update)
│           ├── SettingsPage.tsx
│           ├── SettingsTabs.tsx
│           ├── GeneralSettings.tsx
│           ├── ContactSettings.tsx
│           ├── SocialSettings.tsx
│           ├── HoursSettings.tsx
│           ├── HomepageSettings.tsx
│           ├── SEOSettings.tsx
│           ├── ThemeSettings.tsx
│           ├── SettingsImageUpload.tsx
│           └── SettingsColorPicker.tsx
└── (updates to 20+ existing files)
```

---

## ⏱️ Timeline Estimasi

| Phase | Durasi | Kumulatif |
|-------|--------|-----------|
| Phase 1: Backend Enhancement | 4-6 jam | 4-6 jam |
| Phase 2: Frontend Context | 3-4 jam | 7-10 jam |
| Phase 3: Admin UI | 4-5 jam | 11-15 jam |
| Phase 4: Refactor Components | 6-8 jam | 17-23 jam |
| Phase 5: Testing | 2-3 jam | 19-26 jam |

**Total Estimasi: 19-26 jam kerja (3-4 hari)**

---

## 🎯 Prioritas Implementasi

### High Priority (Harus Ada) - ✅ SELESAI PHASE 1-3

1. ✅ General Settings (nama, deskripsi sekolah)
2. ✅ Contact Settings (alamat, telepon, email)
3. ✅ Social Media Links
4. ✅ Homepage Principal Section
5. ⬜ Footer dinamis (Phase 4)

### Medium Priority (Sebaiknya Ada)

1. ✅ SEO Settings - Backend ready
2. ✅ Operating Hours - Backend ready
3. ✅ Homepage CTA customization - Backend ready
4. ✅ Theme/Branding colors - Backend ready

### Low Priority (Nice to Have)

1. ⬜ Google Analytics integration (frontend)
2. ⬜ GTM integration (frontend)
3. ⬜ Advanced theming (CSS variables)

---

## 📝 Implementation Progress (Updated 17 Des 2024)

### Phase 1: Backend Settings Enhancement ✅ SELESAI

- ✅ Migration `add_metadata_to_settings_table.php`
- ✅ SettingsSeeder dengan 40+ settings
- ✅ SettingController dengan semua endpoints
- ✅ API routes untuk public dan admin

### Phase 2: Frontend Settings Context ✅ SELESAI

- ✅ Types `settings.ts` dengan SiteSettings interface
- ✅ Default settings values
- ✅ Settings API functions di `api.ts`
- ✅ `SiteConfigContext.tsx` provider
- ✅ `settings-server.ts` untuk server-side fetching

### Phase 3: Admin Settings UI ✅ SELESAI

- ✅ Desktop view dengan tabs dan dynamic form
- ✅ Mobile view dengan collapsible sections
- ✅ Image upload support
- ✅ Color picker support
- ✅ API integration

### Phase 4: Refactor Frontend Components ✅ SELESAI

- ✅ Update `Footer.tsx` untuk menggunakan useSiteConfig()
- ✅ Update `DesktopView.tsx` (Homepage) principal section + CTA
- ✅ Update `MobileView.tsx` (Homepage) hero + CTA
- ✅ Update `LocationMap.tsx` contact info + maps embed
- ✅ Create `DynamicJsonLd.tsx` wrapper components
- ✅ Update `layout.tsx` metadata + SiteConfigProvider
- ✅ Update `manifest.ts` PWA metadata

### Phase 5: Testing & Validation ⬜ RECOMMENDED

- ⬜ Test backend API (CRUD, caching, authorization)
- ⬜ Test admin panel settings (semua grup)
- ⬜ Test frontend rendering dengan dynamic settings
- ⬜ Test fallback ke default values

---

## 🔄 Rollback Plan

Jika terjadi masalah:

1. Default values sudah di-define di frontend
2. Settings fallback ke default jika API gagal
3. Cache dapat di-clear dari backend
4. Dapat revert ke commit sebelumnya

---

## 📝 Notes

### Keamanan

- Settings yang sensitif (API keys, credentials) tidak disimpan di settings public
- Admin-only settings tidak terexpose ke public API
- File upload hanya menerima image types tertentu

### Performance

- Settings di-cache di backend (Redis/File) selama 1 jam
- Frontend fetch settings sekali di root layout
- ISR (Incremental Static Regeneration) 5 menit untuk pages
- Settings tidak re-fetch di setiap page navigation

### SEO Considerations

- Dynamic metadata generation dengan server components
- JSON-LD schema menggunakan settings
- Sitemap dan robots.txt tetap static untuk performance
