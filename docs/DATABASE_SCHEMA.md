# Database Schema Design

## 🗄️ Database Architecture

### Strategy

- **MariaDB 11.x** sebagai primary database
- **Redis** untuk caching & sessions
- **Meilisearch** untuk full-text search (optional, advanced)

### Design Principles

- ✅ Normalize to 3NF (Third Normal Form)
- ✅ Use appropriate indexes
- ✅ Soft deletes untuk important data
- ✅ UUID untuk public-facing IDs (security)
- ✅ Timestamps (created_at, updated_at)
- ✅ Foreign keys dengan CASCADE/SET NULL

## 📊 Entity Relationship Diagram

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│    users    │───────│    posts     │───────│ categories  │
└─────────────┘   1:N └──────────────┘  N:M  └─────────────┘
      │                     │
      │ 1:N                 │ 1:N
      │                     │
┌─────────────┐       ┌──────────────┐
│   roles     │       │post_galleries│
└─────────────┘       └──────────────┘
      │                     │
      │ N:M                 │ N:1
┌─────────────┐       ┌──────────────┐
│permissions  │       │    media     │
└─────────────┘       └──────────────┘
```

## 📋 Table Definitions

### 1. Users & Authentication

#### **users**

```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) UNIQUE NOT NULL COMMENT 'Public ID',
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) NULL,
    bio TEXT NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_uuid (uuid),
    INDEX idx_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Laravel Migration:**

```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->uuid('uuid')->unique();
    $table->string('name');
    $table->string('email')->unique();
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password');
    $table->string('avatar')->nullable();
    $table->text('bio')->nullable();
    $table->rememberToken();
    $table->timestamps();
    $table->softDeletes();
    
    $table->index('email');
    $table->index('uuid');
});
```

#### **roles** (Spatie Permissions)

