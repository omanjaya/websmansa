# Database Migrations - Complete Schema

## 🎯 TASK

Generate semua Laravel migration files untuk project SMANSA berdasarkan DATABASE_SCHEMA.md

## 📚 DOKUMENTASI REFERENCE

**Wajib dibaca:**

- `/home/omanjaya/project/smansa/websmansanew/docs/DATABASE_SCHEMA.md` - Complete schema

## 📋 MIGRATIONS TO CREATE

Sesuai DATABASE_SCHEMA.md, buat migrations untuk:

### 1. Users & Authentication

- [ ] users
- [ ] roles (Spatie)
- [ ] permissions (Spatie)
- [ ] model_has_roles
- [ ] model_has_permissions
- [ ] role_has_permissions

### 2. Content Management

- [ ] posts (includes informasi, pengumuman, pages)
- [ ] categories
- [ ] post_category (pivot)
- [ ] post_views
- [ ] post_likes

### 3. Media & Files

- [ ] media
- [ ] post_media (pivot)

### 4. School-Specific

- [ ] extras (ekstrakurikuler)
- [ ] facilities (fasilitas)
- [ ] staff (guru & staff)
- [ ] galleries
- [ ] gallery_items
- [ ] alumni
- [ ] tracer_studies

### 5. Settings & UI

- [ ] settings
- [ ] sliders
- [ ] testimonials
- [ ] contact_submissions

## ✅ REQUIREMENTS

Setiap migration harus include:

1. **Proper column types** sesuai DATABASE_SCHEMA.md
2. **Foreign keys** dengan CASCADE/SET NULL
3. **Indexes** untuk optimization
4. **Soft deletes** untuk important data
5. **UUID columns** untuk public IDs
6. **Timestamps** (created_at, updated_at)

## 📝 EXAMPLE MIGRATION STRUCTURE

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->longText('content');
            $table->string('featured_image')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->enum('type', ['post', 'announcement', 'page'])->default('post');
            $table->unsignedInteger('views')->default(0);
            $table->unsignedInteger('likes')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_pinned')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('slug');
            $table->index('status');
            $table->index('type');
            $table->index('published_at');
            $table->index('is_featured');
            $table->fullText(['title', 'excerpt', 'content']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
```

## 🎯 GENERATE ALL MIGRATIONS

Berdasarkan DATABASE_SCHEMA.md, generate file migrations lengkap untuk semua tables.

**Urutan migration (important for foreign keys):**

1. Users & auth tables
2. Core content tables (categories, posts)
3. Media tables
4. School-specific tables
5. Settings & UI tables

## ⚠️ IMPORTANT NOTES

- Use **proper naming convention**: `YYYY_MM_DD_HHMMSS_create_tablename_table.php`
- Include **comments** untuk complex columns
- Add **proper indexes** untuk performance
- Use **enum** untuk fixed values
- Include **fulltext indexes** untuk searchable fields

## 📝 AFTER MIGRATIONS CREATED

Run migrations:

```bash
php artisan migrate
```

Check database structure:

```bash
php artisan db:show
php artisan schema:dump
```

---

Generate all migration files sesuai DATABASE_SCHEMA.md!
