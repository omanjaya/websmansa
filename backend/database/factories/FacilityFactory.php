<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Facility;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Facility>
 */
final class FacilityFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = Facility::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $names = [
            'lab_ipa' => 'Laboratorium IPA',
            'lab_kimia' => 'Laboratorium Kimia',
            'lab_fisika' => 'Laboratorium Fisika',
            'lab_biologi' => 'Laboratorium Biologi',
            'lab_komputer_1' => 'Laboratorium Komputer 1',
            'lab_komputer_2' => 'Laboratorium Komputer 2',
            'lab_bahasa' => 'Laboratorium Bahasa',
            'perpustakaan' => 'Perpustakaan',
            'aula' => 'Aula Utama',
            'auditorium' => 'Auditorium',
            'ruang_kelas_1' => 'Ruang Kelas X-1',
            'ruang_kelas_2' => 'Ruang Kelas XI-IPA-1',
            'ruang_kelas_3' => 'Ruang Kelas XII-IPS-1',
            'lab_multimedia' => 'Laboratorium Multimedia',
            'studio_musik' => 'Studio Musik',
            'studio_seni' => 'Studio Seni',
            'ruang_olahraga' => 'Gelanggang Olahraga',
            'lapangan_bola' => 'Lapangan Sepak Bola',
            'lapangan_voli' => 'Lapangan Voli',
            'lapangan_basket' => 'Lapangan Basket',
            'kantin_utama' => 'Kantin Utama',
            'kantin_2' => 'Kantin 2',
            'koperasi' => 'Koperasi Sekolah',
            'ruang_uk' => 'Unit Kesehatan Sekolah',
            'ruang_bk' => 'Ruang Bimbingan Konseling',
            'ruang_guru_1' => 'Ruang Guru 1',
            'ruang_guru_2' => 'Ruang Guru 2',
            'ruang_tu' => 'Ruang Tata Usaha',
            'masjid' => 'Masjid Al-Ikhlas',
            'toilet_gedung_utama' => 'Toilet Gedung Utama',
            'toilet_gedung_2' => 'Toilet Gedung 2',
            'taman_depan' => 'Taman Depan',
            'taman_belakang' => 'Taman Belakang',
            'area_parkir_guru' => 'Area Parkir Guru',
            'area_parkir_siswa' => 'Area Parkir Siswa',
            'ruang_administrasi' => 'Ruang Administrasi',
            'ruang_kepsek' => 'Ruang Kepala Sekolah',
            'ruang_wakasek' => 'Ruang Wakil Kepala Sekolah',
        ];

        $facilityName = $this->faker->randomElement(array_keys($names));

        return [
            'name' => $names[$facilityName],
            'slug' => str()->slug($facilityName).'-'.$this->faker->unique()->numberBetween(1000, 9999),
            'description' => $this->faker->paragraphs(3, true),
            'category' => $this->faker->randomElement([
                'classroom', 'laboratory', 'library', 'sports', 'canteen',
                'health', 'auditorium', 'multipurpose', 'parking', 'worship',
                'toilet', 'garden', 'computer', 'science', 'language',
                'art', 'music',
            ]),
            'location' => $this->faker->randomElement([
                'Gedung Utama Lantai 1',
                'Gedung Utama Lantai 2',
                'Gedung Utama Lantai 3',
                'Gedung Baru Lantai 1',
                'Gedung Baru Lantai 2',
                'Lapangan Olahraga',
                'Area Parkir',
            ]),
            'capacity' => $this->faker->boolean(50) ? $this->faker->numberBetween(20, 200) : null,
            'area' => $this->faker->boolean(40) ? $this->faker->numberBetween(20, 500) : null,
            'facilities' => $this->faker->randomElements([
                'AC',
                'Proyektor',
                'Whiteboard',
                'Sound System',
                'Wi-Fi',
                'Komputer',
                'Meja dan Kursi',
                'Papan Tulis',
                'Layar Proyeksi',
                'Speaker',
                'Lampu Penerangan',
            ], $this->faker->numberBetween(3, 8)),
            'images' => [
                'facilities/'.$facilityName.'_1.jpg',
                'facilities/'.$facilityName.'_2.jpg',
            ],
            'rules' => $this->faker->randomElements([
                'Wajib izin dari guru',
                'Hanya untuk kegiatan sekolah',
                'Tidak membawa makanan dan minuman',
                'Menjaga kebersihan',
                'Tidak merusak fasilitas',
                'Melaporkan penggunaan',
                'Mengembalikan barang ke tempat semula',
                'Mematikan alat-alat elektronik setelah penggunaan',
            ], $this->faker->numberBetween(2, 5)),
            'booking_url' => $this->faker->boolean(30) ? $this->faker->url : null,
            'is_active' => $this->faker->boolean(95),
            'is_featured' => $this->faker->boolean(15),
            'order' => $this->faker->numberBetween(0, 50),
            'user_id' => User::factory(),
        ];
    }

    /**
     * Indicate that the facility is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => array_merge($attributes, [
            'is_active' => true,
        ]));
    }

    /**
     * Indicate that the facility is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => array_merge($attributes, [
            'is_featured' => true,
        ]));
    }

    /**
     * Indicate that the facility is a classroom.
     */
    public function classroom(): static
    {
        return $this->state(fn (array $attributes) => array_merge($attributes, [
            'category' => 'classroom',
            'name' => 'Ruang Kelas '.$this->faker->randomElement(['X', 'XI', 'XII']).'-'.$this->faker->numberBetween(1, 6),
            'capacity' => $this->faker->numberBetween(30, 40),
            'area' => $this->faker->numberBetween(40, 60),
            'facilities' => ['AC', 'Meja dan Kursi', 'Papan Tulis', 'Whiteboard'],
        ]));
    }

    /**
     * Indicate that the facility is a laboratory.
     */
    public function laboratory(): static
    {
        $labTypes = [
            ['lab_ipa', 'Laboratorium IPA', 'science'],
            ['lab_kimia', 'Laboratorium Kimia', 'chemistry'],
            ['lab_fisika', 'Laboratorium Fisika', 'physics'],
            ['lab_biologi', 'Laboratorium Biologi', 'biology'],
            ['lab_komputer', 'Laboratorium Komputer', 'computer'],
            ['lab_bahasa', 'Laboratorium Bahasa', 'language'],
        ];

        $lab = $this->faker->randomElement($labTypes);

        return $this->state(fn (array $attributes) => array_merge($attributes, [
            'name' => $lab[1],
            'slug' => str()->slug($lab[0]).'-'.$this->faker->unique()->numberBetween(1000, 9999),
            'category' => 'laboratory',
            'type' => $lab[2],
            'capacity' => $this->faker->numberBetween(20, 40),
            'area' => $this->faker->numberBetween(50, 100),
            'facilities' => ['AC', 'Meja Kerja', 'Whiteboard', 'Proyektor', 'Sound System'],
        ]));
    }

    /**
     * Indicate that the facility is a sports facility.
     */
    public function sport(): static
    {
        $sports = [
            ['ruang_olahraga', 'Gelanggang Olahraga', 'sports'],
            ['lapangan_bola', 'Lapangan Sepak Bola', 'sports'],
            ['lapangan_voli', 'Lapangan Voli', 'sports'],
            ['lapangan_basket', 'Lapangan Basket', 'sports'],
        ];

        $sport = $this->faker->randomElement($sports);

        return $this->state(fn (array $attributes) => array_merge($attributes, [
            'name' => $sport[1],
            'slug' => str()->slug($sport[0]).'-'.$this->faker->unique()->numberBetween(1000, 9999),
            'category' => 'sports',
            'capacity' => $this->faker->numberBetween(50, 200),
            'area' => $this->faker->numberBetween(200, 1000),
            'location' => 'Area Olahraga',
            'facilities' => ['Net', 'Ring Bola', 'Papan Skor', 'Tribun'],
        ]));
    }

    /**
     * Indicate that the facility has limited capacity.
     */
    public function limited(): static
    {
        return $this->state(fn (array $attributes) => array_merge($attributes, [
            'capacity' => $this->faker->numberBetween(20, 100),
            'rules' => array_merge($attributes['rules'] ?? [], [
                'Maksimal '.$this->faker->numberBetween(20, 50).' orang',
                'Wajib booking terlebih dahulu',
            ]),
        ]));
    }
}
