# Technology Stack

## 🏗️ Tech Stack Overview

```
Frontend (Client-Side)
├── React 18.2+
├── Next.js 14 (App Router)
├── TypeScript 5.3+
├── TailwindCSS 3.4+
├── shadcn/ui components
├── React Query (TanStack Query)
└── Framer Motion

Backend (Server-Side)
├── Laravel 11
├── Laravel Octane (Swoole/RoadRunner)
├── PHP 8.3+
└── Laravel Sanctum

Database & Cache
├── MariaDB 11.x
├── Redis 7.x
└── Meilisearch (optional)

DevOps & Infrastructure
├── Docker & Docker Compose
├── Nginx
├── GitHub Actions (CI/CD)
└── Ubuntu Server 22.04 LTS

Monitoring & Analytics
├── Sentry (Error Tracking)
├── Google Analytics 4
├── Laravel Telescope (Dev)
└── Laravel Horizon (Queues)
```

## 📦 Detailed Technology Specifications

### Frontend Stack

#### **Next.js 14**

**Version**: 14.0+  
**Why**:

- Server-side rendering untuk SEO optimal
- App Router dengan React Server Components
- Automatic code splitting
- Image optimization
- Built-in performance optimizations

**Key Features Used**:

- App Router
- Server Components
- Server Actions
- Incremental Static Regeneration (ISR)
- Image Optimization
- Font Optimization

**Dependencies**:

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tanstack/react-query": "^5.0.0",
    "@tanstack/react-query-devtools": "^5.0.0",
    "axios": "^1.6.0",
    "framer-motion": "^10.16.0",
    "next-themes": "^0.2.1",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "date-fns": "^2.30.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.54.0",
    "eslint-config-next": "^14.0.0",
    "@typescript-eslint/eslint-plugin": "^6.13.0",
    "prettier": "^3.1.0",
    "prettier-plugin-tailwindcss": "^0.5.0"
  }
}
```

#### **TailwindCSS 3.4+**

**Why**:

- Utility-first CSS
- Excellent performance
- JIT compiler
- Great DX dengan VS Code extensions

**Plugins**:

- `@tailwindcss/forms` - Better form styling
- `@tailwindcss/typography` - Prose styling
- `tailwindcss-animate` - Animation utilities

#### **shadcn/ui**

**Why**:

- Copy-paste components (no npm package)
- Built on Radix UI primitives
- Fully customizable
- Accessible out of the box
- TypeScript support

**Components**:

- Button, Card, Dialog, Dropdown
- Form, Input, Label, Textarea
- Select, Checkbox, Radio
- Toast, Alert, Badge
- Tabs, Accordion, Sheet
- Table, Pagination

#### **React Query (TanStack Query)**

**Why**:

- Powerful data fetching & caching
- Automatic refetching
- Optimistic updates
- Devtools for debugging

**Configuration**:

```typescript
// lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

### Backend Stack

#### **Laravel 11**

**Version**: 11.x  
**Why**:

- Mature PHP framework
- Excellent documentation
- Large ecosystem
- Built-in features (Auth, Queue, Cache, etc.)

**Key Packages**:

```json
{
  "require": {
    "php": "^8.3",
    "laravel/framework": "^11.0",
    "laravel/octane": "^2.3",
    "laravel/sanctum": "^4.0",
    "laravel/telescope": "^5.0",
    "laravel/horizon": "^5.21",
    "spatie/laravel-permission": "^6.0",
    "spatie/laravel-query-builder": "^5.7",
    "spatie/laravel-medialibrary": "^11.0",
    "intervention/image": "^3.0",
    "maatwebsite/excel": "^3.1",
    "barryvdh/laravel-dompdf": "^2.1"
  },
  "require-dev": {
    "laravel/pint": "^1.13",
    "phpstan/phpstan": "^1.10",
    "phpunit/phpunit": "^10.5",
    "fakerphp/faker": "^1.23",
    "mockery/mockery": "^1.6",
    "nunomaduro/collision": "^8.0"
  }
}
```

#### **Laravel Octane**

**Version**: 2.3+  
**Server**: Swoole or RoadRunner  
**Why**:

- 2-3x faster than traditional PHP-FPM
- Persistent application state
- Concurrent request handling
- WebSocket support

**Configuration**:

```php
// config/octane.php
return [
    'server' => env('OCTANE_SERVER', 'swoole'),
    
    'listeners' => [
        WorkerStarting::class => [
            EnsureUploadedFilesAreValid::class,
        ],
        RequestReceived::class => [
            ...Octane::prepareApplicationForNextOperation(),
            ...Octane::prepareApplicationForNextRequest(),
        ],
        RequestTerminated::class => [
            FlushTemporaryContainerInstances::class,
        ],
    ],

    'warm' => [
        'config',
        'routes',
        'views',
    ],

    'cache' => [
        'rows' => 1000,
        'bytes' => 10000,
    ],

    'tables' => [
        'example:1000',
    ],

    'swoole' => [
        'options' => [
            'log_file' => storage_path('logs/swoole_http.log'),
            'package_max_length' => 10 * 1024 * 1024,
        ],
    ],
];
```