```sql
CREATE TABLE roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    guard_name VARCHAR(255) NOT NULL DEFAULT 'web',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    UNIQUE KEY unique_name_guard (name, guard_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### **permissions**

```sql
CREATE TABLE permissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    guard_name VARCHAR(255) NOT NULL DEFAULT 'web',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    UNIQUE KEY unique_name_guard (name, guard_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### **model_has_roles**

```sql
CREATE TABLE model_has_roles (
    role_id BIGINT UNSIGNED NOT NULL,
    model_type VARCHAR(255) NOT NULL,
    model_id BIGINT UNSIGNED NOT NULL,
    
    PRIMARY KEY (role_id, model_id, model_type),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    INDEX idx_model (model_id, model_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2. Content Management

#### **posts**

```sql
CREATE TABLE posts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) UNIQUE NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT NULL,
    content LONGTEXT NOT NULL,
    featured_image VARCHAR(255) NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    type ENUM('post', 'announcement', 'page') DEFAULT 'post',
    views INT UNSIGNED DEFAULT 0,
    likes INT UNSIGNED DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE COMMENT 'For announcements',
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_type (type),
    INDEX idx_published_at (published_at),
    INDEX idx_is_featured (is_featured),
    INDEX idx_user_id (user_id),
    FULLTEXT idx_search (title, excerpt, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Laravel Model:**

```php
class Post extends Model
{
    use HasFactory, SoftDeletes, HasUuid;

    protected $fillable = [
        'user_id', 'title', 'slug', 'excerpt', 'content',
        'featured_image', 'status', 'type', 'is_featured',
        'is_pinned', 'published_at',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_pinned' => 'boolean',
        'published_at' => 'datetime',
        'status' => PostStatus::class, // Enum
        'type' => PostType::class, // Enum
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'post_category');
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                    ->whereNotNull('published_at')
                    ->where('published_at', '<=', now());
    }
}
```

#### **categories**

```sql
CREATE TABLE categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NULL,
    parent_id BIGINT UNSIGNED NULL,
    order INT DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### **post_category** (Pivot Table)

```sql
CREATE TABLE post_category (
    post_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,
    
    PRIMARY KEY (post_id, category_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### **post_views**

```sql
CREATE TABLE post_views (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    post_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_post_id (post_id),
    INDEX idx_viewed_at (viewed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### **post_likes**

```sql
CREATE TABLE post_likes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    post_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NULL,
    ip_address VARCHAR(45) NULL,
    created_at TIMESTAMP NULL,
    
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_post_user_ip (post_id, user_id, ip_address),
    INDEX idx_post_id (post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3. Media & Files

#### **media**

```sql
CREATE TABLE media (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) UNIQUE NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    path VARCHAR(500) NOT NULL,
    disk VARCHAR(50) DEFAULT 'public',
    size BIGINT UNSIGNED NOT NULL COMMENT 'Size in bytes',
    width INT UNSIGNED NULL COMMENT 'For images',
    height INT UNSIGNED NULL COMMENT 'For images',
    alt_text VARCHAR(255) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_mime_type (mime_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### **post_media** (Polymorphic Many-to-Many)

```sql
CREATE TABLE post_media (
    media_id BIGINT UNSIGNED NOT NULL,
    post_id BIGINT UNSIGNED NOT NULL,
    order INT DEFAULT 0,
    
    PRIMARY KEY (media_id, post_id),
    FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 4. School-Specific Tables

#### **extras** (Ekstrakurikuler)

```sql
CREATE TABLE extras (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NULL,
    category ENUM('sports', 'arts', 'academic', 'religious', 'other') DEFAULT 'other',
    logo VARCHAR(255) NULL,
    schedule TEXT NULL,
    contact_person VARCHAR(255) NULL,
    contact_phone VARCHAR(20) NULL,
    contact_email VARCHAR(255) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    order INT DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_slug (slug),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### **facilities** (Fasilitas)

```sql
CREATE TABLE facilities (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NULL,
    thumbnail VARCHAR(255) NULL,
    capacity INT UNSIGNED NULL,
    is_bookable BOOLEAN DEFAULT FALSE,
    order INT DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_slug (slug),
    INDEX idx_is_bookable (is_bookable)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### **staff**

```sql
CREATE TABLE staff (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) UNIQUE NOT NULL,
    nip VARCHAR(50) UNIQUE NULL COMMENT 'Nomor Induk Pegawai',
    name VARCHAR(255) NOT NULL,
    photo VARCHAR(255) NULL,
    position VARCHAR(255) NOT NULL COMMENT 'Jabatan',
    department VARCHAR(255) NULL COMMENT 'Bidang/Departemen',
    subjects TEXT NULL COMMENT 'Mata pelajaran (JSON array)',
    email VARCHAR(255) NULL,
    phone VARCHAR(20) NULL,
    bio TEXT NULL,
    qualifications TEXT NULL COMMENT 'Pendidikan & kualifikasi',
    is_active BOOLEAN DEFAULT TRUE,
    order INT DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_nip (nip),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### **galleries**

```sql
CREATE TABLE galleries (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NULL,
    thumbnail VARCHAR(255) NULL,
    type ENUM('photo', 'video', 'mixed') DEFAULT 'photo',
    event_date DATE NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_slug (slug),
    INDEX idx_type (type),
    INDEX idx_event_date (event_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### **gallery_items**

```sql
CREATE TABLE gallery_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    gallery_id BIGINT UNSIGNED NOT NULL,
    media_id BIGINT UNSIGNED NOT NULL,
    caption TEXT NULL,
    order INT DEFAULT 0,
    created_at TIMESTAMP NULL,
    
    FOREIGN KEY (gallery_id) REFERENCES galleries(id) ON DELETE CASCADE,
    FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE,
    INDEX idx_gallery_id (gallery_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### **alumni**

```sql
CREATE TABLE alumni (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    graduation_year YEAR NOT NULL,
    class VARCHAR(50) NULL COMMENT 'Kelas terakhir',
    photo VARCHAR(255) NULL,
    email VARCHAR(255) NULL,
    phone VARCHAR(20) NULL,
    current_occupation VARCHAR(255) NULL,
    current_institution VARCHAR(255) NULL COMMENT 'Universitas/Perusahaan',
    achievements TEXT NULL,
    bio TEXT NULL,
    is_public BOOLEAN DEFAULT TRUE COMMENT 'Show in public directory',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_graduation_year (graduation_year),
    INDEX idx_is_public (is_public)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### **tracer_studies**

```sql
CREATE TABLE tracer_studies (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    alumni_id BIGINT UNSIGNED NULL,
    name VARCHAR(255) NOT NULL,
    graduation_year YEAR NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    
    -- Current Status
    current_status ENUM('working', 'studying', 'entrepreneur', 'unemployed', 'other') NOT NULL,
    occupation VARCHAR(255) NULL,
    institution_name VARCHAR(255) NULL,
    institution_type VARCHAR(100) NULL,
    field_of_work VARCHAR(255) NULL,
    
    -- Education Continuation
    is_continuing_education BOOLEAN DEFAULT FALSE,
    university_name VARCHAR(255) NULL,
    major VARCHAR(255) NULL,
    education_level ENUM('D3', 'S1', 'S2', 'S3') NULL,
    
    -- Satisfaction Survey
    satisfaction_curriculum INT NULL COMMENT '1-5 scale',
    satisfaction_facilities INT NULL,
    satisfaction_teachers INT NULL,
    suggestions TEXT NULL,
    
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (alumni_id) REFERENCES alumni(id) ON DELETE SET NULL,
    INDEX idx_graduation_year (graduation_year),
    INDEX idx_current_status (current_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 5. Settings & Configuration

#### **settings**

```sql
CREATE TABLE settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value LONGTEXT NULL,
    type ENUM('string', 'text', 'boolean', 'integer', 'json') DEFAULT 'string',
    group VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_key (key),
    INDEX idx_group (group)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Common Settings:**

```json
{
  "site_name": "SMA Negeri 1 Denpasar",
  "site_tagline": "Unggul dalam Prestasi, Berkarakter Pancasila",
  "site_logo": "/storage/logo.png",
  "site_favicon": "/storage/favicon.ico",
  "contact_email": "info@smansadps.sch.id",
  "contact_phone": "(0361) 123456",
  "contact_address": "Jl. ..., Denpasar, Bali",
  "social_facebook": "https://facebook.com/...",
  "social_instagram": "https://instagram.com/...",
  "social_youtube": "https://youtube.com/...",
  "seo_meta_title": "SMA Negeri 1 Denpasar",
  "seo_meta_description": "...",
  "google_analytics_id": "G-XXXXXXXXXX"
}
```

#### **sliders**

```sql
CREATE TABLE sliders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT NULL,
    image VARCHAR(255) NOT NULL,
    link VARCHAR(500) NULL,
    button_text VARCHAR(100) NULL,
    order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_order (order),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### **testimonials**

```sql
CREATE TABLE testimonials (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NULL COMMENT 'Alumni/Siswa/Orang Tua',
    photo VARCHAR(255) NULL,
    content TEXT NOT NULL,
    rating INT DEFAULT 5 COMMENT '1-5 stars',
    is_featured BOOLEAN DEFAULT FALSE,
    order INT DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_is_featured (is_featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 6. Forms & Submissions

#### **contact_submissions**

```sql
CREATE TABLE contact_submissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    replied_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 🔍 Indexes Strategy

### Primary Indexes

- **Primary Keys**: Auto-increment BIGINT UNSIGNED
- **UUID**: For public-facing IDs (security)

### Secondary Indexes

- **Foreign Keys**: All foreign keys indexed
- **Slug Fields**: Unique index for SEO-friendly URLs
- **Status/Type Fields**: For filtering
- **Date Fields**: For sorting and filtering
- **Boolean Flags**: For feature flags

### Full-Text Indexes

- **posts**: title, excerpt, content
- **staff**: name, position, department

### Composite Indexes

```sql
-- For common queries
CREATE INDEX idx_posts_status_published ON posts(status, published_at);
CREATE INDEX idx_posts_type_status ON posts(type, status);
```

## 🚀 Performance Optimization

### Query Optimization

```php
// ❌ N+1 Query Problem
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->user->name; // N+1 queries
}

// ✅ Eager Loading
$posts = Post::with('user', 'categories')->get();
```

### Caching Strategy

```php
// Cache frequently accessed data
Cache::remember('homepage_posts', 3600, function () {
    return Post::published()
        ->featured()
        ->with('user', 'categories')
        ->limit(6)
        ->get();
});

// Cache invalidation
Cache::forget('homepage_posts');
Cache::tags(['posts'])->flush();
```

### Database Connection Pooling

```php
// config/database.php (with Laravel Octane)
'mysql' => [
    // ...
    'pool' => [
        'min_connections' => 1,
        'max_connections' => 10,
    ],
],
```

## 📦 Seeders

```php
// database/seeders/DatabaseSeeder.php
public function run(): void
{
    $this->call([
        RoleAndPermissionSeeder::class,
        UserSeeder::class,
        CategorySeeder::class,
        SettingSeeder::class,
        // Production data only
        StaffSeeder::class,
        ExtraSeeder::class,
        FacilitySeeder::class,
    ]);

    if (app()->environment('local')) {
        $this->call([
            PostSeeder::class,
            GallerySeeder::class,
            TestimonialSeeder::class,
        ]);
    }
}
```

## 🔄 Migration Strategy

### From Old Database

```php
// database/migrations/xxxx_migrate_old_data.php
public function up()
{
    // 1. Migrate users
    DB::table('old_users')->chunk(100, function ($oldUsers) {
        foreach ($oldUsers as $oldUser) {
            User::create([
                'name' => $oldUser->name,
                'email' => $oldUser->email,
                // Map old fields to new fields
            ]);
        }
    });

    // 2. Migrate posts
    // 3. Migrate images
    // 4. etc.
}
```

## 🔒 Security Considerations

- ✅ Use prepared statements (Eloquent ORM)
- ✅ Sanitize all inputs
- ✅ Encrypt sensitive data
- ✅ Use soft deletes for audit trail
- ✅ Regular backups
- ✅ Database user with minimal privileges

## 📊 Monitoring

```sql
-- Slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- Check table sizes
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS "Size (MB)"
FROM information_schema.TABLES
WHERE table_schema = 'smansa_db'
ORDER BY (data_length + index_length) DESC;

-- Index usage
SHOW INDEX FROM posts;
```

## 🎯 Summary

Database dirancang dengan prinsip:

- ✅ **Normalized** - Menghindari redundansi
- ✅ **Indexed** - Optimal query performance
- ✅ **Scalable** - Dapat handle growth
- ✅ **Secure** - Data integrity dan security
- ✅ **Maintainable** - Clear structure dan naming
