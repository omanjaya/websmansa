# UI/UX Design Guidelines

## 🎨 Design System

### Brand Identity

**School Colors:**

```css
:root {
  /* Primary Colors */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6; /* Main brand color - Blue */
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;

  /* Secondary Colors */
  --color-secondary-50: #fef3c7;
  --color-secondary-500: #f59e0b; /* Gold/Yellow accent */
  --color-secondary-900: #78350f;

  /* Neutral Colors */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;

  /* Semantic Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
}
```

### Typography

```css
:root {
  /* Font Families */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-serif: 'Merriweather', Georgia, serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
  --text-6xl: 3.75rem;   /* 60px */

  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
}
```

### Spacing System

```css
:root {
  --spacing-0: 0;
  --spacing-1: 0.25rem;  /* 4px */
  --spacing-2: 0.5rem;   /* 8px */
  --spacing-3: 0.75rem;  /* 12px */
  --spacing-4: 1rem;     /* 16px */
  --spacing-6: 1.5rem;   /* 24px */
  --spacing-8: 2rem;     /* 32px */
  --spacing-12: 3rem;    /* 48px */
  --spacing-16: 4rem;    /* 64px */
  --spacing-24: 6rem;    /* 96px */
  --spacing-32: 8rem;    /* 128px */
}
```

### Border Radius

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.125rem;   /* 2px */
  --radius-base: 0.25rem;  /* 4px */
  --radius-md: 0.375rem;   /* 6px */
  --radius-lg: 0.5rem;     /* 8px */
  --radius-xl: 0.75rem;    /* 12px */
  --radius-2xl: 1rem;      /* 16px */
  --radius-full: 9999px;
}
```

### Shadows

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}
```

## 🎯 Component Library (shadcn/ui based)

### Button Component

```typescript
// components/ui/button.tsx
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export function Button({
  className,
  variant = 'default',
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        'disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-primary-600 text-white hover:bg-primary-700': variant === 'default',
          'bg-secondary-500 text-white hover:bg-secondary-600': variant === 'secondary',
          'border border-gray-300 bg-white hover:bg-gray-50': variant === 'outline',
          'hover:bg-gray-100': variant === 'ghost',
          'bg-red-600 text-white hover:bg-red-700': variant === 'destructive',
        },
        {
          'h-9 px-3 text-sm': size === 'sm',
          'h-11 px-5 text-base': size === 'md',
          'h-13 px-7 text-lg': size === 'lg',
          'h-10 w-10': size === 'icon',
        },
        className
      )}
      {...props}
    />
  );
}
```

### Card Component

```typescript
// components/ui/card.tsx
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 bg-white shadow-sm',
        'hover:shadow-md transition-shadow',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-2xl font-semibold', className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-0', className)} {...props} />;
}
```

## 📱 Layout Patterns

### Container

```typescript
export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}
      {...props}
    />
  );
}
```

### Grid System

```typescript
export function Grid({ cols = 3, gap = 6, className, ...props }: GridProps) {
  return (
    <div
      className={cn(
        'grid',
        {
          'grid-cols-1': cols === 1,
          'grid-cols-1 md:grid-cols-2': cols === 2,
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3': cols === 3,
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-4': cols === 4,
        },
        {
          'gap-4': gap === 4,
          'gap-6': gap === 6,
          'gap-8': gap === 8,
        },
        className
      )}
      {...props}
    />
  );
}
```

## 🎨 Page Layouts

### Homepage Hero Section

```typescript
export function HeroSection() {
  return (
    <section className="relative h-[600px] bg-gradient-to-r from-primary-600 to-primary-800">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Content */}
      <Container className="relative flex h-full items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl font-bold leading-tight">
            SMA Negeri 1 Denpasar
            <span className="block text-secondary-500">Sekolah Unggulan Bali</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed opacity-90">
            Mewujudkan generasi unggul, berkarakter, dan berprestasi
            tingkat nasional dan internasional
          </p>
          <div className="mt-8 flex gap-4">
            <Button size="lg">Informasi PPDB</Button>
            <Button size="lg" variant="outline" className="bg-white/10 text-white border-white">
              Tentang Kami
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
```

### Post Card

```typescript
export function PostCard({ post }: { post: Post }) {
  return (
    <Card className="group overflow-hidden">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {post.category && (
          <Badge className="absolute top-3 left-3 bg-primary-600">
            {post.category.name}
          </Badge>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-5">
        <time className="text-sm text-gray-500">
          {formatDate(post.publishedAt)}
        </time>
        <h3 className="mt-2 text-xl font-semibold line-clamp-2 group-hover:text-primary-600">
          <Link href={`/informasi/${post.slug}`}>
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 text-gray-600 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <EyeIcon className="h-4 w-4" />
              {post.views}
            </span>
            <span className="flex items-center gap-1">
              <HeartIcon className="h-4 w-4" />
              {post.likes}
            </span>
          </div>
          <Link
            href={`/informasi/${post.slug}`}
            className="text-primary-600 hover:underline"
          >
            Baca selengkapnya →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
```

## 🎭 Animation Guidelines

### Micro-interactions