### Database & Cache

#### **MariaDB 11.x**

**Why**:

- MySQL-compatible
- Better performance
- More features
- Open source

**Connection Pool** (with Octane):

```php
'mysql' => [
    'driver' => 'mysql',
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', '3306'),
    'database' => env('DB_DATABASE', 'smansa_db'),
    'username' => env('DB_USERNAME', 'root'),
    'password' => env('DB_PASSWORD', ''),
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'pool' => [
        'min_connections' => 1,
        'max_connections' => 10,
    ],
],
```

#### **Redis 7.x**

**Why**:

- Fast in-memory cache
- Session storage
- Queue driver
- Real-time features

**Usage**:

- Application cache
- Session storage
- Rate limiting
- Queue jobs
- Broadcasting (optional)

**Configuration**:

```php
'redis' => [
    'client' => env('REDIS_CLIENT', 'phpredis'),
    'default' => [
        'host' => env('REDIS_HOST', '127.0.0.1'),
        'password' => env('REDIS_PASSWORD'),
        'port' => env('REDIS_PORT', '6379'),
        'database' => env('REDIS_DB', '0'),
    ],
    'cache' => [
        'host' => env('REDIS_HOST', '127.0.0.1'),
        'password' => env('REDIS_PASSWORD'),
        'port' => env('REDIS_PORT', '6379'),
        'database' => env('REDIS_CACHE_DB', '1'),
    ],
],
```

### DevOps & Infrastructure

#### **Docker & Docker Compose**

**Why**:

- Consistent environments
- Easy deployment
- Isolated services
- Scalability

**Services**:

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DB_CONNECTION=mysql
      - DB_HOST=db
      - REDIS_HOST=redis
    depends_on:
      - db
      - redis

  db:
    image: mariadb:11
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=secret
      - MYSQL_DATABASE=smansa_db
    volumes:
      - db_data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend

volumes:
  db_data:
  redis_data:
```

#### **GitHub Actions**

**Why**:

- Free for public repos
- Easy integration
- Powerful workflows
- Matrix builds

**CI/CD Pipeline**:

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      # Frontend tests
      - name: Test Frontend
        run: |
          cd frontend
          npm ci
          npm run lint
          npm run type-check
          npm run test
      
      # Backend tests
      - name: Test Backend
        run: |
          cd backend
          composer install
          php artisan test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      # Build Docker images
      - name: Build Images
        run: |
          docker build -t smansa-frontend:latest ./frontend
          docker build -t smansa-backend:latest ./backend
      
      # Push to registry
      - name: Push to Docker Hub
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push smansa-frontend:latest
          docker push smansa-backend:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /var/www/smansa
            docker-compose pull
            docker-compose up -d
            docker-compose exec -T backend php artisan migrate --force
            docker-compose exec -T backend php artisan optimize
```

### Monitoring & Tools

#### **Sentry**

**Why**:

- Real-time error tracking
- Performance monitoring
- Release tracking
- User feedback

**Setup**:

```bash
# Frontend
npm install @sentry/nextjs

# Backend
composer require sentry/sentry-laravel
```

#### **Google Analytics 4**

**Why**:

- User analytics
- Traffic insights
- Conversion tracking
- Free

**Implementation**:

```typescript
// lib/gtag.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};
```

## 🛠️ Development Tools

### IDE & Extensions

**VS Code Extensions**:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin
- PHP Intelephense
- Laravel Extra Intellisense
- Docker
- GitLens

### Code Quality Tools

**Frontend**:

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "type-check": "tsc --noEmit"
  }
}
```

**Backend**:

```json
{
  "scripts": {
    "lint": "./vendor/bin/pint",
    "test": "php artisan test",
    "stan": "./vendor/bin/phpstan analyse",
    "check": "composer lint && composer stan && composer test"
  }
}
```

## 📊 Performance Benchmarks

### Expected Performance

**Frontend (Lighthouse)**:

- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

**Backend (API Response Times)**:

- Simple GET: < 50ms
- Complex GET with joins: < 100ms  
- POST/PUT: < 150ms
- Heavy operations: < 500ms

**Database**:

- Simple query: < 10ms
- Complex query with joins: < 50ms
- Full-text search: < 100ms

## 🔄 Version Management

```json
{
  "node": ">=20.0.0",
  "npm": ">=10.0.0",
  "php": ">=8.3",
  "composer": ">=2.6"
}
```

## 🎯 Summary

Tech stack dipilih berdasarkan:

- ✅ **Performance** - Fastest options available
- ✅ **Scalability** - Can handle growth
- ✅ **Developer Experience** - Great tooling & documentation
- ✅ **Community** - Large, active communities
- ✅ **Cost** - Balance between cost and value
- ✅ **Future-proof** - Modern, actively maintained
