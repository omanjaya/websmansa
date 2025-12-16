<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Akademik',
                'slug' => 'akademik',
                'description' => 'Berita dan informasi seputar kegiatan akademik',
                'order' => 1,
            ],
            [
                'name' => 'Prestasi',
                'slug' => 'prestasi',
                'description' => 'Pencapaian dan penghargaan siswa',
                'order' => 2,
            ],
            [
                'name' => 'Ekstrakurikuler',
                'slug' => 'ekstrakurikuler',
                'description' => 'Kegiatan di luar jam pelajaran',
                'order' => 3,
            ],
            [
                'name' => 'Pengumuman',
                'slug' => 'pengumuman',
                'description' => 'Pengumuman resmi sekolah',
                'order' => 4,
            ],
            [
                'name' => 'Kegiatan',
                'slug' => 'kegiatan',
                'description' => 'Event dan kegiatan sekolah',
                'order' => 5,
            ],
            [
                'name' => 'Alumni',
                'slug' => 'alumni',
                'description' => 'Berita tentang alumni dan tracer study',
                'order' => 6,
            ],
        ];

        DB::table('categories')->insert($categories);
    }
}
