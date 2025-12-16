<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Media;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Media>
 */
final class MediaFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = Media::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $isImage = $this->faker->boolean(80); // 80% chance of being an image
        $fileName = $this->faker->word().($isImage ? '.jpg' : '.mp4');

        return [
            'user_id' => User::factory(),
            'name' => $this->faker->words(3, true),
            'file_name' => $fileName,
            'mime_type' => $isImage ? 'image/jpeg' : 'video/mp4',
            'path' => 'galleries/'.Str::random(40).'/'.$fileName,
            'disk' => 'public',
            'size' => $this->faker->numberBetween(100000, 5000000), // 100KB to 5MB
            'width' => $isImage ? $this->faker->numberBetween(800, 1920) : null,
            'height' => $isImage ? $this->faker->numberBetween(600, 1080) : null,
            'alt_text' => $this->faker->sentence(6),
        ];
    }

    /**
     * Indicate that the media is an image.
     */
    public function image(): static
    {
        return $this->state(fn (array $attributes) => [
            'file_name' => $this->faker->word().'.jpg',
            'mime_type' => 'image/jpeg',
            'width' => $this->faker->numberBetween(800, 1920),
            'height' => $this->faker->numberBetween(600, 1080),
        ]);
    }

    /**
     * Indicate that the media is a PNG image.
     */
    public function png(): static
    {
        return $this->state(fn (array $attributes) => [
            'file_name' => $this->faker->word().'.png',
            'mime_type' => 'image/png',
            'width' => $this->faker->numberBetween(800, 1920),
            'height' => $this->faker->numberBetween(600, 1080),
        ]);
    }

    /**
     * Indicate that the media is a video.
     */
    public function video(): static
    {
        return $this->state(fn (array $attributes) => [
            'file_name' => $this->faker->word().'.mp4',
            'mime_type' => 'video/mp4',
            'width' => null,
            'height' => null,
        ]);
    }
}
