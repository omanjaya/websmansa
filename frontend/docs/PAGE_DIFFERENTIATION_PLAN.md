# 🎨 Page Differentiation Plan

## Website SMAN 1 Denpasar - Frontend Enhancement

**Dibuat:** 19 Desember 2025  
**Status:** Planning Phase  
**Developer:** @omanjaya

---

## 📋 Daftar Isi

1. [Overview](#overview)
2. [Filosofi Desain](#filosofi-desain)
3. [Status Per Halaman](#status-per-halaman)
4. [Enhancement Plan Detail](#enhancement-plan-detail)
5. [Shared Components](#shared-components)
6. [Color System](#color-system)
7. [Animation Library](#animation-library)
8. [Implementation Priority](#implementation-priority)
9. [Technical Notes](#technical-notes)

---

## Overview

### Tujuan

Menciptakan pengalaman visual yang unik dan memorable untuk setiap halaman, sambil menjaga konsistensi brand dan UX yang baik.

### Prinsip

- **Konsistensi dalam Variasi**: Gunakan design system yang sama, tapi dengan variasi yang bermakna
- **Purpose-Driven Design**: Setiap elemen unik harus memiliki tujuan fungsional
- **Performance First**: Animasi dan efek tidak boleh mengorbankan performa
- **Accessibility**: Semua enhancement harus tetap accessible

---

## Filosofi Desain

### Brand Identity

- **Primary Color**: Blue (#3B82F6) - Melambangkan kepercayaan dan profesionalisme
- **Secondary Colors**: Warna per-kategori halaman
- **Typography**: Modern, clean, readable
- **Imagery**: High-quality, authentic school photos

### User Experience Goals

1. **First Impression**: Wow effect dalam 3 detik pertama
2. **Navigation**: Intuitive dan predictable
3. **Engagement**: Interaktif tapi tidak overwhelming
4. **Information Architecture**: Clear hierarchy

---

## Status Per Halaman

### Legend

- 🟢 Selesai
- 🟡 Dalam Progress
- 🔴 Belum Dimulai
- ⭐ Priority

| Halaman | Status | Theme Color | Unique Feature |
|---------|--------|-------------|----------------|
| Homepage | 🟢 | Blue | Hero Slider, Carousels |
| Informasi | 🟢 | Blue/Cyan | Category Filter, Search |
| Galeri | 🟡 | Purple/Pink | Lightbox |
| Fasilitas | 🟢 | Purple/Indigo | Amenities Cards |
| Ekstrakurikuler | 🟢 | Green/Emerald | Achievement List |
| Pengumuman | 🟢 | Orange/Amber | Type Badges |
| Prestasi | 🟡 | Yellow/Gold | Medal System |
| Alumni | 🟢 | Purple/Violet | Year Filter |
| Staff | 🟢 | Green/Teal | Position Filter |
| Tentang | 🟡 | Blue/Slate | Vision Mission |
| Kontak | 🟢 | Green/Cyan | Contact Form, Map |

---

## Enhancement Plan Detail

### 1. 🏠 Homepage

**Status**: ✅ Complete
**Theme**: Blue gradient dengan accent gold

#### Current Features

- Hero slider dengan auto-play
- Featured achievements carousel (infinite marquee)
- Alumni testimonials marquee
- Gallery preview grid
- News section dengan featured cards

#### Planned Enhancements

- [ ] Parallax effect pada hero section
- [ ] Statistik counter animation on scroll
- [ ] Smooth scroll navigation
- [ ] Video background option untuk hero

---

### 2. 📰 Informasi (Berita)

**Status**: ✅ Complete
**Theme**: Blue to Cyan gradient

#### Current Features

- Category filter pills
- Search functionality
- Pagination
- News cards dengan hover effects

#### Planned Enhancements

- [ ] Infinite scroll option
- [ ] Reading progress bar di detail page
- [ ] Related posts dengan smart algorithm
- [ ] Share dengan social meta preview

#### Detail Page Features

- Hero dengan featured image
- Author info dan reading time
- Like button
- Share buttons
- Related posts section

---

### 3. 🖼️ Galeri

**Status**: 🟡 In Progress
**Theme**: Purple to Pink gradient (Creative, Artistic)

#### Current Features

- Grid masonry layout
- Lightbox dengan navigation
- Category filter (Foto/Video)

#### Planned Enhancements

- [ ] **3D Card Hover Effect**: Kartu gambar dengan tilt effect on hover
- [ ] **Masonry Layout Improved**: Pinterest-style dynamic grid
- [ ] **Fullscreen Gallery Mode**: Immersive viewing experience
- [ ] **Zoom & Pan**: Gesture support untuk mobile
- [ ] **Gallery Slideshow**: Auto-play option dalam lightbox

#### Animation Details

```typescript
// 3D Card Tilt Effect
const tiltEffect = {
  rotateX: mouseY * 0.1,
  rotateY: mouseX * -0.1,
  transformPerspective: 1000,
  scale: 1.05
}
```

---

### 4. 🏫 Fasilitas

**Status**: ✅ Complete
**Theme**: Purple to Indigo gradient (Professional, Trustworthy)

#### Current Features

- Category filter
- Amenities list dengan icons
- Capacity dan location info
- Related facilities sidebar

#### Planned Enhancements

- [ ] **Virtual Tour Preview**: 360° image atau video preview
- [ ] **Availability Calendar**: Status ketersediaan fasilitas
- [ ] **Interactive Floor Map**: Peta lokasi fasilitas dalam sekolah
- [ ] **Photo Gallery per Facility**: Multiple images dengan slider

#### Detail Page Features

- Hero dengan facility image
- Amenities badge list
- Location dan capacity info
- Related facilities

---

### 5. ⚽ Ekstrakurikuler

**Status**: ✅ Complete
**Theme**: Green to Emerald gradient (Active, Growth)

#### Current Features

- Category filter (Olahraga, Seni, Akademik, dll)
- Member count dan quota
- Schedule dan location info
- Coach/Pembina info

#### Planned Enhancements

- [ ] **Achievement Showcase**: Trophy animation saat hover
- [ ] **Member Gallery**: Foto anggota ekskul
- [ ] **Activity Timeline**: Recent activities dan events
- [ ] **Registration Interest Form**: Inline interest form (bukan pendaftaran penuh)

#### Detail Page Features

- Hero dengan ekskul image
- Coach info section
- Achievement list dengan trophy icons
- Requirements section

---

### 6. 📢 Pengumuman

**Status**: 🟢 Complete
**Theme**: Orange to Amber gradient (Attention, Important)

#### Current Features

- Type filter (General, Academic, Event, Urgent)
- Priority badges
- Pinned announcements
- Date range info

#### Planned Enhancements

- [ ] **Urgent Banner**: Animated attention banner untuk pengumuman urgent
- [ ] **Countdown Timer**: Untuk event dengan deadline
- [ ] **Notification Sound**: Optional untuk urgent announcements
- [ ] **Calendar View**: View pengumuman dalam format kalender

#### Unique Elements

```typescript
// Urgent Announcement Animation
const urgentPulse = {
  scale: [1, 1.02, 1],
  boxShadow: [
    "0 0 0 0 rgba(239, 68, 68, 0.4)",
    "0 0 0 10px rgba(239, 68, 68, 0)",
    "0 0 0 0 rgba(239, 68, 68, 0)"
  ]
}
```

---

### 7. 🏆 Prestasi

**Status**: 🟡 In Progress
**Theme**: Yellow to Gold gradient (Success, Excellence)

#### Current Features

- Medal system (Gold/Silver/Bronze)
- Level filter (Sekolah/Kota/Provinsi/Nasional/Internasional)
- Year filter
- Category filter (Akademik/Non-Akademik)

#### Planned Enhancements

- [ ] **Confetti Animation**: Confetti effect saat hover achievement card
- [ ] **Trophy Cabinet**: 3D trophy display untuk top achievements
- [ ] **Achievement Counter**: Animated counter statistics
- [ ] **Timeline View**: Chronological achievement timeline
- [ ] **Medal Shine Effect**: Shimmer/shine effect pada medal badges

#### Animation Details

```typescript
// Confetti on Hover
import confetti from 'canvas-confetti'

const celebrateAchievement = () => {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#FFD700', '#FFA500', '#C0C0C0']
  })
}

// Medal Shine Effect
const shineAnimation = {
  background: `linear-gradient(
    120deg,
    transparent 0%,
    transparent 40%,
    rgba(255,255,255,0.8) 50%,
    transparent 60%,
    transparent 100%
  )`,
  backgroundSize: '200% 100%',
  animation: 'shine 3s infinite'
}
```

---

### 8. 🎓 Alumni

**Status**: 🟢 Complete
**Theme**: Purple to Violet gradient (Pride, Legacy)

#### Current Features

- Year/Angkatan filter
- Testimonial quotes
- Institution info
- Photo cards

#### Planned Enhancements

- [ ] **Success Story Slider**: Featured alumni stories dalam carousel
- [ ] **Parallax Testimonial Cards**: Scroll-driven movement
- [ ] **Alumni Map**: Peta persebaran alumni (jika ada data)
- [ ] **Generation Stats**: Statistik per angkatan (jumlah, profesi, dll)
- [ ] **Quote Animation**: Typewriter effect untuk testimonial

#### Animation Details

```typescript
// Parallax Card Effect
const parallaxCard = {
  y: scrollProgress * 50,
  rotate: scrollProgress * 5,
  opacity: 1 - Math.abs(scrollProgress - 0.5)
}
```

---

### 9. 👨‍🏫 Staff & Guru

**Status**: 🟢 Complete
**Theme**: Green to Teal gradient (Professional, Nurturing)

#### Current Features

- Position filter (Kepala Sekolah, Wakil, Guru, Staff)
- Leadership section
- Profile cards
- Search functionality

#### Planned Enhancements

- [ ] **Magazine-Style Layout**: Editorial layout untuk leadership
- [ ] **Department Grouping**: Visual grouping by department
- [ ] **Hover Bio Preview**: Quick bio on hover
- [ ] **Subject Tags**: Teacher subject specializations
- [ ] **Contact Quick Action**: Quick call/email action

#### Layout Concept

```
┌──────────────────────────────────────┐
│         LEADERSHIP SECTION           │
│  ┌─────────┐  ┌─────────┐            │
│  │ Kepala  │  │  Wakil  │            │
│  │ Sekolah │  │ Kepsek  │            │
│  └─────────┘  └─────────┘            │
├──────────────────────────────────────┤
│           TEACHERS GRID              │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐      │
│  │   │ │   │ │   │ │   │ │   │      │
│  └───┘ └───┘ └───┘ └───┘ └───┘      │
└──────────────────────────────────────┘
```

---

### 10. ℹ️ Tentang Kami

**Status**: 🟡 In Progress
**Theme**: Blue to Slate gradient (Trustworthy, Established)

#### Current Features

- Vision & Mission section
- School history
- Accreditation info
- Principal message

#### Planned Enhancements

- [ ] **Scroll-Driven Timeline**: Interactive history timeline
- [ ] **Stats Counter Animation**: Animated statistics on scroll
- [ ] **Photo Milestone Slider**: Historical photos carousel
- [ ] **Accreditation Badge Showcase**: Animated badge display
- [ ] **Organizational Chart**: Interactive org chart

#### Timeline Concept

```
2010 ──●────────────────────────────
       │  Pendirian
       │
2015 ──●────────────────────────────
       │  Akreditasi A
       │
2020 ──●────────────────────────────
       │  Renovasi Gedung
       │
2024 ──●────────────────────────────
       │  50 Tahun Anniversary
```

---

### 11. 📞 Kontak

**Status**: 🟢 Complete
**Theme**: Green to Cyan gradient (Friendly, Accessible)

#### Current Features

- Contact form
- Google Maps embed
- Contact info cards
- Social media links

#### Planned Enhancements

- [ ] **Interactive Map Markers**: Custom markers dengan info popup
- [ ] **Working Hours Widget**: Real-time open/closed status
- [ ] **Directions Button**: One-click directions ke Google Maps
- [ ] **Form Validation Animation**: Friendly validation feedback
- [ ] **Success Animation**: Checkmark animation on form submit

---

## Shared Components

### Core Components

Komponen yang digunakan di semua halaman:

```
src/components/shared/
├── PageHero.tsx          # Hero section dengan variants
├── Section.tsx           # Content section wrapper
├── Waves.tsx             # Wave divider
├── DotPattern.tsx        # Background pattern
├── GlowSpot.tsx          # Glow effect
├── FilterBar.tsx         # Filter component
├── Pagination.tsx        # Pagination
├── SectionTitle.tsx      # Section heading
└── ProfileCard.tsx       # Profile/Card component
```

### Animation Components

```
src/components/shared/Animations.tsx
├── FadeInOnScroll        # Fade in when visible
├── StaggerContainer      # Staggered children
├── StaggerItem           # Child of StaggerContainer
├── Parallax              # Parallax scroll effect
├── HoverScale            # Scale on hover
├── Float                 # Floating animation
├── TextReveal            # Text reveal animation
└── Shimmer               # Loading shimmer
```

### Decoration Components

```
src/components/shared/Decorations.tsx
├── FloatingShapes        # Animated shapes (disabled - glitchy)
├── GridPattern           # Grid background
├── DotPattern            # Dot background
├── Waves                 # Wave divider
├── GlowSpot              # Glow effect
└── HexagonPattern        # Hexagon pattern (disabled - glitchy)
```

---

## Color System

### Primary Colors per Page

```css
:root {
  /* Homepage */
  --color-home-primary: #3B82F6;
  --color-home-secondary: #1D4ED8;
  
  /* Informasi */
  --color-info-primary: #0891B2;
  --color-info-secondary: #0E7490;
  
  /* Galeri */
  --color-gallery-primary: #A855F7;
  --color-gallery-secondary: #EC4899;
  
  /* Fasilitas */
  --color-facility-primary: #8B5CF6;
  --color-facility-secondary: #6366F1;
  
  /* Ekstrakurikuler */
  --color-extra-primary: #10B981;
  --color-extra-secondary: #059669;
  
  /* Pengumuman */
  --color-announce-primary: #F97316;
  --color-announce-secondary: #EA580C;
  
  /* Prestasi */
  --color-achieve-primary: #EAB308;
  --color-achieve-secondary: #CA8A04;
  
  /* Alumni */
  --color-alumni-primary: #8B5CF6;
  --color-alumni-secondary: #7C3AED;
  
  /* Staff */
  --color-staff-primary: #14B8A6;
  --color-staff-secondary: #0D9488;
  
  /* Tentang */
  --color-about-primary: #64748B;
  --color-about-secondary: #475569;
  
  /* Kontak */
  --color-contact-primary: #06B6D4;
  --color-contact-secondary: #0891B2;
}
```

### Gradient Templates

```css
/* Standard Page Hero Gradient */
.gradient-hero-standard {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
}

/* Overlay Gradient */
.gradient-overlay {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    rgba(0, 0, 0, 0.2) 100%
  );
}

/* Card Gradient */
.gradient-card {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(248, 250, 252, 0.95) 100%
  );
}
```

---

## Animation Library

### Scroll-Triggered Animations

```typescript
// useScrollAnimation.ts
import { useScroll, useTransform, MotionValue } from 'framer-motion'

export function useScrollAnimation() {
  const { scrollYProgress } = useScroll()
  
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])
  const y = useTransform(scrollYProgress, [0, 0.2], [50, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1])
  
  return { opacity, y, scale }
}
```

### Hover Effects Library

```typescript
// Hover Effects
export const hoverEffects = {
  // Lift up effect
  lift: {
    y: -8,
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    transition: { duration: 0.3 }
  },
  
  // Scale effect
  scale: {
    scale: 1.05,
    transition: { duration: 0.2 }
  },
  
  // Glow effect
  glow: {
    boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
    transition: { duration: 0.3 }
  },
  
  // Tilt 3D effect
  tilt3D: (mouseX: number, mouseY: number) => ({
    rotateX: mouseY * 10,
    rotateY: mouseX * -10,
    transformPerspective: 1000
  })
}
```

### Page Transition Effects

```typescript
// Page Transitions
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: 'easeInOut' }
}
```

---

## Implementation Priority

### Phase 1: Quick Wins (1-2 hari)

High impact, low effort improvements

| Task | Page | Effort | Impact |
|------|------|--------|--------|
| Medal shine effect | Prestasi | Low | High |
| Confetti on achievement | Prestasi | Low | High |
| Quote typewriter effect | Alumni | Low | Medium |
| Stats counter animation | Tentang | Medium | High |
| Form validation animation | Kontak | Low | Medium |

### Phase 2: Medium Effort (3-5 hari)

Substantial improvements

| Task | Page | Effort | Impact |
|------|------|--------|--------|
| 3D card tilt effect | Galeri | Medium | High |
| Scroll-driven timeline | Tentang | Medium | High |
| Parallax testimonials | Alumni | Medium | Medium |
| Magazine layout | Staff | Medium | High |
| Gallery slideshow | Galeri | Medium | Medium |

### Phase 3: Major Features (1-2 minggu)

Big features yang membutuhkan waktu

| Task | Page | Effort | Impact |
|------|------|--------|--------|
| Virtual tour preview | Fasilitas | High | Very High |
| Interactive floor map | Fasilitas | High | High |
| Trophy cabinet 3D | Prestasi | High | High |
| Achievement timeline | Prestasi | High | High |
| Activity calendar | Pengumuman | High | Medium |

---

## Technical Notes

### Performance Considerations

1. **Lazy Loading**
   - Semua gambar menggunakan `loading="lazy"`
   - Komponen berat menggunakan `dynamic import`
   - Animasi menggunakan `IntersectionObserver`

2. **Animation Performance**
   - Gunakan `transform` dan `opacity` untuk animasi
   - Hindari animasi pada `layout properties`
   - Gunakan `will-change` dengan bijak

3. **Bundle Size**
   - Split code per route
   - Tree-shake unused components
   - Optimize images dengan Next.js Image

### Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| CSS Grid | ✅ | ✅ | ✅ | ✅ |
| Flexbox | ✅ | ✅ | ✅ | ✅ |
| CSS Variables | ✅ | ✅ | ✅ | ✅ |
| Backdrop Filter | ✅ | ✅ | ⚠️ | ✅ |
| Scroll Snap | ✅ | ✅ | ✅ | ✅ |
| IntersectionObserver | ✅ | ✅ | ✅ | ✅ |

### Accessibility Checklist

- [ ] All buttons have `aria-label`
- [ ] All images have `alt` text
- [ ] Color contrast meets WCAG 2.1 AA
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Reduced motion option

---

## 📝 Notes & Ideas

### Future Considerations

1. **PWA Enhancement**: Offline support untuk berita dan galeri
2. **Dark Mode Polish**: Refine dark mode colors per page
3. **Mobile Gestures**: Swipe navigation untuk galeri
4. **Print Styles**: Optimized printing untuk pengumuman

### Inspirations

- Apple.com - Clean animations
- Linear.app - Smooth transitions
- Stripe.com - Gradient usage
- Vercel.com - Dark mode implementation

---

## 🔄 Changelog

### v1.0.0 (19 Des 2025)

- Initial documentation created
- Defined color system
- Listed all enhancement plans
- Created implementation priority

---

*Dokumentasi ini akan diupdate seiring development*
