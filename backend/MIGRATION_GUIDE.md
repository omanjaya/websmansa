# Database Migration Guide

## Overview
This guide explains how to migrate data from the old database structure to the new clean architecture.

## Prerequisites
- Backup of old database: `/home/omanjaya/project/smansa/websmansaold/smandpss_new_web.sql`
- New backend with all migrations ready
- PHP artisan CLI access

## Migration Strategy

### Current Database Structure
The current database (`smandpss_new_web`) contains old data with:
- Spatie Media Library structure
- Old column naming (`status` instead of `is_active`, `name` instead of `title`)
- Different relationships

### New Database Structure
Clean architecture with:
- UUID support for public IDs
- Better column naming
- Improved relationships
- Soft deletes
- Media and gallery_items tables

## Migration Steps

### Step 1: Backup Current Database
```bash
cd /home/omanjaya/project/smansa/websmansanew/backend
mysqldump -u smansa -p smandpss_new_web > backup_before_migration_$(date +%Y%m%d_%H%M%S).sql
```

### Step 2: Rename Old Tables
This command will rename existing tables with `_old` suffix:
```bash
php artisan migrate:prepare-old-data
```

This will:
- Rename `users` → `users_old`
- Rename `categories` → `categories_old`
- Rename `posts` → `posts_old`
- Rename `extras` → `extras_old`
- Rename `galleries` → `galleries_old`
- Rename `media` → `media_old`
- Rename `staff` → `staff_old`
- Rename `slides` → `slides_old`
- Rename `settings` → `settings_old`

### Step 3: Run Fresh Migrations
Create new clean table structure:
```bash
php artisan migrate:fresh
```

### Step 4: Run Data Migration Seeder
Transform and import old data:
```bash
php artisan db:seed --class=OldDataMigrationSeeder
```

This will:
1. ✅ Create default admin user if needed
2. ✅ Migrate categories with proper mapping
3. ✅ Migrate posts with UUID and new structure
4. ✅ Migrate extracurricular activities
5. ✅ Migrate galleries and media (from Spatie to new structure)
6. ✅ Migrate staff members
7. ✅ Migrate sliders (from slides table)
8. ✅ Migrate settings

### Step 5: Verify Migration
```bash
# Check record counts
php artisan tinker
```

In tinker:
```php
// Check users
\App\Models\User::count();

// Check categories
\App\Models\Category::count();

// Check posts
\App\Models\Post::count();

// Check extras
\App\Models\Extra::count();

// Check galleries
\App\Models\Gallery::count();

// Check staff
\App\Models\Staff::count();

// Check sliders
\App\Models\Slider::count();

// Check settings
\App\Models\Setting::count();
```

### Step 6: Test API Endpoints
```bash
# Start the server
php artisan octane:start --port=8000

# Test in another terminal
curl http://localhost:8000/api/v1/posts
curl http://localhost:8000/api/v1/categories
curl http://localhost:8000/api/v1/galleries
curl http://localhost:8000/api/v1/extras
curl http://localhost:8000/api/v1/staff
```

## Data Transformation Details

### Users
- Old: `email`, `name`, `password`
- New: Added `uuid`, preserved credentials
- Default: Creates admin@sman1denpasar.sch.id if no users exist

### Categories
- Old: `name`, `slug`, `status`
- New: `name`, `slug`, `is_active`, `description`
- Mapping: `status` (1/0) → `is_active` (true/false)

### Posts
- Old: `name`, `short_description`, `description`, `status`, `created_by`
- New: `title`, `excerpt`, `content`, `status`, `user_id`, `uuid`
- Status mapping: 1 → 'published', 0 → 'draft'
- Category relationship: Migrated to post_category pivot table

### Extras (Extracurricular)
- Old: `name`, `slug`, `image`, `description`, `status`
- New: Added `category`, `schedule`, `contact_*`, etc.
- Category auto-detection based on name keywords
- Logo: Migrated from `image` field

### Galleries
- Old: Spatie Media Library with `media` table
- New: `galleries` + `gallery_items` tables
- Media migration: Converts Spatie media to gallery_items
- Thumbnail: First image from collection

### Staff
- Old: Basic structure
- New: Enhanced with `department`, `qualification`, `specialization`, `bio`
- NIP: Generated if missing

### Sliders
- Old: `slides` table with `name`, `image`
- New: `sliders` with `title`, `subtitle`, `link`, `button_text`
- Order: Auto-assigned based on original order

### Settings
- Old: `key`, `label`, `value`
- New: `key`, `value`, `type`, `group`
- Type: Auto-detected or defaults to 'string'

## Rollback Plan

If migration fails, you can restore the old structure:

```bash
# Drop new tables
php artisan migrate:rollback

# Restore old tables
mysql -u smansa -p smandpss_new_web
```

In MySQL:
```sql
-- Rename old tables back
RENAME TABLE users_old TO users;
RENAME TABLE categories_old TO categories;
RENAME TABLE posts_old TO posts;
RENAME TABLE extras_old TO extras;
RENAME TABLE galleries_old TO galleries;
RENAME TABLE media_old TO media;
RENAME TABLE staff_old TO staff;
RENAME TABLE slides_old TO slides;
RENAME TABLE settings_old TO settings;
```

Or restore from backup:
```bash
mysql -u smansa -p smandpss_new_web < backup_before_migration_YYYYMMDD_HHMMSS.sql
```

## Common Issues & Solutions

### Issue: "Table not found" during seeding
**Solution**: The table doesn't exist in old database. Seeder will skip it automatically.

### Issue: "User foreign key constraint fails"
**Solution**: Ensure UserSeeder runs first, or migration creates default user.

### Issue: "Duplicate entry for key 'slug'"
**Solution**: Clean old data first or modify seeder to handle duplicates.

### Issue: Media files not loading
**Solution**: Copy media files from old storage to new:
```bash
cp -r /home/omanjaya/project/smansa/websmansaold/storage/app/public/* \
       /home/omanjaya/project/smansa/websmansanew/backend/storage/app/public/
```

## Post-Migration Tasks

1. **Update File Paths**: If media paths changed, update image URLs
2. **Test Frontend**: Ensure frontend can fetch all data
3. **Clean Old Tables**: After verification, drop `_old` tables
4. **Re-index Search**: If using full-text search
5. **Update Documentation**: Note any manual changes needed

## Clean Up Old Tables (After Successful Migration)

Only after confirming everything works:
```sql
DROP TABLE IF EXISTS users_old;
DROP TABLE IF EXISTS categories_old;
DROP TABLE IF EXISTS posts_old;
DROP TABLE IF EXISTS extras_old;
DROP TABLE IF EXISTS galleries_old;
DROP TABLE IF EXISTS media_old;
DROP TABLE IF EXISTS staff_old;
DROP TABLE IF EXISTS slides_old;
DROP TABLE IF EXISTS settings_old;
```

## Support

If you encounter issues:
1. Check Laravel logs: `storage/logs/laravel.log`
2. Check migration output for specific errors
3. Verify database connection settings in `.env`
4. Test with smaller dataset first
