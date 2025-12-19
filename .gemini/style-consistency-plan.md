# Implementation Plan: Konsistensi Style Website SMANSA

## 🎯 Objective

Membuat semua halaman publik memiliki style yang konsisten dengan homepage, menggunakan aesthetic seperti:

- **Glassmorphism** (backdrop-blur, transparency)
- **Gradient backgrounds** (subtle gradients)
- **Spotlight/Blur effects** (untuk carousels)
- **Premium cards** dengan shadow dan hover effects
- **Section headers** dengan badge dan gradient text
- **Smooth animations** (Framer Motion)

---

## 📋 Halaman yang Perlu Diupdate

### Priority 1: Main Public Pages

1. `/tentang` - Halaman Tentang Kami
2. `/informasi` - Halaman Berita/Informasi
3. `/galeri` - Halaman Galeri
4. `/kontak` - Halaman Kontak

### Priority 2: Content Pages

5. `/prestasi` - Halaman Prestasi (perlu dibuat)
6. `/alumni` - Halaman Alumni (perlu dibuat)
7. `/fasilitas` - Halaman Fasilitas
8. `/staff` - Halaman Staff/Guru
9. `/ekstrakurikuler` - Halaman Ekstrakurikuler
10. `/pengumuman` - Halaman Pengumuman

### Priority 3: Detail Pages

11. `/informasi/[slug]` - Detail Berita
12. `/galeri/[slug]` - Detail Galeri
13. `/fasilitas/[slug]` - Detail Fasilitas
14. `/staff/[slug]` - Detail Staff
15. `/ekstrakurikuler/[slug]` - Detail Ekstrakurikuler
16. `/pengumuman/[slug]` - Detail Pengumuman

---

## 🎨 Design System Components

### 1. Page Hero Component

Reusable hero untuk semua halaman dengan:

- Background gradient atau gambar
- Glassmorphism overlay
- Animated title dengan gradient text
- Breadcrumb navigation
- Optional stats bar

```tsx
// src/components/shared/PageHero.tsx
interface PageHeroProps {
  title: string
  subtitle?: string
  badge?: { icon: LucideIcon; label: string; color: string }
  backgroundImage?: string
  stats?: { label: string; value: string }[]
  breadcrumbs?: { label: string; href: string }[]
}
```

### 2. Section Component

Wrapper untuk section dengan:

- Consistent padding
- Background options (white, slate, gradient)
- Section divider
- Fade-in animation

```tsx
// src/components/shared/Section.tsx
interface SectionProps {
  children: React.ReactNode
  background?: 'white' | 'slate' | 'gradient'
  className?: string
}
```

### 3. Card Components

Premium cards dengan:

- Glassmorphism effect
- Hover animations
- Shadow variations
- Border glow on hover

```tsx
// src/components/shared/cards/
- GlassCard.tsx      // Glassmorphism effect
- PhotoCard.tsx      // Untuk gallery items
- ArticleCard.tsx    // Untuk berita/artikel
- ProfileCard.tsx    // Untuk staff/alumni
- FeatureCard.tsx    // Untuk fasilitas/fitur
```

### 4. Filter/Search Component

Modern filter bar dengan:

- Glassmorphism background
- Animated tabs
- Search input dengan icon
- Category pills

```tsx
// src/components/shared/FilterBar.tsx
interface FilterBarProps {
  categories: Category[]
  currentCategory?: string
  onCategoryChange: (slug: string) => void
  onSearch: (query: string) => void
}
```

---

## 📝 Implementation Steps

### Phase 1: Create Shared Components (Day 1)

#### Step 1.1: PageHero Component

```
Location: src/components/shared/PageHero.tsx
Features:
- Fullscreen or half-screen hero
- Background with overlay/gradient
- Animated title entrance
- Glassmorphism badge
- Optional breadcrumbs
- Optional stats row
```

#### Step 1.2: Section Component

