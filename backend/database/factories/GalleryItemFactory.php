<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Gallery;
use App\Models\GalleryItem;
use App\Models\Media;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GalleryItem>
 */
final class GalleryItemFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = GalleryItem::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'gallery_id' => Gallery::factory(),
            'media_id' => Media::factory(),
            'caption' => $this->faker->boolean(60) ? $this->faker->sentence(8) : null,
            'order' => $this->faker->numberBetween(1, 100),
        ];
    }

    /**
     * Indicate that the item has a caption.
     */
    public function withCaption(): static
    {
        return $this->state(fn (array $attributes) => [
            'caption' => $this->faker->sentence(10),
        ]);
    }

    /**
     * Indicate that the item has no caption.
     */
    public function withoutCaption(): static
    {
        return $this->state(fn (array $attributes) => [
            'caption' => null,
        ]);
    }
}
