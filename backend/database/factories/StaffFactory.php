<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Staff;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Staff>
 */
final class StaffFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = Staff::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $gender = $this->faker->randomElement(['male', 'female']);
        $departments = [
            'mathematics' => ['Matematika', 'teacher'],
            'indonesian' => ['Bahasa Indonesia', 'teacher'],
            'english' => ['Bahasa Inggris', 'teacher'],
            'physics' => ['Fisika', 'teacher'],
            'chemistry' => ['Kimia', 'teacher'],
            'biology' => ['Biologi', 'teacher'],
            'history' => ['Sejarah', 'teacher'],
            'geography' => ['Geografi', 'teacher'],
            'economics' => ['Ekonomi', 'teacher'],
            'sociology' => ['Sosiologi', 'teacher'],
            'civics' => ['PKN', 'teacher'],
            'religion' => ['Pendidikan Agama', 'teacher'],
            'art' => ['Seni Budaya', 'teacher'],
            'music' => ['Musik', 'teacher'],
            'pe' => ['Pendidikan Jasmani', 'teacher'],
            'it' => ['Teknologi Informasi', 'teacher'],
            'counseling' => ['Bimbingan Konseling', 'counselor'],
            'library' => ['Perpustakaan', 'librarian'],
            'laboratory' => ['Laboratorium', 'lab_assistant'],
            'administration' => ['Tata Usaha', 'admin'],
            'finance' => ['Keuangan', 'admin'],
            'student_affairs' => ['Kesiswaan', 'admin'],
            'curriculum' => ['Kurikulum', 'admin'],
            'facilities' => ['Sarana Prasarana', 'admin'],
            'public_relation' => ['Humas', 'admin'],
            'security' => ['Keamanan', 'security'],
            'cleaning' => ['Kebersihan', 'cleaner'],
            'cafeteria' => ['Kantin', 'cafeteria'],
            'health' => ['UKS', 'admin'],
        ];

        $department = $this->faker->randomElement(array_keys($departments));
        $deptInfo = $departments[$department];
        $fullName = $this->faker->name($gender);

        // Generate NIP (Nomor Induk Pegawai)
        $year = $this->faker->numberBetween(1980, 2020);
        $nip = sprintf('%d%06d%02d', $year, $this->faker->numberBetween(1, 999999), $this->faker->numberBetween(1, 99));

        return [
            'nip' => $nip,
            'name' => $fullName,
            'slug' => str()->slug($fullName),
            'photo' => 'staff/'.$this->faker->numberBetween(1, 50).'.jpg',
            'position' => $this->faker->jobTitle,
            'department' => $department,
            'type' => $deptInfo[1],
            'subjects' => in_array($deptInfo[1], ['teacher', 'counselor'])
                ? $this->faker->randomElements([
                    'Matematika Wajib', 'Matematika Peminatan',
                    'Bahasa Indonesia Wajib', 'Bahasa Indonesia Peminatan',
                    'Bahasa Inggris Wajib', 'Bahasa Inggris Peminatan',
                    'Fisika Wajib', 'Fisika Peminatan',
                    'Kimia Wajib', 'Kimia Peminatan',
                    'Biologi Wajib', 'Biologi Peminatan',
                    'Sejarah Indonesia', 'Sejarah Dunia',
                    'Geografi', 'Ekonomi', 'Sosiologi', 'PKN',
                    'Seni Budaya', 'Musik', 'Pendidikan Jasmani',
                    'TIK', 'Bimbingan Konseling',
                ], $this->faker->numberBetween(1, 3))
                : null,
            'qualifications' => $this->faker->randomElements([
                'S1 '.$deptInfo[0].' - Universitas Indonesia',
                'S2 '.$deptInfo[0].' - Universitas Gadjah Mada',
                'S3 '.$deptInfo[0].' - Universitas Padjajaran',
                'S1 Pendidikan '.$deptInfo[0].' - IKIP Jakarta',
                'S2 Manajemen '.$deptInfo[0].' - UGM',
                'Sarjana '.$deptInfo[0].' - Universitas Udayana',
                'Magister Pendidikan '.$deptInfo[0].' - UNESA',
                'Doktor '.$deptInfo[0].' - Universitas Airlangga',
            ], $this->faker->numberBetween(1, 2)),
            'experience' => $this->faker->numberBetween(1, 25),
            'email' => $this->faker->companyEmail,
            'phone' => $this->faker->phoneNumber,
            'social_media' => [
                'facebook' => 'https://facebook.com/'.$this->faker->userName,
                'instagram' => 'https://instagram.com/'.$this->faker->userName,
                'linkedin' => 'https://linkedin.com/in/'.$this->faker->userName,
            ],
            'bio' => $this->faker->paragraph(3, true),
            'achievements' => $this->faker->randomElements([
                'Guru Berprestasi Tingkat Provinsi 2023',
                'Pembimbing Terbaik Olimpiade Sains 2022',
                'Peneliti Muda Terpilih 2021',
                'Inovator Pendidikan 2020',
                'Pengajar Favorit Siswa 2019',
            ], $this->faker->numberBetween(0, 2)),
            'is_active' => $this->faker->boolean(95),
            'is_featured' => $this->faker->boolean(10),
            'order' => $this->faker->numberBetween(0, 100),
            'user_id' => User::factory(),
        ];
    }

    /**
     * Indicate that the staff is a teacher.
     */
    public function teacher(): static
    {
        return $this->state(fn (array $attributes) => array_merge($attributes, [
            'type' => 'teacher',
            'position' => 'Guru '.$this->faker->randomElement(['Utama', 'Madya', 'Muda']).' '.$this->faker->jobTitle,
        ]));
    }

    /**
     * Indicate that the staff is an administrator.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => array_merge($attributes, [
            'type' => 'admin',
            'position' => $this->faker->randomElement([
                'Kepala Tata Usaha',
                'Kepala Subbagian',
                'Kepala Seksi',
                'Staf Tata Usaha',
                'Analis Tata Usaha',
            ]),
        ]));
    }

    /**
     * Indicate that the staff is headmaster.
     */
    public function headmaster(): static
    {
        return $this->state(fn (array $attributes) => array_merge($attributes, [
            'type' => 'headmaster',
            'position' => 'Kepala Sekolah',
            'nip' => '196501011990031001',
            'is_featured' => true,
            'qualifications' => [
                'S2 Manajemen Pendidikan - Universitas Padjadjaran',
                'Sarjana Pendidikan Bahasa Indonesia - Universitas Indonesia',
            ],
            'experience' => $this->faker->numberBetween(15, 30),
        ]));
    }

    /**
     * Indicate that the staff is vice headmaster.
     */
    public function viceHeadmaster(): static
    {
        return $this->state(fn (array $attributes) => array_merge($attributes, [
            'type' => 'vice_headmaster',
            'position' => 'Wakil Kepala Sekolah',
            'qualifications' => [
                'S2 Manajemen Pendidikan - Universitas Gadjah Mada',
                'S1 Pendidikan Fisika - IKIP Surabaya',
            ],
            'experience' => $this->faker->numberBetween(10, 25),
        ]));
    }

    /**
     * Indicate that the staff is experienced.
     */
    public function experienced(): static
    {
        return $this->state(fn (array $attributes) => array_merge($attributes, [
            'experience' => $this->faker->numberBetween(10, 30),
            'qualifications' => [
                'S2 '.$this->faker->randomElement(['Manajemen', 'Administrasi', 'Pendidikan']).' - '.$this->faker->randomElement(['UGM', 'UI', 'UNAIR', 'ITS']),
                'S1 '.$this->faker->randomElement(['Pendidikan', 'Teknik', 'Ekonomi', 'Hukum']).' - '.$this->faker->randomElement(['UB', 'UNAIR', 'ITS', 'UPNV']),
                'S3 '.$this->faker->randomElement(['Pendidikan', 'Manajemen']).' - '.$this->faker->randomElement(['UPI', 'UNDIP', 'UNS']),
            ],
        ]));
    }

    /**
     * Indicate that the staff is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => array_merge($attributes, [
            'is_featured' => true,
            'photo' => 'staff/featured_'.$this->faker->numberBetween(1, 5).'.jpg',
        ]));
    }

    /**
     * Indicate that the staff teaches specific subject.
     */
    public function mathematics(): static
    {
        return $this->state(fn (array $attributes) => array_merge($attributes, [
            'department' => 'mathematics',
            'subjects' => $this->faker->randomElements([
                'Matematika Wajib',
                'Matematika Peminatan',
                'Kalkulus Dasar',
                'Statistika Matematika',
            ], $this->faker->numberBetween(1, 2)),
        ]));
    }

    /**
     * Indicate that the staff teaches science subjects.
     */
    public function science(): static
    {
        $scienceSubjects = [
            ['physics', ['Fisika Wajib', 'Fisika Peminatan', 'Mekanika']],
            ['chemistry', ['Kimia Wajib', 'Kimia Peminatan', 'Organik']],
            ['biology', ['Biologi Wajib', 'Biologi Peminatan', 'Ekologi']],
        ];

        $subject = $this->faker->randomElement($scienceSubjects);

        return $this->state(fn (array $attributes) => array_merge($attributes, [
            'department' => $subject[0],
            'subjects' => $this->faker->randomElements($subject[1], $this->faker->numberBetween(1, 2)),
        ]));
    }

    /**
     * Indicate that the staff teaches social subjects.
     */
    public function social(): static
    {
        $socialSubjects = [
            ['history', ['Sejarah Indonesia', 'Sejarah Dunia']],
            ['geography', ['Geografi', 'Geografi Regional']],
            ['economics', ['Ekonomi Mikro', 'Ekonomi Makro']],
            ['sociology', ['Sosiologi Dasar', 'Sosiologi Modern']],
            ['civics', ['PKN Wajib', 'PKN Lanjutan']],
        ];

        $subject = $this->faker->randomElement($socialSubjects);

        return $this->state(fn (array $attributes) => array_merge($attributes, [
            'department' => $subject[0],
            'subjects' => $this->faker->randomElements($subject[1], $this->faker->numberBetween(1, 2)),
        ]));
    }
}