```
Location: src/components/shared/Section.tsx
Features:
- Consistent py-16 md:py-20 padding
- Background variants
- Optional section divider
- Fade-in animation wrapper
```

#### Step 1.3: GlassCard Component

```
Location: src/components/shared/cards/GlassCard.tsx
Features:
- backdrop-blur-md
- bg-white/80 dark:bg-slate-800/80
- border border-white/20
- hover:shadow-xl transition
- Optional glow ring
```

### Phase 2: Update Main Pages (Day 2-3)

#### Step 2.1: Update `/tentang`

```
Components to update: src/components/tentang/TentangPage.tsx
Changes:
- Add PageHero with school image background
- Glassmorphism stat cards
- Timeline with animated entries
- Leadership cards with premium styling
- Visi Misi with gradient accents
```

#### Step 2.2: Update `/informasi`

```
Components to update: src/components/informasi/InformasiPage.tsx
Changes:
- Add PageHero with news theme
- Glassmorphism filter bar
- Premium article cards with hover effects
- Featured news spotlight
- Pagination with modern styling
```

#### Step 2.3: Update `/galeri`

```
Components to update: src/components/galeri/GaleriPage.tsx
Changes:
- Add PageHero with gallery theme
- Masonry grid layout
- Photo cards with hover zoom
- Lightbox integration
- Filter tabs with glassmorphism
```

#### Step 2.4: Update `/kontak`

```
Components to update: src/components/kontak/ or create new
Changes:
- Add PageHero with contact theme
- Glassmorphism contact cards
- Embedded map with custom styling
- Contact form with modern inputs
- Social media links with hover effects
```

### Phase 3: Create New Pages (Day 4-5)

#### Step 3.1: Create `/prestasi`

```
Location: src/app/prestasi/page.tsx + src/components/prestasi/
Features:
- PageHero with trophy/medal theme
- Filter by year/category/level
- Achievement cards with spotlight carousel (like homepage)
- Stats section
```

#### Step 3.2: Create `/alumni`

```
Location: src/app/alumni/page.tsx + src/components/alumni/
Features:
- PageHero with graduation theme
- Search by year/profession
- Alumni cards with photo + quote
- Alumni spotlight carousel (like homepage)
- Alumni testimonials section
```

### Phase 4: Update Content Pages (Day 6-7)

#### Step 4.1: Update `/fasilitas`

```
- PageHero with building image
- Feature grid with icons
- Photo gallery for each facility
- Modern card layout
```

#### Step 4.2: Update `/staff`

```
- PageHero with team theme
- Filter by department
- Profile cards with hover effects
- Grid layout responsive
```

#### Step 4.3: Update `/ekstrakurikuler`

```
- PageHero with activity theme
- Category filter
- Activity cards with images
- Join CTA section
```

#### Step 4.4: Update `/pengumuman`

```
- PageHero with announcement theme
- Priority indicators
- Timeline/list view
- Filter by type/date
```

### Phase 5: Update Detail Pages (Day 8-9)

#### Step 5.1: Article Detail Template

```
Common layout for:
- /informasi/[slug]
- /pengumuman/[slug]

Features:
- Hero with featured image
- Reading time indicator
- Share buttons
- Related articles
- Comment section (optional)
```

#### Step 5.2: Gallery Detail Template

```
For: /galeri/[slug]

Features:
- Hero with gallery cover
- Photo grid with lightbox
- Gallery info sidebar
- Related galleries
```

#### Step 5.3: Profile Detail Template

```
For: /staff/[slug]

Features:
- Full profile hero
- Bio section
- Contact info
- Related staff
```

---

## 🔧 CSS Updates Required

### Add to globals.css

