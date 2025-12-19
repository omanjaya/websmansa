<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Facility;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class FacilitySeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@sman1dps.sch.id')->first();
        $userId = $admin?->id ?? 1;

        $facilities = [
            [
                'name' => 'Ruang Kelas Standar',
                'description' => 'SMA Negeri 1 Denpasar memiliki 36 ruang kelas yang dilengkapi dengan fasilitas modern seperti AC, proyektor LCD, dan papan tulis interaktif.',
                'category' => 'classroom',
                'location' => 'Gedung A, B, C',
                'capacity' => 36,
                'area' => 72,
                'facilities' => ['AC', 'Proyektor LCD', 'Papan Tulis', 'Meja Kursi', 'WiFi'],
                'is_active' => true,
                'is_featured' => true,
                'order' => 1,
            ],
            [
                'name' => 'Laboratorium Fisika',
                'description' => 'Laboratorium fisika modern dengan peralatan praktikum lengkap.',
                'category' => 'science',
                'location' => 'Gedung D Lantai 2',
                'capacity' => 40,
                'area' => 120,
                'facilities' => ['Alat Praktikum', 'Meja Lab', 'AC', 'Proyektor'],
                'is_active' => true,
                'is_featured' => true,
                'order' => 2,
            ],
            [
                'name' => 'Laboratorium Kimia',
                'description' => 'Laboratorium kimia dengan peralatan analisis dan praktikum lengkap.',
                'category' => 'science',
                'location' => 'Gedung D Lantai 2',
                'capacity' => 40,
                'area' => 120,
                'facilities' => ['Alat Praktikum', 'Lemari Asam', 'AC'],
                'is_active' => true,
                'is_featured' => true,
                'order' => 3,
            ],
            [
                'name' => 'Laboratorium Biologi',
                'description' => 'Laboratorium biologi untuk praktikum dan penelitian.',
                'category' => 'science',
                'location' => 'Gedung D Lantai 1',
                'capacity' => 40,
                'area' => 120,
                'facilities' => ['Mikroskop', 'Alat Praktikum', 'Spesimen', 'AC'],
                'is_active' => true,
                'order' => 4,
            ],
            [
                'name' => 'Laboratorium Komputer',
                'description' => 'Laboratorium komputer dengan 50 unit PC terbaru.',
                'category' => 'computer',
                'location' => 'Gedung E Lantai 1',
                'capacity' => 50,
                'area' => 150,
                'facilities' => ['PC Desktop', 'Internet', 'AC', 'Proyektor'],
                'is_active' => true,
                'is_featured' => true,
                'order' => 5,
            ],
            [
                'name' => 'Perpustakaan',
                'description' => 'Perpustakaan dengan koleksi 15.000 buku dan ruang baca nyaman.',
                'category' => 'library',
                'location' => 'Gedung F',
                'capacity' => 100,
                'area' => 300,
                'facilities' => ['Koleksi Buku', 'Ruang Baca', 'Internet', 'AC'],
                'is_active' => true,
                'is_featured' => true,
                'order' => 6,
            ],
            [
                'name' => 'Aula Serba Guna',
                'description' => 'Aula untuk kegiatan upacara, seminar, dan acara besar.',
                'category' => 'auditorium',
                'location' => 'Area Tengah Sekolah',
                'capacity' => 500,
                'area' => 800,
                'facilities' => ['Sound System', 'Panggung', 'AC', 'Kursi Lipat'],
                'is_active' => true,
                'is_featured' => true,
                'order' => 7,
            ],
            [
                'name' => 'Lapangan Basket',
                'description' => 'Lapangan basket outdoor standar nasional.',
                'category' => 'sports',
                'location' => 'Area Depan',
                'capacity' => 100,
                'area' => 420,
                'is_active' => true,
                'order' => 8,
            ],
            [
                'name' => 'Lapangan Futsal',
                'description' => 'Lapangan futsal dengan rumput sintetis.',
                'category' => 'sports',
                'location' => 'Area Belakang',
                'capacity' => 50,
                'area' => 800,
                'is_active' => true,
                'order' => 9,
            ],
            [
                'name' => 'Kantin Sekolah',
                'description' => 'Kantin bersih dan sehat dengan menu beragam.',
                'category' => 'canteen',
                'location' => 'Gedung G',
                'capacity' => 200,
                'area' => 250,
                'is_active' => true,
                'order' => 10,
            ],
            [
                'name' => 'UKS (Unit Kesehatan Sekolah)',
                'description' => 'Fasilitas kesehatan lengkap dengan perawat jaga.',
                'category' => 'health',
                'location' => 'Gedung A Lantai 1',
                'capacity' => 10,
                'area' => 50,
                'is_active' => true,
                'order' => 11,
            ],
            [
                'name' => 'Pura Sekolah',
                'description' => 'Tempat ibadah umat Hindu di lingkungan sekolah.',
                'category' => 'worship',
                'location' => 'Area Timur',
                'capacity' => 100,
                'area' => 200,
                'is_active' => true,
                'order' => 12,
            ],
        ];

        foreach ($facilities as $data) {
            $data['user_id'] = $userId;
            $data['slug'] = Str::slug($data['name']);
            Facility::create($data);
        }
    }
}
