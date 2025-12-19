<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GallerySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Delete existing seeded galleries
        $existingGalleries = DB::table('galleries')
            ->whereIn('slug', [
                'kegiatan-pembelajaran',
                'fasilitas-sekolah',
                'kegiatan-ekstrakurikuler',
                'upacara-bendera',
                'lomba-dan-prestasi',
            ])
            ->pluck('id');

        if ($existingGalleries->count() > 0) {
            DB::table('gallery_items')->whereIn('gallery_id', $existingGalleries)->delete();
            DB::table('galleries')->whereIn('id', $existingGalleries)->delete();
        }

        // Gallery data
        $galleries = [
            [
                'title' => 'Kegiatan Pembelajaran',
                'slug' => 'kegiatan-pembelajaran',
                'description' => 'Dokumentasi kegiatan belajar mengajar di SMA Negeri 1 Denpasar. Suasana kelas yang kondusif dan pembelajaran interaktif dengan fasilitas modern.',
                'type' => 'photo',
                'is_featured' => true,
            ],
            [
                'title' => 'Fasilitas Sekolah',
                'slug' => 'fasilitas-sekolah',
                'description' => 'Fasilitas modern dan lengkap untuk mendukung proses pembelajaran, termasuk laboratorium, perpustakaan, dan ruang multimedia.',
                'type' => 'photo',
                'is_featured' => true,
            ],
            [
                'title' => 'Kegiatan Ekstrakurikuler',
                'slug' => 'kegiatan-ekstrakurikuler',
                'description' => 'Berbagai kegiatan ekstrakurikuler untuk pengembangan bakat dan minat siswa, mulai dari olahraga, seni, hingga teknologi.',
                'type' => 'photo',
                'is_featured' => true,
            ],
            [
                'title' => 'Upacara Bendera',
                'slug' => 'upacara-bendera',
                'description' => 'Dokumentasi upacara bendera dan kegiatan nasionalisme di SMA Negeri 1 Denpasar.',
                'type' => 'photo',
                'is_featured' => false,
            ],
            [
                'title' => 'Lomba dan Prestasi',
                'slug' => 'lomba-dan-prestasi',
                'description' => 'Dokumentasi keikutsertaan dan prestasi siswa dalam berbagai lomba tingkat daerah, nasional, dan internasional.',
                'type' => 'photo',
                'is_featured' => true,
            ],
        ];

        foreach ($galleries as $galleryData) {
            DB::table('galleries')->insert([
                'uuid' => Str::uuid()->toString(),
                'title' => $galleryData['title'],
                'slug' => $galleryData['slug'],
                'description' => $galleryData['description'],
                'type' => $galleryData['type'],
                'is_featured' => $galleryData['is_featured'],
                'is_active' => true,
                'order' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $this->command->info("Created gallery: {$galleryData['title']}");
        }

        $this->command->info('Gallery seeding completed! Note: Images need to be uploaded via admin panel.');
    }
}