```typescript
// Hover effects
<button className="transition-all hover:scale-105 hover:shadow-lg">
  Click Me
</button>

// Loading states
<div className="animate-pulse bg-gray-200 rounded h-4 w-full" />

// Fade in on mount (with Framer Motion)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### Page Transitions

```typescript
//app/template.tsx
'use client';

import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

## ♿ Accessibility Guidelines

### Keyboard Navigation

```typescript
// All interactive elements must be keyboard accessible
<button
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  className="focus:outline-none focus:ring-2 focus:ring-primary-500"
>
  Click me
</button>

// Skip to content link
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### ARIA Labels

```typescript
// Buttons with icons only
<button aria-label="Close dialog">
  <XIcon className="h-5 w-5" />
</button>

// Form inputs
<label htmlFor="email" className="block text-sm font-medium">
  Email
</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-invalid={errors.email ? 'true' : 'false'}
  aria-describedby={errors.email ? 'email-error' : undefined}
/>
{errors.email && (
  <p id="email-error" className="text-red-600 text-sm" role="alert">
    {errors.email}
  </p>
)}
```

### Color Contrast

```css
/* Ensure WCAG AA compliance (4.5:1 for normal text, 3:1 for large text) */
.text-on-primary {
  color: white; /* Contrast with primary-600: 7.2:1 ✅ */
}

.text-on-white {
  color: var(--color-gray-700); /* Contrast: 6.8:1 ✅ */
}
```

## 📐 Responsive Design

### Breakpoints

```typescript
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
};
```

### Mobile-First Approach

```css
/* Base styles (mobile) */
.container {
  padding: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
  }
}
```

## 🎨 UI Patterns

### Loading States

```typescript
// Skeleton loading
export function PostCardSkeleton() {
  return (
    <Card>
      <div className="h-48 bg-gray-200 animate-pulse" />
      <CardContent className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 animate-pulse rounded w-24" />
        <div className="h-6 bg-gray-200 animate-pulse rounded w-full" />
        <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
        <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
      </CardContent>
    </Card>
  );
}
```

### Empty States

```typescript
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <InboxIcon className="h-16 w-16 text-gray-300" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">
        Tidak ada data
      </h3>
      <p className="mt-2 text-gray-500">{message}</p>
    </div>
  );
}
```

### Error States

```typescript
export function ErrorState({ error, retry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <ExclamationTriangleIcon className="h-16 w-16 text-red-500" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">
        Terjadi kesalahan
      </h3>
      <p className="mt-2 text-gray-500">{error.message}</p>
      {retry && (
        <Button onClick={retry} className="mt-4">
          Coba lagi
        </Button>
      )}
    </div>
  );
}
```

## 📝 Form Design

```typescript
export function ContactForm() {
  return (
    <form className="space-y-6">
      {/* Input Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nama Lengkap
        </label>
        <input
          type="text"
          id="name"
          className={cn(
            'mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2',
            'focus:border-primary-500 focus:ring-2 focus:ring-primary-500',
            'disabled:bg-gray-100 disabled:cursor-not-allowed'
          )}
          placeholder="Masukkan nama lengkap"
        />
      </div>

      {/* Textarea */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Pesan
        </label>
        <textarea
          id="message"
          rows={4}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2"
          placeholder="Tulis pesan Anda..."
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full">
        Kirim Pesan
      </Button>
    </form>
  );
}
```

## 🎯 UX Best Practices

### 1. Performance

- ✅ Optimize images (WebP, lazy loading)
- ✅ Code splitting
- ✅ Minimize bundle size
- ✅ Cache API responses
- ✅ Show loading states

### 2. Feedback

- ✅ Loading indicators
- ✅ Success/error messages (toast notifications)
- ✅ Form validation feedback
- ✅ Disabled states for buttons
- ✅ Progress indicators

### 3. Navigation

- ✅ Breadcrumbs
- ✅ Clear menu structure
- ✅ Search functionality
- ✅ Back button support
- ✅ Sticky navigation (optional)

### 4. Content

- ✅ Scannable content (headings, lists)
- ✅ Clear CTAs
- ✅ Readable font sizes
- ✅ Adequate line spacing
- ✅ Images with alt text

### 5. Mobile Experience

- ✅ Touch-friendly tap targets (min 44x44px)
- ✅ No require zoom
- ✅ Thumb-friendly navigation
- ✅ Optimized for slow connections
- ✅ Offline support (optional)

## 🎨 Design Tokens (Tailwind Config)

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          // ... complete color scale
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

## 📊 Design Review Checklist

- [ ] Consistent spacing
- [ ] Proper typography hierarchy
- [ ] Color contrast meets WCAG AA
- [ ] Responsive on all breakpoints
- [ ] Keyboard accessible
- [ ] Screen reader friendly
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Hover effects
- [ ] Focus indicators
- [ ] Touch-friendly on mobile

## 🎯 Summary

UI/UX dirancang dengan prinsip:

- ✅ **Consistent** - Design system yang kohesif
- ✅ **Accessible** - WCAG 2.1 Level AA compliant
- ✅ **Responsive** - Mobile-first approach
- ✅ **Performant** - Fast loading, smooth animations
- ✅ **User-Friendly** - Intuitive navigation, clear feedback
