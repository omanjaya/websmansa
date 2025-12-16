<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Announcement>
 */
final class AnnouncementFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = Announcement::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->sentence(4);
        $published = $this->faker->boolean(70);

        return [
            'title' => $title,
            'slug' => str()->slug($title).'-'.$this->faker->unique()->numberBetween(1000, 9999),
            'content' => $this->faker->paragraphs(3, true),
            'excerpt' => $this->faker->sentence(10),
            'type' => $this->faker->randomElement(['info', 'event', 'warning', 'success']),
            'priority' => $this->faker->randomElement(['low', 'medium', 'high', 'urgent']),
            'is_pinned' => $this->faker->boolean(20),
            'is_active' => $this->faker->boolean(80),
            'published_at' => $published
                ? $this->faker->dateTimeBetween('-1 month', 'now')
                : null,
            'expires_at' => $published && $this->faker->boolean(60)
                ? $this->faker->dateTimeBetween('now', '+2 months')
                : null,
            'user_id' => User::factory(),
            'category_id' => null,
        ];
    }

    /**
     * Indicate that the announcement is published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => array_merge($attributes, [
            'is_active' => true,
            'published_at' => now(),
        ]));
    }

    /**
     * Indicate that the announcement is pinned.
     */
    public function pinned(): static
    {
        return $this->state(fn (array $attributes) => array_merge($attributes, [
            'is_pinned' => true,
            'priority' => 'high',
        ]));
    }

    /**
     * Indicate that the announcement is urgent.
     */
    public function urgent(): static
    {
        return $this->state(fn (array $attributes) => array_merge($attributes, [
            'priority' => 'urgent',
            'is_pinned' => true,
        ]));
    }

    /**
     * Indicate that the announcement has expired.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => array_merge($attributes, [
            'expires_at' => $this->faker->dateTimeBetween('-2 months', '-1 day'),
        ]));
    }

    /**
     * Indicate that the announcement is of type event.
     */
    public function event(): static
    {
        return $this->state(fn (array $attributes) => array_merge($attributes, [
            'type' => 'event',
            'title' => $this->faker->sentence(3).' - Acara',
        ]));
    }

    /**
     * Indicate that the announcement is of type warning.
     */
    public function warning(): static
    {
        return $this->state(fn (array $attributes) => array_merge($attributes, [
            'type' => 'warning',
            'priority' => 'high',
            'title' => $this->faker->sentence(2).' - Penting',
        ]));
    }
}
