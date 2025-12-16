<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Gallery;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Gallery>
 */
final class GalleryFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = Gallery::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->sentence(4);

        return [
            'title' => $title,
            'slug' => Str::slug($title).'-'.$this->faker->unique()->numberBetween(1000, 9999),
            'description' => $this->faker->paragraph(3),
            'thumbnail' => null,
            'type' => $this->faker->randomElement(['photo', 'video', 'mixed']),
            'event_date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'is_featured' => $this->faker->boolean(20), // 20% chance of being featured
        ];
    }

    /**
     * Indicate that the gallery is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    /**
     * Indicate that the gallery is a photo gallery.
     */
    public function photo(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'photo',
        ]);
    }

    /**
     * Indicate that the gallery is a video gallery.
     */
    public function video(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'video',
        ]);
    }

    /**
     * Indicate that the gallery is a mixed gallery.
     */
    public function mixed(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'mixed',
        ]);
    }

    /**
     * Indicate that the gallery has a thumbnail.
     */
    public function withThumbnail(): static
    {
        return $this->state(fn (array $attributes) => [
            'thumbnail' => 'galleries/thumbnails/'.Str::random(40).'.jpg',
        ]);
    }
}