```css
/* Glassmorphism utilities */
.glass-card {
  @apply bg-white/80 dark:bg-slate-800/80 backdrop-blur-md;
  @apply border border-white/20 dark:border-slate-700/50;
  @apply shadow-lg rounded-2xl;
}

.glass-card-hover {
  @apply transition-all duration-300;
  @apply hover:shadow-xl hover:border-white/40;
  @apply hover:-translate-y-1;
}

/* Page hero styles */
.page-hero {
  @apply relative min-h-[50vh] flex items-center;
  @apply bg-gradient-to-b from-slate-900 to-slate-800;
}

.page-hero-overlay {
  @apply absolute inset-0 bg-black/40;
}

/* Gradient text variants */
.gradient-text-blue {
  @apply text-transparent bg-clip-text;
  @apply bg-gradient-to-r from-blue-600 to-cyan-500;
}

.gradient-text-purple {
  @apply text-transparent bg-clip-text;
  @apply bg-gradient-to-r from-purple-500 to-pink-500;
}

.gradient-text-gold {
  @apply text-transparent bg-clip-text;
  @apply bg-gradient-to-r from-yellow-500 to-orange-500;
}
```

---

## 📦 File Structure After Implementation

```
src/components/
├── shared/
│   ├── PageHero.tsx          # Hero component for all pages
│   ├── Section.tsx           # Section wrapper
│   ├── FilterBar.tsx         # Filter/search bar
│   ├── Breadcrumbs.tsx       # Breadcrumb navigation
│   ├── SectionHeader.tsx     # (existing) Update styling
│   ├── NewsCard.tsx          # (existing) Update styling
│   └── cards/
│       ├── GlassCard.tsx     # Base glass card
│       ├── ArticleCard.tsx   # For news/articles
│       ├── PhotoCard.tsx     # For gallery
│       ├── ProfileCard.tsx   # For staff/alumni
│       └── FeatureCard.tsx   # For facilities
├── tentang/
│   └── TentangPage.tsx       # Updated
├── informasi/
│   └── InformasiPage.tsx     # Updated
├── galeri/
│   └── GaleriPage.tsx        # Updated
├── kontak/
│   └── KontakPage.tsx        # New/Updated
├── prestasi/
│   └── PrestasiPage.tsx      # New
├── alumni/
│   └── AlumniPage.tsx        # New
├── fasilitas/
│   └── FasilitasPage.tsx     # Updated
├── staff/
│   └── StaffPage.tsx         # Updated
└── ekstrakurikuler/
    └── EkstrakurikulerPage.tsx # Updated
```

---

## ✅ Checklist

### Shared Components

- [ ] PageHero.tsx
- [ ] Section.tsx
- [ ] FilterBar.tsx
- [ ] GlassCard.tsx
- [ ] ArticleCard.tsx
- [ ] PhotoCard.tsx
- [ ] ProfileCard.tsx

### Page Updates

- [ ] /tentang
- [ ] /informasi
- [ ] /galeri
- [ ] /kontak
- [ ] /prestasi (new)
- [ ] /alumni (new)
- [ ] /fasilitas
- [ ] /staff
- [ ] /ekstrakurikuler
- [ ] /pengumuman

### Detail Pages

- [ ] /informasi/[slug]
- [ ] /galeri/[slug]
- [ ] /fasilitas/[slug]
- [ ] /staff/[slug]
- [ ] /ekstrakurikuler/[slug]
- [ ] /pengumuman/[slug]

### CSS/Styling

- [ ] Add glassmorphism utilities
- [ ] Add gradient text classes
- [ ] Update dark mode variants

---

## 🚀 Execution Order

1. **Start with PageHero** - This will be used by all pages
2. **Update /tentang** - Good test case for full page redesign
3. **Update /informasi** - High traffic page, update cards
4. **Update /galeri** - Visual page, test photo cards
5. **Create /prestasi** - Reuse homepage carousel
6. **Create /alumni** - Reuse homepage carousel
7. **Update remaining pages**
8. **Update detail pages last**

Apakah Anda ingin saya mulai implementasi dari Step 1 (PageHero component)?
