# Frontend Setup - Next.js 14 + TypeScript

## 🎯 TASK

Setup Next.js 14 frontend dengan TypeScript untuk project SMANSA di folder `/home/omanjaya/project/smansa/websmansanew/frontend/`

## 📚 DOKUMENTASI REFERENCE

**Wajib dibaca:**

- `/home/omanjaya/project/smansa/websmansanew/docs/UI_UX_GUIDELINES.md` - Design system
- `/home/omanjaya/project/smansa/websmansanew/docs/SEO_STRATEGY.md` - SEO implementation
- `/home/omanjaya/project/smansa/websmansanew/docs/API_DESIGN.md` - API integration
- `/home/omanjaya/project/smansa/websmansanew/docs/TECH_STACK.md` - Package versions

## 🛠️ TECH STACK

- **Next.js**: 14.x (App Router)
- **React**: 18.2+
- **TypeScript**: 5.3+
- **TailwindCSS**: 3.4+
- **shadcn/ui**: Latest

## 📋 SETUP TASKS

### 1. Initialize Next.js Project

```bash
cd /home/omanjaya/project/smansa/websmansanew
npx create-next-app@latest frontend --typescript --tailwind --app --no-src-dir --import-alias "@/*"
cd frontend
```

Answer prompts:

- TypeScript: **Yes**
- ESLint: **Yes**
- Tailwind CSS: **Yes**
- `src/` directory: **No**
- App Router: **Yes**
- Import alias: **@/***

### 2. Install Required Packages

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install axios
npm install framer-motion
npm install react-hook-form zod @hookform/resolvers
npm install date-fns
npm install clsx tailwind-merge
npm install next-themes

# Dev dependencies
npm install -D @types/node @types/react @types/react-dom
npm install -D eslint eslint-config-next
npm install -D prettier prettier-plugin-tailwindcss
npm install -D @typescript-eslint/eslint-plugin
```

### 3. Setup shadcn/ui

```bash
npx shadcn-ui@latest init
```

Config selections:

- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**

Install essential components:

```bash
npx shadcn-ui@latest add button card input label textarea select
npx shadcn-ui@latest add dropdown-menu dialog sheet
npx shadcn-ui@latest add toast alert badge
npx shadcn-ui@latest add tabs accordion
npx shadcn-ui@latest add table pagination
```

### 4. Create Directory Structure

Sesuai ARCHITECTURE.md:

```
app/
├── (public)/          # Public pages
│   ├── page.tsx       # Homepage
│   ├── tentang-kami/
│   ├── informasi/
│   └── ...
├── admin/             # Admin pages
├── api/               # API routes (if needed)
├── layout.tsx
└── globals.css

components/
├── ui/                # shadcn/ui components
├── layout/            # Layout components (Header, Footer)
├── features/          # Feature-specific components
└── shared/            # Shared/common components

lib/
├── api.ts             # API client
├── utils.ts           # Utility functions
└── query-client.ts    # React Query config

hooks/                 # Custom React hooks
├── use-posts.ts
├── use-auth.ts
└── ...

services/              # API service layer
├── post-service.ts
├── auth-service.ts
└── ...

types/                 # TypeScript types
├── post.ts
├── user.ts
└── ...

config/                # Configuration files
└── site.ts            # Site configuration
```

### 5. Configure TypeScript

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 6. Setup TailwindCSS

Update `tailwind.config.ts` dengan design tokens dari UI_UX_GUIDELINES.md:

```typescript
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        // ... from UI_UX_GUIDELINES.md
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
} satisfies Config

export default config
```

### 7. Setup ESLint & Prettier

**.eslintrc.json:**

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error"
  }
}
```

**.prettierrc:**

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### 8. Setup Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=
```

### 9. Create Base Files

**lib/api.ts** - API client:

```typescript
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**lib/query-client.ts** - React Query config:

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

**lib/utils.ts** - Utility functions:

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 10. Update app/layout.tsx

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'SMA Negeri 1 Denpasar',
    template: '%s | SMAN 1 Denpasar',
  },
  description: 'Sekolah menengah atas unggulan di Bali',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

## ✅ OUTPUT EXPECTED

Setelah setup selesai:

- ✅ Next.js 14 installed dengan TypeScript
- ✅ TailwindCSS + shadcn/ui configured
- ✅ React Query setup
- ✅ Directory structure created
- ✅ ESLint & Prettier configured
- ✅ Base utility files created
- ✅ Environment variables setup

## 📝 NEXT STEPS AFTER SETUP

1. Implement design system components
2. Create layout components (Header, Footer)
3. Build public pages
4. Integrate with backend API
5. Implement SEO optimizations

## ⚠️ IMPORTANT REMINDERS

- Use **TypeScript strict mode**
- Follow **component patterns** from UI_UX_GUIDELINES.md
- Implement **SEO best practices** from SEO_STRATEGY.md
- Use **server components** where possible
- Add **proper error boundaries**

---

Silakan mulai setup dan beri tahu saya jika ada yang perlu klarifikasi!
