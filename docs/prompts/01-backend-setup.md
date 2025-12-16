# Backend Setup - Laravel 11 + Octane

## 🎯 TASK

Setup Laravel 11 backend dengan Octane untuk project SMANSA di folder `/home/omanjaya/project/smansa/websmansanew/backend/`

## 📚 DOKUMENTASI REFERENCE

**Wajib dibaca:**

- `/home/omanjaya/project/smansa/websmansanew/docs/ARCHITECTURE.md` - Architecture patterns
- `/home/omanjaya/project/smansa/websmansanew/docs/CODE_QUALITY.md` - SOLID & patterns
- `/home/omanjaya/project/smansa/websmansanew/docs/DATABASE_SCHEMA.md` - Database design
- `/home/omanjaya/project/smansa/websmansanew/docs/TECH_STACK.md` - Package versions

## 🛠️ TECH STACK

- **Laravel**: 11.x
- **PHP**: 8.3+
- **Octane**: Swoole
- **Database**: MariaDB 11 + Redis 7

## 📋 SETUP TASKS

### 1. Initialize Laravel Project

```bash
cd /home/omanjaya/project/smansa/websmansanew
composer create-project laravel/laravel backend "11.*"
cd backend
```

### 2. Install Required Packages

Dari TECH_STACK.md, install:

```bash
composer require laravel/octane
composer require laravel/sanctum
composer require laravel/telescope
composer require laravel/horizon
composer require spatie/laravel-permission
composer require spatie/laravel-query-builder
composer require spatie/laravel-medialibrary
composer require intervention/image
composer require maatwebsite/excel
composer require barryvdh/laravel-dompdf
```

**Dev dependencies:**

```bash
composer require --dev laravel/pint
composer require --dev phpstan/phpstan
composer require --dev phpunit/phpunit
```

### 3. Setup Laravel Octane

```bash
php artisan octane:install
# Choose: Swoole
```

### 4. Configure Environment

Edit `.env`:

```env
APP_NAME="SMANSA Website"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=smansa_db
DB_USERNAME=root
DB_PASSWORD=

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

### 5. Create Directory Structure

Sesuai ARCHITECTURE.md, buat struktur:

```
app/
├── Actions/           # Single-use action classes
├── DTOs/              # Data Transfer Objects
├── Enums/             # PHP 8 Enums
├── Exceptions/        # Custom exceptions
├── Http/
│   ├── Controllers/
│   │   └── Api/       # API controllers
│   ├── Middleware/    # Custom middleware
│   ├── Requests/      # Form requests
│   └── Resources/     # API resources
├── Models/            # Eloquent models
├── Repositories/      # Repository pattern
├── Services/          # Business logic
└── Traits/            # Reusable traits
```

### 6. Setup Code Quality Tools

**PHPStan** - Create `phpstan.neon`:

```neon
parameters:
    level: 8
    paths:
        - app
    excludePaths:
        - app/Http/Middleware/TrustProxies.php
```

**Pint** - Already configured by Laravel

### 7. Setup Testing

```bash
php artisan test
```

### 8. Install Telescope & Horizon (Dev only)

```bash
php artisan telescope:install
php artisan horizon:install
php artisan migrate
```

## ✅ REQUIREMENTS

From CODE_QUALITY.md:

1. **All classes must:**
   - Have proper type hints
   - Follow SOLID principles
   - Use dependency injection
   - Have PHPDoc blocks

2. **Repository Pattern:**

```php
// app/Repositories/BaseRepository.php
abstract class BaseRepository
{
    public function __construct(protected Model $model) {}
    
    public function all(): Collection;
    public function find(int $id): ?Model;
    public function create(array $data): Model;
    public function update(int $id, array $data): Model;
    public function delete(int $id): bool;
}
```

3. **Service Layer:**

```php
// app/Services/PostService.php
class PostService
{
    public function __construct(
        private PostRepository $repository,
        private ImageService $imageService,
        private CacheService $cacheService
    ) {}
}
```

4. **DTO Pattern:**

```php
// app/DTOs/Post/CreatePostDTO.php
class CreatePostDTO
{
    public function __construct(
        public readonly string $title,
        public readonly string $content,
        // ...
    ) {}
    
    public static function fromRequest(Request $request): self {
        return new self(
            title: $request->input('title'),
            content: $request->input('content'),
        );
    }
}
```

## 🎯 OUTPUT EXPECTED

Setelah setup selesai, saya expect:

- ✅ Laravel 11 installed dengan Octane
- ✅ All packages installed
- ✅ Directory structure sesuai ARCHITECTURE.md
- ✅ Code quality tools configured (PHPStan level 8)
- ✅ Testing environment ready
- ✅ `.env` configured
- ✅ Base classes created (BaseRepository, etc.)

## 📝 NEXT STEPS AFTER SETUP

Setelah backend setup selesai:

1. Create database migrations (from DATABASE_SCHEMA.md)
2. Create models dengan relationships
3. Implement API endpoints (from API_DESIGN.md)

## ⚠️ IMPORTANT REMINDERS

- Use **PHP 8.3 features** (readonly properties, enums, etc.)
- Follow **PSR-12** coding standards
- All code must pass **PHPStan level 8**
- Use **strict types**: `declare(strict_types=1);`
- Implement **proper error handling**

---

Silakan mulai setup dan beri tahu saya jika ada yang perlu klarifikasi!
