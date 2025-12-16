<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\PostStatus;
use App\Enums\PostType;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
final class PostFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = Post::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->sentence(6);
        $published = $this->faker->boolean(70);

        return [
            'title' => $title,
            'slug' => Str::slug($title).'-'.$this->faker->unique()->numberBetween(1000, 9999),
            'excerpt' => $this->faker->sentence(15),
            'content' => $this->faker->paragraphs(5, true),
            'featured_image' => $this->faker->boolean(50) ? $this->faker->imageUrl(800, 600, 'posts') : null,
            'status' => $this->faker->randomElement(PostStatus::values()),
            'type' => PostType::POST->value,
            'views' => $this->faker->numberBetween(0, 1000),
            'likes' => $this->faker->numberBetween(0, 100),
            'is_featured' => $this->faker->boolean(15),
            'is_pinned' => false,
            'published_at' => $published ? $this->faker->dateTimeBetween('-3 months', 'now') : null,
            'user_id' => User::factory(),
        ];
    }

    /**
     * Indicate that the post is published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PostStatus::PUBLISHED->value,
            'published_at' => now()->subDays($this->faker->numberBetween(1, 30)),
        ]);
    }

    /**
     * Indicate that the post is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PostStatus::DRAFT->value,
            'published_at' => null,
        ]);
    }

    /**
     * Indicate that the post is archived.
     */
    public function archived(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PostStatus::ARCHIVED->value,
        ]);
    }

    /**
     * Indicate that the post is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
            'status' => PostStatus::PUBLISHED->value,
            'published_at' => now()->subDays($this->faker->numberBetween(1, 30)),
        ]);
    }

    /**
     * Indicate that the post is pinned.
     */
    public function pinned(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_pinned' => true,
            'status' => PostStatus::PUBLISHED->value,
            'published_at' => now()->subDays($this->faker->numberBetween(1, 30)),
        ]);
    }

    /**
     * Indicate that the post is an announcement.
     */
    public function announcement(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => PostType::ANNOUNCEMENT->value,
            'title' => $this->faker->sentence(4).' - Pengumuman',
        ]);
    }

    /**
     * Indicate that the post is a page.
     */
    public function page(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => PostType::PAGE->value,
            'title' => $this->faker->words(3, true),
            'is_featured' => false,
            'is_pinned' => false,
        ]);
    }
}
