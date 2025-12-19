<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class GallerySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Delete existing seeded galleries and their media
        $existingGalleries = DB::table('galleries')
            ->whereIn('slug', ['kegiatan-pembelajaran', 'fasilitas-sekolah', 'kegiatan-ekstrakurikuler'])
            ->pluck('id');
        
        if ($existingGalleries->count() > 0) {
            // Delete gallery items
            DB::table('gallery_items')->whereIn('gallery_id', $existingGalleries)->delete();
            // Delete media
            DB::table('media')
                ->where('model_type', 'App\\Models\\Gallery')
                ->whereIn('model_id', $existingGalleries)
                ->get()
                ->each(function ($media) {
                    // Delete media folder
                    Storage::disk('public')->deleteDirectory((string) $media->id);
                });
            DB::table('media')
                ->where('model_type', 'App\\Models\\Gallery')
                ->whereIn('model_id', $existingGalleries)
                ->delete();
            // Delete galleries
            DB::table('galleries')->whereIn('id', $existingGalleries)->delete();
        }

        // Gallery categories with their images
        $galleries = [
            [
                'name' => 'Kegiatan Pembelajaran',
                'slug' => 'kegiatan-pembelajaran',
                'description' => 'Dokumentasi kegiatan belajar mengajar di SMAN 1',
                'images' => [
                    ['file' => 'school-1.jpg', 'caption' => 'Suasana kelas yang kondusif'],
                    ['file' => 'school-2.jpg', 'caption' => 'Pembelajaran interaktif'],
                ],
            ],
            [
                'name' => 'Fasilitas Sekolah',
                'slug' => 'fasilitas-sekolah',
                'description' => 'Fasilitas modern dan lengkap untuk mendukung proses pembelajaran',
                'images' => [
                    ['file' => 'school-3.jpg', 'caption' => 'Gedung sekolah'],
                    ['file' => 'school-4.jpg', 'caption' => 'Perpustakaan'],
                ],
            ],
            [
                'name' => 'Kegiatan Ekstrakurikuler',
                'slug' => 'kegiatan-ekstrakurikuler',
                'description' => 'Berbagai kegiatan ekstrakurikuler untuk pengembangan bakat siswa',
                'images' => [
                    ['file' => 'school-5.jpg', 'caption' => 'Kegiatan siswa'],
                    ['file' => 'school-6.jpg', 'caption' => 'Aktivitas di sekolah'],
                ],
            ],
        ];

        // Source path from frontend public folder
        $sourcePath = base_path('../frontend/public/gallery');

        foreach ($galleries as $galleryData) {
            $images = $galleryData['images'];
            unset($galleryData['images']);

            // Create gallery using DB facade (bypass model traits)
            $galleryId = DB::table('galleries')->insertGetId([
                'name' => $galleryData['name'],
                'slug' => $galleryData['slug'],
                'description' => $galleryData['description'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $this->command->info("Created gallery: {$galleryData['name']}");

            // Add images to gallery
            $order = 1;
            foreach ($images as $imageData) {
                $sourceFile = "{$sourcePath}/{$imageData['file']}";

                if (File::exists($sourceFile)) {
                    // First, create media record to get the ID
                    $mediaId = DB::table('media')->insertGetId([
                        'model_type' => 'App\\Models\\Gallery',
                        'model_id' => $galleryId,
                        'uuid' => Str::uuid(),
                        'collection_name' => 'gallery_images',
                        'name' => pathinfo($imageData['file'], PATHINFO_FILENAME),
                        'file_name' => $imageData['file'],
                        'mime_type' => 'image/jpeg',
                        'disk' => 'public',
                        'conversions_disk' => 'public',
                        'size' => File::size($sourceFile),
                        'manipulations' => json_encode([]),
                        'custom_properties' => json_encode([]),
                        'generated_conversions' => json_encode([]),
                        'responsive_images' => json_encode([]),
                        'order_column' => $order,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    // Now copy to storage with correct path using media ID
                    Storage::disk('public')->makeDirectory((string) $mediaId);
                    Storage::disk('public')->put("{$mediaId}/{$imageData['file']}", File::get($sourceFile));

                    // Create gallery item linking media to gallery
                    DB::table('gallery_items')->insert([
                        'gallery_id' => $galleryId,
                        'media_id' => $mediaId,
                        'caption' => $imageData['caption'],
                        'order' => $order,
                        'created_at' => now(),
                    ]);

                    $this->command->info("  - Added image: {$imageData['file']} (media_id: {$mediaId})");
                    $order++;
                } else {
                    $this->command->warn("  - Image not found: {$imageData['file']}");
                }
            }
        }

        $this->command->info('Gallery seeding completed!');
    }
}
