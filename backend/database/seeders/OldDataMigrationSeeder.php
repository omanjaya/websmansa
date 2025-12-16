<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\Category;
use App\Models\Extra;
use App\Models\Gallery;
use App\Models\Post;
use App\Models\Setting;
use App\Models\Slider;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class OldDataMigrationSeeder extends Seeder
{
    protected $oldDb;

    public function __construct()
    {
        // Connect to old database (same database, just different table structure)
        $this->oldDb = DB::connection('mysql');
    }

    public function run(): void
    {
        $this->command->info('Starting data migration from old structure...');

        try {
            // Run migrations in order
            $this->migrateUsers();
            $this->migrateCategories();
            $this->migratePosts();
            $this->migrateExtras();
            $this->migrateGalleries();
            $this->migrateStaff();
            $this->migrateSliders();
            $this->migrateSettings();

            $this->command->info('✅ Data migration completed successfully!');
        } catch (\Exception $e) {
            $this->command->error('❌ Migration failed: ' . $e->getMessage());
            Log::error('Migration failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    protected function migrateUsers(): void
    {
        $this->command->info('Migrating users...');

        // Check if old users table exists
        if (!$this->tableExists('users_old')) {
            $this->command->warn('Old users table not found. Creating default admin user...');

            // Create default admin user
            User::firstOrCreate(
                ['email' => 'admin@sman1denpasar.sch.id'],
                [
                    'uuid' => Str::uuid(),
                    'name' => 'Administrator',
                    'password' => bcrypt('password'),
                    'email_verified_at' => now(),
                ]
            );

            return;
        }

        $oldUsers = $this->oldDb->table('users_old')->get();

        foreach ($oldUsers as $oldUser) {
            User::updateOrCreate(
                ['email' => $oldUser->email],
                [
                    'uuid' => Str::uuid(),
                    'name' => $oldUser->name,
                    'password' => $oldUser->password,
                    'email_verified_at' => $oldUser->email_verified_at,
                    'created_at' => $oldUser->created_at,
                    'updated_at' => $oldUser->updated_at,
                ]
            );
        }

        $this->command->info("✓ Migrated {$oldUsers->count()} users");
    }

    protected function migrateCategories(): void
    {
        $this->command->info('Migrating categories...');

        if (!$this->tableExists('categories_old')) {
            $this->command->warn('Old categories table not found. Skipping...');
            return;
        }

        $oldCategories = $this->oldDb->table('categories_old')->get();

        foreach ($oldCategories as $oldCat) {
            Category::updateOrCreate(
                ['slug' => $oldCat->slug],
                [
                    'name' => $oldCat->name,
                    'slug' => $oldCat->slug,
                    'description' => $oldCat->description ?? null,
                    'is_active' => $oldCat->status == 1,
                    'created_at' => $oldCat->created_at,
                    'updated_at' => $oldCat->updated_at,
                ]
            );
        }

        $this->command->info("✓ Migrated {$oldCategories->count()} categories");
    }

    protected function migratePosts(): void
    {
        $this->command->info('Migrating posts...');

        if (!$this->tableExists('posts_old')) {
            $this->command->warn('Old posts table not found. Skipping...');
            return;
        }

        $defaultUser = User::first();
        if (!$defaultUser) {
            $this->command->error('No users found. Please run user migration first.');
            return;
        }

        $oldPosts = $this->oldDb->table('posts_old')->get();

        foreach ($oldPosts as $oldPost) {
            // Determine user_id (use created_by from old, or default to first user)
            $userId = $defaultUser->id;
            if (isset($oldPost->created_by)) {
                $oldUser = User::where('id', $oldPost->created_by)->first();
                if ($oldUser) {
                    $userId = $oldUser->id;
                }
            }

            $post = Post::updateOrCreate(
                ['slug' => $oldPost->slug],
                [
                    'uuid' => Str::uuid(),
                    'user_id' => $userId,
                    'title' => $oldPost->name,
                    'slug' => $oldPost->slug,
                    'excerpt' => $oldPost->short_description,
                    'content' => $oldPost->description,
                    'featured_image' => $oldPost->image,
                    'status' => $this->convertStatus($oldPost->status ?? 1),
                    'type' => $oldPost->type ?? 'post',
                    'views' => 0,
                    'likes' => $oldPost->likes ?? 0,
                    'is_featured' => $oldPost->highlight ?? false,
                    'is_pinned' => false,
                    'published_at' => $oldPost->created_at,
                    'created_at' => $oldPost->created_at,
                    'updated_at' => $oldPost->updated_at,
                ]
            );

            // Attach category if exists
            if (isset($oldPost->category_id)) {
                $category = Category::find($oldPost->category_id);
                if ($category) {
                    $post->categories()->syncWithoutDetaching([$category->id]);
                }
            }
        }

        $this->command->info("✓ Migrated {$oldPosts->count()} posts");
    }

    protected function migrateExtras(): void
    {
        $this->command->info('Migrating extracurricular activities...');

        if (!$this->tableExists('extras_old')) {
            $this->command->warn('Old extras table not found. Skipping...');
            return;
        }

        $defaultUser = User::first();
        $oldExtras = $this->oldDb->table('extras_old')->get();

        foreach ($oldExtras as $oldExtra) {
            Extra::updateOrCreate(
                ['slug' => $oldExtra->slug],
                [
                    'name' => $oldExtra->name,
                    'slug' => $oldExtra->slug,
                    'description' => $oldExtra->description,
                    'short_description' => $this->extractShortDescription($oldExtra->description),
                    'category' => $this->mapExtraCategory($oldExtra->name),
                    'schedule' => null,
                    'contact_person' => null,
                    'contact_phone' => null,
                    'contact_email' => null,
                    'requirements' => null,
                    'capacity' => null,
                    'logo' => $oldExtra->image,
                    'images' => null,
                    'is_active' => $oldExtra->status == 1,
                    'is_featured' => false,
                    'order' => 0,
                    'user_id' => $defaultUser->id,
                    'created_at' => $oldExtra->created_at,
                    'updated_at' => $oldExtra->updated_at,
                ]
            );
        }

        $this->command->info("✓ Migrated {$oldExtras->count()} extracurricular activities");
    }

    protected function migrateGalleries(): void
    {
        $this->command->info('Migrating galleries...');

        if (!$this->tableExists('galleries_old')) {
            $this->command->warn('Old galleries table not found. Skipping...');
            return;
        }

        $oldGalleries = $this->oldDb->table('galleries_old')->get();

        foreach ($oldGalleries as $oldGallery) {
            $gallery = Gallery::updateOrCreate(
                ['slug' => $oldGallery->slug],
                [
                    'uuid' => Str::uuid(),
                    'title' => $oldGallery->name,
                    'slug' => $oldGallery->slug,
                    'description' => $oldGallery->description,
                    'thumbnail' => null,
                    'type' => 'photo',
                    'event_date' => null,
                    'is_featured' => false,
                    'created_at' => $oldGallery->created_at,
                    'updated_at' => $oldGallery->updated_at,
                ]
            );

            // Migrate gallery media from Spatie media library
            $this->migrateGalleryMedia($oldGallery->id, $gallery->id);
        }

        $this->command->info("✓ Migrated {$oldGalleries->count()} galleries");
    }

    protected function migrateGalleryMedia(int $oldGalleryId, int $newGalleryId): void
    {
        if (!$this->tableExists('media_old')) {
            return;
        }

        $oldMedia = $this->oldDb->table('media_old')
            ->where('model_type', 'App\\Models\\Gallery')
            ->where('model_id', $oldGalleryId)
            ->get();

        $gallery = Gallery::find($newGalleryId);

        foreach ($oldMedia as $media) {
            // Store media info in gallery_items table
            DB::table('gallery_items')->insert([
                'gallery_id' => $newGalleryId,
                'type' => $media->mime_type && str_contains($media->mime_type, 'video') ? 'video' : 'image',
                'url' => $media->file_name,
                'thumbnail_url' => $media->file_name,
                'title' => $media->name,
                'description' => null,
                'order' => $media->order_column ?? 0,
                'created_at' => $media->created_at,
                'updated_at' => $media->updated_at,
            ]);

            // Set first image as gallery thumbnail
            if (!$gallery->thumbnail && $media->collection_name === 'images') {
                $gallery->thumbnail = $media->file_name;
                $gallery->save();
            }
        }
    }

    protected function migrateStaff(): void
    {
        $this->command->info('Migrating staff...');

        if (!$this->tableExists('staff_old')) {
            $this->command->warn('Old staff table not found. Skipping...');
            return;
        }

        $defaultUser = User::first();
        $oldStaff = $this->oldDb->table('staff_old')->get();

        foreach ($oldStaff as $staff) {
            Staff::updateOrCreate(
                ['nip' => $staff->nip ?? 'STAFF-' . $staff->id],
                [
                    'nip' => $staff->nip ?? 'STAFF-' . $staff->id,
                    'name' => $staff->name,
                    'slug' => Str::slug($staff->name),
                    'email' => $staff->email ?? null,
                    'phone' => $staff->phone ?? null,
                    'photo' => $staff->photo ?? null,
                    'position' => $staff->position ?? 'Teacher',
                    'department' => $staff->department ?? 'General',
                    'qualification' => $staff->qualification ?? null,
                    'specialization' => $staff->specialization ?? null,
                    'bio' => $staff->bio ?? null,
                    'joined_date' => $staff->joined_date ?? null,
                    'is_active' => $staff->status ?? true,
                    'is_featured' => $staff->is_featured ?? false,
                    'order' => $staff->order ?? 0,
                    'user_id' => $defaultUser->id,
                    'created_at' => $staff->created_at ?? now(),
                    'updated_at' => $staff->updated_at ?? now(),
                ]
            );
        }

        $this->command->info("✓ Migrated {$oldStaff->count()} staff members");
    }

    protected function migrateSliders(): void
    {
        $this->command->info('Migrating sliders...');

        if (!$this->tableExists('slides_old')) {
            $this->command->warn('Old slides table not found. Skipping...');
            return;
        }

        $defaultUser = User::first();
        $oldSlides = $this->oldDb->table('slides_old')->get();

        foreach ($oldSlides as $index => $slide) {
            Slider::updateOrCreate(
                ['title' => $slide->name],
                [
                    'title' => $slide->name,
                    'subtitle' => null,
                    'image_url' => $slide->image,
                    'link' => null,
                    'button_text' => null,
                    'order' => $index + 1,
                    'is_active' => $slide->status == 1,
                    'user_id' => $defaultUser->id,
                    'created_at' => $slide->created_at,
                    'updated_at' => $slide->updated_at,
                ]
            );
        }

        $this->command->info("✓ Migrated {$oldSlides->count()} sliders");
    }

    protected function migrateSettings(): void
    {
        $this->command->info('Migrating settings...');

        if (!$this->tableExists('settings_old')) {
            $this->command->warn('Old settings table not found. Skipping...');
            return;
        }

        $oldSettings = $this->oldDb->table('settings_old')->get();

        foreach ($oldSettings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting->key],
                [
                    'key' => $setting->key,
                    'value' => $setting->value,
                    'type' => 'string',
                    'group' => 'general',
                    'created_at' => $setting->created_at,
                    'updated_at' => $setting->updated_at,
                ]
            );
        }

        $this->command->info("✓ Migrated {$oldSettings->count()} settings");
    }

    // Helper methods

    protected function tableExists(string $table): bool
    {
        try {
            return DB::getSchemaBuilder()->hasTable($table);
        } catch (\Exception $e) {
            return false;
        }
    }

    protected function convertStatus(int $status): string
    {
        return match($status) {
            1 => 'published',
            0 => 'draft',
            default => 'draft'
        };
    }

    protected function extractShortDescription(?string $html): ?string
    {
        if (!$html) {
            return null;
        }

        $text = strip_tags($html);
        return Str::limit($text, 200);
    }

    protected function mapExtraCategory(string $name): string
    {
        $name = strtolower($name);

        // Map based on keywords in name
        if (str_contains($name, 'basket') || str_contains($name, 'voli') ||
            str_contains($name, 'futsal') || str_contains($name, 'olahraga')) {
            return 'sports';
        }

        if (str_contains($name, 'musik') || str_contains($name, 'tari') ||
            str_contains($name, 'seni')) {
            return 'arts';
        }

        if (str_contains($name, 'sain') || str_contains($name, 'matematika') ||
            str_contains($name, 'fisika') || str_contains($name, 'kimia')) {
            return 'academic';
        }

        if (str_contains($name, 'bahasa') || str_contains($name, 'english') ||
            str_contains($name, 'jepang')) {
            return 'language';
        }

        if (str_contains($name, 'pramuka') || str_contains($name, 'osis')) {
            return 'leadership';
        }

        if (str_contains($name, 'rohis') || str_contains($name, 'keagamaan')) {
            return 'religious';
        }

        return 'social';
    }
}
