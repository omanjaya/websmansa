<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Extra;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Extra>
 */
final class ExtraFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = Extra::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $names = [
            'basket' => 'Basket',
            'football' => 'Sepak Bola',
            'badminton' => 'Bulu Tangkis',
            'volleyball' => 'Bola Voli',
            'tennis' => 'Tenis Meja',
            'chess' => 'Catur',
            'art_club' => 'Klub Seni',
            'music_club' => 'Klub Musik',
            'drama_club' => 'Klub Drama',
            'debate_club' => 'Klub Debat',
            'science_club' => 'Klub IPA',
            'english_club' => 'Klub Bahasa Inggris',
            'programming_club' => 'Klub Pemrograman',
            'robotics_club' => 'Klub Robotika',
            'photography_club' => 'Klub Fotografi',
            'journalism_club' => 'Klub Jurnalistik',
            'social_service' => 'Kerelawanan',
            'environmental_club' => 'Klub Lingkungan',
            'entrepreneurship_club' => 'Klub Wirausaha',
        ];

        $extraName = $this->faker->randomElement(array_keys($names));

        return [
            'name' => $names[$extraName],
            'slug' => str()->slug($extraName).'-'.$this->faker->unique()->numberBetween(1000, 9999),
            'description' => $this->faker->paragraphs(2, true),
            'short_description' => $this->faker->sentence(2),
            'category' => $this->faker->randomElement([
                'sports', 'arts', 'academic', 'social', 'technology',
                'language', 'leadership', 'volunteer', 'religious',
            ]),
            'schedule' => $this->faker->randomElement([
                'Senin & Rabu, 15:00-17:00',
                'Selasa & Kamis, 14:00-16:00',
                'Jumat, 13:00-15:00',
                'Sabtu, 09:00-11:00',
                'Disesuaikan jadwal',
            ]),
            'contact_person' => $this->faker->name,
            'contact_phone' => $this->faker->phoneNumber,
            'contact_email' => $this->faker->companyEmail,
            'requirements' => $this->faker->randomElements([
                'Siswa kelas X-XII',
                'Tidak ada nilai merah',
                'Izin dari orang tua',
                'Komitmen mengikuti semua sesi',
                'Bersemangat dan disiplin',
            ], $this->faker->numberBetween(2, 4)),
            'capacity' => $this->faker->boolean(60) ? $this->faker->numberBetween(10, 50) : null,
            'logo' => 'extras/logo_'.$this->faker->numberBetween(1, 10).'.jpg',
            'images' => [
                'extras/'.$extraName.'_1.jpg',
                'extras/'.$extraName.'_2.jpg',
            ],
            'is_active' => $this->faker->boolean(90),
            'is_featured' => $this->faker->boolean(20),
            'order' => $this->faker->numberBetween(0, 20),
            'user_id' => User::factory(),
        ];
    }

    /**
     * Indicate that the extra is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => array_merge($attributes, [
            'is_active' => true,
        ]));
    }

    /**
     * Indicate that the extra is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => array_merge($attributes, [
            'is_featured' => true,
        ]));
    }

    /**
     * Indicate that the extra is a sport.
     */
    public function sport(): static
    {
        $sports = ['basket', 'football', 'badminton', 'volleyball', 'tennis'];
        $sportName = $this->faker->randomElement($sports);
        $names = [
            'basket' => 'Basket',
            'football' => 'Sepak Bola',
            'badminton' => 'Bulu Tangkis',
            'volleyball' => 'Bola Voli',
            'tennis' => 'Tenis Meja',
        ];

        return $this->state(fn (array $attributes) => array_merge($attributes, [
            'name' => $names[$sportName],
            'slug' => str()->slug($sportName),
            'category' => 'sports',
            'schedule' => $this->faker->randomElement([
                'Senin & Rabu, 15:00-17:00',
                'Selasa & Kamis, 16:00-18:00',
                'Sabtu, 08:00-11:00',
            ]),
        ]));
    }

    /**
     * Indicate that the extra is an art activity.
     */
    public function art(): static
    {
        $arts = ['art_club', 'music_club', 'drama_club', 'photography_club'];
        $artName = $this->faker->randomElement($arts);
        $names = [
            'art_club' => 'Klub Seni',
            'music_club' => 'Klub Musik',
            'drama_club' => 'Klub Drama',
            'photography_club' => 'Klub Fotografi',
        ];

        return $this->state(fn (array $attributes) => array_merge($attributes, [
            'name' => $names[$artName],
            'slug' => str()->slug($artName),
            'category' => 'arts',
            'schedule' => $this->faker->randomElement([
                'Jumat, 14:00-16:00',
                'Sabtu, 10:00-13:00',
            ]),
        ]));
    }

    /**
     * Indicate that the extra is an academic activity.
     */
    public function academic(): static
    {
        $academic = ['science_club', 'english_club', 'programming_club', 'robotics_club'];
        $academicName = $this->faker->randomElement($academic);
        $names = [
            'science_club' => 'Klub IPA',
            'english_club' => 'Klub Bahasa Inggris',
            'programming_club' => 'Klub Pemrograman',
            'robotics_club' => 'Klub Robotika',
        ];

        return $this->state(fn (array $attributes) => array_merge($attributes, [
            'name' => $names[$academicName],
            'slug' => str()->slug($academicName),
            'category' => 'academic',
            'schedule' => $this->faker->randomElement([
                'Selasa, 15:00-17:00',
                'Kamis, 15:00-17:00',
            ]),
        ]));
    }

    /**
     * Indicate that the extra has limited capacity.
     */
    public function limited(): static
    {
        return $this->state(fn (array $attributes) => array_merge($attributes, [
            'capacity' => $this->faker->numberBetween(10, 30),
        ]));
    }
}
